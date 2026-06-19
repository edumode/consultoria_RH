import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Sesion = {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
};

/** Usuario actual + si está en la allowlist de admins (vía RPC is_admin). */
export async function getSesion(): Promise<Sesion> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  return {
    user: { id: user.id, email: user.email },
    isAdmin: Boolean(isAdmin),
  };
}
