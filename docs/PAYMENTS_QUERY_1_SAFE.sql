-- ============================================================================
-- QUERY 1: Safe Migration (no trigger issues)
-- Run this first - adds all columns and sets up RLS
-- ============================================================================

-- STEP A: Add new columns (non-destructive)
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS plan TEXT CHECK (plan IN ('monthly','yearly')),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_session_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- STEP B: Add and populate amount_minor (in paise)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount_minor INTEGER;

UPDATE payments
SET amount_minor = CAST(ROUND(amount * 100) AS INTEGER)
WHERE amount IS NOT NULL AND amount_minor IS NULL;

-- Add helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_session_id ON payments(provider_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Enable RLS on the payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: Allow users to access only their own payment records
DROP POLICY IF EXISTS payments_insert ON payments;
DROP POLICY IF EXISTS payments_select ON payments;
DROP POLICY IF EXISTS payments_update ON payments;

CREATE POLICY payments_insert ON payments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY payments_select ON payments
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY payments_update ON payments
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
