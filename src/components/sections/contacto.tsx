import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ContactForm } from "@/features/leads/contact-form";

const PUNTOS = [
  "Diagnóstico inicial sin compromiso",
  "Propuesta a la medida de tu empresa",
  "Atención directa con un consultor senior",
];

export function Contacto() {
  return (
    <section id="contacto">
      <Container className="py-22">
        <div className="flex flex-wrap items-start gap-16">
          <div className="min-w-0 flex-[1_1_380px]">
            <Eyebrow>Hablemos</Eyebrow>
            <h2 className="mt-3.5 font-serif text-4xl font-medium leading-tight tracking-[-0.01em] text-ink">
              Mejoremos tu equipo, juntos
            </h2>
            <p className="mb-7 mt-4 max-w-[440px] text-[17px] leading-relaxed text-stone">
              Cuéntanos qué necesitas y te contactamos para agendar una asesoría
              inicial sin costo. Respondemos en menos de 24 horas hábiles.
            </p>
            <div className="flex flex-col gap-3.5">
              {PUNTOS.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-3 text-[15.5px] text-ink-soft"
                >
                  <span className="h-2 w-2 rounded-full bg-forest" />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
