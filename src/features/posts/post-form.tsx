"use client";

import { useActionState, useState } from "react";
import { guardarPost, type PostState } from "./actions";

const INITIAL: PostState = { status: "idle" };

export type PostFormData = {
  id: string;
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  portada_url: string;
  estado: string;
  enviar_newsletter: boolean;
};

const inputClass =
  "w-full rounded-[10px] border-[1.5px] border-sand-300 bg-white px-[15px] py-[11px] text-[15px] text-ink outline-none transition-colors focus:border-forest";
const labelClass = "mb-[6px] block text-[13px] font-semibold text-ink-soft";

const btnPrimary =
  "rounded-[10px] bg-forest px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-60";
const btnOutline =
  "rounded-[10px] border border-sand-300 px-5 py-3 text-[15px] font-semibold text-ink-soft transition-colors hover:border-forest hover:text-forest disabled:opacity-60";

export function PostForm({
  post,
  newsletterDisponible = false,
}: {
  post?: PostFormData;
  newsletterDisponible?: boolean;
}) {
  const [state, formAction, pending] = useActionState(guardarPost, INITIAL);
  const [programar, setProgramar] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label className={labelClass} htmlFor="titulo">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          required
          defaultValue={post?.titulo}
          placeholder="5 claves para retener talento"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">
          Slug <span className="font-normal text-muted">(opcional — se genera del título)</span>
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          placeholder="5-claves-para-retener-talento"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="extracto">
          Extracto <span className="font-normal text-muted">(resumen para la lista y el correo)</span>
        </label>
        <textarea
          id="extracto"
          name="extracto"
          rows={2}
          defaultValue={post?.extracto}
          placeholder="Una frase que invite a leer la entrada."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="portada_url">
          URL de portada <span className="font-normal text-muted">(opcional)</span>
        </label>
        <input
          id="portada_url"
          name="portada_url"
          type="url"
          defaultValue={post?.portada_url}
          placeholder="https://…/imagen.jpg"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contenido">
          Contenido <span className="font-normal text-muted">(Markdown)</span>
        </label>
        <textarea
          id="contenido"
          name="contenido"
          rows={16}
          defaultValue={post?.contenido}
          placeholder={"## Subtítulo\n\nEscribe en **Markdown**. Listas, enlaces, citas…\n\n- Punto uno\n- Punto dos"}
          className={`${inputClass} font-mono text-[14px] leading-relaxed`}
        />
      </div>

      {newsletterDisponible && (
        <label className="flex items-center gap-2.5 text-[15px] text-ink-soft">
          <input
            type="checkbox"
            name="enviar_newsletter"
            defaultChecked={post?.enviar_newsletter}
            className="h-4 w-4 accent-forest"
          />
          Enviar también por correo a los suscriptores al publicar
        </label>
      )}

      <label className="flex items-center gap-2.5 text-[15px] text-ink-soft">
        <input
          type="checkbox"
          checked={programar}
          onChange={(e) => setProgramar(e.target.checked)}
          className="h-4 w-4 accent-forest"
        />
        Programar publicación para más tarde
      </label>

      {programar && (
        <div>
          <label className={labelClass} htmlFor="programado_para">
            Fecha y hora de publicación
          </label>
          <input
            id="programado_para"
            name="programado_para"
            type="datetime-local"
            className={inputClass}
          />
        </div>
      )}

      {state.status === "error" && (
        <p className="rounded-lg bg-[#f7e6e2] px-4 py-3 text-[14px] text-terracotta">
          {state.message}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-3 border-t border-sand-200 pt-5">
        <button
          type="submit"
          name="accion"
          value="borrador"
          disabled={pending}
          className={btnOutline}
        >
          Guardar borrador
        </button>
        {programar ? (
          <button
            type="submit"
            name="accion"
            value="programar"
            disabled={pending}
            className={btnPrimary}
          >
            {pending ? "Programando…" : "Programar"}
          </button>
        ) : (
          <button
            type="submit"
            name="accion"
            value="publicar"
            disabled={pending}
            className={btnPrimary}
          >
            {pending ? "Publicando…" : "Publicar ahora"}
          </button>
        )}
      </div>
    </form>
  );
}
