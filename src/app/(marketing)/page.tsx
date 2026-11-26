import { Hero } from "@/components/sections/hero";
import { Equipo } from "@/components/sections/equipo";
import { Servicios } from "@/components/sections/servicios";
import { PorQueNosotros } from "@/components/sections/por-que-nosotros";
import { Contacto } from "@/components/sections/contacto";

// ISR: regenera la página (incl. servicios desde Supabase) cada hora.
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Equipo />
      <Servicios />
      <PorQueNosotros />
      <Contacto />
    </>
  );
}
