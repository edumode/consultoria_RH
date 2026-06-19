import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const TILES = [
  {
    label: "foto · reunión de equipo",
    className: "col-span-2 row-span-1 bg-forest text-sage",
    pattern:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 12px, transparent 12px 24px)",
  },
  {
    label: "oficina",
    className: "bg-sand-100 text-muted-light",
    pattern:
      "repeating-linear-gradient(135deg, #e1ddcf 0 12px, #eceadf 12px 24px)",
  },
  {
    label: "entrevista 1:1",
    className: "bg-sand-accent text-[#fff3ea]",
    pattern:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 12px, transparent 12px 24px)",
  },
  {
    label: "colaboración",
    className: "bg-sage text-[#3e5750]",
    pattern:
      "repeating-linear-gradient(135deg, #c0d4ca 0 12px, #cfe0d8 12px 24px)",
  },
  {
    label: "presentación",
    className: "bg-sand-100 text-muted-light",
    pattern:
      "repeating-linear-gradient(135deg, #e1ddcf 0 12px, #eceadf 12px 24px)",
  },
];

export function Hero() {
  return (
    <section id="top">
      <Container className="py-16 sm:py-[72px] lg:pt-[84px]">
        <div className="flex flex-wrap items-center gap-16">
          {/* Columna de texto */}
          <div className="min-w-[320px] flex-[1_1_480px]">
            <div className="mb-6 inline-flex items-center gap-2.5">
              <span className="inline-block h-px w-6 bg-clay" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-clay">
                Aliados estratégicos en talento humano
              </span>
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.06] tracking-[-0.015em] text-ink sm:text-[58px]">
              Encuentra el talento perfecto y{" "}
              <span className="italic text-forest">potencia tu empresa</span>.
            </h1>

            <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-stone">
              Somos tu aliado estratégico en reclutamiento y consultoría de
              Recursos Humanos. Transformamos y optimizamos tus equipos de
              trabajo para que tu operación crezca con bases sólidas.
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <Button
                href="#contacto"
                size="lg"
                className="rounded-[10px] shadow-[0_8px_24px_-10px_rgba(31,77,68,0.55)]"
              >
                Agenda una asesoría gratuita
              </Button>
              <Button
                href="#servicios"
                variant="outline"
                size="lg"
                className="rounded-[10px] border-[#cfd8d2]"
              >
                Conoce nuestros servicios
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-[22px] border-t border-sand-200 pt-7">
              <div>
                <div className="font-serif text-3xl font-semibold leading-none text-forest">
                  Senior
                </div>
                <div className="mt-1.5 text-[13px] text-muted">
                  consultores especializados en RRHH
                </div>
              </div>
              <span className="h-10 w-px bg-sand-300" />
              <div>
                <div className="font-serif text-3xl font-semibold leading-none text-forest">
                  Ágil
                </div>
                <div className="mt-1.5 text-[13px] text-muted">
                  cobertura de vacantes clave
                </div>
              </div>
            </div>
          </div>

          {/* Collage de imágenes (placeholders con leyenda; fotos reales → public/) */}
          <div className="min-w-[300px] flex-[1_1_400px]">
            <div className="grid aspect-[4/5] grid-cols-2 grid-rows-[1.35fr_1fr_1fr] gap-2 overflow-hidden rounded-[18px] border border-sand-200 bg-sand-200">
              {TILES.map((tile) => (
                <div
                  key={tile.label}
                  className={`relative flex items-end p-3.5 ${tile.className}`}
                  style={{ backgroundImage: tile.pattern }}
                >
                  <span className="font-mono text-[11px]">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
