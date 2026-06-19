import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { markdownToHtml } from "@/lib/markdown";
import { getPostPorSlug, getPostsPublicados } from "@/features/posts/data";

export const revalidate = 3600;

// Prerenderiza en build las entradas existentes; las nuevas se generan on-demand.
export async function generateStaticParams() {
  const posts = await getPostsPublicados();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostPorSlug(slug);
  if (!post) return { title: "Entrada no encontrada" };
  return {
    title: post.titulo,
    description: post.extracto ?? undefined,
    openGraph: {
      title: post.titulo,
      description: post.extracto ?? undefined,
      images: post.portada_url ? [post.portada_url] : undefined,
    },
  };
}

function formatoFecha(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostPorSlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-medium text-muted transition-colors hover:text-forest"
        >
          ← Volver al blog
        </Link>

        <header className="mt-6">
          <time className="text-[13px] font-medium uppercase tracking-wide text-clay">
            {formatoFecha(post.publicado_en)}
          </time>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-[44px]">
            {post.titulo}
          </h1>
          {post.extracto && (
            <p className="mt-5 text-xl leading-relaxed text-stone">
              {post.extracto}
            </p>
          )}
        </header>

        {post.portada_url && (
          <img
            src={post.portada_url}
            alt=""
            className="mt-10 aspect-[16/9] w-full rounded-3xl object-cover"
          />
        )}

        <div
          className="prosa mt-10"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.contenido) }}
        />
      </Container>
    </article>
  );
}
