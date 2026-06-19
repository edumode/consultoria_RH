import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_URL } from "./env";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isServiceRoleConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

/**
 * Cliente con service_role: IGNORA RLS. Solo para tareas de servidor de
 * confianza (cron de publicación/envío). NUNCA exponer al cliente ni usar con
 * datos provenientes del usuario sin validar.
 */
export function createAdminClient() {
  if (!isServiceRoleConfigured) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está configurada (Supabase → Settings → API).",
    );
  }
  return createSupabaseClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
