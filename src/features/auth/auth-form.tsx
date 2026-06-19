"use client";

import { useActionState, useState } from "react";
import { login, signup, oauthSignIn, type AuthState } from "./actions";

const INITIAL: AuthState = { status: "idle" };

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

const oauthBtnClass =
  "flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-sand-300 bg-white py-3 text-[15px] font-medium text-ink transition-colors hover:bg-sand-100";

function OAuthButtons() {
  return (
    <form action={oauthSignIn}>
      <button type="submit" className={oauthBtnClass}>
        <GoogleIcon /> Continuar con Google
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-[10px] border-[1.5px] border-sand-300 bg-cream-light px-[15px] py-[13px] text-[15px] text-ink outline-none transition-colors focus:border-forest";
const labelClass = "mb-[7px] block text-[13px] font-semibold text-ink-soft";

export function AuthForm({ oauthError = false }: { oauthError?: boolean }) {
  const [modo, setModo] = useState<"login" | "signup">("login");
  const action = modo === "login" ? login : signup;
  const [state, formAction, pending] = useActionState(action, INITIAL);

  if (state.status === "check_email") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2ee] text-[28px] text-forest">
          ✓
        </div>
        <h2 className="mb-2.5 font-serif text-[22px] font-semibold text-ink">
          Revisa tu correo
        </h2>
        <p className="text-[15px] text-stone">
          Te enviamos un enlace para confirmar tu cuenta. Ábrelo y luego inicia
          sesión.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 text-center">
        <h1 className="font-serif text-[28px] font-semibold text-ink">
          {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="mt-2 text-[15px] text-stone">
          Acceso al panel de VÉRTICE.
        </p>
      </div>

      {oauthError && (
        <p className="mb-5 rounded-lg bg-[#f7e6e2] px-4 py-3 text-center text-[13px] text-terracotta">
          No pudimos iniciar sesión con ese proveedor. Inténtalo de nuevo.
        </p>
      )}

      <OAuthButtons />

      <div className="my-6 flex items-center gap-3 text-[12px] uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-sand-300" />o<span className="h-px flex-1 bg-sand-300" />
      </div>

      <form action={formAction} noValidate className="flex flex-col gap-[18px]">
        <div>
          <label className={labelClass} htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@correo.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {state.status === "error" && (
          <p className="text-[13px] text-terracotta">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-[10px] bg-forest py-[15px] text-[16px] font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
        >
          {pending
            ? "Procesando…"
            : modo === "login"
              ? "Entrar"
              : "Registrarme"}
        </button>
      </form>

      <p className="mt-6 text-center text-[14px] text-stone">
        {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          type="button"
          onClick={() => setModo(modo === "login" ? "signup" : "login")}
          className="font-semibold text-forest hover:underline"
        >
          {modo === "login" ? "Crear una" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}
