import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

const NAV = [
  { href: "#servicios", label: "Servicios" },
  { href: "#porque", label: "Por qué nosotros" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-background/82 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-6 py-4.5">
        <Logo />

        <nav className="flex items-center gap-6 sm:gap-8.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden text-[15px] font-medium text-ink-soft transition-colors hover:text-forest sm:inline"
            >
              {item.label}
            </Link>
          ))}

          {/* Acceso al panel (login/signup). Discreto, separado del CTA. */}
          <Link
            href="/login"
            className="text-[15px] font-medium text-muted transition-colors hover:text-forest"
          >
            Acceder
          </Link>

          <Link
            href="#contacto"
            className="rounded-lg bg-forest px-5 py-2.75 text-[15px] font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Agenda asesoría
          </Link>
        </nav>
      </Container>
    </header>
  );
}
