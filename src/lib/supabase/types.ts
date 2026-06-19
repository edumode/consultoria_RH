import type { Tables, TablesInsert } from "./database.types";

/**
 * Alias convenientes de las tablas, generados desde el esquema real.
 * Regenera los tipos tras cada migración con:
 *   npx supabase gen types typescript --linked --schema public > src/lib/supabase/database.types.ts
 */

// Filas (lo que devuelve un SELECT)
export type Lead = Tables<"leads">;
export type Suscriptor = Tables<"suscriptores">;
export type Servicio = Tables<"servicios">;
export type Equipo = Tables<"equipo">;

// Inserts (lo que se envía en un INSERT)
export type LeadInsert = TablesInsert<"leads">;
export type SuscriptorInsert = TablesInsert<"suscriptores">;
