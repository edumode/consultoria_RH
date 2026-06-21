import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { eliminarPost, enviarNewsletterAction } from "@/features/posts/actions";
import { isResendConfigured } from "@/features/posts/email";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";

export const metadata: Metadata = { title: "Blog" };

const ESTADO_CLASS: Record<string, string> = {
  publicado: "bg-sage text-forest-dark",
  programado: "bg-[#f7ece2] text-clay",
  borrador: "bg-sand-200 text-muted",
};

type PostRow = {
  id: string;
  titulo: string;
  slug: string;
  estado: string;
  publicado_en: string | null;
  enviar_newsletter: boolean;
  newsletter_enviado_en: string | null;
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

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        ESTADO_CLASS[estado] ?? "bg-sand-200 text-muted"
      }`}
    >
      {estado}
    </span>
  );
}

function newsletterTexto(p: PostRow): string {
  if (p.newsletter_enviado_en) return `Enviada ${fecha(p.newsletter_enviado_en)}`;
  return p.enviar_newsletter ? "Pendiente" : "—";
}

function Acciones({ p }: { p: PostRow }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
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
        <ConfirmSubmit
          message={`¿Borrar la entrada "${p.titulo}"? Esta acción no se puede deshacer.`}
          className="text-xs font-medium text-terracotta hover:underline"
        >
          Borrar
        </ConfirmSubmit>
      </form>
    </div>
  );
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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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

      {posts && posts.length > 0 ? (
        <>
          {/* Móvil: tarjetas apiladas (sin scroll horizontal) */}
          <div className="flex flex-col gap-3 md:hidden">
            {posts.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-sand-300 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/admin/posts/${p.id}/editar`}
                    className="font-medium text-ink hover:text-forest"
                  >
                    {p.titulo}
                  </Link>
                  <EstadoBadge estado={p.estado} />
                </div>
                <dl className="mt-3 flex flex-col gap-1 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Publicación</dt>
                    <dd className="text-ink-soft">{fecha(p.publicado_en)}</dd>
                  </div>
                  {isResendConfigured && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Newsletter</dt>
                      <dd className="text-ink-soft">{newsletterTexto(p)}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-3 border-t border-sand-100 pt-3">
                  <Acciones p={p} />
                </div>
              </div>
            ))}
          </div>

          {/* Escritorio: tabla */}
          <div className="hidden overflow-x-auto rounded-2xl border border-sand-300 bg-white md:block">
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
                      <EstadoBadge estado={p.estado} />
                    </td>
                    <td className="px-5 py-3 text-muted">{fecha(p.publicado_en)}</td>
                    {isResendConfigured && (
                      <td className="px-5 py-3 text-muted">{newsletterTexto(p)}</td>
                    )}
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <Acciones p={p} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-sand-300 bg-white">
          <p className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay entradas. Crea la primera.
          </p>
        </div>
      )}
    </div>
  );
}
