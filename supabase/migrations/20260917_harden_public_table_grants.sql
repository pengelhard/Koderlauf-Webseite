-- Live DB currently has sponsors + fassjagd_state (no participants).
-- Revoke write privileges from public roles; keep SELECT on sponsors_public only.

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.sponsors FROM anon, authenticated, PUBLIC;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.fassjagd_state FROM anon, authenticated, PUBLIC;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.sponsors_public FROM anon, authenticated, PUBLIC;

GRANT SELECT ON TABLE public.sponsors_public TO anon, authenticated;
REVOKE SELECT ON TABLE public.sponsors FROM anon, authenticated, PUBLIC;
REVOKE SELECT ON TABLE public.fassjagd_state FROM anon, authenticated, PUBLIC;
