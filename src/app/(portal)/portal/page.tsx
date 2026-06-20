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

export default async function PortalPage() {
  const supabase = await createClient();
  // RLS ya limita a los procesos cuyo cliente_email == correo del usuario.
  const { data: procesos } = await supabase
    .from("procesos")
    .select("id, titulo, descripcion, estado, created_at, updated_at")
    .order("created_at", { ascending: false });

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
