"use client";

import { useActionState } from "react";
import { subscribe, type NewsletterState } from "./actions";

const INITIAL: NewsletterState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, INITIAL);

  if (state.status === "success") {
    return (
      <p className="text-[14.5px] text-sand-400">
        ¡Gracias! Te avisaremos de novedades de VÉRTICE.
      </p>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-2.5">
      <div className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="tu@correo.com"
          aria-label="Correo para la newsletter"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-[#7d796e] focus:border-sand-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-sand-accent px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-clay disabled:opacity-60"
        >
          {pending ? "…" : "Suscribirme"}
        </button>
      </div>
      {state.status === "error" && (
        <p className="text-[13px] text-sand-accent">{state.message}</p>
      )}
    </form>
  );
}
