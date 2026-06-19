import { cn } from "@/lib/utils";

/** Etiqueta superior en mayúsculas con tracking, usada al inicio de cada sección. */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.16em] text-clay",
        className,
      )}
    >
      {children}
    </span>
  );
}
