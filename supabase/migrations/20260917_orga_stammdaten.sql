-- Koderlauf Orga-Stammdaten für das neue Supabase-Projekt rrhcoelbplyiwczzkrjl
-- Idempotent: im SQL-Editor einfach ausführen.
--
-- Race Result bleibt Quelle für Starter/Startnummern/Wertung.
-- Diese Tabellen: Sponsoren-Kontakte + Fassjagd-Aliase/Freeze (überleben Deploys).
--
-- RLS: öffentlich kein Zugriff auf Kontakte / Fassjagd-State.
-- Website bleibt bei der Code-Liste (Name, Ort, Logo, Website).
-- Server nutzt SUPABASE_SECRET_KEY (umgeht RLS) für PDF und Admin.

create extension if not exists "pgcrypto";

create table if not exists public.sponsors (
  id text primary key,
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

drop policy if exists sponsors_no_public_select on public.sponsors;
-- Keine Policies = anon/authenticated sehen nichts. Service-/Secret-Key umgeht RLS.

comment on table public.sponsors is
  'Orga-Stammdaten Sponsoren. Kontakte nicht öffentlich; Website nutzt Code-Liste.';
comment on column public.sponsors.adresse is 'Straße/Hausnummer, optional mit PLZ';
comment on column public.sponsors.social_media is 'Instagram, Facebook, LinkedIn, …';
comment on column public.sponsors.notes is 'Nur intern, nicht im öffentlichen Frontend';
comment on column public.sponsors.year is 'Koderlauf-Jahr 2026 oder 2027';
comment on column public.sponsors.id is 'Stabiler Schlüssel, z. B. bittig-it-2026';

create table if not exists public.fassjagd_state (
  id int primary key default 1 check (id = 1),
  overrides jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.fassjagd_state enable row level security;

insert into public.fassjagd_state (id, overrides)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

comment on table public.fassjagd_state is
  'Eine Zeile: Fassjagd-Aliase, Ausschlüsse, Personen-Gruppen, Freeze, Tagesstände.';

-- Öffentliche Sicht: nur Felder, die auch auf /sponsoren stehen.
create or replace view public.sponsors_public as
select
  id,
  year,
  firma,
  ort,
  website,
  logo_path,
  hauptsponsor,
  invert_in_light_mode,
  sort_order
from public.sponsors;

grant select on public.sponsors_public to anon, authenticated;

insert into public.sponsors (
  id, year, firma, ort, logo_path, website, social_media, hauptsponsor, invert_in_light_mode, sort_order
) values
  ('heiko-biermeyer-2026', 2026, 'Heiko Biermeyer', 'Obermögersheim', '/sponsors/biermayer.png', 'https://elektrotechnik-biermeyer.de/', null, false, false, 0),
  ('bittig-it-2026', 2026, 'Bittig IT', 'Obermögersheim', '/sponsors/bittig-it.png', 'https://www.bittig-it.de/', null, false, false, 1),
  ('edeka-holler-2026', 2026, 'Edeka Holler', 'Wassertrüdingen', '/sponsors/edeka.png', 'https://edeka-wassertruedingen.de/', null, false, false, 2),
  ('modehaus-steingass-2026', 2026, 'Modehaus Steingass', 'Gunzenhausen', '/sponsors/steingass.png', 'https://www.modehaus-steingass.de/', null, false, true, 3),
  ('buttner-agrartechnik-2026', 2026, 'Büttner Agrartechnik', 'Ehingen', '/sponsors/buettner.png', 'https://www.buettner-agrartechnik.de/', null, false, false, 4),
  ('s-kuhl-hofladen-2026', 2026, 'S-Kuhl Hofladen', 'Obermögersheim', '/sponsors/s-kuhl.png', 'https://s-kuhl.de/', null, false, false, 5),
  ('schmidt-haustechnik-2026', 2026, 'Schmidt Haustechnik', 'Wassertrüdingen', '/sponsors/schmidt.png', 'https://schmidt-haustechnik.de/', null, false, false, 6),
  ('schreinerei-zinsmeister-2026', 2026, 'Schreinerei Zinsmeister', 'Obermögersheim', '/sponsors/zinsmeister.png', 'https://schreinerei-zinsmeister.de/', null, false, false, 7),
  ('label-b-2026', 2026, 'Label B', 'Wassertrüdingen', '/sponsors/label-b.png', 'https://www.label-b.de/', null, false, false, 8),
  ('mobiles-sagewerk-2026', 2026, 'Mobiles Sägewerk', 'Obermögersheim', '/sponsors/mobiles-saegewerk.png', null, null, false, false, 9),
  ('jager-2026', 2026, 'Jäger', 'Obermögersheim', null, null, null, false, false, 10),
  ('kaffeetechnik-piesche-2026', 2026, 'Kaffeetechnik Piesche', 'Gunzenhausen', '/sponsors/kaffeetechnik-piesche.png', 'http://www.kaffeetechnik.info/', null, false, false, 11),
  ('tretlager-2026', 2026, 'Tretlager', 'Wassertrüdingen', '/sponsors/tretlager.gif', 'http://tretlager.net/', null, false, false, 12),
  ('adler-apotheke-2026', 2026, 'Adler Apotheke', 'Wassertrüdingen', '/sponsors/adler-apotheke.png', 'https://deineadlerapo.de/', null, false, false, 13),
  ('amk-engelhardt-2026', 2026, 'AMK Engelhardt', 'Hainsfarth', '/sponsors/amk-engelhardt.png', 'https://bauzaun-mieten.net/', null, false, false, 14),
  ('baywa-bau-garten-2026', 2026, 'BayWa Bau & Garten', 'Gunzenhausen', '/sponsors/baywa.png', 'https://www.baywa-baumarkt.de/markt/gunzenhausen/', null, false, false, 15),
  ('medien-schlicker-2026', 2026, 'Medien Schlicker', 'Obermögersheim', '/sponsors/medien-schlicker.png', 'https://medien-schlicker.de/', null, false, false, 16),
  ('jeremias-abgastechnik-2026', 2026, 'Jeremias Abgastechnik', 'Wassertrüdingen', '/sponsors/jeremias.png', 'https://jeremias.de/', null, false, false, 17),
  ('lucalia-balloons-2026', 2026, 'Lucalia Balloons', 'Schobdach', '/sponsors/lucalia-balloons.png', 'https://lucalia-balloons-und-events-1.jimdosite.com/', null, false, false, 18),
  ('martina-edelmann-2026', 2026, 'Martina Edelmann', 'Obermögersheim', '/sponsors/edelmann.png', 'https://www.dvag.de/martina.edelmann/index.html', null, false, false, 19),
  ('beyhl-2026', 2026, 'Beyhl', 'Auhausen', '/sponsors/beyhl.png', 'https://www.beyhl.de/', null, false, false, 20),
  ('blattwerkbauer-2026', 2026, 'Blattwerkbauer', 'Wassertrüdingen', '/sponsors/blattwerk.png', 'https://www.instagram.com/blattwerkbauer/', 'https://www.instagram.com/blattwerkbauer/', false, true, 21),
  ('dommel-2026', 2026, 'DOMMEL', 'Wassertrüdingen', '/sponsors/dommel.png', 'https://www.dommel.de/', null, false, false, 22),
  ('fliesen-ballenberger-2026', 2026, 'Fliesen Ballenberger', 'Gunzenhausen', '/sponsors/ballenberger.png', null, null, false, false, 23),
  ('rothenberger-optik-und-schmuck-2026', 2026, 'Rothenberger Optik und Schmuck', 'Wassertrüdingen', '/sponsors/rothenberger.png', 'https://www.optik-rothenberger.de/', null, false, false, 24),
  ('kfz-rosenbauer-2026', 2026, 'KFZ Rosenbauer', 'Unterschwaningen', '/sponsors/kfz-rosenbauer.png', null, null, false, false, 25),
  ('kfz-jungwirth-2026', 2026, 'KFZ Jungwirth', 'Obermögersheim', '/sponsors/jungwirth.png', null, null, false, false, 26),
  ('elektronic-thoma-gmbh-2026', 2026, 'Elektronic Thoma GmbH', 'Dentlein am Forst', '/sponsors/thoma.png', 'https://www.thoma.de/', null, false, false, 27),
  ('kleeberger-forstdienstleistung-2026', 2026, 'Kleeberger Forstdienstleistung', 'Obermögersheim', '/sponsors/kleeberger.png', null, null, false, false, 28),
  ('r-v-versicherung-klaus-kapp-2026', 2026, 'R+V Versicherung Klaus Kapp', 'Wassertrüdingen', '/sponsors/ruv.png', 'https://www.ruv.de/vor-ort/wassertruedingen/kapp/', null, false, false, 29),
  ('geuko-laserscan-2026', 2026, 'GeuKo Laserscan', 'Wassertrüdingen', '/sponsors/geuko.png', 'https://geuko.de/', null, false, true, 30),
  ('getranke-peschke-2026', 2026, 'Getränke Peschke', 'Ostheim', null, null, null, false, false, 31),
  ('sparkasse-wassertrudingen-2026', 2026, 'Sparkasse Wassertrüdingen', 'Wassertrüdingen', '/sponsors/sparkasse-wassertruedingen.png', 'https://www.sparkasse.de/standorte/filialen/sparkasse-ansbach-beratungs-center-wassertruedingen-104062', null, false, false, 32),
  ('thomas-schneller-e-k-2026', 2026, 'Thomas Schneller e.K.', 'Unterschwaningen', '/sponsors/schneller.png', 'https://www.kartoffelfeinkost-schneller.de/unterschwaningen.html', null, false, false, 33),
  ('m-flock-2026', 2026, 'M. Flock', 'Wolframs-Eschenbach', '/sponsors/flock-transporte.png', 'https://www.flock-transporte.de/', null, false, false, 34),
  ('amro-it-systeme-gmbh-2026', 2026, 'AMRO IT-Systeme GmbH', 'Weißenburg i. Bay.', '/sponsors/amro-it-systeme.png', 'https://www.amro.de/', null, false, false, 35),
  ('stache-fitness-2026', 2026, 'Stache Fitness', 'Oberasbach', '/sponsors/stache-fitness.png', 'https://www.stache-fitness.de/', null, false, false, 36)
on conflict (id) do update set
  firma = excluded.firma,
  ort = excluded.ort,
  logo_path = excluded.logo_path,
  website = excluded.website,
  social_media = coalesce(public.sponsors.social_media, excluded.social_media),
  hauptsponsor = excluded.hauptsponsor,
  invert_in_light_mode = excluded.invert_in_light_mode,
  sort_order = excluded.sort_order,
  updated_at = now();
