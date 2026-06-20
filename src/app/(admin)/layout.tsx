import { redirect } from "next/navigation";
import Link from "next/link";
import { getSesion } from "@/features/auth/session";
import { logout } from "@/features/auth/actions";
import { AdminMobileNav } from "./admin-mobile-nav";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/procesos", label: "Procesos" },
  { href: "/admin/suscriptores", label: "Suscriptores" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await getSesion();

  // Sin sesión → al login (el proxy ya lo cubre, esto es defensa en profundidad).
  if (!user) redirect("/login");

  // Autenticado pero sin rol admin → a su portal de cliente.
  if (!isAdmin) redirect("/portal");

  return (
    <div className="flex min-h-screen flex-col bg-sand-100">
      <header className="sticky top-0 z-40 border-b border-sand-300 bg-white">
        <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-6 py-3.5">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-serif text-lg font-semibold tracking-[0.08em] text-ink"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className="h-7 w-auto rounded-[5px]" />
            <span className="flex flex-col leading-none">
              <span>
                <span className="text-forest">Pilar </span>
                <span className="text-clay">Humano</span>
              </span>
              <span className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Panel
              </span>
            </span>
          </Link>

          {/* Navegación inline en escritorio (≥ md) */}
          <nav className="ml-4 hidden flex-1 items-center gap-5 md:flex lg:gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5 md:ml-0">
            <Link
              href="/"
              className="hidden text-[13px] font-medium text-ink-soft transition-colors hover:text-forest md:inline"
            >
              Ver sitio ↗
            </Link>
            <span className="hidden text-[13px] text-muted lg:inline">
              {user.email}
            </span>
            <form action={logout}>
              <button className="rounded-lg border border-sand-300 px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest">
                Salir
              </button>
            </form>
            {/* Hamburguesa en móvil (< md) */}
            <AdminMobileNav items={NAV} email={user.email} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
