# Photo Gallery Management Guide

Your admin panel now includes a complete photo gallery management system! Upload, organize, and manage project photos dynamically.

## 🚀 Quick Start

### Step 1: Set Up Database (One-time)

1. Go to Supabase Dashboard → SQL Editor
2. Open and run **`PROJECT_PHOTOS_SETUP.sql`**
3. Wait for "Success" message ✅

This creates:
- `project_photos` table
- Supabase Storage bucket
- RLS policies for admin access
- Automatic timestamps

### Step 2: Access Photo Gallery

1. Login to admin panel at `/admin`
2. Click **"Gallery"** tab (camera icon)
3. You'll see the upload form and photo grid

---

## 📸 How to Upload Photos

### Upload New Photo:

1. **Select File**
   - Click "Choose File" or drag & drop
   - Accepts: JPG, PNG, WebP
   - Max size: 5MB
   - Preview appears instantly

2. **Add Details (Optional)**
   - **Title**: "Cable Installation Phase 1"
   - **Description**: Brief description (shows on hover)

3. **Upload**
   - Click "Upload Photo" button
   - Photo uploads to Supabase Storage
   - Automatically appears in gallery
   - Shows as "Active" by default

---

## 🎨 Managing Photos

### Photo Grid View

Each photo shows:
- **Photo number** (#1, #2, etc.)
- **Status badge** (Active/Hidden)
- **Hover controls**:
  - 👁️ **Show/Hide** - Toggle visibility
  - ⬆️ **Move Up** - Reorder earlier
  - ⬇️ **Move Down** - Reorder later
  - 🗑️ **Delete** - Remove completely

### Reorder Photos

**Visual drag-free ordering:**
1. Click **⬆️ Move Up** to shift photo left
2. Click **⬇️ Move Down** to shift photo right
3. Changes save instantly
4. Order appears on public gallery

**Tips:**
- Photos display in numerical order (#1 first)
- Reorder anytime without affecting visibility
- First photo appears leftmost in carousel

### Show/Hide Photos

**Hide without deleting:**
1. Hover over photo
2. Click 👁️ icon
3. Badge changes to "Hidden" (red)
4. Photo removed from public gallery
5. Still visible in admin for re-enabling

**Show hidden photo:**
1. Hover over hidden photo (red badge)
2. Click 👁️ icon again
3. Badge changes to "Active" (green)
4. Photo reappears in public gallery

### Delete Photos

**Permanent removal:**
1. Hover over photo
2. Click 🗑️ **Delete** button
3. Confirm deletion dialog
4. Photo removed from:
   - Database
   - Supabase Storage
   - Public gallery
   - Admin panel

⚠️ **Warning:** Deletion is permanent and cannot be undone!

---

## 🌐 How Photos Appear on Website

### Public Gallery Behavior

**Automatic Display:**
- Gallery at `/` shows all **Active** photos
- Displays in order you set (display_order)
- Shows title and description on hover
- Carousel navigation unchanged
- Updates in real-time (refresh page)

**Fallback System:**
- If no database photos: Shows hardcoded images
- If database has photos: Shows only database photos
- Mix not supported (either/or)

### Visitor Experience

**Photo Carousel:**
- Swipe/click through photos
- See photo counter (1/10, 2/10, etc.)
- Hover to see description
- Responsive on all devices

---

## 💡 Best Practices

### Photo Quality

**Recommended specs:**
- **Resolution**: 1920x1080 or higher
- **Aspect Ratio**: 16:9 or 4:3
- **Format**: JPG for photos, PNG for graphics
- **Size**: Under 2MB (compress if needed)

**Before uploading:**
1. Resize large images (use online tools)
2. Compress for web (reduce file size)
3. Use descriptive filenames
4. Check image orientation

### Organization Tips

**Logical ordering:**
- Group by project phase
- Chronological order (oldest first)
- Category grouping (cables, equipment, etc.)
- Feature best photos first

**Titles & Descriptions:**
- Keep titles short (3-5 words)
- Descriptions: 1-2 sentences max
- Mention key details:
  - Project name
  - Equipment/technique shown
  - Location (if relevant)
  - Date/year

**Example:**
- **Title:** "33kV Cable Installation"
- **Description:** "Underground cable laying for main distribution line, Q2 2024"

### Gallery Maintenance

**Regular tasks:**
- **Weekly:** Review and hide outdated photos
- **Monthly:** Delete low-quality/redundant photos
- **Quarterly:** Reorganize photo order
- **Annually:** Archive old projects

**Storage management:**
- Free tier: 1GB storage
- Monitor usage in Supabase Dashboard
- Delete unused photos to free space
- Compress images before upload

---

## 🔧 Features Reference

### Upload Section

| Field | Required | Purpose |
|-------|----------|---------|
| Photo File | Yes | The image to upload |
| Title | No | Short name for photo |
| Description | No | Detailed description |

### Photo Controls

| Button | Action | Reversible? |
|--------|--------|-------------|
| 👁️ Show/Hide | Toggle visibility | Yes |
| ⬆️ Move Up | Reorder earlier | Yes |
| ⬇️ Move Down | Reorder later | Yes |
| 🗑️ Delete | Remove permanently | No |

### Status Badges

| Badge | Meaning | Visible to Public? |
|-------|---------|-------------------|
| **Active** (Green) | Photo is live | Yes |
| **Hidden** (Red) | Photo is disabled | No |
| **#1, #2...** | Display order | N/A |

---

## 🐛 Troubleshooting

### Upload Issues

**"Please select a file first"**
- You clicked Upload before choosing a file
- Select an image file first

**"Please select an image file"**
- File is not JPG/PNG/WebP
- Use image files only
- Check file extension

**"File size must be less than 5MB"**
- Image too large
- Compress image using:
  - TinyPNG.com
  - Squoosh.app
  - Image editing software

**Upload fails silently**
- Check browser console (F12)
- Verify database setup ran successfully
- Check Supabase Storage bucket exists
- Verify admin permissions

### Display Issues

**Photos don't appear on public gallery**
- Check photo is set to "Active" (green badge)
- Refresh the website page (Ctrl+R)
- Verify project_photos table has data
- Check browser console for errors

**Old hardcoded photos still showing**
- Database is empty, add at least 1 photo
- Or database query failing (check console)
- Gallery falls back to hardcoded images

**Photo order wrong on website**
- Reorder in admin using ⬆️⬇️ buttons
- Refresh public site to see changes
- Order by display_order field (1, 2, 3...)

### Permission Errors

**"Failed to upload"**
- Verify you're logged in as admin
- Check admin_profiles has your user ID
- Run PROJECT_PHOTOS_SETUP.sql again
- Check Supabase RLS policies

**Can't delete photos**
- Must be logged in as admin
- Check storage policies in Supabase
- Verify file exists in storage bucket

---

## 📊 Technical Details

### Database Schema

```sql
Table: project_photos
- id (UUID, primary key)
- title (TEXT, optional)
- description (TEXT, optional)
- image_url (TEXT, required)
- display_order (INTEGER)
- is_active (BOOLEAN)
- uploaded_by (UUID, references users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Storage Location

- **Bucket:** `project-photos`
- **Access:** Public read, admin write
- **Path format:** `{timestamp}-{random}.{ext}`
- **URL format:** `https://{project}.supabase.co/storage/v1/object/public/project-photos/{filename}`

### RLS Policies

**Visitors (anon):**
- SELECT active photos only

**Admins (authenticated):**
- SELECT all photos
- INSERT new photos
- UPDATE existing photos
- DELETE any photo

---

## ✅ Quick Checklist

**Initial Setup:**
- [ ] Run PROJECT_PHOTOS_SETUP.sql in Supabase
- [ ] Verify storage bucket created
- [ ] Test upload with sample photo
- [ ] Verify photo appears in admin grid
- [ ] Check photo shows on public gallery

**Regular Workflow:**
- [ ] Select quality photo file
- [ ] Add descriptive title
- [ ] Write brief description
- [ ] Upload and verify
- [ ] Set proper order
- [ ] Test on public site

**Maintenance:**
- [ ] Hide outdated photos
- [ ] Delete poor quality images
- [ ] Reorder for best flow
- [ ] Monitor storage usage

---

## 🎯 Pro Tips

1. **Batch Upload**: Upload multiple photos in one session for efficiency

2. **Test First**: Upload a test photo before bulk uploading

3. **Backup**: Export photo URLs before major changes

4. **Mobile-First**: Test how photos look on mobile devices

5. **Loading Speed**: Don't upload too many huge photos (slows site)

6. **Accessibility**: Add descriptive titles for screen readers

7. **SEO**: Use keyword-rich titles for better search visibility

8. **Consistency**: Use similar photo styles/quality for professional look

---

## 🚀 Advanced Features (Future)

Potential enhancements:
- Bulk upload multiple files
- Drag & drop visual reordering
- Photo categories/tags
- Search/filter in admin
- Image editing (crop, resize)
- Automatic compression
- CDN integration
- Bulk hide/show operations

---

## 📞 Need Help?

If you encounter issues:

1. **Check browser console** (F12) for error messages
2. **Verify Supabase status** - Dashboard → Project Settings
3. **Review SQL setup** - Ensure PROJECT_PHOTOS_SETUP.sql ran successfully
4. **Test permissions** - Try uploading as admin
5. **Check storage** - Supabase Dashboard → Storage → project-photos

---

Your photo gallery is now fully dynamic and easy to manage! Upload professional project photos and keep your portfolio fresh. 🎉
