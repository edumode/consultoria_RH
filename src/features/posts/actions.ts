"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/markdown";
import { enviarNewsletter, type Suscriptor } from "./email";

export type PostState =
  | { status: "idle" }
  | { status: "error"; message: string };

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  titulo: z.string().trim().min(1, "El título es obligatorio."),
  slug: z.string().trim().optional(),
  extracto: z.string().trim().optional(),
  contenido: z.string().default(""),
  portada_url: z
    .string()
    .trim()
    .url("La URL de portada no es válida.")
    .optional()
    .or(z.literal("")),
  accion: z.enum(["borrador", "publicar", "programar"]),
  programado_para: z.string().optional(),
  enviar_newsletter: z.boolean(),
});

/** Lee, valida y guarda el post; publica/programa según el botón pulsado. */
export async function guardarPost(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const parsed = schema.safeParse({
    id: String(formData.get("id") ?? ""),
    titulo: String(formData.get("titulo") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    extracto: String(formData.get("extracto") ?? "").trim(),
    contenido: String(formData.get("contenido") ?? ""),
    portada_url: String(formData.get("portada_url") ?? "").trim(),
    accion: String(formData.get("accion") ?? "borrador"),
    programado_para: String(formData.get("programado_para") ?? ""),
    enviar_newsletter: formData.get("enviar_newsletter") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const slug = d.slug ? slugify(d.slug) : slugify(d.titulo);
  if (!slug) {
    return { status: "error", message: "No se pudo generar un slug válido." };
  }

  // Estado y fecha de publicación según la acción.
  let estado: "borrador" | "programado" | "publicado" = "borrador";
  let publicado_en: string | null = null;

  if (d.accion === "publicar") {
    estado = "publicado";
    publicado_en = new Date().toISOString();
  } else if (d.accion === "programar") {
    if (!d.programado_para) {
      return { status: "error", message: "Elige la fecha y hora de publicación." };
    }
    const fecha = new Date(d.programado_para);
    if (Number.isNaN(fecha.getTime()) || fecha.getTime() <= Date.now()) {
      return { status: "error", message: "La fecha programada debe ser futura." };
    }
    estado = "programado";
    publicado_en = fecha.toISOString();
  }

  const supabase = await createClient();

  const fila = {
    titulo: d.titulo,
    slug,
    extracto: d.extracto || null,
    contenido: d.contenido,
    portada_url: d.portada_url || null,
    estado,
    publicado_en,
    enviar_newsletter: d.enviar_newsletter,
  };

  let postId = d.id || null;

  if (postId) {
    const { error } = await supabase.from("posts").update(fila).eq("id", postId);
    if (error) return { status: "error", message: mensajeError(error) };
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert(fila)
      .select("id")
      .single();
    if (error) return { status: "error", message: mensajeError(error) };
    postId = data.id;
  }

  // Si se publica AHORA y se pidió newsletter, enviar de inmediato.
  if (estado === "publicado" && d.enviar_newsletter && postId) {
    const resultado = await enviarYMarcar(supabase, postId);
    if (resultado?.error) {
      // El post quedó guardado/publicado; avisamos del fallo de envío.
      return {
        status: "error",
        message: `Publicado, pero el envío falló: ${resultado.error}`,
      };
    }
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

/** Envío manual de la newsletter de un post ya publicado (form action simple). */
export async function enviarNewsletterAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) {
    redirect("/admin/posts?error=1");
  }
  const supabase = await createClient();
  const resultado = await enviarYMarcar(supabase, id);
  revalidatePath("/admin/posts");
  if (resultado?.error) {
    redirect("/admin/posts?error=1");
  }
  redirect("/admin/posts?enviado=1");
}

export async function eliminarPost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// -----------------------------------------------------------------------------

/** Carga el post + suscriptores, envía y marca newsletter_enviado_en. */
async function enviarYMarcar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
): Promise<{ error?: string } | void> {
  const { data: post } = await supabase
    .from("posts")
    .select("titulo, extracto, contenido, slug, portada_url")
    .eq("id", postId)
    .single();
  if (!post) return { error: "No se encontró el post." };

  const { data: suscriptores } = await supabase
    .from("suscriptores")
    .select("id, email");

  const resultado = await enviarNewsletter(post, (suscriptores ?? []) as Suscriptor[]);
  if (resultado.error) return { error: resultado.error };

  await supabase
    .from("posts")
    .update({ newsletter_enviado_en: new Date().toISOString() })
    .eq("id", postId);
}

function mensajeError(error: { code?: string }): string {
  if (error.code === "23505") {
    return "Ya existe una entrada con ese slug. Cámbialo e inténtalo de nuevo.";
  }
  return "No se pudo guardar la entrada. Inténtalo de nuevo.";
}
