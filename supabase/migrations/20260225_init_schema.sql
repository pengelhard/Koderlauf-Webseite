-- Koderlauf Database Schema
-- Creates all tables for events, participants, results, and gallery

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ENUM types
create type distance_type as enum ('5km', '10km', 'kids');
create type gender_type as enum ('M', 'W', 'D');
create type price_tier_type as enum ('early_bird', 'normal', 'nachmeldung');

-- Events table
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  date timestamptz not null,
  location text not null,
  description text,
  max_participants_5km int,
  max_participants_10km int,
  max_participants_kids int,
  registration_open boolean not null default false,
  early_bird_deadline timestamptz,
  created_at timestamptz not null default now()
);

-- Participants table
create table public.participants (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  birth_date date not null,
  gender gender_type not null,
  distance distance_type not null,
  club text,
  tshirt_size text not null,
  emergency_contact_name text not null,
  emergency_contact_phone text not null,
  photo_consent boolean not null default false,
  privacy_accepted boolean not null default true,
  bib_number int,
  startgebuehr_paid boolean not null default false,
  stripe_session_id text,
  price_cents int not null,
  price_tier price_tier_type not null,
  created_at timestamptz not null default now(),
  unique(event_id, email)
);

-- Results table
create table public.results (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  participant_id uuid not null references public.participants(id) on delete cascade,
  finish_time interval not null,
  rank int,
  category_rank int,
  distance distance_type not null,
  age_class text,
  created_at timestamptz not null default now()
);

-- Gallery images table
create table public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  caption text,
  photographer text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_participants_event on public.participants(event_id);
create index idx_participants_email on public.participants(email);
create index idx_participants_distance on public.participants(event_id, distance);
create index idx_results_event on public.results(event_id);
create index idx_results_participant on public.results(participant_id);
create index idx_gallery_event on public.gallery_images(event_id);

-- Row Level Security (RLS)
alter table public.events enable row level security;
alter table public.participants enable row level security;
alter table public.results enable row level security;
alter table public.gallery_images enable row level security;

-- Public read access for events, results, gallery
create policy "Events are publicly readable"
  on public.events for select using (true);

create policy "Results are publicly readable"
  on public.results for select using (true);

create policy "Gallery images are publicly readable"
  on public.gallery_images for select using (true);

-- Participants: public can insert (register), but only read own data
create policy "Anyone can register"
  on public.participants for insert with check (true);

create policy "Participants can view paid entries"
  on public.participants for select using (startgebuehr_paid = true);

-- Function: count participants per distance (for live counter)
create or replace function public.count_participants(p_event_id uuid, p_distance distance_type)
returns bigint
language sql
stable
security definer
as $$
  select count(*)
  from public.participants
  where event_id = p_event_id
    and distance = p_distance
    and startgebuehr_paid = true;
$$;

-- Function: auto-assign bib number
create or replace function public.assign_bib_number()
returns trigger
language plpgsql
security definer
as $$
declare
  next_bib int;
begin
  if NEW.startgebuehr_paid = true and NEW.bib_number is null then
    select coalesce(max(bib_number), 0) + 1
    into next_bib
    from public.participants
    where event_id = NEW.event_id;
    NEW.bib_number := next_bib;
  end if;
  return NEW;
end;
$$;

create trigger trg_assign_bib
  before insert or update on public.participants
  for each row execute function public.assign_bib_number();

-- Seed: Koderlauf 2027 event
insert into public.events (name, slug, date, location, description, max_participants_5km, max_participants_10km, max_participants_kids, registration_open, early_bird_deadline)
values (
  'Koderlauf 2027',
  'koderlauf-2027',
  '2027-06-15T09:00:00+02:00',
  'Obermögersheim',
  'Der jährliche Waldlauf in Obermögersheim. 5 km, 10 km und Kids-Lauf durch den Wald.',
  200,
  150,
  100,
  true,
  '2027-02-28T23:59:59+01:00'
);

-- Seed: Koderlauf 2026 event (for results/gallery)
insert into public.events (name, slug, date, location, description, max_participants_5km, max_participants_10km, max_participants_kids, registration_open)
values (
  'Koderlauf 2026',
  'koderlauf-2026',
  '2026-06-14T09:00:00+02:00',
  'Obermögersheim',
  'Koderlauf 2026 – unser bisher größter Lauf!',
  200,
  150,
  100,
  false
);
