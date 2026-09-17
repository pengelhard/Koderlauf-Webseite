-- Harden public access to participants (PII).
-- Apply in the Supabase SQL editor if not run via CLI.
-- Safe if tables/policies are missing. Does not change results/gallery reads.

DO $$
DECLARE
  pol record;
  col text;
  pii_cols text[] := ARRAY[
    'email',
    'first_name',
    'last_name',
    'vorname',
    'nachname',
    'geburtstag',
    'birth_date',
    'emergency_contact_name',
    'emergency_contact_phone',
    'stripe_session_id',
    'user_id'
  ];
  public_cols text[] := ARRAY[
    'id',
    'distanz',
    'distance',
    'startgebuehr_paid',
    'created_at',
    'verein',
    'club',
    'startnummer',
    'bib_number'
  ];
  grant_list text := '';
  col_exists boolean;
BEGIN
  IF to_regclass('public.participants') IS NULL THEN
    RAISE NOTICE 'participants table missing – skip';
    RETURN;
  END IF;

  ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'participants'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.participants', pol.policyname);
  END LOOP;

  REVOKE ALL ON TABLE public.participants FROM PUBLIC;
  REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.participants FROM anon, authenticated;

  -- Column-level SELECT: no email / names / birth dates for anon
  REVOKE SELECT ON TABLE public.participants FROM anon, authenticated;

  FOREACH col IN ARRAY public_cols
  LOOP
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'participants'
        AND column_name = col
    ) INTO col_exists;

    IF col_exists THEN
      IF grant_list <> '' THEN
        grant_list := grant_list || ', ';
      END IF;
      grant_list := grant_list || format('%I', col);
    END IF;
  END LOOP;

  IF grant_list <> '' THEN
    EXECUTE format(
      'GRANT SELECT (%s) ON TABLE public.participants TO anon, authenticated',
      grant_list
    );
  END IF;

  -- Never grant PII columns (explicit, in case a previous GRANT lingered)
  FOREACH col IN ARRAY pii_cols
  LOOP
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'participants'
        AND column_name = col
    ) INTO col_exists;

    IF col_exists THEN
      EXECUTE format(
        'REVOKE SELECT (%I) ON TABLE public.participants FROM anon, authenticated, PUBLIC',
        col
      );
    END IF;
  END LOOP;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'participants'
      AND column_name = 'startgebuehr_paid'
  ) THEN
    CREATE POLICY participants_public_select_paid
      ON public.participants
      FOR SELECT
      TO anon, authenticated
      USING (startgebuehr_paid = true);
  ELSE
    CREATE POLICY participants_public_select
      ON public.participants
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Gallery: only approved rows, no public writes (either table name)
DO $$
BEGIN
  IF to_regclass('public.gallery_photos') IS NOT NULL THEN
    ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Gallery images are publicly readable" ON public.gallery_photos;
    DROP POLICY IF EXISTS gallery_photos_public_select ON public.gallery_photos;
    CREATE POLICY gallery_photos_public_select
      ON public.gallery_photos
      FOR SELECT
      TO anon, authenticated
      USING (COALESCE(approved, false) = true);
    REVOKE INSERT, UPDATE, DELETE ON TABLE public.gallery_photos FROM anon, authenticated, PUBLIC;
  END IF;

  IF to_regclass('public.gallery_images') IS NOT NULL THEN
    ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Gallery images are publicly readable" ON public.gallery_images;
    REVOKE INSERT, UPDATE, DELETE ON TABLE public.gallery_images FROM anon, authenticated, PUBLIC;
    CREATE POLICY gallery_images_public_select
      ON public.gallery_images
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
