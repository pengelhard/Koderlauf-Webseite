-- Neue Supabase-Projekte (ab 30.05.2026) vergeben keine Rechte mehr automatisch.
-- Ohne dieses Grant schlägt der Admin-Haken bei Sachspenden fehl (42501).

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.fassjagd_state to service_role;
grant select, insert, update, delete on table public.sponsors to service_role;
