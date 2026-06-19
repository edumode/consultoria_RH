/**
 * Variables públicas de Supabase.
 *
 * No lanzamos error al importar: el proxy corre en cada request y queremos
 * que el sitio siga vivo aunque aún no haya credenciales. Quien *usa*
 * Supabase (clientes browser/server) llama a `assertSupabaseConfigured()`
 * para fallar con un mensaje claro.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase no está configurado. Copia .env.example a .env.local y rellena " +
        "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase Dashboard > Project Settings > API).",
    );
  }
}
