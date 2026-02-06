-- ============================================
-- FULL IMAGE MIGRATION TO SUPABASE STORAGE
-- ============================================
-- This script sets up storage buckets and database tables
-- for managing all portfolio images in Supabase Storage

-- ============================================
-- STEP 1: Create Storage Buckets
-- ============================================

-- Certifications bucket (for certification badges)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certifications',
  'certifications',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Profile bucket (for profile photos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile',
  'profile',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Assets bucket (for other images/icons)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Create Database Tables
-- ============================================

-- Certifications table (replaces hardcoded certificateData.ts)
CREATE TABLE IF NOT EXISTS certification_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Path in storage bucket
  public_url TEXT NOT NULL, -- Full public URL
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile images table
CREATE TABLE IF NOT EXISTS profile_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true, -- Only one should be active
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- General assets table (icons, logos, etc.)
CREATE TABLE IF NOT EXISTS asset_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'icon', 'logo', 'background', etc.
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cert_images_active ON certification_images(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_cert_images_featured ON certification_images(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_profile_images_active ON profile_images(is_active);
CREATE INDEX IF NOT EXISTS idx_asset_images_category ON asset_images(category, is_active);

-- ============================================
-- STEP 4: Row Level Security Policies
-- ============================================

-- Certifications RLS
ALTER TABLE certification_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active certifications" ON certification_images
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin manage certifications" ON certification_images
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true));

-- Profile images RLS
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active profile" ON profile_images
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin manage profile" ON profile_images
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true));

-- Asset images RLS
ALTER TABLE asset_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active assets" ON asset_images
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin manage assets" ON asset_images
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true));

-- ============================================
-- STEP 5: Storage RLS Policies
-- ============================================

-- Certifications bucket policies
CREATE POLICY "Public read certifications" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'certifications');

CREATE POLICY "Admin upload certifications" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'certifications' AND
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin delete certifications" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'certifications' AND
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Profile bucket policies
CREATE POLICY "Public read profile" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'profile');

CREATE POLICY "Admin upload profile" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profile' AND
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin delete profile" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'profile' AND
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Assets bucket policies
CREATE POLICY "Public read assets" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'assets');

CREATE POLICY "Admin upload assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'assets' AND
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin delete assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'assets' AND
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- STEP 6: Helper Functions
-- ============================================

-- Function to get active profile image URL
CREATE OR REPLACE FUNCTION get_active_profile_url()
RETURNS TEXT AS $$
  SELECT public_url FROM profile_images WHERE is_active = true LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Function to set profile image as active (deactivates others)
CREATE OR REPLACE FUNCTION set_active_profile(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profile_images SET is_active = false;
  UPDATE profile_images SET is_active = true WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get storage statistics for all buckets
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS TABLE (
  bucket_id TEXT,
  file_count BIGINT,
  total_size_mb NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    objects.bucket_id::TEXT,
    COUNT(*)::BIGINT as file_count,
    ROUND((SUM((objects.metadata->>'size')::BIGINT) / 1024.0 / 1024.0)::NUMERIC, 2) as total_size_mb
  FROM storage.objects
  WHERE objects.bucket_id IN ('certifications', 'profile', 'assets', 'project-photos')
  GROUP BY objects.bucket_id
  ORDER BY objects.bucket_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 7: Backup and Restore Functions
-- ============================================

-- Function to backup all certification images metadata
CREATE OR REPLACE FUNCTION backup_certification_images()
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(row_to_json(t))
    FROM (
      SELECT id, title, date, storage_path, public_url, is_featured,
             display_order, is_active, created_at, updated_at
      FROM certification_images
      ORDER BY display_order
    ) t
  );
END;
$$ LANGUAGE plpgsql;

-- Function to backup all profile images metadata
CREATE OR REPLACE FUNCTION backup_profile_images()
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(row_to_json(t))
    FROM (
      SELECT id, title, storage_path, public_url, is_primary,
             is_active, created_at, updated_at
      FROM profile_images
    ) t
  );
END;
$$ LANGUAGE plpgsql;

-- Function to backup all asset images metadata
CREATE OR REPLACE FUNCTION backup_asset_images()
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(row_to_json(t))
    FROM (
      SELECT id, title, category, storage_path, public_url,
             is_active, created_at, updated_at
      FROM asset_images
    ) t
  );
END;
$$ LANGUAGE plpgsql;

-- Function to backup ALL image metadata
CREATE OR REPLACE FUNCTION backup_all_images()
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'backup_date', NOW(),
    'certification_images', (SELECT backup_certification_images()),
    'profile_images', (SELECT backup_profile_images()),
    'asset_images', (SELECT backup_asset_images())
  );
END;
$$ LANGUAGE plpgsql;

-- Function to list all storage files for download
CREATE OR REPLACE FUNCTION list_all_storage_files()
RETURNS TABLE (
  bucket TEXT,
  file_path TEXT,
  file_size BIGINT,
  public_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    objects.bucket_id::TEXT as bucket,
    objects.name::TEXT as file_path,
    (objects.metadata->>'size')::BIGINT as file_size,
    CASE
      WHEN buckets.public THEN
        format('https://%s/storage/v1/object/public/%s/%s',
          current_setting('app.settings.project_url', true),
          objects.bucket_id,
          objects.name)
      ELSE NULL
    END as public_url
  FROM storage.objects
  JOIN storage.buckets ON objects.bucket_id = buckets.id
  WHERE objects.bucket_id IN ('certifications', 'profile', 'assets', 'project-photos')
  ORDER BY objects.bucket_id, objects.name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check buckets were created
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('certifications', 'profile', 'assets', 'project-photos');

-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('certification_images', 'profile_images', 'asset_images');

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Upload existing images using migration script
-- 3. Update components to use Supabase URLs
-- 4. Remove local /public/images/ folder
-- ============================================
