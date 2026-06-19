import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Rol = "admin" | "customer";

export type Sesion = {
  user: { id: string; email?: string } | null;
  role: Rol | null;
  isAdmin: boolean;
};

/** Usuario actual + su rol (leído de profiles). */
export async function getSesion(): Promise<Sesion> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null, isAdmin: false };

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (perfil?.role ?? "customer") as Rol;
  return {
    user: { id: user.id, email: user.email },
    role,
    isAdmin: role === "admin",
  };
}

/** Ruta de inicio según el rol: admins al panel, clientes a su portal. */
export function rutaInicio(role: Rol | null): string {
  return role === "admin" ? "/admin" : "/portal";
}
