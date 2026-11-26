import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EQUIPO } from "@/features/contenido/data";

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Equipo() {
  return (
    <section id="equipo" className="bg-cream-light">
      <Container className="py-22 sm:py-[88px]">
        <div className="mx-auto mb-14 max-w-[620px] text-center">
          <Eyebrow>Nuestro equipo</Eyebrow>
          <h2 className="mt-3.5 font-serif text-4xl font-medium leading-tight tracking-[-0.01em] text-ink">
            Las personas detrás de cada proceso
          </h2>
          <p className="mt-4 text-[17px] text-stone">
            Especialistas en Recursos Humanos que acompañan a tu empresa de
            principio a fin.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {EQUIPO.map((p, i) => (
            <article key={`${p.nombre}-${i}`} className="text-center">
              <div className="mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-full border-4 border-white bg-sand-200 shadow-[0_12px_32px_-14px_rgba(31,77,68,0.45)]">
                {p.foto ? (
                  // Las fotos vienen recortadas en círculo sobre fondo blanco:
                  // el leve scale oculta el borde blanco del recorte.
                  <img
                    src={p.foto}
                    alt={`${p.nombre}, ${p.puesto}`}
                    className="h-full w-full scale-[1.04] object-cover"
                    style={p.encuadre ? { objectPosition: p.encuadre } : undefined}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-serif text-5xl font-semibold text-forest">
                    {iniciales(p.nombre)}
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-serif text-[22px] font-semibold text-ink">
                {p.nombre}
              </h3>
              <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-widest text-clay">
                {p.puesto}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
