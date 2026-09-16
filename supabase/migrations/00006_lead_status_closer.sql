-- Owner works leads from /admin/leads: a status per lead + which sales rep closed it (2026-09-16).
-- Old statuses stay valid so existing rows keep their history.
ALTER TABLE public_leads DROP CONSTRAINT IF EXISTS public_leads_status_check;
ALTER TABLE public_leads
  ADD CONSTRAINT public_leads_status_check CHECK (status IN (
    'new', 'follow_up', 'no_answer', 'not_interested', 'cancelled', 'sold',
    'contacted', 'qualified', 'converted', 'closed'
  ));

ALTER TABLE public_leads
  ADD COLUMN IF NOT EXISTS closer_name TEXT,
  ADD COLUMN IF NOT EXISTS closer_note TEXT,
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_leads_status_updated ON public_leads (status, status_updated_at DESC);
