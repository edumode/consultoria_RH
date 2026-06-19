/**
 * Contenido de la landing, hardcodeado por ahora (Paso 5).
 * En el Paso 6 los `servicios` se leerán desde Supabase y este archivo
 * quedará solo para fallback/seed.
 */

export type Servicio = {
  num: string;
  titulo: string;
  descripcion: string;
  destacado?: boolean;
};

export const SERVICIOS: Servicio[] = [
  {
    num: "01",
    titulo: "Reclutamiento Estratégico",
    descripcion:
      "Identificamos y atraemos al talento clave que tu empresa necesita, con procesos de selección rigurosos y cobertura ágil de las vacantes críticas.",
    destacado: true,
  },
  {
    num: "02",
    titulo: "Consultoría y Estructuración de RRHH",
    descripcion:
      "Ordenamos tu área de Recursos Humanos: estructura, procesos, políticas y descripciones de puesto que dan soporte real al crecimiento.",
  },
  {
    num: "03",
    titulo: "Cierre de Brechas y Desarrollo",
    descripcion:
      "Detectamos brechas de competencias y diseñamos planes de capacitación y desarrollo para que tus equipos rindan al máximo.",
  },
];

export type Beneficio = {
  titulo: string;
  descripcion: string;
};

export const BENEFICIOS: Beneficio[] = [
  {
    titulo: "Consultores senior",
    descripcion:
      "Cada proyecto lo lidera un especialista con experiencia real en Recursos Humanos, no un perfil junior.",
  },
  {
    titulo: "Enfoque a resultados",
    descripcion:
      "Medimos lo que importa: tiempo de cobertura, calidad de la contratación y retención del talento.",
  },
  {
    titulo: "Acompañamiento cercano",
    descripcion:
      "Trabajamos como una extensión de tu equipo, con comunicación directa y respuesta en menos de 24 horas hábiles.",
  },
];

/** Opciones del selector "Servicio de interés" del formulario de contacto. */
export const SERVICIOS_INTERES = [
  "Reclutamiento Estratégico (Headhunting)",
  "Consultoría y Estructuración de RRHH",
  "Cierre de Brechas y Desarrollo",
  "Aún no lo tengo claro",
] as const;
