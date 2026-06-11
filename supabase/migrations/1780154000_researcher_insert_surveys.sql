-- Allow researchers to insert surveys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'surveys'
      AND policyname = 'Researchers can insert surveys'
  ) THEN
    CREATE POLICY "Researchers can insert surveys" ON surveys
      FOR INSERT TO authenticated
      WITH CHECK (is_researcher());
  END IF;
END $$;
