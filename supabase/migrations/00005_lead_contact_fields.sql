-- Homeowner-facing form v3 (2026-09-15): split name, optional date of birth, preferred speed.
-- `isp_declared` now holds the homeowner's pick too (was canvasser-only); "best" = "find me the best option".
ALTER TABLE public_leads
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS preferred_speed TEXT;
