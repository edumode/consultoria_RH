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
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3.5">
          <Link
            href="/admin"
            className="order-1 font-serif text-lg font-semibold tracking-[0.08em] text-ink"
          >
            Pilar Humano
            <span className="ml-2 align-middle font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Panel
            </span>
          </Link>

          <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
            <span className="hidden text-[13px] text-muted sm:inline">
              {user.email}
            </span>
            <form action={logout}>
              <button className="rounded-lg border border-sand-300 px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest">
                Salir
              </button>
            </form>
          </div>

          {/* En móvil el menú baja a una segunda fila (envuelve); en ≥ sm va en línea. */}
          <nav className="order-3 flex w-full flex-wrap gap-x-5 gap-y-1.5 sm:order-2 sm:w-auto">
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
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
