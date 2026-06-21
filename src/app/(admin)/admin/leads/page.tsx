import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { eliminarLead } from "@/features/leads/actions";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";

export const metadata: Metadata = { title: "Leads" };

const ESTADO_CLASS: Record<string, string> = {
  nuevo: "bg-sage text-forest-dark",
  contactado: "bg-[#f7ece2] text-clay",
  cerrado: "bg-sand-200 text-muted",
};

type LeadRow = {
  id: string;
  nombre: string;
  email: string;
  empresa: string | null;
  servicio: string | null;
  estado: string;
  created_at: string;
};

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        ESTADO_CLASS[estado] ?? "bg-sand-200 text-muted"
      }`}
    >
      {estado}
    </span>
  );
}

function Acciones({ lead }: { lead: LeadRow }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/admin/procesos/nuevo?email=${encodeURIComponent(lead.email)}&lead=${lead.id}`}
        className="text-xs font-medium text-forest hover:underline"
      >
        Crear proceso
      </Link>
      <form action={eliminarLead}>
        <input type="hidden" name="id" value={lead.id} />
        <ConfirmSubmit
          message={`¿Borrar el lead de ${lead.nombre}? Esta acción no se puede deshacer.`}
          className="text-xs font-medium text-terracotta hover:underline"
        >
          Borrar
        </ConfirmSubmit>
      </form>
    </div>
  );
}

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, nombre, email, empresa, servicio, estado, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">
        Leads{" "}
        <span className="text-base font-normal text-muted">
          ({leads?.length ?? 0})
        </span>
      </h1>

      {leads && leads.length > 0 ? (
        <>
          {/* Móvil: tarjetas */}
          <div className="flex flex-col gap-3 md:hidden">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-sand-300 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-ink">{lead.nombre}</span>
                  <EstadoBadge estado={lead.estado} />
                </div>
                <a
                  href={`mailto:${lead.email}`}
                  className="mt-1 block break-all text-[13px] text-stone hover:text-forest hover:underline"
                >
                  {lead.email}
                </a>
                <dl className="mt-2 flex flex-col gap-1 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Empresa</dt>
                    <dd className="text-ink-soft">{lead.empresa ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Servicio</dt>
                    <dd className="text-right text-ink-soft">{lead.servicio ?? "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Fecha</dt>
                    <dd className="text-ink-soft">
                      {new Date(lead.created_at).toLocaleDateString("es")}
                    </dd>
                  </div>
                </dl>
                <div className="mt-3 border-t border-sand-100 pt-3">
                  <Acciones lead={lead} />
                </div>
              </div>
            ))}
          </div>

          {/* Escritorio: tabla */}
          <div className="hidden overflow-x-auto rounded-2xl border border-sand-300 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nombre</th>
                  <th className="px-5 py-3 font-semibold">Correo</th>
                  <th className="px-5 py-3 font-semibold">Empresa</th>
                  <th className="px-5 py-3 font-semibold">Servicio</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-sand-100 last:border-0">
                    <td className="px-5 py-3 text-ink">{lead.nombre}</td>
                    <td className="px-5 py-3 text-stone">
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-forest hover:underline"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-stone">{lead.empresa ?? "—"}</td>
                    <td className="px-5 py-3 text-stone">{lead.servicio ?? "—"}</td>
                    <td className="px-5 py-3">
                      <EstadoBadge estado={lead.estado} />
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {new Date(lead.created_at).toLocaleDateString("es")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Acciones lead={lead} />
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
            Aún no hay leads.
          </p>
        </div>
      )}
    </div>
  );
}
