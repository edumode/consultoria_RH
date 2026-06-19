"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.email("Ingresa un correo válido."),
});

export type NewsletterState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function subscribe(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("suscriptores")
    .insert({ email: parsed.data.email });

  if (error) {
    // 23505 = violación de unicidad → ya estaba suscrito, lo tratamos como éxito.
    if (error.code === "23505") return { status: "success" };
    return {
      status: "error",
      message: "No pudimos suscribirte. Inténtalo de nuevo.",
    };
  }

  return { status: "success" };
}
