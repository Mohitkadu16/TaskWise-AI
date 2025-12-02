-- ============================================================================
-- FIX: Allow amount column to be nullable (since we use amount_minor now)
-- ============================================================================
ALTER TABLE payments ALTER COLUMN amount DROP NOT NULL;
