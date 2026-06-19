"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  nombre: z.string().trim().min(1, "Indícanos tu nombre."),
  empresa: z.string().trim().min(1, "Indícanos tu empresa."),
  correo: z.email("Revisa el formato del correo."),
  servicio: z.string().trim().min(1, "Selecciona un servicio."),
});

export type LeadValues = {
  nombre: string;
  empresa: string;
  correo: string;
  servicio: string;
};

export type LeadState =
  | { status: "idle" }
  | { status: "success"; nombre: string }
  | {
      status: "error";
      errors: Partial<Record<keyof LeadValues | "_form", string>>;
      values: LeadValues;
    };

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const values: LeadValues = {
    nombre: String(formData.get("nombre") ?? ""),
    empresa: String(formData.get("empresa") ?? ""),
    correo: String(formData.get("correo") ?? ""),
    servicio: String(formData.get("servicio") ?? ""),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: Partial<Record<keyof LeadValues, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadValues;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    nombre: parsed.data.nombre,
    empresa: parsed.data.empresa,
    email: parsed.data.correo,
    servicio: parsed.data.servicio,
  });

  if (error) {
    return {
      status: "error",
      errors: { _form: "No pudimos enviar tu solicitud. Inténtalo de nuevo." },
      values,
    };
  }

  return { status: "success", nombre: parsed.data.nombre };
}
