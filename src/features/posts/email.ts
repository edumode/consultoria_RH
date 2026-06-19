import { Resend } from "resend";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

const API_KEY = process.env.RESEND_API_KEY ?? "";
// Remitente verificado en Resend. Ej: "VÉRTICE <newsletter@tudominio.com>".
const FROM = process.env.RESEND_FROM ?? "";

export const isResendConfigured = Boolean(API_KEY && FROM);

export type PostEmail = {
  titulo: string;
  extracto: string | null;
  contenido: string;
  slug: string;
  portada_url: string | null;
};

export type Suscriptor = { id: string; email: string };

export type EnvioResultado = { enviados: number; error?: string };

// Resend acepta hasta 100 mensajes por llamada batch.
const TAMANO_LOTE = 100;

function plantilla(post: PostEmail, bajaUrl: string): string {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const portada = post.portada_url
    ? `<img src="${post.portada_url}" alt="" width="100%" style="border-radius:12px;margin-bottom:24px;display:block" />`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f6f4ee;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#161613">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${post.extracto ?? ""}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ee;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="padding:0 8px 24px">
          <span style="font-family:Georgia,serif;font-size:20px;font-weight:600;letter-spacing:0.14em;color:#1f4d44">VÉRTICE</span>
          <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.18em;color:#7a766b;margin-left:8px">Consultoría RH</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:18px;padding:36px 32px">
          ${portada}
          <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.2;margin:0 0 16px;color:#161613">${post.titulo}</h1>
          ${post.extracto ? `<p style="font-size:17px;line-height:1.6;color:#545046;margin:0 0 24px">${post.extracto}</p>` : ""}
          <div style="font-size:16px;line-height:1.7;color:#2b2b27">${markdownToHtml(post.contenido)}</div>
          <div style="margin-top:32px">
            <a href="${postUrl}" style="display:inline-block;background:#1f4d44;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:10px">Leer en el sitio</a>
          </div>
        </td></tr>
        <tr><td style="padding:24px 8px;text-align:center;color:#7a766b;font-size:13px;line-height:1.6">
          Recibes este correo porque te suscribiste a la newsletter de VÉRTICE.<br />
          <a href="${bajaUrl}" style="color:#7a766b;text-decoration:underline">Darme de baja</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Envía el post a todos los suscriptores en lotes. Cada correo lleva su propio
 * enlace de baja y la cabecera List-Unsubscribe (buena práctica anti-spam).
 */
export async function enviarNewsletter(
  post: PostEmail,
  suscriptores: Suscriptor[],
): Promise<EnvioResultado> {
  if (!isResendConfigured) {
    return {
      enviados: 0,
      error:
        "Resend no está configurado. Define RESEND_API_KEY y RESEND_FROM en .env.local.",
    };
  }
  if (suscriptores.length === 0) return { enviados: 0 };

  const resend = new Resend(API_KEY);
  let enviados = 0;

  for (let i = 0; i < suscriptores.length; i += TAMANO_LOTE) {
    const lote = suscriptores.slice(i, i + TAMANO_LOTE);
    const mensajes = lote.map((s) => {
      const bajaUrl = `${SITE_URL}/newsletter/baja?id=${s.id}`;
      return {
        from: FROM,
        to: s.email,
        subject: post.titulo,
        html: plantilla(post, bajaUrl),
        headers: { "List-Unsubscribe": `<${bajaUrl}>` },
      };
    });

    const { error } = await resend.batch.send(mensajes);
    if (error) {
      return { enviados, error: error.message };
    }
    enviados += lote.length;
  }

  return { enviados };
}
