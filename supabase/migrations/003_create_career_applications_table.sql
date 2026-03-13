-- Career applications table
CREATE TABLE IF NOT EXISTS career_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  experience TEXT,
  why_interested TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (public form)
CREATE POLICY "Anyone can submit career application" ON career_applications
  FOR INSERT WITH CHECK (true);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_career_apps_status ON career_applications (status, created_at DESC);
