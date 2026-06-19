import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SERVICIOS, type Servicio } from "./data";

/**
 * Servicios para la landing. Lee de Supabase (tabla `servicios`, solo activos,
 * ordenados). Si Supabase no está configurado o no hay filas, cae al seed local.
 *
 * Usa el cliente público (sin cookies) para no forzar render dinámico:
 * así la landing se genera estática y se revalida por ISR.
 */
export async function getServicios(): Promise<Servicio[]> {
  if (!isSupabaseConfigured) return SERVICIOS;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("servicios")
    .select("titulo, descripcion, orden")
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) return SERVICIOS;

  return data.map((row, i) => ({
    num: String(i + 1).padStart(2, "0"),
    titulo: row.titulo,
    descripcion: row.descripcion ?? "",
    // El primero se marca como destacado (equivalente a "Más solicitado").
    destacado: i === 0,
  }));
}
