import "server-only";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const API_KEY = process.env.RESEND_API_KEY ?? "";
// Remitente verificado (necesario para enviar a clientes en cualquier correo).
const FROM = process.env.RESEND_FROM ?? "";

// Solo se puede avisar al cliente si hay dominio verificado (API key + remitente).
export const puedeNotificarCliente = Boolean(API_KEY && FROM);

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completado: "Completado",
};

/**
 * Avisa al cliente por correo de una actualización en su proceso. No lanza:
 * si Resend no está listo o falla, simplemente no envía.
 */
export async function notificarActualizacionCliente(opts: {
  clienteEmail: string;
  titulo: string;
  nota: string;
  estado: string;
}): Promise<void> {
  if (!API_KEY || !FROM) return;
  try {
    const resend = new Resend(API_KEY);
    await resend.emails.send({
      from: FROM,
      to: opts.clienteEmail,
      subject: `Actualización de tu proceso: ${opts.titulo}`,
      html: plantilla(opts),
    });
  } catch {
    // Nunca interrumpir el guardado por un fallo de correo.
  }
}

function plantilla(opts: {
  titulo: string;
  nota: string;
  estado: string;
}): string {
  const estado = ESTADO_LABEL[opts.estado] ?? opts.estado;
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8" /></head>
<body style="margin:0;background:#f6f4ee;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ee;padding:28px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <tr><td style="padding:0 8px 20px">
          <span style="font-family:Georgia,serif;font-size:20px;font-weight:600;color:#1f4d44">Pilar</span>
          <span style="font-family:Georgia,serif;font-size:20px;font-weight:600;color:#c97a45"> Humano</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;padding:32px">
          <div style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#c97a45">Actualización de tu proceso</div>
          <h1 style="margin:8px 0 6px;font-family:Georgia,serif;font-size:23px;color:#161613">${opts.titulo}</h1>
          <div style="display:inline-block;background:#eef3f0;color:#1f4d44;font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;margin-bottom:18px">Estado: ${estado}</div>
          <p style="font-size:16px;line-height:1.6;color:#2b2b27;margin:0 0 24px">${opts.nota}</p>
          <a href="${SITE_URL}/portal" style="display:inline-block;background:#1f4d44;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 24px;border-radius:10px">Ver mi proceso</a>
        </td></tr>
        <tr><td style="padding:20px 8px;color:#7a766b;font-size:13px;line-height:1.6">
          Recibes este correo porque tienes una consultoría activa con Pilar Humano.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
