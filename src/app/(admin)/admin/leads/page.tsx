import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Leads" };

const ESTADO_CLASS: Record<string, string> = {
  nuevo: "bg-sage text-forest-dark",
  contactado: "bg-[#f7ece2] text-clay",
  cerrado: "bg-sand-200 text-muted",
};

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

      <div className="overflow-x-auto rounded-2xl border border-sand-300 bg-white">
        {leads && leads.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Empresa</th>
                <th className="px-5 py-3 font-semibold">Servicio</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-sand-100 last:border-0"
                >
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
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ESTADO_CLASS[lead.estado] ?? "bg-sand-200 text-muted"
                      }`}
                    >
                      {lead.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(lead.created_at).toLocaleDateString("es")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay leads.
          </p>
        )}
      </div>
    </div>
  );
}
