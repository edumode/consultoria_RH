"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ProcesoState =
  | { status: "idle" }
  | { status: "error"; message: string };

const schema = z.object({
  cliente_email: z.email("Correo del cliente inválido."),
  titulo: z.string().trim().min(1, "El título es obligatorio."),
  descripcion: z.string().trim().optional(),
  estado: z.enum(["pendiente", "en_progreso", "completado"]),
  lead_id: z.string().uuid().optional().or(z.literal("")),
});

/** Crea un proceso y lo asigna a un cliente por correo. Solo admin (RLS). */
export async function crearProceso(
  _prev: ProcesoState,
  formData: FormData,
): Promise<ProcesoState> {
  const parsed = schema.safeParse({
    cliente_email: String(formData.get("cliente_email") ?? "").trim().toLowerCase(),
    titulo: String(formData.get("titulo") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    estado: String(formData.get("estado") ?? "pendiente"),
    lead_id: String(formData.get("lead_id") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("procesos").insert({
    cliente_email: d.cliente_email,
    titulo: d.titulo,
    descripcion: d.descripcion || null,
    estado: d.estado,
    lead_id: d.lead_id || null,
  });

  if (error) {
    return { status: "error", message: "No se pudo crear el proceso." };
  }

  revalidatePath("/admin/procesos");
  redirect("/admin/procesos");
}

/** Cambia el estado de un proceso (form action simple, desde la lista). */
export async function actualizarEstadoProceso(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const estado = String(formData.get("estado") ?? "");
  if (
    !z.string().uuid().safeParse(id).success ||
    !["pendiente", "en_progreso", "completado"].includes(estado)
  ) {
    return;
  }
  const supabase = await createClient();
  await supabase.from("procesos").update({ estado }).eq("id", id);
  revalidatePath("/admin/procesos");
}

export async function eliminarProceso(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) return;
  const supabase = await createClient();
  await supabase.from("procesos").delete().eq("id", id);
  revalidatePath("/admin/procesos");
  redirect("/admin/procesos");
}
