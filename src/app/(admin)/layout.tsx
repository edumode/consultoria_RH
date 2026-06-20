import { redirect } from "next/navigation";
import Link from "next/link";
import { getSesion } from "@/features/auth/session";
import { logout } from "@/features/auth/actions";

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
      <header className="border-b border-sand-300 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="font-serif text-lg font-semibold tracking-[0.14em] text-ink"
            >
              Pilar Humano
              <span className="ml-2 align-middle font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Panel
              </span>
            </Link>
            <nav className="hidden gap-6 sm:flex">
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
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-muted sm:inline">
              {user.email}
            </span>
            <form action={logout}>
              <button className="rounded-lg border border-sand-300 px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
