import { cn } from "@/lib/utils";

/** Centra el contenido y aplica el ancho máximo del sitio. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-295 px-6 sm:px-10", className)}>
      {children}
    </div>
  );
}
