/*
  # Core tables for macroeconomic data collection dApp

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, FK to auth.users)
      - `wallet_address` (text, unique) — Solana public key
      - `full_name` (text)
      - `age_range` (text) — age bracket for demographics
      - `gender` (text)
      - `education_level` (text)
      - `occupation` (text)
      - `municipality` (text) — approximate location (privacy-safe)
      - `state` (text) — approximate location (privacy-safe)
      - `gps_verified` (boolean) — whether GPS matched declared location
      - `gps_verified_at` (timestamptz) — when GPS was last verified
      - `is_registered` (boolean) — completed registration flow
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `surveys`
      - `id` (uuid, primary key)
      - `title` (text) — survey name
      - `description` (text) — what this survey is about
      - `category` (text) — e.g. income, consumption, employment
      - `questions` (jsonb) — array of question objects
      - `is_active` (boolean)
      - `estimated_minutes` (integer) — time to complete
      - `created_at` (timestamptz)

    - `survey_responses`
      - `id` (uuid, primary key)
      - `survey_id` (uuid, FK to surveys)
      - `respondent_id` (uuid, FK to profiles)
      - `answers` (jsonb) — full answer data
      - `data_hash` (text) — SHA-256 hash for Solana integrity verification
      - `solana_tx_signature` (text) — transaction signature once hash is on-chain
      - `municipality` (text) — location at time of response
      - `state` (text) — location at time of response
      - `submitted_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read/update their own profile, insert their own profile
    - Surveys: all authenticated users can read active surveys
    - Survey responses: users can read/insert their own responses

  3. Indexes
    - profiles(wallet_address) for lookup
    - survey_responses(respondent_id) for user history
    - survey_responses(survey_id) for survey aggregation
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address text UNIQUE NOT NULL,
  full_name text NOT NULL DEFAULT '',
  age_range text NOT NULL DEFAULT '',
  gender text NOT NULL DEFAULT '',
  education_level text NOT NULL DEFAULT '',
  occupation text NOT NULL DEFAULT '',
  municipality text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  gps_verified boolean DEFAULT false,
  gps_verified_at timestamptz,
  is_registered boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  estimated_minutes integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  data_hash text NOT NULL DEFAULT '',
  solana_tx_signature text,
  municipality text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Enable RLS on surveys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'surveys' AND rowsecurity = true
  ) THEN
    ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Enable RLS on survey_responses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'survey_responses' AND rowsecurity = true
  ) THEN
    ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Profiles policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can read own profile'
  ) THEN
    CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Surveys policies (all authenticated can read active surveys)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'surveys' AND policyname = 'Authenticated users can read active surveys'
  ) THEN
    CREATE POLICY "Authenticated users can read active surveys" ON surveys FOR SELECT TO authenticated USING (is_active = true);
  END IF;
END $$;

-- Survey responses policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'survey_responses' AND policyname = 'Users can read own responses'
  ) THEN
    CREATE POLICY "Users can read own responses" ON survey_responses FOR SELECT TO authenticated USING (auth.uid() = respondent_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'survey_responses' AND policyname = 'Users can insert own responses'
  ) THEN
    CREATE POLICY "Users can insert own responses" ON survey_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = respondent_id);
  END IF;
END $$;

-- Indexes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_profiles_wallet_address') THEN
    CREATE INDEX idx_profiles_wallet_address ON profiles(wallet_address);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_survey_responses_respondent') THEN
    CREATE INDEX idx_survey_responses_respondent ON survey_responses(respondent_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_survey_responses_survey') THEN
    CREATE INDEX idx_survey_responses_survey ON survey_responses(survey_id);
  END IF;
END $$;