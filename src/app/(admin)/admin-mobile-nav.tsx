"use client";

import { useState } from "react";
import Link from "next/link";

type Item = { href: string; label: string };

/** Menú hamburguesa del panel para móvil (oculto en ≥ md). Despliega los enlaces
 *  en vertical para que no se vean amontonados. */
export function AdminMobileNav({
  items,
  email,
}: {
  items: Item[];
  email?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="-mr-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-sand-200"
      >
        <span className="relative block h-4 w-5" aria-hidden>
          <span
            className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
              open ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
              open ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-40 cursor-default bg-ink/20"
          />
          <div className="absolute inset-x-0 top-full z-50 border-b border-sand-300 bg-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]">
            <nav className="flex flex-col gap-1 px-6 py-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-ink-soft transition-colors hover:bg-sand-100 hover:text-forest"
                >
                  {item.label}
                </Link>
              ))}
              {email && (
                <div className="mt-1 border-t border-sand-200 px-2 pt-3 text-[13px] text-muted">
                  {email}
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
