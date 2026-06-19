"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSesion, rutaInicio } from "./session";

export async function oauthSignIn() {
  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? `https://${hdrs.get("host")}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

const credenciales = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export type AuthState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "check_email" };

function parse(formData: FormData) {
  return credenciales.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { status: "error", message: "Correo o contraseña incorrectos." };
  }

  const { role } = await getSesion();
  redirect(rutaInicio(role));
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = parse(formData);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? `https://${hdrs.get("host")}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    // El enlace de confirmación vuelve a /auth/callback, que crea la sesión
    // y entra al panel (si no, el código queda sin procesar en la raíz).
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    return { status: "error", message: error.message };
  }

  // Si hay confirmación de correo activada, no llega sesión todavía.
  if (!data.session) {
    return { status: "check_email" };
  }

  // Usuario recién creado → rol customer → su portal.
  const { role } = await getSesion();
  redirect(rutaInicio(role));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
