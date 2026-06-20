import "server-only";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const API_KEY = process.env.RESEND_API_KEY ?? "";
// Dirección que recibe el aviso de cada nuevo lead (p. ej. contacto@pilarhumano.com).
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO ?? "";
// Remitente: el dominio verificado si existe; si no, el sender de prueba de Resend
// (solo entrega al correo dueño de la cuenta Resend — suficiente para empezar).
const FROM = process.env.RESEND_FROM || "Pilar Humano <onboarding@resend.dev>";

export type LeadNotif = {
  nombre: string;
  empresa: string;
  correo: string;
  servicio: string;
};

/**
 * Envía un aviso de nuevo lead a LEAD_NOTIFY_TO. No lanza: si no está
 * configurado o falla el envío, simplemente no notifica (el lead ya se guardó).
 */
export async function notificarNuevoLead(lead: LeadNotif): Promise<void> {
  if (!API_KEY || !NOTIFY_TO) return;
  try {
    const resend = new Resend(API_KEY);
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: lead.correo,
      subject: `Nuevo lead: ${lead.nombre} · ${lead.empresa}`,
      html: plantilla(lead),
    });
  } catch {
    // Nunca interrumpir el flujo del formulario por un fallo de correo.
  }
}

function fila(etiqueta: string, valor: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#7a766b;font-size:14px;width:120px;vertical-align:top">${etiqueta}</td>
    <td style="padding:8px 0;color:#161613;font-size:15px;font-weight:600">${valor}</td>
  </tr>`;
}

function plantilla(lead: LeadNotif): string {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8" /></head>
<body style="margin:0;background:#f6f4ee;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ee;padding:28px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;padding:32px">
        <tr><td>
          <div style="font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#c97a45">Nuevo lead</div>
          <h1 style="margin:8px 0 20px;font-family:Georgia,serif;font-size:24px;color:#161613">Alguien agendó una asesoría</h1>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${fila("Nombre", lead.nombre)}
            ${fila("Empresa", lead.empresa)}
            ${fila("Correo", `<a href="mailto:${lead.correo}" style="color:#1f4d44">${lead.correo}</a>`)}
            ${fila("Servicio", lead.servicio)}
          </table>
          <div style="margin-top:24px">
            <a href="${SITE_URL}/admin/leads" style="display:inline-block;background:#1f4d44;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:10px">Ver en el panel</a>
          </div>
          <p style="margin-top:20px;color:#7a766b;font-size:13px">Puedes responder directamente a este correo para contactar al cliente.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
