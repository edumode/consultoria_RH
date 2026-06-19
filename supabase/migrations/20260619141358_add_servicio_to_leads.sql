-- Servicio de interés seleccionado en el formulario de contacto.
alter table public.leads
  add column servicio text;
