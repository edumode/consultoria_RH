import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getServicios } from "@/features/contenido/servicios";

export async function Servicios() {
  const servicios = await getServicios();

  return (
    <section
      id="servicios"
      className="border-y border-sand-200 bg-white"
    >
      <Container className="py-22 sm:py-[88px]">
        <div className="mb-14 max-w-[620px]">
          <Eyebrow>Nuestros servicios</Eyebrow>
          <h2 className="mt-3.5 font-serif text-4xl font-medium leading-tight tracking-[-0.01em] text-ink">
            Tres pilares para construir equipos que rinden
          </h2>
          <p className="mt-4 text-[17px] text-stone">
            Soluciones integrales de Recursos Humanos, diseñadas según la etapa y
            el tamaño de tu empresa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {servicios.map((s) => (
            <article
              key={s.num}
              className="group relative flex flex-col rounded-2xl border border-sand-200 bg-cream-light p-8 transition-colors hover:border-forest"
            >
              {s.destacado && (
                <span className="absolute right-5 top-5 rounded-full border border-[#ecd6c2] bg-[#f7ece2] px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.08em] text-clay">
                  Más solicitado
                </span>
              )}

              <div className="font-serif text-[15px] font-semibold tracking-[0.04em] text-forest">
                {s.num}
              </div>

              <div className="my-5 flex h-11 w-11 items-center justify-center rounded-xl bg-forest">
                <span className="h-4 w-4 rounded-[3px] border-2 border-white" />
              </div>

              <h3 className="mb-3 font-serif text-[23px] font-semibold leading-snug text-ink">
                {s.titulo}
              </h3>
              <p className="mb-[22px] flex-1 text-[15.5px] leading-relaxed text-stone">
                {s.descripcion}
              </p>

              <a
                href="#contacto"
                className="inline-flex items-center gap-[7px] text-[15px] font-semibold text-forest transition-all group-hover:gap-2.5"
              >
                Saber más <span className="text-[17px]">→</span>
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
