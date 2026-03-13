-- Reps table for sales representative data
CREATE TABLE IF NOT EXISTS reps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Sales Representative',
  bio TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  territory TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE reps ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view active reps)
CREATE POLICY "Public can view active reps" ON reps
  FOR SELECT USING (is_active = true);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_reps_slug ON reps (slug);
CREATE INDEX IF NOT EXISTS idx_reps_active ON reps (is_active, sort_order);

-- Seed with placeholder team members (replace with real data later)
INSERT INTO reps (slug, name, role, bio, phone, email, city, state) VALUES
  ('sarah-johnson', 'Sarah Johnson', 'Founder & CEO', 'Former cable executive turned fiber advocate. 15 years of telecom experience.', '(888) 555-3278', 'sarah@fiberfastusa.com', 'Denver', 'CO'),
  ('mike-chen', 'Mike Chen', 'Head of Operations', 'Infrastructure expert ensuring reliable fiber service nationwide.', '(888) 555-3278', 'mike@fiberfastusa.com', 'Colorado Springs', 'CO'),
  ('james-rodriguez', 'James Rodriguez', 'Lead Technician', '10+ years installing fiber. Every installation is handled with pride.', '(888) 555-3278', 'james@fiberfastusa.com', 'Aurora', 'CO'),
  ('emma-wilson', 'Emma Wilson', 'Customer Success', '24/7 support that actually answers the phone. Because you matter.', '(888) 555-3278', 'emma@fiberfastusa.com', 'Boulder', 'CO')
ON CONFLICT (slug) DO NOTHING;
