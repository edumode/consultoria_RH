import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark: emblema + "Pilar" (verde) "Humano" (terracota) + bajada "Consultoría RH". */
export function Logo({
  href = "/",
  className,
  tone = "dark",
}: {
  href?: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
      aria-label="Pilar Humano — Consultoría RH, inicio"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" className="h-9 w-auto rounded-[5px] sm:h-10" />
      <span className="flex flex-col">
        <span className="font-serif text-xl font-semibold leading-none tracking-[0.01em] sm:text-2xl">
          <span className={light ? "text-cream-light" : "text-forest"}>Pilar </span>
          <span className="text-clay">Humano</span>
        </span>
        <span className="mt-1 flex items-center gap-1.5">
          <span className={cn("h-px w-3 flex-none", light ? "bg-white/25" : "bg-sage")} />
          <span
            className={cn(
              "text-[9px] font-semibold uppercase tracking-[0.22em] sm:text-[10px]",
              light ? "text-muted-light" : "text-stone",
            )}
          >
            Consultoría RH
          </span>
          <span className={cn("h-px w-3 flex-none", light ? "bg-white/25" : "bg-sage")} />
        </span>
      </span>
    </Link>
  );
}
