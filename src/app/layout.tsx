import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import "./globals.css";

// .trim() para tolerar saltos de línea/espacios al pegar la variable.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

const sans = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const TITULO = "Pilar Humano — Consultoría RH";
const DESCRIPCION =
  "Consultoría de Recursos Humanos: reclutamiento, selección, desarrollo y estrategia de talento para que tu empresa crezca con bases sólidas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITULO,
    template: "%s · Pilar Humano",
  },
  description: DESCRIPCION,
  applicationName: "Pilar Humano",
  keywords: [
    "consultoría de recursos humanos",
    "consultoría RH",
    "reclutamiento",
    "selección de personal",
    "gestión de talento",
    "capacitación",
    "clima organizacional",
    "México",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "Pilar Humano",
    title: TITULO,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
