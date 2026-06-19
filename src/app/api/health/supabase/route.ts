import { NextResponse } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

/**
 * Diagnóstico de conexión a Supabase.
 * GET /api/health/supabase → comprueba env + alcanza el endpoint de Auth.
 */
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: SUPABASE_ANON_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          status: res.status,
          message: "Supabase respondió con un estado no esperado.",
        },
        { status: 502 },
      );
    }

    const body = await res.json();
    return NextResponse.json({
      ok: true,
      configured: true,
      url: SUPABASE_URL,
      auth: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        message:
          error instanceof Error ? error.message : "No se pudo conectar a Supabase.",
      },
      { status: 502 },
    );
  }
}
