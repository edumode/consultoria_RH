import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Refresca la sesión de Supabase en cada request y propaga las cookies.
 * Se invoca desde proxy.ts (antes "middleware" en Next < 16).
 *
 * En el Paso 7 aquí se añadirá el blindaje de rutas /admin.
 */
export async function updateSession(request: NextRequest) {
  // Sin credenciales aún: no-op para no romper el sitio durante el desarrollo.
  if (!isSupabaseConfigured) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANTE: no metas lógica entre createServerClient y getUser(),
  // o tendrás cierres de sesión aleatorios difíciles de depurar.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Blindaje barato de /admin: si no hay sesión, a /login.
  // La verificación de admin (allowlist) se hace en el layout de /admin y en RLS.
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
