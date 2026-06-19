import { redirect } from "next/navigation";
import Link from "next/link";
import { getSesion } from "@/features/auth/session";
import { logout } from "@/features/auth/actions";

/** Área privada del cliente. Los admins se redirigen a su panel. */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await getSesion();

  if (!user) redirect("/login");
  if (isAdmin) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-sand-100">
      <header className="border-b border-sand-300 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link
            href="/portal"
            className="font-serif text-lg font-semibold tracking-[0.14em] text-ink"
          >
            VÉRTICE
            <span className="ml-2 align-middle font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Mi cuenta
            </span>
          </Link>
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
