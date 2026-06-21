import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  actualizarEstadoProceso,
  eliminarProceso,
} from "@/features/procesos/actions";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";

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

type ProcesoRow = {
  id: string;
  cliente_email: string;
  titulo: string;
  estado: string;
  created_at: string;
};

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        ESTADO_CLASS[estado] ?? "bg-sand-200 text-muted"
      }`}
    >
      {ESTADOS.find((e) => e.value === estado)?.label ?? estado}
    </span>
  );
}

function CambiarEstado({ p }: { p: ProcesoRow }) {
  return (
    <form action={actualizarEstadoProceso} className="flex items-center gap-2">
      <input type="hidden" name="id" value={p.id} />
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
  );
}

function Borrar({ id }: { id: string }) {
  return (
    <form action={eliminarProceso}>
      <input type="hidden" name="id" value={id} />
      <ConfirmSubmit
        message="¿Borrar este proceso? Se eliminará junto con su historial y no se puede deshacer."
        className="text-xs font-medium text-terracotta hover:underline"
      >
        Borrar
      </ConfirmSubmit>
    </form>
  );
}

export default async function ProcesosPage() {
  const supabase = await createClient();
  const { data: procesos } = await supabase
    .from("procesos")
    .select("id, cliente_email, titulo, estado, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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

      {procesos && procesos.length > 0 ? (
        <>
          {/* Móvil: tarjetas */}
          <div className="flex flex-col gap-3 md:hidden">
            {procesos.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-sand-300 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/admin/procesos/${p.id}/editar`}
                    className="font-medium text-ink hover:text-forest"
                  >
                    {p.titulo}
                  </Link>
                  <EstadoBadge estado={p.estado} />
                </div>
                <a
                  href={`mailto:${p.cliente_email}`}
                  className="mt-1 block break-all text-[13px] text-stone hover:text-forest hover:underline"
                >
                  {p.cliente_email}
                </a>
                <p className="mt-1 text-[13px] text-muted">
                  Creado el {fecha(p.created_at)}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-sand-100 pt-3">
                  <CambiarEstado p={p} />
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/procesos/${p.id}/editar`}
                      className="text-xs font-medium text-forest hover:underline"
                    >
                      Editar
                    </Link>
                    <Borrar id={p.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Escritorio: tabla */}
          <div className="hidden overflow-x-auto rounded-2xl border border-sand-300 bg-white md:block">
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
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/procesos/${p.id}/editar`}
                        className="font-medium text-ink hover:text-forest"
                      >
                        {p.titulo}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-stone">
                      <a
                        href={`mailto:${p.cliente_email}`}
                        className="hover:text-forest hover:underline"
                      >
                        {p.cliente_email}
                      </a>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <EstadoBadge estado={p.estado} />
                        <CambiarEstado p={p} />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted">{fecha(p.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/procesos/${p.id}/editar`}
                          className="text-xs font-medium text-forest hover:underline"
                        >
                          Editar
                        </Link>
                        <Borrar id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-sand-300 bg-white">
          <p className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay procesos. Crea el primero o asígnalo desde un lead.
          </p>
        </div>
      )}
    </div>
  );
}
