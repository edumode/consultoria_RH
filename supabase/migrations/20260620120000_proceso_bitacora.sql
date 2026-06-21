-- =============================================================================
-- proceso_bitacora — historial de un proceso.
-- Cada creación/edición/cambio de estado registra una entrada con una nota,
-- el estado en ese momento y quién lo hizo. Se muestra del más reciente al más
-- antiguo. El cliente puede leer la bitácora de SUS procesos; solo admin escribe.
-- =============================================================================

create table public.proceso_bitacora (
  id          uuid primary key default gen_random_uuid(),
  proceso_id  uuid not null references public.procesos (id) on delete cascade,
  nota        text,
  estado      text,
  autor       text,
  created_at  timestamptz not null default now()
);

create index proceso_bitacora_proceso_idx
  on public.proceso_bitacora (proceso_id, created_at desc);

alter table public.proceso_bitacora enable row level security;

-- El cliente ve la bitácora de sus procesos; el admin ve todas.
create policy "bitacora: lectura cliente o admin"
  on public.proceso_bitacora for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.procesos p
      where p.id = proceso_id
        and p.cliente_email = (auth.jwt() ->> 'email')
    )
  );

-- Solo el admin escribe en la bitácora.
create policy "bitacora: gestión admin"
  on public.proceso_bitacora for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
