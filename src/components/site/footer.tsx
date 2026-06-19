import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/features/newsletter/newsletter-form";
import { Logo } from "./logo";

const NAVEGACION = [
  { href: "#servicios", label: "Servicios" },
  { href: "#porque", label: "Por qué nosotros" },
  { href: "#contacto", label: "Contacto" },
];

const SOCIAL = [
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "Contacto directo" },
];

function ColumnaLinks({
  titulo,
  links,
}: {
  titulo: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="mb-3.5 text-xs uppercase tracking-[0.14em] text-[#6f6b60]">
        {titulo}
      </div>
      <div className="flex flex-col gap-2.5">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-[15px] text-sand-400 transition-colors hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-sand-400">
      <Container className="flex flex-wrap items-start justify-between gap-10 pb-10 pt-13.5">
        <div className="max-w-75">
          <Logo href="/" tone="light" className="mb-3.5" />
          <p className="text-[14.5px] leading-relaxed text-[#9b978c]">
            Transformamos y optimizamos los equipos de trabajo de empresas que
            quieren crecer.
          </p>
        </div>
        <div className="flex flex-wrap gap-16">
          <ColumnaLinks titulo="Navegación" links={NAVEGACION} />
          <ColumnaLinks titulo="Síguenos" links={SOCIAL} />
        </div>

        <div className="w-full max-w-75 sm:w-auto">
          <div className="mb-3.5 text-xs uppercase tracking-[0.14em] text-[#6f6b60]">
            Newsletter
          </div>
          <p className="mb-3 text-[14.5px] leading-relaxed text-[#9b978c]">
            Tendencias de RRHH y novedades, sin spam.
          </p>
          <NewsletterForm />
        </div>
      </Container>

      <div className="border-t border-[#2a2823]">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <span className="text-[13px] text-[#7d796e]">
            © {new Date().getFullYear()} VÉRTICE Consultoría RH. Todos los
            derechos reservados.
          </span>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-[13px] text-[#7d796e] transition-colors hover:text-sand-400"
            >
              Política de privacidad
            </Link>
            <Link
              href="#"
              className="text-[13px] text-[#7d796e] transition-colors hover:text-sand-400"
            >
              Términos
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
