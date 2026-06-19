/**
 * URL pública del sitio. Se usa para construir enlaces absolutos en los correos
 * (al post y a la baja de la newsletter). En local cae a localhost.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
