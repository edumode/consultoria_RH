/** Une clases condicionalmente, ignorando valores vacíos/falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
