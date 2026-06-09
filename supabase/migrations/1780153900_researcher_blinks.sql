/*
  # Researcher role, survey incentives, and RLS for data access

  1. profiles.role — 'participant' (default) | 'researcher'
  2. surveys.incentive_description — optional text set by researchers (no on-chain payment)
  3. RLS policies so researchers can read aggregated survey data

  To grant researcher access, run in Supabase SQL Editor:
    UPDATE profiles SET role = 'researcher' WHERE wallet_address = 'YOUR_WALLET_ADDRESS';
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'participant';

ALTER TABLE surveys
  ADD COLUMN IF NOT EXISTS incentive_description text NOT NULL DEFAULT '';

-- Researchers can read all surveys (including inactive)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'surveys'
      AND policyname = 'Researchers can read all surveys'
  ) THEN
    CREATE POLICY "Researchers can read all surveys" ON surveys
      FOR SELECT TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'researcher')
      );
  END IF;
END $$;

-- Researchers can update incentive text on surveys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'surveys'
      AND policyname = 'Researchers can update survey incentives'
  ) THEN
    CREATE POLICY "Researchers can update survey incentives" ON surveys
      FOR UPDATE TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'researcher')
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'researcher')
      );
  END IF;
END $$;

-- Researchers can read all survey responses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'survey_responses'
      AND policyname = 'Researchers can read all responses'
  ) THEN
    CREATE POLICY "Researchers can read all responses" ON survey_responses
      FOR SELECT TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'researcher')
      );
  END IF;
END $$;

-- Researchers can read respondent profiles (demographics for analysis)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
      AND policyname = 'Researchers can read respondent profiles'
  ) THEN
    CREATE POLICY "Researchers can read respondent profiles" ON profiles
      FOR SELECT TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'researcher')
      );
  END IF;
END $$;
