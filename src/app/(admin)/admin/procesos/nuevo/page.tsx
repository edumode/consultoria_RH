import type { Metadata } from "next";
import Link from "next/link";
import { ProcesoForm } from "@/features/procesos/proceso-form";

export const metadata: Metadata = { title: "Nuevo proceso" };

export default async function NuevoProcesoPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; lead?: string }>;
}) {
  const { email, lead } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/procesos"
        className="text-sm font-medium text-muted transition-colors hover:text-forest"
      >
        ← Volver a procesos
      </Link>
      <h1 className="mt-4 mb-7 font-serif text-2xl font-semibold text-ink">
        Nuevo proceso
      </h1>
      <ProcesoForm clienteEmail={email ?? ""} leadId={lead ?? ""} />
    </div>
  );
}
