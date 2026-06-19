import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Proxy de Next 16 (antes "middleware"). Refresca la sesión de Supabase
 * en cada navegación para mantener las cookies de auth al día.
 *
 * Importamos supabase-js de forma perezosa: si aún no hay credenciales,
 * el proxy no arrastra la librería a su bundle (clave en equipos con poca
 * RAM, donde compilarla bajo demanda en `next dev` agota la memoria).
 */
export async function proxy(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.next({ request });
  }

  const { updateSession } = await import("@/lib/supabase/middleware");
  return updateSession(request);
}

export const config = {
  // Ejecuta en todo excepto estáticos e imágenes (patrón recomendado por Supabase).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
