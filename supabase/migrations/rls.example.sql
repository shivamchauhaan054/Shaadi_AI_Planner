-- =============================================================================
-- Row Level Security (RLS) — EXAMPLE ONLY
-- =============================================================================
-- This file is NOT applied by the v1 app. Run manually after integrating
-- Supabase Auth and adding ownership columns.
--
-- Prerequisites:
--   1. Enable Supabase Auth (email, OAuth, etc.)
--   2. Apply the schema changes in SECTION 1 below
--   3. Run SECTION 2 to enable RLS + policies
--   4. Stop using the anon key from public Route Handlers for cross-user access;
--      prefer user JWT in server clients OR keep API as BFF with service checks
--
-- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser or NEXT_PUBLIC_* vars.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION 1 — Ownership columns (run once before RLS)
-- -----------------------------------------------------------------------------

-- ALTER TABLE wedding_intakes
--   ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users (id) ON DELETE SET NULL;

-- CREATE INDEX IF NOT EXISTS idx_wedding_intakes_owner_id
--   ON wedding_intakes (owner_id);

-- Optional: session / share link for guest read-only access (future)
-- ALTER TABLE wedding_intakes
--   ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;

-- -----------------------------------------------------------------------------
-- SECTION 2 — Enable RLS
-- -----------------------------------------------------------------------------

-- ALTER TABLE wedding_intakes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners (recommended in production)
-- ALTER TABLE wedding_intakes FORCE ROW LEVEL SECURITY;
-- ALTER TABLE recommendations FORCE ROW LEVEL SECURITY;
-- ALTER TABLE payments FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- SECTION 3 — wedding_intakes policies
-- -----------------------------------------------------------------------------

-- CREATE POLICY "intakes_select_own"
--   ON wedding_intakes
--   FOR SELECT
--   TO authenticated
--   USING (owner_id = auth.uid());

-- CREATE POLICY "intakes_insert_own"
--   ON wedding_intakes
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (owner_id = auth.uid());

-- CREATE POLICY "intakes_update_own"
--   ON wedding_intakes
--   FOR UPDATE
--   TO authenticated
--   USING (owner_id = auth.uid())
--   WITH CHECK (owner_id = auth.uid());

-- CREATE POLICY "intakes_delete_own"
--   ON wedding_intakes
--   FOR DELETE
--   TO authenticated
--   USING (owner_id = auth.uid());

-- -----------------------------------------------------------------------------
-- SECTION 4 — recommendations policies (via intake ownership)
-- -----------------------------------------------------------------------------

-- CREATE POLICY "recommendations_select_own"
--   ON recommendations
--   FOR SELECT
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = recommendations.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "recommendations_insert_own"
--   ON recommendations
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = recommendations.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "recommendations_update_own"
--   ON recommendations
--   FOR UPDATE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = recommendations.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "recommendations_delete_own"
--   ON recommendations
--   FOR DELETE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = recommendations.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- -----------------------------------------------------------------------------
-- SECTION 5 — payments policies (via intake ownership)
-- -----------------------------------------------------------------------------

-- CREATE POLICY "payments_select_own"
--   ON payments
--   FOR SELECT
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = payments.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "payments_insert_own"
--   ON payments
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = payments.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "payments_update_own"
--   ON payments
--   FOR UPDATE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = payments.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "payments_delete_own"
--   ON payments
--   FOR DELETE
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM wedding_intakes wi
--       WHERE wi.id = payments.intake_id
--         AND wi.owner_id = auth.uid()
--     )
--   );

-- -----------------------------------------------------------------------------
-- SECTION 6 — Revoke broad anon access (production)
-- -----------------------------------------------------------------------------
-- After RLS is verified, restrict anon role grants in the Supabase dashboard
-- or via SQL. Until Auth ships, v1 relies on UUID secrecy + server BFF — NOT
-- sufficient for a public multi-tenant launch.

-- REVOKE ALL ON wedding_intakes FROM anon;
-- REVOKE ALL ON recommendations FROM anon;
-- REVOKE ALL ON payments FROM anon;

-- -----------------------------------------------------------------------------
-- SECTION 7 — Service role (server-only background jobs)
-- -----------------------------------------------------------------------------
-- SUPABASE_SERVICE_ROLE_KEY bypasses RLS. Use only in:
--   - Trusted cron / admin scripts
--   - Never in Client Components or NEXT_PUBLIC_* env vars
-- The Next.js app v1 does NOT use the service role.
