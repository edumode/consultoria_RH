"use client";

import { useActionState } from "react";
import { crearProceso, type ProcesoState } from "./actions";

const INITIAL: ProcesoState = { status: "idle" };

const inputClass =
  "w-full rounded-[10px] border-[1.5px] border-sand-300 bg-white px-[15px] py-[11px] text-[15px] text-ink outline-none transition-colors focus:border-forest";
const labelClass = "mb-[6px] block text-[13px] font-semibold text-ink-soft";

export function ProcesoForm({
  clienteEmail = "",
  leadId = "",
}: {
  clienteEmail?: string;
  leadId?: string;
}) {
  const [state, formAction, pending] = useActionState(crearProceso, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {leadId && <input type="hidden" name="lead_id" value={leadId} />}

      <div>
        <label className={labelClass} htmlFor="cliente_email">
          Correo del cliente
        </label>
        <input
          id="cliente_email"
          name="cliente_email"
          type="email"
          required
          defaultValue={clienteEmail}
          placeholder="cliente@empresa.com"
          className={inputClass}
        />
        <p className="mt-1.5 text-[13px] text-muted">
          El cliente verá este proceso al entrar con este correo (aunque aún no
          tenga cuenta).
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="titulo">
          Título del proceso
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          placeholder="Diagnóstico de clima organizacional"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="descripcion">
          Descripción <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          placeholder="Qué incluye el proceso, próximos pasos, etc."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="estado">
          Estado
        </label>
        <select id="estado" name="estado" defaultValue="pendiente" className={inputClass}>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En progreso</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      {state.status === "error" && (
        <p className="rounded-lg bg-[#f7e6e2] px-4 py-3 text-[14px] text-terracotta">
          {state.message}
        </p>
      )}

      <div className="flex gap-3 border-t border-sand-200 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-forest px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60"
        >
          {pending ? "Creando…" : "Crear y asignar"}
        </button>
      </div>
    </form>
  );
}
