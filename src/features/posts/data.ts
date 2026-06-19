import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type PostResumen = {
  slug: string;
  titulo: string;
  extracto: string | null;
  portada_url: string | null;
  publicado_en: string | null;
};

export type PostCompleto = PostResumen & {
  contenido: string;
};

/**
 * Lista de entradas publicadas para /blog. Usa el cliente público (sin cookies)
 * para no forzar render dinámico: la página puede ser estática con ISR.
 */
export async function getPostsPublicados(): Promise<PostResumen[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, titulo, extracto, portada_url, publicado_en")
    .eq("estado", "publicado")
    .order("publicado_en", { ascending: false });

  if (error || !data) return [];
  return data;
}

/** Una entrada por slug (solo si está publicada). */
export async function getPostPorSlug(slug: string): Promise<PostCompleto | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, titulo, extracto, portada_url, publicado_en, contenido")
    .eq("slug", slug)
    .eq("estado", "publicado")
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
