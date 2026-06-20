import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { AuthButton } from "./auth-button";
import { MobileMenu } from "./mobile-menu";
import { NAV } from "./nav-items";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-background/82 backdrop-blur-md">
      <Container className="relative flex items-center justify-between gap-4 py-4">
        <Logo />

        {/* Navegación de escritorio (≥ md) */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-ink-soft transition-colors hover:text-forest"
            >
              {item.label}
            </Link>
          ))}

          {/* Acceso: "Acceder" sin sesión, "Mi cuenta" con sesión. */}
          <AuthButton />

          <Link
            href="/#contacto"
            className="rounded-lg bg-forest px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Agenda asesoría
          </Link>
        </nav>

        {/* Menú móvil (< md) */}
        <MobileMenu />
      </Container>
    </header>
  );
}
