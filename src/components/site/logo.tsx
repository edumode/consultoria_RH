import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark Pilar Humano + bajada "Consultoría RH". */
export function Logo({
  href = "/",
  className,
  tone = "dark",
}: {
  href?: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex shrink-0 items-baseline gap-2.5", className)}
      aria-label="Pilar Humano — Consultoría RH, inicio"
    >
      <span
        className={cn(
          "font-serif text-xl font-semibold tracking-[0.04em] sm:text-2xl",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        Pilar Humano
      </span>
      <span
        className={cn(
          "hidden text-[11px] font-semibold uppercase tracking-[0.18em] min-[360px]:inline-block",
          tone === "light" ? "text-muted-light" : "text-muted",
        )}
      >
        Consultoría RH
      </span>
    </Link>
  );
}
