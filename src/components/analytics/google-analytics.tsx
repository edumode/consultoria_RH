import Script from "next/script";

/**
 * Google Analytics 4. Se carga después de la hidratación (no bloquea la página).
 * GA4 con "medición mejorada" (activada por defecto) registra las navegaciones
 * del App Router vía eventos de historial, así que cubre la SPA sin más código.
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
