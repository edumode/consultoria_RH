import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

/**
 * Convierte Markdown a HTML. El contenido lo escriben solo admins (de confianza),
 * por eso no sanitizamos la salida. Si en el futuro escriben terceros, añadir un
 * sanitizador (p. ej. isomorphic-dompurify) antes de renderizar.
 */
export function markdownToHtml(md: string): string {
  return marked.parse(md, { async: false });
}

/** Genera un slug URL-amigable a partir de un título. */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
