-- Shaadi AI Planner — initial schema
-- Run via Supabase SQL editor or: supabase db push

-- ---------------------------------------------------------------------------
-- wedding_intakes
-- ---------------------------------------------------------------------------
CREATE TABLE wedding_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_date DATE NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  city TEXT NOT NULL,
  venue_type TEXT NOT NULL,
  total_budget NUMERIC(12, 2) NOT NULL CHECK (total_budget >= 0),
  priorities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wedding_intakes_wedding_date
  ON wedding_intakes (wedding_date);

CREATE INDEX idx_wedding_intakes_city
  ON wedding_intakes (city);

CREATE INDEX idx_wedding_intakes_created_at
  ON wedding_intakes (created_at DESC);

-- ---------------------------------------------------------------------------
-- recommendations
-- ---------------------------------------------------------------------------
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID NOT NULL
    REFERENCES wedding_intakes (id) ON DELETE CASCADE,
  recommendations JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recommendations_intake_id
  ON recommendations (intake_id);

CREATE INDEX idx_recommendations_created_at
  ON recommendations (created_at DESC);

CREATE INDEX idx_recommendations_payload
  ON recommendations USING gin (recommendations);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID NOT NULL
    REFERENCES wedding_intakes (id) ON DELETE CASCADE,
  vendor_category TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  amount_paid NUMERIC(12, 2) NOT NULL CHECK (amount_paid >= 0),
  payment_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_intake_id
  ON payments (intake_id);

CREATE INDEX idx_payments_payment_date
  ON payments (payment_date DESC);

CREATE INDEX idx_payments_vendor_category
  ON payments (vendor_category);

CREATE INDEX idx_payments_created_at
  ON payments (created_at DESC);
