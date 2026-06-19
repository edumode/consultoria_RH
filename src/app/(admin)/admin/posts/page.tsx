import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { eliminarPost, enviarNewsletterAction } from "@/features/posts/actions";
import { isResendConfigured } from "@/features/posts/email";

export const metadata: Metadata = { title: "Blog" };

const ESTADO_CLASS: Record<string, string> = {
  publicado: "bg-sage text-forest-dark",
  programado: "bg-[#f7ece2] text-clay",
  borrador: "bg-sand-200 text-muted",
};

function fecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; error?: string }>;
}) {
  const { enviado, error } = await searchParams;
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, titulo, slug, estado, publicado_en, enviar_newsletter, newsletter_enviado_en, updated_at",
    )
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Blog{" "}
          <span className="text-base font-normal text-muted">
            ({posts?.length ?? 0})
          </span>
        </h1>
        <Link
          href="/admin/posts/nuevo"
          className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Nueva entrada
        </Link>
      </div>

      {enviado && (
        <p className="mb-5 rounded-lg bg-[#eaf2ee] px-4 py-3 text-sm text-forest">
          Newsletter enviada a los suscriptores. ✓
        </p>
      )}
      {error && (
        <p className="mb-5 rounded-lg bg-[#f7e6e2] px-4 py-3 text-sm text-terracotta">
          No se pudo enviar la newsletter. Revisa la configuración de Resend.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-sand-300 bg-white">
        {posts && posts.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Título</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Publicación</th>
                {isResendConfigured && (
                  <th className="px-5 py-3 font-semibold">Newsletter</th>
                )}
                <th className="px-5 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-sand-100 last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/posts/${p.id}/editar`}
                      className="font-medium text-ink hover:text-forest"
                    >
                      {p.titulo}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ESTADO_CLASS[p.estado] ?? "bg-sand-200 text-muted"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{fecha(p.publicado_en)}</td>
                  {isResendConfigured && (
                    <td className="px-5 py-3 text-muted">
                      {p.newsletter_enviado_en
                        ? `Enviada ${fecha(p.newsletter_enviado_en)}`
                        : p.enviar_newsletter
                          ? "Pendiente"
                          : "—"}
                    </td>
                  )}
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {p.estado === "publicado" && (
                        <Link
                          href={`/blog/${p.slug}`}
                          className="text-xs font-medium text-muted hover:text-forest"
                        >
                          Ver
                        </Link>
                      )}
                      {isResendConfigured &&
                        p.estado === "publicado" &&
                        !p.newsletter_enviado_en && (
                          <form action={enviarNewsletterAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <button className="text-xs font-medium text-clay hover:underline">
                              Enviar newsletter
                            </button>
                          </form>
                        )}
                      <Link
                        href={`/admin/posts/${p.id}/editar`}
                        className="text-xs font-medium text-forest hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={eliminarPost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-xs font-medium text-terracotta hover:underline">
                          Borrar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay entradas. Crea la primera.
          </p>
        )}
      </div>
    </div>
  );
}
