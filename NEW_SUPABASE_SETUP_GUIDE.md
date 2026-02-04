# New Supabase Project Setup Guide

Your Supabase project has been paused for over 90 days. Follow these steps to get your site working again.

## Step 1: Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in the details:
   - **Name:** portfolio (or whatever you prefer)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be ready

## Step 2: Set Up the Database

1. In your new project, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `DATABASE_SETUP.sql` file
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is good!

## Step 3: Get Your New API Keys

1. Click **"Settings"** in the left sidebar (gear icon at bottom)
2. Click **"API"** under Project Settings
3. You'll see two important values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (long string starting with "eyJ...")

## Step 4: Update Your Environment Variables

### Option A: If using Lovable.dev or similar hosting

1. Go to your hosting platform's settings
2. Find "Environment Variables" or "Secrets"
3. Update these variables:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```
4. Save and redeploy

### Option B: If running locally

1. Find the `.env` or `.env.local` file in your project root
2. Update these lines:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```
3. Save the file
4. Restart your dev server: `npm run dev`

## Step 5: Update Supabase Client Configuration (if needed)

Check if you have a file at `src/integrations/supabase/client.ts` or similar.

If the URL and key are hardcoded there (not using environment variables), update them:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxxxx.supabase.co';  // Your new URL
const supabaseKey = 'eyJhbGc...';  // Your new anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Step 6: Test the Setup

1. Open your website
2. You should see the **Diagnostic Panel** in the bottom-right
3. All three tests should show ✅ green checkmarks:
   - ✅ Supabase Client
   - ✅ SELECT Permission
   - ✅ INSERT Permission
4. The visitor counter in the footer should now work!
5. Refresh the page a few times - the counter should increment

## Step 7: (Optional) Set Up Admin Authentication

If you want to access the admin dashboard:

1. In Supabase, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter your email and password
4. Click **"Create user"**
5. You can now log in to your admin dashboard at `/admin`

## Troubleshooting

### Diagnostic Panel shows errors

**Error: "Failed to fetch"**
- Check that environment variables are set correctly
- Make sure you restarted the dev server after updating .env

**Error 42501: Row Level Security**
- Run DATABASE_SETUP.sql again
- Make sure all policies were created successfully

**Error: "Invalid API key"**
- Double-check you copied the full anon key
- Make sure there are no extra spaces

### Visitor counter still shows 0

1. Open browser console (F12)
2. Run: `await window.testSupabaseConnection()`
3. Check for any error messages
4. Make sure the INSERT test passes

### Can't find .env file

The environment variables might be set in:
- `.env.local`
- `.env.development`
- Hosting platform settings (Vercel/Netlify/Lovable)
- `src/integrations/supabase/client.ts` (hardcoded)

## Data Migration (if you have important data)

If you need to restore your old visitor data:

1. From the paused project screen, click **"Download backups"**
2. Extract the SQL dump file
3. In your new project, go to SQL Editor
4. Run the SQL commands from the backup file
5. Make sure to run DATABASE_SETUP.sql after to set up policies

## Verification Checklist

- [ ] New Supabase project created
- [ ] DATABASE_SETUP.sql executed successfully
- [ ] Environment variables updated with new URL and key
- [ ] Dev server restarted (if local)
- [ ] Website loads without errors
- [ ] Diagnostic panel shows all ✅ green checks
- [ ] Visitor counter increments when refreshing page
- [ ] Admin dashboard accessible (if using authentication)

## Need Help?

If you're still having issues:
1. Check the browser console for errors (F12)
2. Run the diagnostic tool: `await window.testSupabaseConnection()`
3. Verify your environment variables are correct
4. Make sure the Supabase project is active (not paused)

---

**Important Files:**
- `DATABASE_SETUP.sql` - Complete database schema and policies
- `SUPABASE_FIX.sql` - Old fix file (not needed for new project)
- `DATABASE_FIX_GUIDE.md` - Original troubleshooting guide
