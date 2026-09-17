-- Sponsoren-Stammdaten (Orga intern).
-- Noch nicht live gegen das Supabase-Projekt ausführen, bis die Orga das
-- bewusst im SQL-Editor / CLI anstößt. Das PDF liest zuerst Code-Daten
-- und fällt nur auf diese Tabelle zurück, wenn Zeilen existieren.
--
-- Wichtig: Kein öffentliches SELECT auf der vollen Tabelle – Telefon, Mail
-- und Ansprechpartner sind intern. Die Website bleibt bei der Code-Liste
-- (Name, Ort, Logo, Website). Service Role umgeht RLS für das Orga-PDF.

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  year int not null check (year in (2026, 2027)),
  firma text not null,
  ort text,
  adresse text,
  ansprechpartner text,
  email text,
  telefon text,
  social_media text,
  website text,
  links text[],
  logo_path text,
  hauptsponsor boolean not null default false,
  invert_in_light_mode boolean not null default false,
  sort_order int not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sponsors_year on public.sponsors (year, sort_order, firma);

alter table public.sponsors enable row level security;

comment on table public.sponsors is
  'Orga-Stammdaten Sponsoren. Kontakte nicht öffentlich; Website nutzt Code-Fallback.';
comment on column public.sponsors.adresse is 'Straße/Hausnummer, optional mit PLZ';
comment on column public.sponsors.social_media is 'Instagram, Facebook, LinkedIn, …';
comment on column public.sponsors.notes is 'Nur intern, nicht im öffentlichen Frontend';
comment on column public.sponsors.year is 'Koderlauf-Jahr 2026 oder 2027';
