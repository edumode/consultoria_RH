-- =============================================================================
-- Esquema inicial — VÉRTICE Consultoría RH
-- Tablas: leads, suscriptores (captura pública) · servicios, equipo (contenido)
-- Seguridad: RLS activado en todas. Escritura de captura abierta a anon;
-- lectura de captura cerrada (solo service_role/admin). Contenido: lectura
-- pública, escritura solo admin.
-- =============================================================================

-- Actualiza automáticamente updated_at en cada UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- leads — mensajes del formulario de contacto
-- -----------------------------------------------------------------------------
create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nombre      text not null,
  email       text not null,
  telefono    text,
  empresa     text,
  mensaje     text,
  -- Estado de gestión interna del lead.
  estado      text not null default 'nuevo'
                check (estado in ('nuevo', 'contactado', 'cerrado'))
);

alter table public.leads enable row level security;

-- Cualquiera puede ENVIAR un lead (formulario público); nadie anónimo puede leerlos.
create policy "leads: insert público"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- Lectura/gestión solo para usuarios autenticados (admin). service_role ignora RLS.
create policy "leads: lectura admin"
  on public.leads for select
  to authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- suscriptores — altas de la newsletter
-- -----------------------------------------------------------------------------
create table public.suscriptores (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique
);

alter table public.suscriptores enable row level security;

create policy "suscriptores: insert público"
  on public.suscriptores for insert
  to anon, authenticated
  with check (true);

create policy "suscriptores: lectura admin"
  on public.suscriptores for select
  to authenticated
  using (true);

-- -----------------------------------------------------------------------------
-- servicios — contenido dinámico mostrado en la landing
-- -----------------------------------------------------------------------------
create table public.servicios (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  titulo       text not null,
  descripcion  text,
  icono        text,
  orden        integer not null default 0,
  activo       boolean not null default true
);

create trigger servicios_set_updated_at
  before update on public.servicios
  for each row execute function public.set_updated_at();

alter table public.servicios enable row level security;

-- Lectura pública solo de los activos; escritura solo admin (authenticated).
create policy "servicios: lectura pública"
  on public.servicios for select
  to anon, authenticated
  using (activo = true);

create policy "servicios: gestión admin"
  on public.servicios for all
  to authenticated
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- equipo — miembros del equipo mostrados en la landing
-- -----------------------------------------------------------------------------
create table public.equipo (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  nombre      text not null,
  puesto      text,
  bio         text,
  foto_url    text,
  orden       integer not null default 0,
  activo      boolean not null default true
);

create trigger equipo_set_updated_at
  before update on public.equipo
  for each row execute function public.set_updated_at();

alter table public.equipo enable row level security;

create policy "equipo: lectura pública"
  on public.equipo for select
  to anon, authenticated
  using (activo = true);

create policy "equipo: gestión admin"
  on public.equipo for all
  to authenticated
  using (true)
  with check (true);
