import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Suscriptores" };

export default async function SuscriptoresPage() {
  const supabase = await createClient();
  const { data: suscriptores } = await supabase
    .from("suscriptores")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">
        Suscriptores{" "}
        <span className="text-base font-normal text-muted">
          ({suscriptores?.length ?? 0})
        </span>
      </h1>

      <div className="overflow-x-auto rounded-2xl border border-sand-300 bg-white">
        {suscriptores && suscriptores.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Suscrito el</th>
              </tr>
            </thead>
            <tbody>
              {suscriptores.map((s) => (
                <tr key={s.id} className="border-b border-sand-100 last:border-0">
                  <td className="px-5 py-3 text-ink">
                    <a
                      href={`mailto:${s.email}`}
                      className="hover:text-forest hover:underline"
                    >
                      {s.email}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(s.created_at).toLocaleDateString("es")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">
            Aún no hay suscriptores.
          </p>
        )}
      </div>
    </div>
  );
}
