import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/features/posts/post-form";

export const metadata: Metadata = { title: "Editar entrada" };

export default async function EditarPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, titulo, slug, extracto, contenido, portada_url, estado, enviar_newsletter",
    )
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/posts"
        className="text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        ← Volver al blog
      </Link>
      <h1 className="mt-4 mb-7 font-serif text-2xl font-semibold text-ink">
        Editar entrada
      </h1>
      <PostForm
        post={{
          id: post.id,
          titulo: post.titulo,
          slug: post.slug,
          extracto: post.extracto ?? "",
          contenido: post.contenido,
          portada_url: post.portada_url ?? "",
          estado: post.estado,
          enviar_newsletter: post.enviar_newsletter,
        }}
      />
    </div>
  );
}
