# QUICK FIX - Paused Supabase Project

## The Problem
Your Supabase project at `ikxgwmujogucdamjgqkp.supabase.co` has been paused for over 90 days and is inaccessible. This is why the visitor counter shows 0.

## The Solution
You need to either restore your old project OR create a new one.

---

## Option 1: Create New Project (5 minutes - Recommended)

### 1. Create New Supabase Project
- Go to: https://supabase.com/dashboard
- Click "New Project"
- Choose a name, password, and region
- Wait 2-3 minutes for it to be ready

### 2. Run Database Setup
- Click "SQL Editor" in your new project
- Copy everything from `DATABASE_SETUP.sql`
- Paste and click "Run"

### 3. Get Your New Credentials
In your new Supabase project:
- Go to: Settings → API
- Copy the **Project URL** (e.g., https://xxxxxx.supabase.co)
- Copy the **anon public** key (long string starting with eyJ...)

### 4. Update Your Code
Edit this file: `src/integrations/supabase/client.ts`

Replace lines 5-6 with your new credentials:
```typescript
const SUPABASE_URL = "https://YOUR-NEW-PROJECT.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJI...your-new-key";
```

### 5. Restart and Test
```bash
# Stop your dev server (Ctrl+C)
npm run dev
# Open your site - visitor counter should work!
```

---

## Option 2: Restore Old Project (10 minutes)

### If you have important visitor data to preserve:

1. On the paused project screen, click "Restore the backup to a new Supabase project"
2. Wait for restoration to complete (2-3 minutes)
3. Go to SQL Editor and run `DATABASE_SETUP.sql` to add missing policies
4. Get new credentials from Settings → API
5. Update `src/integrations/supabase/client.ts` with new URL and key
6. Restart your dev server

---

## Current Configuration (Paused Project)

**File:** `src/integrations/supabase/client.ts`

```typescript
const SUPABASE_URL = "https://ikxgwmujogucdamjgqkp.supabase.co";  // ⚠️ PAUSED
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGc...";  // ⚠️ NOT WORKING
```

This URL is pointing to your paused project. It will NOT work until you:
- ✅ Create a new project and update these values, OR
- ✅ Restore the backup and update these values

---

## After Updating Credentials

Your website should show:
- ✅ Diagnostic Panel: All green checks
- ✅ Visitor counter: Shows numbers and increments
- ✅ Admin dashboard: Can view visitor data

If you still see errors, run in browser console:
```javascript
await window.testSupabaseConnection()
```

This will show exactly what's wrong.

---

## Need More Help?

See the complete guide: `NEW_SUPABASE_SETUP_GUIDE.md`
