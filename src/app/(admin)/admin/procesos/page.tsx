import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  actualizarEstadoProceso,
  eliminarProceso,
} from "@/features/procesos/actions";

export const metadata: Metadata = { title: "Procesos" };

const ESTADOS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En progreso" },
  { value: "completado", label: "Completado" },
];

const ESTADO_CLASS: Record<string, string> = {
  pendiente: "bg-sand-200 text-muted",
  en_progreso: "bg-[#f7ece2] text-clay",
  completado: "bg-sage text-forest-dark",
};

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ProcesosPage() {
  const supabase = await createClient();
  const { data: procesos } = await supabase
    .from("procesos")
    .select("id, cliente_email, titulo, estado, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Procesos{" "}
          <span className="text-base font-normal text-muted">
            ({procesos?.length ?? 0})
          </span>
        </h1>
        <Link
          href="/admin/procesos/nuevo"
          className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Nuevo proceso
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sand-300 bg-white">
        {procesos && procesos.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Proceso</th>
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Creado</th>
                <th className="px-5 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {procesos.map((p) => (
                <tr key={p.id} className="border-b border-sand-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{p.titulo}</td>
                  <td className="px-5 py-3 text-stone">
                    <a
                      href={`mailto:${p.cliente_email}`}
                      className="hover:text-forest hover:underline"
                    >
                      {p.cliente_email}
                    </a>
                  </td>
                  <td className="px-5 py-3">
                    <form action={actualizarEstadoProceso} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={p.id} />
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          ESTADO_CLASS[p.estado] ?? "bg-sand-200 text-muted"
                        }`}
                      >
                        {ESTADOS.find((e) => e.value === p.estado)?.label ?? p.estado}
                      </span>
                      <select
                        name="estado"
                        defaultValue={p.estado}
                        className="rounded-lg border border-sand-300 bg-white px-2 py-1 text-xs text-ink-soft outline-none focus:border-forest"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e.value} value={e.value}>
                            {e.label}
                          </option>
                        ))}
                      </select>
                      <button className="text-xs font-medium text-forest hover:underline">
                        Cambiar
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3 text-muted">{fecha(p.created_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <form action={eliminarProceso}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-xs font-medium text-terracotta hover:underline">
                          Borrar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay procesos. Crea el primero o asígnalo desde un lead.
          </p>
        )}
      </div>
    </div>
  );
}
