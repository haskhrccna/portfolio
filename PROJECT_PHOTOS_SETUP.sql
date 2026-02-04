-- Project Photos Table Setup
-- Run this in your Supabase SQL Editor after DATABASE_SETUP.sql

-- ============================================
-- 1. Create project_photos table
-- ============================================
CREATE TABLE IF NOT EXISTS project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Enable Row Level Security
-- ============================================
ALTER TABLE project_photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Create RLS Policies
-- ============================================

-- Allow anyone to view active photos
CREATE POLICY "Allow public read of active photos"
ON project_photos
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Allow authenticated admins to insert photos
CREATE POLICY "Allow admin insert photos"
ON project_photos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow authenticated admins to update photos
CREATE POLICY "Allow admin update photos"
ON project_photos
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

-- Allow authenticated admins to delete photos
CREATE POLICY "Allow admin delete photos"
ON project_photos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 4. Create Storage Bucket for project photos
-- ============================================

-- Create a storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-photos', 'project-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read photos
CREATE POLICY "Public Access to Project Photos"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'project-photos' );

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload project photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-photos' AND
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow authenticated users to update photos
CREATE POLICY "Authenticated users can update project photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-photos' AND
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow authenticated users to delete photos
CREATE POLICY "Authenticated users can delete project photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-photos' AND
  EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 5. Create indexes for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_project_photos_active ON project_photos(is_active);
CREATE INDEX IF NOT EXISTS idx_project_photos_order ON project_photos(display_order);
CREATE INDEX IF NOT EXISTS idx_project_photos_created ON project_photos(created_at DESC);

-- ============================================
-- 6. Create function to auto-update timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_project_photos_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_photos_timestamp
  BEFORE UPDATE ON project_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_project_photos_timestamp();

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify the setup:
-- SELECT * FROM project_photos;
-- SELECT * FROM storage.buckets WHERE id = 'project-photos';
