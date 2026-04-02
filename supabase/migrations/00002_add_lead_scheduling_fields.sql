-- Add scheduling and plan selection fields to public_leads
ALTER TABLE public_leads
  ADD COLUMN IF NOT EXISTS selected_plan TEXT,
  ADD COLUMN IF NOT EXISTS preferred_install_date TEXT,
  ADD COLUMN IF NOT EXISTS preferred_install_time TEXT CHECK (preferred_install_time IN ('morning', 'afternoon', 'no-preference'));
