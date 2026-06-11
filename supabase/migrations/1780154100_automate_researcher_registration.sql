-- Create researcher_whitelist table to store authorized wallets
CREATE TABLE IF NOT EXISTS researcher_whitelist (
  wallet_address text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security to prevent unauthorized table modifications
ALTER TABLE researcher_whitelist ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read the whitelist (e.g. to check eligibility on the client)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'researcher_whitelist'
      AND policyname = 'Allow authenticated users to read whitelist'
  ) THEN
    CREATE POLICY "Allow authenticated users to read whitelist" ON researcher_whitelist
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Trigger function to automatically manage profiles.role based on the whitelist
CREATE OR REPLACE FUNCTION check_researcher_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the user's wallet is in the whitelist, automatically upgrade to researcher
  IF EXISTS (
    SELECT 1 FROM researcher_whitelist
    WHERE wallet_address = NEW.wallet_address
  ) THEN
    NEW.role := 'researcher';
  ELSE
    -- If not whitelisted:
    -- On insert, default to participant.
    -- On update, preserve existing 'researcher' status if set previously, 
    -- but prevent client-side promotion to 'researcher'.
    IF TG_OP = 'INSERT' THEN
      NEW.role := 'participant';
    ELSIF TG_OP = 'UPDATE' THEN
      IF OLD.role = 'researcher' THEN
        NEW.role := 'researcher';
      ELSE
        NEW.role := 'participant';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create the before trigger on profiles table
DROP TRIGGER IF EXISTS tr_check_researcher_role ON profiles;
CREATE TRIGGER tr_check_researcher_role
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_researcher_role();
