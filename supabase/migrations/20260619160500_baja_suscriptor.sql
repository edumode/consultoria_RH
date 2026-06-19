-- =============================================================================
-- Baja de newsletter para visitantes anónimos.
-- El enlace "Darme de baja" del correo apunta a /newsletter/baja?id=<uuid>.
-- Como anon no puede borrar de suscriptores (RLS solo admin), exponemos una
-- función security definer que borra SOLO por id (el uuid es secreto suficiente).
-- =============================================================================

create or replace function public.baja_suscriptor(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.suscriptores where id = p_id;
$$;

grant execute on function public.baja_suscriptor(uuid) to anon, authenticated;
