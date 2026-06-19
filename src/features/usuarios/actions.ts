"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSesion } from "@/features/auth/session";

/**
 * Cambia el rol de un usuario. Solo admin (RLS lo refuerza). No permite que un
 * admin se cambie su propio rol (evita quedarse sin acceso por accidente).
 */
export async function cambiarRol(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (
    !z.string().uuid().safeParse(id).success ||
    !["admin", "customer"].includes(role)
  ) {
    return;
  }

  const { user, isAdmin } = await getSesion();
  if (!isAdmin || !user) return;
  // No te cambies el rol a ti mismo (evita quedarte sin acceso por accidente).
  if (user.id === id) return;

  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/usuarios");
}
