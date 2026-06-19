-- =============================================================================
-- posts — entradas del blog / newsletters
-- Una misma entrada vive en el blog (/blog/[slug]) y puede enviarse por correo
-- a los suscriptores. Estados: borrador → programado → publicado.
-- Lectura pública solo de publicadas; gestión completa solo admin (allowlist).
-- =============================================================================

create table public.posts (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  -- URL amigable, única. Ej: "5-claves-para-retener-talento".
  slug                   text not null unique,
  titulo                 text not null,
  -- Resumen corto para la lista del blog y el preheader del correo.
  extracto               text,
  -- Cuerpo en Markdown.
  contenido              text not null default '',
  -- Imagen de portada (opcional).
  portada_url            text,
  estado                 text not null default 'borrador'
                           check (estado in ('borrador', 'programado', 'publicado')),
  -- Fecha de publicación: en 'programado' es la fecha futura objetivo;
  -- en 'publicado' es cuándo se publicó realmente.
  publicado_en           timestamptz,
  -- Si al publicar (ahora o al cumplirse la programación) debe enviarse el correo.
  enviar_newsletter      boolean not null default false,
  -- Marca de cuándo se envió el correo (null = nunca enviado). Evita doble envío.
  newsletter_enviado_en  timestamptz
);

create index posts_estado_publicado_idx
  on public.posts (estado, publicado_en desc);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

-- Lectura pública: solo entradas publicadas cuya fecha ya llegó.
create policy "posts: lectura pública"
  on public.posts for select
  to anon, authenticated
  using (estado = 'publicado' and publicado_en <= now());

-- Gestión completa (crear, editar, programar, borrar) solo para admins.
create policy "posts: gestión admin"
  on public.posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
