-- ============================================================================
-- Payments Table Migration - Run all steps sequentially in Supabase SQL Editor
-- ============================================================================
-- This migration safely evolves your existing payments table to support:
-- - Monthly/Yearly plans
-- - Minor currency units (paise for INR)
-- - Payment provider integration (Stripe, Razorpay)
-- - Automatic timestamp updates
-- - Row-level security

-- ============================================================================
-- STEP A: Add new columns (non-destructive)
-- ============================================================================
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS plan TEXT CHECK (plan IN ('monthly','yearly')),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_session_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update created_at and updated_at to timestamptz if they aren't already
-- (if they're already timestamptz, this will be a no-op)
ALTER TABLE payments
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- ============================================================================
-- STEP B: Add integer amount_minor column and populate from existing amount
-- ============================================================================
-- Add the new amount_minor column (in paise for INR)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount_minor INTEGER;

-- Populate amount_minor from the existing decimal amount
-- Example: amount 200.00 → amount_minor 20000
UPDATE payments
SET amount_minor = CAST(ROUND(amount * 100) AS INTEGER)
WHERE amount IS NOT NULL AND amount_minor IS NULL;

-- ============================================================================
-- STEP C: Create trigger to auto-update the updated_at column
-- ============================================================================
-- Create the trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the old trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS payments_set_updated_at ON payments;

-- Create the new trigger
CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_column();

-- ============================================================================
-- STEP D (OPTIONAL): Drop the old decimal amount column after verifying
-- ============================================================================
-- WARNING: Only run this AFTER you've verified that amount_minor is populated correctly.
-- Uncomment the line below if you want to drop the old column:
--
-- ALTER TABLE payments DROP COLUMN amount;

-- ============================================================================
-- Add helpful indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_session_id ON payments(provider_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- ============================================================================
-- ENABLE ROW-LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on the payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Allow users to access only their own payment records
-- ============================================================================

-- Policy 1: Allow authenticated users to INSERT their own payment records
CREATE POLICY payments_insert ON payments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy 2: Allow authenticated users to SELECT their own payment records
CREATE POLICY payments_select ON payments
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy 3: Allow authenticated users to UPDATE their own payment records
CREATE POLICY payments_update ON payments
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- VERIFICATION QUERIES (run these to check your progress)
-- ============================================================================
-- Check the table structure:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'payments'
-- ORDER BY ordinal_position;

-- Check if RLS is enabled:
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'payments';

-- Check your data (sample):
-- SELECT id, user_id, plan, amount, amount_minor, status, provider, provider_session_id, created_at, updated_at
-- FROM payments
-- LIMIT 5;
