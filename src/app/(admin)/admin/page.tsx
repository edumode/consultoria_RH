import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Panel" };

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-sand-300 bg-white p-6">
      <div className="font-serif text-4xl font-semibold text-forest">
        {value}
      </div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

export default async function ResumenPage() {
  const supabase = await createClient();

  const [
    { count: totalLeads },
    { count: nuevos },
    { count: procesosActivos },
    { count: suscriptores },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("estado", "nuevo"),
    supabase
      .from("procesos")
      .select("*", { count: "exact", head: true })
      .neq("estado", "completado"),
    supabase.from("suscriptores").select("*", { count: "exact", head: true }),
  ]);

  const { data: recientes } = await supabase
    .from("leads")
    .select("id, nombre, empresa, servicio, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">Resumen</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Leads totales" value={totalLeads ?? 0} />
        <Card label="Leads nuevos" value={nuevos ?? 0} />
        <Card label="Procesos activos" value={procesosActivos ?? 0} />
        <Card label="Suscriptores" value={suscriptores ?? 0} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-ink">
          Leads recientes
        </h2>
        <Link
          href="/admin/leads"
          className="text-sm font-semibold text-forest hover:underline"
        >
          Ver todos →
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-sand-300 bg-white">
        {recientes && recientes.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Empresa</th>
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">Servicio</th>
                <th className="px-5 py-3 font-semibold">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((lead) => (
                <tr key={lead.id} className="border-b border-sand-100 last:border-0">
                  <td className="px-5 py-3 text-ink">{lead.nombre}</td>
                  <td className="hidden px-5 py-3 text-stone sm:table-cell">{lead.empresa ?? "—"}</td>
                  <td className="hidden px-5 py-3 text-stone sm:table-cell">{lead.servicio ?? "—"}</td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(lead.created_at).toLocaleDateString("es")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Aún no hay leads.
          </p>
        )}
      </div>
    </div>
  );
}
