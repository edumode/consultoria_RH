import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, assertSupabaseConfigured } from "./env";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * En Next 16 `cookies()` es asíncrono, por eso esta función es `async`.
 */
export async function createClient() {
  assertSupabaseConfigured();
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // En Server Components no se pueden escribir cookies; el refresco de
        // sesión lo hace proxy.ts. Por eso ignoramos el error aquí.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Llamado desde un Server Component sin respuesta mutable: ok.
        }
      },
    },
  });
}
