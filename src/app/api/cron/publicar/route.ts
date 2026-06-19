import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { enviarNewsletter, type Suscriptor } from "@/features/posts/email";

const CRON_SECRET = process.env.CRON_SECRET ?? "";

/**
 * Publica las entradas programadas cuya fecha ya llegó y, si corresponde, envía
 * la newsletter. Pensado para invocarse periódicamente (Vercel Cron, cron-job.org…)
 * con la cabecera `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: NextRequest) {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!isServiceRoleConfigured) {
    return NextResponse.json(
      { error: "Falta SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();
  const ahora = new Date().toISOString();

  const { data: pendientes, error } = await supabase
    .from("posts")
    .select("id, titulo, extracto, contenido, slug, portada_url, enviar_newsletter")
    .eq("estado", "programado")
    .lte("publicado_en", ahora);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!pendientes || pendientes.length === 0) {
    return NextResponse.json({ publicados: 0, enviados: 0 });
  }

  // Suscriptores (una sola lectura para todos los envíos de esta corrida).
  const { data: suscriptores } = await supabase
    .from("suscriptores")
    .select("id, email");
  const lista = (suscriptores ?? []) as Suscriptor[];

  let enviados = 0;

  for (const post of pendientes) {
    await supabase
      .from("posts")
      .update({ estado: "publicado", publicado_en: ahora })
      .eq("id", post.id);

    if (post.enviar_newsletter) {
      const resultado = await enviarNewsletter(post, lista);
      if (!resultado.error) {
        enviados += resultado.enviados;
        await supabase
          .from("posts")
          .update({ newsletter_enviado_en: new Date().toISOString() })
          .eq("id", post.id);
      }
    }

    revalidatePath(`/blog/${post.slug}`);
  }

  revalidatePath("/blog");

  return NextResponse.json({ publicados: pendientes.length, enviados });
}
