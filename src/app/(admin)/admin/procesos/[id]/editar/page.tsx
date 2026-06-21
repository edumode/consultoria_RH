import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProcesoEditForm } from "@/features/procesos/proceso-edit-form";

export const metadata: Metadata = { title: "Editar proceso" };

const ESTADO_CLASS: Record<string, string> = {
  pendiente: "bg-sand-200 text-muted",
  en_progreso: "bg-[#f7ece2] text-clay",
  completado: "bg-sage text-forest-dark",
};
const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completado: "Completado",
};

function fechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EditarProcesoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proceso } = await supabase
    .from("procesos")
    .select("id, cliente_email, titulo, descripcion, estado")
    .eq("id", id)
    .maybeSingle();

  if (!proceso) notFound();

  // Historial: del más reciente al más antiguo.
  const { data: bitacora } = await supabase
    .from("proceso_bitacora")
    .select("id, nota, estado, autor, created_at")
    .eq("proceso_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/procesos"
        className="text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        ← Volver a procesos
      </Link>
      <h1 className="mt-4 mb-7 font-serif text-2xl font-semibold text-ink">
        Editar proceso
      </h1>

      <ProcesoEditForm
        proceso={{
          id: proceso.id,
          cliente_email: proceso.cliente_email,
          titulo: proceso.titulo,
          descripcion: proceso.descripcion ?? "",
          estado: proceso.estado,
        }}
      />

      <h2 className="mt-12 mb-4 font-serif text-xl font-semibold text-ink">
        Historial{" "}
        <span className="text-base font-normal text-muted">
          ({bitacora?.length ?? 0})
        </span>
      </h2>

      {bitacora && bitacora.length > 0 ? (
        <ol className="relative flex flex-col gap-5 border-l-2 border-sand-300 pl-5">
          {bitacora.map((b) => (
            <li key={b.id} className="relative">
              <span className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-forest" />
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-[13px] font-medium text-ink-soft">
                  {fechaHora(b.created_at)}
                </time>
                {b.estado && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      ESTADO_CLASS[b.estado] ?? "bg-sand-200 text-muted"
                    }`}
                  >
                    {ESTADO_LABEL[b.estado] ?? b.estado}
                  </span>
                )}
              </div>
              {b.nota && (
                <p className="mt-1 text-[15px] leading-relaxed text-stone">
                  {b.nota}
                </p>
              )}
              {b.autor && (
                <p className="mt-0.5 text-[12px] text-muted">por {b.autor}</p>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted">Aún no hay entradas en la bitácora.</p>
      )}
    </div>
  );
}
