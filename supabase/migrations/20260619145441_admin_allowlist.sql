-- =============================================================================
-- Lista blanca de administradores
-- El registro (signup) es abierto, pero SOLO los correos de esta tabla pueden
-- leer leads/suscriptores y gestionar contenido. Se aplica en RLS para que el
-- candado sea real también a nivel de API, no solo en la app Next.
-- =============================================================================

create table public.admin_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Tabla bloqueada: nadie la lee/escribe vía API. Solo la función de abajo
-- (security definer) y service_role pueden consultarla.
alter table public.admin_emails enable row level security;

-- ¿El usuario actual es admin? Lee el email de su JWT y lo busca en la allowlist.
-- security definer → ignora RLS de admin_emails al ejecutarse.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_emails
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- -----------------------------------------------------------------------------
-- Endurecer las políticas: lectura/gestión solo para admins de la allowlist
-- -----------------------------------------------------------------------------
drop policy "leads: lectura admin" on public.leads;
create policy "leads: lectura admin"
  on public.leads for select
  to authenticated
  using (public.is_admin());

-- Permitir a admins actualizar el estado del lead y borrarlos.
create policy "leads: gestión admin"
  on public.leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "leads: borrado admin"
  on public.leads for delete
  to authenticated
  using (public.is_admin());

drop policy "suscriptores: lectura admin" on public.suscriptores;
create policy "suscriptores: lectura admin"
  on public.suscriptores for select
  to authenticated
  using (public.is_admin());

create policy "suscriptores: borrado admin"
  on public.suscriptores for delete
  to authenticated
  using (public.is_admin());

drop policy "servicios: gestión admin" on public.servicios;
create policy "servicios: gestión admin"
  on public.servicios for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy "equipo: gestión admin" on public.equipo;
create policy "equipo: gestión admin"
  on public.equipo for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Admin inicial (propietario del proyecto). Añade más con:
--   insert into public.admin_emails (email) values ('otro@correo.com');
-- -----------------------------------------------------------------------------
insert into public.admin_emails (email) values ('cesarvasz@gmail.com')
  on conflict do nothing;
