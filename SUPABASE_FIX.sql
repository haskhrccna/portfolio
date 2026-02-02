-- RLS Policy Fix for Visitors Table
-- Run these commands in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable RLS on the visitors table (if not already enabled)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous insert on visitors" ON visitors;
DROP POLICY IF EXISTS "Allow anonymous select on visitors" ON visitors;
DROP POLICY IF EXISTS "Allow public read access to visitors" ON visitors;
DROP POLICY IF EXISTS "Allow public insert to visitors" ON visitors;

-- 3. Create policy to allow anonymous users to INSERT visitor records
CREATE POLICY "Allow anonymous insert on visitors"
ON visitors
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Create policy to allow anonymous users to SELECT (read) visitor records
CREATE POLICY "Allow anonymous select on visitors"
ON visitors
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Verify the visitor_number sequence exists and is working
-- If this sequence doesn't exist, the visitor_number won't auto-increment
CREATE SEQUENCE IF NOT EXISTS visitors_visitor_number_seq;

-- 6. Set the default value for visitor_number to use the sequence
ALTER TABLE visitors
ALTER COLUMN visitor_number SET DEFAULT nextval('visitors_visitor_number_seq');

-- 7. Make sure the sequence is owned by the column
ALTER SEQUENCE visitors_visitor_number_seq OWNED BY visitors.visitor_number;

-- 8. Optional: Check current policies
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'visitors';

-- 9. Optional: Test insert (this should work after applying the policies above)
-- INSERT INTO visitors (page_url, visited_at) VALUES ('/', NOW());
-- SELECT COUNT(*) FROM visitors;
