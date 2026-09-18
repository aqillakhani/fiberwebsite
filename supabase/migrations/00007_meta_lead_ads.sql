-- Facebook/Instagram instant-form leads arrive through the Lead Ads webhook (2026-09-18).
-- meta_lead_id makes redelivery idempotent; form_answers keeps every custom question verbatim.
ALTER TABLE public_leads
  ADD COLUMN IF NOT EXISTS meta_lead_id TEXT,
  ADD COLUMN IF NOT EXISTS form_answers JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_meta_lead_id ON public_leads (meta_lead_id) WHERE meta_lead_id IS NOT NULL;
