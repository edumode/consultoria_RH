import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Baja de la newsletter" };

export default async function BajaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  let ok = false;
  // El id es un uuid v4 (36 chars). Validación mínima antes de tocar la BD.
  const idValido = typeof id === "string" && /^[0-9a-f-]{36}$/i.test(id);

  if (idValido && isSupabaseConfigured) {
    const supabase = createPublicClient();
    const { error } = await supabase.rpc("baja_suscriptor", { p_id: id! });
    ok = !error;
  }

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-20 text-center">
      <div className="max-w-md">
        <h1 className="font-serif text-3xl font-semibold text-ink">
          {ok ? "Te diste de baja" : "No pudimos procesar la baja"}
        </h1>
        <p className="mt-4 text-stone">
          {ok
            ? "Ya no recibirás más correos de la newsletter de VÉRTICE. Puedes volver a suscribirte cuando quieras."
            : "El enlace no es válido o ya no estás suscrito. Si el problema persiste, escríbenos."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Ir al inicio
        </Link>
      </div>
    </Container>
  );
}
