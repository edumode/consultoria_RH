import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL, assertSupabaseConfigured } from "./env";

/**
 * Cliente de solo lectura para contenido PÚBLICO (servicios, equipo).
 * No toca cookies ni sesión → no fuerza render dinámico, así la landing
 * puede generarse estática con ISR. No usar para datos por-usuario.
 */
export function createPublicClient() {
  assertSupabaseConfigured();
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}
