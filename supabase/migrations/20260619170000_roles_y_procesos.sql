-- =============================================================================
-- Roles de usuario (admin / customer) y procesos de consultoría.
--
-- profiles : una fila por usuario de auth. role define qué ve al entrar.
--            Se crea sola al registrarse (trigger). is_admin() pasa a leer aquí.
-- procesos : trabajo de consultoría asignado a un cliente (por correo). El admin
--            los crea/asigna; el cliente solo ve los suyos.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text not null default 'customer'
               check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Backfill de usuarios ya existentes y nombramiento del admin inicial.
insert into public.profiles (id, email, role)
  select id, email, 'customer' from auth.users
  on conflict (id) do nothing;

update public.profiles set role = 'admin' where email = 'cesarvasz@gmail.com';

-- is_admin() ahora se basa en el rol del perfil (antes leía admin_emails).
-- security definer → ignora RLS de profiles, así no hay recursión con las políticas.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Cada usuario lee su perfil; el admin lee todos.
create policy "profiles: lectura propia o admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- Solo el admin cambia roles (un cliente NO puede auto-promoverse).
create policy "profiles: gestión admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Alta automática de perfil al registrarse un usuario.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- procesos
-- -----------------------------------------------------------------------------
create table public.procesos (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Lead de origen (cuando nace de una consultoría agendada). Opcional.
  lead_id      uuid references public.leads (id) on delete set null,
  -- Cliente dueño del proceso, vinculado por correo (puede no estar registrado aún).
  cliente_email text not null,
  titulo       text not null,
  descripcion  text,
  estado       text not null default 'pendiente'
                 check (estado in ('pendiente', 'en_progreso', 'completado')),
  notas        text
);

create index procesos_cliente_email_idx on public.procesos (cliente_email);

create trigger procesos_set_updated_at
  before update on public.procesos
  for each row execute function public.set_updated_at();

alter table public.procesos enable row level security;

-- El cliente ve solo sus procesos (match por correo del JWT); el admin ve todos.
create policy "procesos: lectura cliente o admin"
  on public.procesos for select
  to authenticated
  using (public.is_admin() or cliente_email = (auth.jwt() ->> 'email'));

-- Crear/editar/borrar/asignar: solo admin.
create policy "procesos: gestión admin"
  on public.procesos for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
