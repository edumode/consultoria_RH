import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getPostsPublicados } from "@/features/posts/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ideas, guías y novedades sobre gestión de talento y recursos humanos por VÉRTICE.",
};

// Estático con revalidación: las entradas nuevas aparecen en ≤1h sin redeploy.
export const revalidate = 3600;

function formatoFecha(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPostsPublicados();

  return (
    <Section className="pt-16 sm:pt-20">
      <div className="max-w-2xl">
        <Eyebrow>Blog</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Ideas sobre talento y cultura
        </h1>
        <p className="mt-4 text-lg text-stone">
          Guías, perspectivas y novedades para liderar mejor a tu gente.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-stone">Pronto publicaremos nuestras primeras entradas.</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group flex flex-col">
              <Link href={`/blog/${post.slug}`} className="flex flex-col">
                {post.portada_url ? (
                  <img
                    src={post.portada_url}
                    alt=""
                    className="mb-5 aspect-[16/10] w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="mb-5 aspect-[16/10] w-full rounded-2xl bg-sand-200" />
                )}
                <time className="text-[13px] font-medium uppercase tracking-wide text-muted">
                  {formatoFecha(post.publicado_en)}
                </time>
                <h2 className="mt-2 font-serif text-[22px] font-semibold leading-snug text-ink transition-colors group-hover:text-forest">
                  {post.titulo}
                </h2>
                {post.extracto && (
                  <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-stone">
                    {post.extracto}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
