# GitHub-Hosted Project Setup Guide

Your portfolio is hosted on GitHub, which means the Supabase credentials are hardcoded in your code at:
**`src/integrations/supabase/client.ts`**

## 🚀 Quick Fix Steps

### Step 1: Create New Supabase Project (3 minutes)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name:** portfolio (or any name)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 2: Set Up Database (2 minutes)

1. In your new Supabase project, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `DATABASE_SETUP.sql` from your project
4. Paste into the SQL editor
5. Click **"Run"** (or Ctrl+Enter)
6. You should see "Success. No rows returned" ✅

### Step 3: Get Your New Credentials (1 minute)

In your Supabase project:
1. Click **"Settings"** (gear icon at bottom left)
2. Click **"API"** under Project Settings
3. Copy these two values:

   **Project URL:**
   ```
   https://xxxxxxxxx.supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```

### Step 4: Update Your Code (1 minute)

Edit this file: **`src/integrations/supabase/client.ts`**

**Current code (lines 5-6):**
```typescript
const SUPABASE_URL = "https://ikxgwmujogucdamjgqkp.supabase.co";  // ⚠️ OLD PAUSED PROJECT
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreGd3bXVqb2d1Y2RhbWpncWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDU4MTYsImV4cCI6MjA0NjQ4MTgxNn0.hJXmSuqUbL_aTB7FtuRZ3krWFKBAJtHyyqzxa9o3kyE";
```

**New code (replace with YOUR values):**
```typescript
const SUPABASE_URL = "https://YOUR-NEW-PROJECT.supabase.co";  // ✅ Paste your new URL
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGc...";  // ✅ Paste your new key
```

### Step 5: Commit and Push to GitHub (2 minutes)

```bash
git add src/integrations/supabase/client.ts
git commit -m "Update Supabase credentials to new active project"
git push origin main
```

### Step 6: Wait for Deployment (2-5 minutes)

- If using **GitHub Pages**: Changes deploy automatically
- If using **Vercel/Netlify**: Will auto-deploy from GitHub
- Check your hosting platform for deployment status

### Step 7: Test Your Site ✅

1. Visit your live site
2. The **Diagnostic Panel** should appear in bottom-right corner
3. Should show all **green checkmarks ✅**
4. **Visitor counter** should work and increment!

---

## 🔒 Security Note

The `anon` key is **safe to be public** in your code - it's designed for client-side use. However, if you want to keep it more secure:

### Option A: Use GitHub Secrets (Recommended for Production)

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your anon key

3. Update `src/integrations/supabase/client.ts`:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://fallback.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "fallback-key";
```

4. Add build step in GitHub Actions to inject secrets
5. Add `.env.example` file with placeholder values

### Option B: Keep Hardcoded (Simpler)

For a portfolio site, hardcoded credentials are fine because:
- The `anon` key is meant for public use
- Row Level Security (RLS) policies protect your data
- The database password is never exposed
- Supabase is designed for this pattern

**Most portfolios use hardcoded credentials** - it's totally normal! ✅

---

## 📊 After Deployment

Your site should show:
- ✅ Visitor counter with real numbers
- ✅ Counter increments on each visit
- ✅ Diagnostic panel shows all green checks
- ✅ Admin dashboard works (if you set up authentication)

---

## 🐛 Troubleshooting

### Deployment succeeds but counter still shows 0

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Check the Diagnostic Panel** - it will show specific errors
3. **Verify credentials** - Make sure you copied the full URL and key
4. **Check Supabase project** - Make sure it's active (not paused)

### "Failed to fetch" error

- Verify the SUPABASE_URL is correct
- Check that you ran DATABASE_SETUP.sql successfully
- Make sure the Supabase project is not paused

### RLS Policy errors (42501)

- Go back to Supabase SQL Editor
- Run DATABASE_SETUP.sql again
- Verify policies were created successfully

---

## 📁 GitHub Hosting Platforms

Your setup works with:
- ✅ GitHub Pages
- ✅ Vercel (connected to GitHub)
- ✅ Netlify (connected to GitHub)
- ✅ Cloudflare Pages (connected to GitHub)
- ✅ Any platform that deploys from GitHub repo

All you need to do is push the updated code and the platform will automatically deploy it!

---

## ✅ Checklist

- [ ] New Supabase project created
- [ ] DATABASE_SETUP.sql executed successfully
- [ ] New credentials copied from Supabase
- [ ] `src/integrations/supabase/client.ts` updated with new credentials
- [ ] Changes committed to Git
- [ ] Changes pushed to GitHub
- [ ] Site deployed (check GitHub Actions/Pages status)
- [ ] Visited live site and tested
- [ ] Diagnostic panel shows all green checks ✅
- [ ] Visitor counter works and increments

---

**Ready? Start with Step 1 and you'll be done in about 10 minutes!** 🚀
