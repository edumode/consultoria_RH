import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark VÉRTICE + bajada "Consultoría RH". */
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
      className={cn("inline-flex items-baseline gap-2.5", className)}
      aria-label="VÉRTICE — Consultoría RH, inicio"
    >
      <span
        className={cn(
          "font-serif text-2xl font-semibold tracking-[0.14em]",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        VÉRTICE
      </span>
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          tone === "light" ? "text-muted-light" : "text-muted",
        )}
      >
        Consultoría RH
      </span>
    </Link>
  );
}
