"use client";

/**
 * Botón de envío que pide confirmación antes de enviar el formulario.
 * Útil para acciones destructivas (borrar) dentro de forms con Server Actions:
 * si el usuario cancela, se evita el submit.
 */
export function ConfirmSubmit({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
