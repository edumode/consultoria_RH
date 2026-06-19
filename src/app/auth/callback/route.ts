import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSesion, rutaInicio } from "@/features/auth/session";

/**
 * Callback de OAuth (Google) y de confirmación de correo. Supabase redirige aquí
 * con un `code` que intercambiamos por una sesión; luego enviamos al usuario a su
 * área según el rol (admin → /admin, customer → /portal).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { role } = await getSesion();
      return NextResponse.redirect(`${origin}${rutaInicio(role)}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
