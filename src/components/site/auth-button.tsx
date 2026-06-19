"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Botón de acceso del header. Se resuelve en el cliente para no forzar render
 * dinámico de la landing (que es estática con ISR):
 *   - sin sesión  → "Acceder" (/login)
 *   - con sesión  → "Mi cuenta" (/portal; los admins se redirigen a /admin allí)
 */
export function AuthButton() {
  const [logueado, setLogueado] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLogueado(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLogueado(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Mientras resuelve, reserva el espacio sin parpadeo de contenido.
  if (logueado === null) {
    return <span className="text-[15px] text-transparent">Acceder</span>;
  }

  if (logueado) {
    return (
      <Link
        href="/portal"
        className="text-[15px] font-medium text-forest transition-colors hover:text-forest-dark"
      >
        Mi cuenta
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-[15px] font-medium text-muted transition-colors hover:text-forest"
    >
      Acceder
    </Link>
  );
}
