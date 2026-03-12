-- FiberFastUSA Public Website Database Schema

-- Lead submissions from all forms
CREATE TABLE IF NOT EXISTS public_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  use_cases TEXT[] DEFAULT '{}',
  speed_interest TEXT,
  source TEXT DEFAULT 'website',
  campaign_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  rep_id TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales rep verification data
CREATE TABLE IF NOT EXISTS public_sales_reps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing tiers (Phase 2 — dynamic pricing)
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  speed_mbps INTEGER NOT NULL,
  speed_label TEXT NOT NULL,
  price_monthly NUMERIC(10, 2) NOT NULL,
  promo_price NUMERIC(10, 2),
  best_for TEXT,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  quote TEXT NOT NULL,
  star_rating INTEGER DEFAULT 5 CHECK (star_rating >= 1 AND star_rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_email ON public_leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public_leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reps_employee_id ON public_sales_reps (employee_id);
CREATE INDEX IF NOT EXISTS idx_reps_active ON public_sales_reps (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials (is_approved, is_featured) WHERE is_approved = true;

-- Row Level Security
ALTER TABLE public_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public can insert leads
CREATE POLICY "Anyone can submit a lead" ON public_leads
  FOR INSERT TO anon WITH CHECK (true);

-- Public can read active reps
CREATE POLICY "Anyone can view active reps" ON public_sales_reps
  FOR SELECT TO anon USING (is_active = true);

-- Public can read active pricing
CREATE POLICY "Anyone can view active pricing" ON pricing_tiers
  FOR SELECT TO anon USING (is_active = true);

-- Public can read approved testimonials
CREATE POLICY "Anyone can view approved testimonials" ON testimonials
  FOR SELECT TO anon USING (is_approved = true);

-- Public can submit contact forms
CREATE POLICY "Anyone can submit contact" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Seed sample sales reps for testing
INSERT INTO public_sales_reps (name, employee_id, region, is_active) VALUES
  ('John Smith', 'FUS-12847', 'Colorado', true),
  ('Sarah Johnson', 'FUS-13291', 'Colorado', true),
  ('Mike Williams', 'FUS-14003', 'Colorado Springs', true),
  ('Emily Davis', 'FUS-14567', 'Denver Metro', true),
  ('Chris Martinez', 'FUS-15102', 'Boulder', true)
ON CONFLICT (employee_id) DO NOTHING;
