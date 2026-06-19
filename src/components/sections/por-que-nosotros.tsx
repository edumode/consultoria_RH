import { Container } from "@/components/ui/container";
import { BENEFICIOS } from "@/features/contenido/data";

export function PorQueNosotros() {
  return (
    <section id="porque" className="bg-forest-dark text-[#eef2ef]">
      <Container className="flex flex-wrap gap-16 py-22">
        <div className="min-w-[300px] flex-[1_1_360px]">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-accent">
            Por qué elegirnos
          </span>
          <h2 className="mt-3.5 font-serif text-4xl font-medium leading-[1.14] tracking-[-0.01em] text-white">
            Confianza que se traduce en resultados
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#bcc9c2]">
            Acompañamos a líderes y gerentes con un enfoque humano y a la vez
            riguroso, centrado siempre en el crecimiento sostenible de la
            empresa.
          </p>
        </div>

        <div className="grid min-w-[300px] flex-[1_1_420px] gap-4">
          {BENEFICIOS.map((b) => (
            <div
              key={b.titulo}
              className="flex items-start gap-[18px] rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-[22px]"
            >
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-clay text-[15px] font-bold text-white">
                ✓
              </span>
              <div>
                <div className="mb-1 font-serif text-[19px] font-semibold text-white">
                  {b.titulo}
                </div>
                <div className="text-[15px] leading-snug text-[#b6c3bb]">
                  {b.descripcion}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
