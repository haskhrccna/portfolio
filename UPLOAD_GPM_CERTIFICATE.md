# Upload GPM-b Certificate Badge Image

## Issue
The GPM-b certificate is not displaying because the image file doesn't exist yet.

## ✅ Quick Fix

### Step 1: Save the Certificate Badge
You shared the GPM-b certificate badge earlier in the conversation. You need to:
1. **Save that image** to your computer
2. **Name it:** `gpm-b-cert.png`
3. The image shows:
   - Circular badge design
   - "CERTIFIED GREEN PROJECT MANAGER" text
   - "GPM-b™" in center
   - PM and GPM logos
   - Teal/blue gradient colors

### Step 2: Upload to Project

**Option A: Direct File Copy (Fastest)**
```bash
# Navigate to certifications folder
cd /home/user/portfolio/public/images/certifications/

# Copy your downloaded GPM-b badge image here
cp /path/to/your/downloaded/gpm-b-cert.png .

# Verify it's there
ls -la gpm-b-cert.png

# Commit and push
git add gpm-b-cert.png
git commit -m "Add GPM-b certification badge image"
git push
```

**Option B: Via GitHub Web Interface**
1. Go to: `https://github.com/haskhrccna/portfolio/tree/main/public/images/certifications`
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop your `gpm-b-cert.png` file
4. Add commit message: "Add GPM-b certification badge image"
5. Click **"Commit changes"**

**Option C: Replace Placeholder**
```bash
# Remove placeholder file
rm /home/user/portfolio/public/images/certifications/gpm-b-cert-placeholder.txt

# Add your actual image as gpm-b-cert.png
# (Copy it to the certifications folder)

# Commit
git add public/images/certifications/
git commit -m "Replace GPM-b placeholder with actual badge image"
git push
```

### Step 3: Verify It Works

After uploading:
1. **Refresh your portfolio site**
2. **Scroll to Certifications section**
3. **Check if GPM-b badge appears** (should show the circular badge)
4. If still not showing, check browser console for errors

---

## 🎨 Alternative: Use Credly Badge (If Available)

If your GPM-b certification is on Credly:

### Step 1: Get Credly Badge URL
1. Go to your Credly profile
2. Find the GPM-b certification
3. Right-click the badge image
4. Select "Copy Image Address"
5. URL should look like: `https://images.credly.com/size/340x340/images/XXXXX/image.png`

### Step 2: Update certificateData.ts
```bash
# Edit the file
nano src/data/certificateData.ts

# Change this line:
# imageUrl: "/images/certifications/gpm-b-cert.png"

# To your Credly URL:
# imageUrl: "https://images.credly.com/size/340x340/images/YOUR-ID/image.png"

# Save and commit
git add src/data/certificateData.ts
git commit -m "Use Credly URL for GPM-b certificate badge"
git push
```

---

## 🔍 Troubleshooting

### Badge Still Not Showing?

**Check 1: File Path**
```bash
# Verify file exists
ls -la /home/user/portfolio/public/images/certifications/gpm-b-cert.png

# Should show:
# -rw-r--r-- 1 user user XXXX Feb 6 XX:XX gpm-b-cert.png
```

**Check 2: File Format**
- Must be `.png` format
- Name must be exactly: `gpm-b-cert.png` (lowercase, with hyphen)
- No extra extensions (not `gpm-b-cert.png.txt`)

**Check 3: Image Size**
- Recommended: 340x340 pixels (square)
- Max size: 500KB
- Format: PNG with transparent background

**Check 4: Browser Cache**
```bash
# Clear browser cache or do hard refresh:
# - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

**Check 5: Development Server**
If running locally:
```bash
# Restart the dev server
npm run dev
# or
yarn dev
```

---

## 📊 Current Status

**Files that exist:**
- ✅ `pmp-cert.jpg` (PMP badge)
- ✅ `cisco-dev-cert.png` (Cisco badge)
- ✅ `mcse-cert.png` (MCSE badge)
- ✅ `pcap-cert.jpg` (Python badge)
- ❌ `gpm-b-cert.png` (MISSING - needs upload)

**Code status:**
- ✅ Certificate added to certificateData.ts
- ✅ Shows "October 2025" as date
- ✅ Error handler added (shows Award icon if image fails)
- ❌ Actual badge image file missing

---

## ✨ After Uploading

Once the image is uploaded, you'll see:

**Before:**
- Award icon (purple medal) placeholder

**After:**
- Actual GPM-b circular badge
- Teal/blue gradient colors
- Professional branding
- Hover effects (pulse, scale, sparkle)

---

## 🎯 Quick Action

**Right now, do this:**
1. Save the GPM-b badge image from the conversation above
2. Name it: `gpm-b-cert.png`
3. Copy to: `/home/user/portfolio/public/images/certifications/`
4. Commit and push

**Or:**
1. Get the Credly URL (if available)
2. Update `imageUrl` in certificateData.ts
3. Commit and push

---

**Need help?** The certificate is configured correctly in the code - you just need to add the actual image file!
