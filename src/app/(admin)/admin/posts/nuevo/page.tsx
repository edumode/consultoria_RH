import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "@/features/posts/post-form";

export const metadata: Metadata = { title: "Nueva entrada" };

export default function NuevoPostPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/posts"
        className="text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        ← Volver al blog
      </Link>
      <h1 className="mt-4 mb-7 font-serif text-2xl font-semibold text-ink">
        Nueva entrada
      </h1>
      <PostForm />
    </div>
  );
}
