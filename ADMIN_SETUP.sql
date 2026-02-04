-- Admin User Setup for Portfolio Site
-- Run this in your Supabase SQL Editor AFTER running DATABASE_SETUP.sql

-- ============================================
-- 1. Create admin_profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'admin',
  is_admin BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create admin_settings table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  show_cv_request BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO admin_settings (id, show_cv_request)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Create RLS Policies for admin_profiles
-- ============================================

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own admin profile"
ON admin_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Only admins can update admin profiles
CREATE POLICY "Admins can update admin profiles"
ON admin_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 5. Create RLS Policies for admin_settings
-- ============================================

-- Allow authenticated admins to read settings
CREATE POLICY "Admins can read settings"
ON admin_settings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow authenticated admins to update settings
CREATE POLICY "Admins can update settings"
ON admin_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 6. Create is_admin RPC function
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_profiles
    WHERE id = user_id AND is_admin = true
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;

-- ============================================
-- ADMIN SETUP COMPLETE!
-- ============================================

-- IMPORTANT: After running this SQL, you need to:
-- 1. Go to Authentication → Users in Supabase dashboard
-- 2. Click "Add user" → "Create new user"
-- 3. Enter your email and password (e.g., admin@example.com / YourSecurePassword123!)
-- 4. Copy the User UID from the created user
-- 5. Run the command below, replacing YOUR_USER_ID with the actual UID:

-- INSERT INTO admin_profiles (id, username, is_admin)
-- VALUES ('YOUR_USER_ID_HERE', 'admin', true);

-- Example:
-- INSERT INTO admin_profiles (id, username, is_admin)
-- VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin', true);

-- After this, you can login at: /login
