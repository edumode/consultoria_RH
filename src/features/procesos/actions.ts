"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSesion } from "@/features/auth/session";

export type ProcesoState =
  | { status: "idle" }
  | { status: "error"; message: string };

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completado: "Completado",
};

const estadoEnum = z.enum(["pendiente", "en_progreso", "completado"]);

const crearSchema = z.object({
  cliente_email: z.email("Correo del cliente inválido."),
  titulo: z.string().trim().min(1, "El título es obligatorio."),
  descripcion: z.string().trim().optional(),
  estado: estadoEnum,
  lead_id: z.string().uuid().optional().or(z.literal("")),
});

const editarSchema = z.object({
  id: z.string().uuid(),
  cliente_email: z.email("Correo del cliente inválido."),
  titulo: z.string().trim().min(1, "El título es obligatorio."),
  descripcion: z.string().trim().optional(),
  estado: estadoEnum,
  nota: z.string().trim().optional(),
});

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Inserta una entrada en la bitácora del proceso. */
async function registrarBitacora(
  supabase: Supabase,
  procesoId: string,
  nota: string,
  estado: string,
) {
  const { user } = await getSesion();
  await supabase.from("proceso_bitacora").insert({
    proceso_id: procesoId,
    nota,
    estado,
    autor: user?.email ?? null,
  });
}

/** Crea un proceso y lo asigna a un cliente por correo. Solo admin (RLS). */
export async function crearProceso(
  _prev: ProcesoState,
  formData: FormData,
): Promise<ProcesoState> {
  const parsed = crearSchema.safeParse({
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
  const { data, error } = await supabase
    .from("procesos")
    .insert({
      cliente_email: d.cliente_email,
      titulo: d.titulo,
      descripcion: d.descripcion || null,
      estado: d.estado,
      lead_id: d.lead_id || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", message: "No se pudo crear el proceso." };
  }

  await registrarBitacora(supabase, data.id, "Proceso creado.", d.estado);

  revalidatePath("/admin/procesos");
  redirect(`/admin/procesos/${data.id}/editar`);
}

/** Edita un proceso y registra el cambio en la bitácora. Solo admin (RLS). */
export async function editarProceso(
  _prev: ProcesoState,
  formData: FormData,
): Promise<ProcesoState> {
  const parsed = editarSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    cliente_email: String(formData.get("cliente_email") ?? "").trim().toLowerCase(),
    titulo: String(formData.get("titulo") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? "").trim(),
    estado: String(formData.get("estado") ?? "pendiente"),
    nota: String(formData.get("nota") ?? "").trim(),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("procesos")
    .update({
      cliente_email: d.cliente_email,
      titulo: d.titulo,
      descripcion: d.descripcion || null,
      estado: d.estado,
    })
    .eq("id", d.id);

  if (error) {
    return { status: "error", message: "No se pudo guardar el proceso." };
  }

  await registrarBitacora(
    supabase,
    d.id,
    d.nota || "Proceso actualizado.",
    d.estado,
  );

  revalidatePath("/admin/procesos");
  revalidatePath(`/admin/procesos/${d.id}/editar`);
  redirect(`/admin/procesos/${d.id}/editar`);
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
  await registrarBitacora(
    supabase,
    id,
    `Estado cambiado a ${ESTADO_LABEL[estado]}.`,
    estado,
  );
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
