-- Migrate Existing Project Photos to Database
-- Run this AFTER running PROJECT_PHOTOS_SETUP.sql

-- ============================================
-- Insert existing 17 project photos
-- ============================================

-- These photos are already in your /images/projects/ folder
-- This script adds them to the database so you can manage them via admin panel

INSERT INTO project_photos (title, description, image_url, display_order, is_active) VALUES
('Cable Installation', 'Underground cable installation and laying', '/images/projects/cable-installation.jpg', 1, true),
('Equipment Setup', 'Electrical equipment setup and configuration', '/images/projects/equipment-setup.jpg', 2, true),
('Concrete Foundation', 'Concrete block foundation work', '/images/projects/concrete-blocks.jpg', 3, true),
('Control Panel', 'Electrical control panel installation', '/images/projects/control-panel.jpg', 4, true),
('11kV Switchgear', '11kV switchgear installation', '/images/projects/11swg.jpg', 5, true),
('11kV Transformer', '11kV transformer installation and setup', '/images/projects/11tr.jpg', 6, true),
('33kV Cable', '33kV high voltage cable installation', '/images/projects/33cable.jpg', 7, true),
('33kV Switchgear', '33kV switchgear installation and commissioning', '/images/projects/33swg.jpg', 8, true),
('33kV Transformer', '33kV transformer installation project', '/images/projects/33tr.jpg', 9, true),
('Civil Works Phase 1', 'Civil construction and foundation work', '/images/projects/civil1.JPG', 10, true),
('Cable Jointing Phase 1', 'Underground cable jointing work', '/images/projects/jointing1.JPG', 11, true),
('Cable Jointing Phase 2', 'Cable jointing and termination process', '/images/projects/jointing2.JPG', 12, true),
('Cable Pulling Phase 1', 'Cable pulling through conduits', '/images/projects/pulling1.jpg', 13, true),
('Cable Pulling Phase 2', 'Underground cable pulling operations', '/images/projects/pulling2.JPG', 14, true),
('Termination Phase 1', 'Cable termination and connection work', '/images/projects/termination1.JPG', 15, true),
('Termination Phase 2', 'Final cable termination and testing', '/images/projects/termination2.JPG', 16, true),
('Equipment Testing', 'Testing and commissioning of electrical equipment', '/images/projects/testing1.JPG', 17, true);

-- ============================================
-- Verify the migration
-- ============================================

-- Check that all 17 photos were inserted
SELECT COUNT(*) as total_photos FROM project_photos;

-- View all photos ordered by display_order
SELECT display_order, title, is_active FROM project_photos ORDER BY display_order;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================

-- After running this:
-- 1. Your 17 existing photos are now in the database
-- 2. They will appear in the admin Gallery tab
-- 3. You can now edit titles, descriptions, reorder, or delete them
-- 4. The public gallery will show these photos from the database
-- 5. You can add new photos through the admin panel

-- Note: These photos still exist in /images/projects/ folder
-- The database just references them by URL
-- If you want to delete a photo completely, also remove it from the folder
