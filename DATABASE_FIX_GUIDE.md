# Database Visitor Tracking Fix Guide

## Problem
The visitor counter shows 0 even after visiting the site multiple times. This is caused by Row Level Security (RLS) policies in Supabase blocking anonymous users from inserting visitor records.

## Quick Diagnosis

### Step 1: Open Browser Console
1. Open your website in a browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Run this command:
   ```javascript
   await window.testSupabaseConnection()
   ```

This will run a comprehensive diagnostic test and show you exactly what's failing.

### Step 2: Look for Error Messages

You'll see one of these common errors:

**Error Code 42501 - Permission Denied**
```
❌ INSERT failed with error: new row violates row-level security policy
Error code: 42501
```
**Solution:** You need to add RLS policies (see Fix section below)

**Error Code PGRST301 - JWT expired**
```
❌ JWT expired
```
**Solution:** Your Supabase anon key has expired, regenerate it in Supabase dashboard

**Error Code PGRST204 - No rows found**
```
Table not found or inaccessible
```
**Solution:** Check that the `visitors` table exists in your Supabase project

## The Fix

### Option 1: Run SQL Script (Recommended)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Copy and paste the contents of `SUPABASE_FIX.sql` file
5. Click **Run** to execute the SQL commands

### Option 2: Manual Fix via Supabase Dashboard

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Find the `visitors` table
3. Click **New Policy**

**Policy 1: Allow Anonymous Inserts**
- Name: `Allow anonymous insert on visitors`
- Policy Command: `INSERT`
- Target Roles: `anon`, `authenticated`
- WITH CHECK expression: `true`

**Policy 2: Allow Anonymous Reads**
- Name: `Allow anonymous select on visitors`
- Policy Command: `SELECT`
- Target Roles: `anon`, `authenticated`
- USING expression: `true`

4. Click **Review** and then **Save policy** for each

### Option 3: Disable RLS (Not Recommended for Production)

⚠️ **Warning:** This is less secure but works for testing

```sql
-- In Supabase SQL Editor
ALTER TABLE visitors DISABLE ROW LEVEL SECURITY;
```

## Verify the Fix

After applying the fix:

1. Refresh your website
2. Open browser console (`F12`)
3. Run: `await window.testSupabaseConnection()`
4. You should see:
   ```
   ✅ SELECT successful!
   ✅ INSERT successful!
   ✅ Total visitors in database: X
   ```

5. Refresh the page a few times
6. The visitor counter in the footer should now increment

## Common Issues

### Issue: Visitor counter still shows 0
**Cause:** Browser cache or the count query is failing
**Solution:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check console for new errors

### Issue: "visitor_number" is null
**Cause:** The database sequence isn't set up correctly
**Solution:** Run the sequence creation SQL from `SUPABASE_FIX.sql`:
```sql
CREATE SEQUENCE IF NOT EXISTS visitors_visitor_number_seq;
ALTER TABLE visitors ALTER COLUMN visitor_number SET DEFAULT nextval('visitors_visitor_number_seq');
```

### Issue: CORS errors
**Cause:** Your domain isn't whitelisted in Supabase
**Solution:**
1. Go to Supabase dashboard → Settings → API
2. Add your domain to "Allowed Origins"

## Testing Checklist

- [ ] Run `window.testSupabaseConnection()` - all tests pass ✅
- [ ] Visitor counter shows a number > 0
- [ ] Counter increments when refreshing the page (might need to wait a few seconds)
- [ ] No errors in browser console
- [ ] Admin dashboard shows visitor data

## Still Having Issues?

Check these files for error details:
- Browser Console (F12) - Look for red error messages
- `src/utils/visitorTracking.ts` - Enhanced error logging
- `src/components/Footer.tsx` - Visitor count display logic

The diagnostic logs will show you exactly what's failing and provide specific error codes to search for.
