-- Complete Database Setup for Portfolio Site
-- Run this in your NEW Supabase project's SQL Editor

-- ============================================
-- 1. Create the visitors table
-- ============================================
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_number SERIAL,
  page_url TEXT,
  country TEXT,
  city TEXT,
  ip_address TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create the contact_messages table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Create RLS Policies for visitors table
-- ============================================

-- Allow anonymous users to INSERT visitor records
CREATE POLICY "Allow anonymous insert on visitors"
ON visitors
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anonymous users to SELECT (read) visitor records
CREATE POLICY "Allow anonymous select on visitors"
ON visitors
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users (admin) to UPDATE visitor records
CREATE POLICY "Allow authenticated update on visitors"
ON visitors
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users (admin) to DELETE visitor records
CREATE POLICY "Allow authenticated delete on visitors"
ON visitors
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- 5. Create RLS Policies for contact_messages table
-- ============================================

-- Allow anonymous users to INSERT contact messages
CREATE POLICY "Allow anonymous insert on contact_messages"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users (admin) to SELECT contact messages
CREATE POLICY "Allow authenticated select on contact_messages"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users (admin) to DELETE contact messages
CREATE POLICY "Allow authenticated delete on contact_messages"
ON contact_messages
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- 6. Create indexes for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_number ON visitors(visitor_number);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================
-- 7. Create a view for visitor statistics (optional)
-- ============================================

CREATE OR REPLACE VIEW visitor_statistics AS
SELECT
  COUNT(*) as total_visitors,
  COUNT(DISTINCT country) as unique_countries,
  COUNT(DISTINCT ip_address) as unique_ips,
  MAX(visited_at) as last_visit,
  MIN(visited_at) as first_visit
FROM visitors;

-- Grant access to the view
GRANT SELECT ON visitor_statistics TO anon, authenticated;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify the setup by running these queries:
-- SELECT COUNT(*) FROM visitors;
-- SELECT * FROM visitor_statistics;
-- INSERT INTO visitors (page_url) VALUES ('/test') RETURNING *;
