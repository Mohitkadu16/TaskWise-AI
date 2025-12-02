-- ============================================================================
-- QUERY 2: Setup automatic updated_at trigger (run after Query 1)
-- ============================================================================

-- Create the trigger function (idempotent - safe to run multiple times)
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS payments_set_updated_at ON payments;

-- Create the trigger (fresh)
CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();
