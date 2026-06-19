import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSesion } from "@/features/auth/session";
import { cambiarRol } from "@/features/usuarios/actions";

export const metadata: Metadata = { title: "Usuarios" };

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { user } = await getSesion();
  const { data: usuarios } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-1 font-serif text-2xl font-semibold text-ink">
        Usuarios{" "}
        <span className="text-base font-normal text-muted">
          ({usuarios?.length ?? 0})
        </span>
      </h1>
      <p className="mb-6 text-stone">
        Asigna el rol de cada usuario. Los admins ven todo el panel; los clientes
        solo sus procesos.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-sand-300 bg-white">
        {usuarios && usuarios.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Rol</th>
                <th className="px-5 py-3 font-semibold">Registrado</th>
                <th className="px-5 py-3 font-semibold text-right">Cambiar rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const esYo = u.id === user?.id;
                return (
                  <tr key={u.id} className="border-b border-sand-100 last:border-0">
                    <td className="px-5 py-3 text-ink">
                      {u.email}
                      {esYo && (
                        <span className="ml-2 text-xs text-muted">(tú)</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-forest text-white"
                            : "bg-sand-200 text-muted"
                        }`}
                      >
                        {u.role === "admin" ? "Admin" : "Cliente"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">{fecha(u.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        {esYo ? (
                          <span className="text-xs text-muted">—</span>
                        ) : (
                          <form action={cambiarRol} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={u.id} />
                            <select
                              name="role"
                              defaultValue={u.role}
                              className="rounded-lg border border-sand-300 bg-white px-2 py-1 text-xs text-ink-soft outline-none focus:border-forest"
                            >
                              <option value="customer">Cliente</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button className="text-xs font-medium text-forest hover:underline">
                              Guardar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">
            No hay usuarios registrados todavía.
          </p>
        )}
      </div>
    </div>
  );
}
