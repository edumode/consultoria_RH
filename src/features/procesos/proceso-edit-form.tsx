"use client";

import { useActionState } from "react";
import { editarProceso, type ProcesoState } from "./actions";

const INITIAL: ProcesoState = { status: "idle" };

const inputClass =
  "w-full rounded-[10px] border-[1.5px] border-sand-300 bg-white px-[15px] py-[11px] text-[15px] text-ink outline-none transition-colors focus:border-forest";
const labelClass = "mb-[6px] block text-[13px] font-semibold text-ink-soft";

export type ProcesoEditable = {
  id: string;
  cliente_email: string;
  titulo: string;
  descripcion: string;
  estado: string;
};

export function ProcesoEditForm({
  proceso,
  notificarDisponible = false,
}: {
  proceso: ProcesoEditable;
  notificarDisponible?: boolean;
}) {
  const [state, formAction, pending] = useActionState(editarProceso, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={proceso.id} />

      <div>
        <label className={labelClass} htmlFor="cliente_email">
          Correo del cliente
        </label>
        <input
          id="cliente_email"
          name="cliente_email"
          type="email"
          required
          defaultValue={proceso.cliente_email}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="titulo">
          Título del proceso
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          defaultValue={proceso.titulo}
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
          defaultValue={proceso.descripcion}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="estado">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          defaultValue={proceso.estado}
          className={inputClass}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En progreso</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="nota">
          Nota de la actualización{" "}
          <span className="font-normal text-muted">(se guarda en la bitácora)</span>
        </label>
        <textarea
          id="nota"
          name="nota"
          rows={3}
          placeholder="Describe qué cambió o el avance: p. ej. «Enviamos la propuesta al cliente»."
          className={inputClass}
        />
      </div>

      {notificarDisponible && (
        <label className="flex items-center gap-2.5 text-[15px] text-ink-soft">
          <input
            type="checkbox"
            name="notificar"
            className="h-4 w-4 accent-forest"
          />
          Avisar al cliente por correo de esta actualización
        </label>
      )}

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
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
