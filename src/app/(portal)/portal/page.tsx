import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mis procesos" };

const ESTADO: Record<string, { label: string; clase: string }> = {
  pendiente: { label: "Pendiente", clase: "bg-sand-200 text-muted" },
  en_progreso: { label: "En progreso", clase: "bg-[#f7ece2] text-clay" },
  completado: { label: "Completado", clase: "bg-sage text-forest-dark" },
};

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Entrada = {
  id: string;
  proceso_id: string;
  nota: string | null;
  estado: string | null;
  created_at: string;
};

export default async function PortalPage() {
  const supabase = await createClient();
  // RLS limita a los procesos / bitácora cuyo cliente es el usuario actual.
  const [{ data: procesos }, { data: bitacora }] = await Promise.all([
    supabase
      .from("procesos")
      .select("id, titulo, descripcion, estado, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("proceso_bitacora")
      .select("id, proceso_id, nota, estado, created_at")
      .order("created_at", { ascending: false }),
  ]);

  // Agrupa el historial por proceso (ya viene del más reciente al más antiguo).
  const historialPorProceso = new Map<string, Entrada[]>();
  for (const b of (bitacora ?? []) as Entrada[]) {
    const arr = historialPorProceso.get(b.proceso_id) ?? [];
    arr.push(b);
    historialPorProceso.set(b.proceso_id, arr);
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink">Mis procesos</h1>
      <p className="mt-1 text-stone">
        Aquí ves el avance de tus consultorías con Pilar Humano.
      </p>

      {procesos && procesos.length > 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          {procesos.map((p) => {
            const e = ESTADO[p.estado] ?? ESTADO.pendiente;
            const historial = historialPorProceso.get(p.id) ?? [];
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-sand-300 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-serif text-xl font-semibold text-ink">
                    {p.titulo}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${e.clase}`}
                  >
                    {e.label}
                  </span>
                </div>
                {p.descripcion && (
                  <p className="mt-3 text-[15px] leading-relaxed text-stone">
                    {p.descripcion}
                  </p>
                )}
                <p className="mt-4 text-[13px] text-muted">
                  Iniciado el {fecha(p.created_at)}
                </p>

                {historial.length > 0 && (
                  <div className="mt-5 border-t border-sand-200 pt-5">
                    <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-muted">
                      Avances
                    </h3>
                    <ol className="flex flex-col gap-4 border-l-2 border-sand-300 pl-5">
                      {historial.map((b) => {
                        const be = b.estado ? ESTADO[b.estado] : undefined;
                        return (
                          <li key={b.id} className="relative">
                            <span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-forest" />
                            <div className="flex flex-wrap items-center gap-2">
                              <time className="text-[13px] font-medium text-ink-soft">
                                {fechaHora(b.created_at)}
                              </time>
                              {be && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${be.clase}`}
                                >
                                  {be.label}
                                </span>
                              )}
                            </div>
                            {b.nota && (
                              <p className="mt-1 text-[15px] leading-relaxed text-stone">
                                {b.nota}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-sand-400 bg-white/60 px-6 py-16 text-center">
          <p className="font-serif text-xl text-ink">
            Aún no tienes procesos asignados
          </p>
          <p className="mx-auto mt-2 max-w-md text-stone">
            Cuando agendes una consultoría y un asesor la habilite, verás aquí su
            avance. Si ya agendaste, dale un momento a que la habilitemos.
          </p>
        </div>
      )}
    </div>
  );
}
