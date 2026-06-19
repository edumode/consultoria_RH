"use client";

import { useActionState } from "react";
import { SERVICIOS_INTERES } from "@/features/contenido/data";
import { submitLead, type LeadState } from "./actions";

const INITIAL: LeadState = { status: "idle" };

const inputClass =
  "w-full rounded-[10px] border-[1.5px] border-sand-300 bg-cream-light px-[15px] py-[13px] text-[15px] text-ink outline-none transition-colors focus:border-forest";
const labelClass = "mb-[7px] block text-[13px] font-semibold text-ink-soft";
const errorClass = "mt-1.5 text-[13px] text-terracotta";

const cardClass =
  "min-w-[300px] flex-[1_1_440px] rounded-[18px] border border-sand-200 bg-white p-[34px] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL);

  if (state.status === "success") {
    return (
      <div className={cardClass}>
        <div className="px-2 py-7 text-center">
          <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2ee] text-[28px] text-forest">
            ✓
          </div>
          <h3 className="mb-2.5 font-serif text-[25px] font-semibold text-ink">
            ¡Gracias, {state.nombre}!
          </h3>
          <p className="text-[16px] text-stone">
            Recibimos tu solicitud. Un consultor de VÉRTICE te contactará muy
            pronto.
          </p>
        </div>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : undefined;

  return (
    <form action={formAction} noValidate className={cardClass}>
      <div className="mb-[18px]">
        <label className={labelClass} htmlFor="nombre">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          defaultValue={values?.nombre}
          placeholder="Tu nombre completo"
          className={inputClass}
        />
        {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
      </div>

      <div className="mb-[18px]">
        <label className={labelClass} htmlFor="empresa">
          Empresa
        </label>
        <input
          id="empresa"
          name="empresa"
          type="text"
          defaultValue={values?.empresa}
          placeholder="Nombre de tu empresa"
          className={inputClass}
        />
        {errors.empresa && <p className={errorClass}>{errors.empresa}</p>}
      </div>

      <div className="mb-[18px]">
        <label className={labelClass} htmlFor="correo">
          Correo
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          defaultValue={values?.correo}
          placeholder="nombre@empresa.com"
          className={inputClass}
        />
        {errors.correo && <p className={errorClass}>{errors.correo}</p>}
      </div>

      <div className="mb-6">
        <label className={labelClass} htmlFor="servicio">
          Servicio de interés
        </label>
        <select
          id="servicio"
          name="servicio"
          defaultValue={values?.servicio ?? ""}
          className={`${inputClass} appearance-none`}
        >
          <option value="">Selecciona una opción</option>
          {SERVICIOS_INTERES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.servicio && <p className={errorClass}>{errors.servicio}</p>}
      </div>

      {errors._form && (
        <p className="mb-3 text-center text-[13px] text-terracotta">
          {errors._form}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-forest py-[15px] text-[16px] font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Solicitar asesoría gratuita"}
      </button>
      <p className="mt-3.5 text-center text-[12.5px] text-muted-light">
        Al enviar aceptas nuestra política de privacidad.
      </p>
    </form>
  );
}
