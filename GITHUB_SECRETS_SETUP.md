# GitHub Secrets Setup Guide

## Why GitHub Actions is Failing

Your keep-alive workflow is failing with exit code 3 because the required GitHub secrets are not configured. The workflow needs:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

These secrets allow the GitHub Actions workflow to ping your Supabase database every 5 minutes to keep it active.

---

## 🔐 Step-by-Step: Add GitHub Secrets

### Option 1: Via GitHub Web Interface (Recommended)

#### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/haskhrccna/portfolio`
2. Click **Settings** tab (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**

#### Step 2: Add SUPABASE_URL Secret
1. Click **New repository secret** button
2. Enter secret details:
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://ikxgwmujogucdamjgqkp.supabase.co`
3. Click **Add secret**

#### Step 3: Add SUPABASE_ANON_KEY Secret
1. Click **New repository secret** button again
2. Enter secret details:
   - **Name:** `SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreGd3bXVqb2d1Y2RhbWpncWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDU4MTYsImV4cCI6MjA0NjQ4MTgxNn0.hJXmSuqUbL_aTB7FtuRZ3krWFKBAJtHyyqzxa9o3kyE`
3. Click **Add secret**

#### Step 4: Verify Secrets
You should now see two secrets listed:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`

---

### Option 2: Via GitHub CLI (If Available)

If you have GitHub CLI (`gh`) installed and authenticated:

```bash
# Add SUPABASE_URL secret
gh secret set SUPABASE_URL --body "https://ikxgwmujogucdamjgqkp.supabase.co"

# Add SUPABASE_ANON_KEY secret
gh secret set SUPABASE_ANON_KEY --body "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreGd3bXVqb2d1Y2RhbWpncWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDU4MTYsImV4cCI6MjA0NjQ4MTgxNn0.hJXmSuqUbL_aTB7FtuRZ3krWFKBAJtHyyqzxa9o3kyE"

# Verify secrets were added
gh secret list
```

---

## ✅ Testing the Workflow

### Method 1: Manual Trigger (Fastest)
1. Go to **Actions** tab in your repository
2. Click **Database Keep-Alive** workflow (left sidebar)
3. Click **Run workflow** dropdown (right side)
4. Click green **Run workflow** button
5. Wait 10-20 seconds
6. Refresh the page
7. Click on the latest run to see results

**Expected Output:**
```
🔄 Pinging Supabase database to keep project active...
Timestamp: 2026-02-06T07:30:00Z
Response code: 200
✅ Database ping successful!
Keep-alive ping completed at 2026-02-06T07:30:00Z
```

### Method 2: Wait for Scheduled Run
The workflow runs automatically every 5 minutes. Just wait and check the Actions tab.

---

## 🔍 Troubleshooting

### Issue: Secrets Not Working After Adding

**Solution 1: Retry the Workflow**
- Go to failed workflow run
- Click **Re-run all jobs** button
- Secrets take effect immediately on new runs

**Solution 2: Check Secret Names**
- Secret names are **case-sensitive**
- Must be exactly: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- No spaces before or after the names

**Solution 3: Check Secret Values**
- No extra spaces in the values
- Copy values exactly as shown above
- Don't include quotes around the values

### Issue: Getting 401 Unauthorized

**Cause:** Supabase project might be paused or anon key expired

**Solution:**
1. Go to Supabase dashboard: https://supabase.com/dashboard
2. Check if project `ikxgwmujogucdamjgqkp` is active
3. If paused, click **Resume project**
4. If key expired, generate new anon key:
   - Settings → API → Project API keys
   - Copy new `anon public` key
   - Update GitHub secret with new key

### Issue: Getting 404 Not Found

**Cause:** Wrong Supabase URL or project doesn't exist

**Solution:**
1. Verify project exists in Supabase dashboard
2. Check project URL matches: `https://ikxgwmujogucdamjgqkp.supabase.co`
3. Update GitHub secret if URL changed

### Issue: Workflow Still Failing with Exit Code 3

**Possible causes:**
1. ❌ Secrets not added
2. ❌ Secret names incorrect (typos)
3. ❌ Supabase project paused
4. ❌ Network issues (rare)

**Debug steps:**
1. Verify secrets exist: Go to Settings → Secrets and variables → Actions
2. Delete and re-add secrets with exact names/values
3. Manually trigger workflow again
4. Check workflow logs for detailed error message

---

## 📊 Expected Behavior After Setup

### Workflow Success Indicators:
- ✅ Green checkmark on workflow runs
- ✅ "Database ping successful!" in logs
- ✅ Response code 200 or 206
- ✅ No exit code errors

### Frequency:
- Runs every 5 minutes automatically
- 288 pings per day (24 hours × 12 per hour)
- Keeps Supabase project from auto-pausing

### Database Impact:
- **Zero cost** - uses lightweight HEAD requests
- **No data modified** - only checks visitor count
- **Minimal load** - equivalent to page refresh
- **Safe for production** - read-only operation

---

## 🎯 Next Steps After Setup

1. **Add secrets** using instructions above
2. **Test workflow** with manual trigger
3. **Verify success** - check for green checkmark
4. **Monitor for 24 hours** - ensure consistent success
5. **Optional:** Enable email notifications for failures
   - Settings → Notifications → Actions → Configure

---

## 📧 Notifications Setup (Optional)

Get email alerts if keep-alive fails:

1. Go to **Settings** → **Notifications**
2. Under **Actions**, check:
   - ✅ Send notifications for failed workflows only
   - ✅ Email
3. Click **Save notification preferences**

This way you'll know immediately if the database stops being pinged.

---

## 🔐 Security Notes

### Are These Secrets Safe to Use?

**Yes**, the anon key is designed to be public:
- ✅ Used in frontend applications (already in your client.ts)
- ✅ Protected by Row Level Security (RLS) policies
- ✅ Can only perform operations allowed by RLS
- ✅ Cannot access admin functions
- ✅ Safe to use in GitHub Actions

**Never share:**
- ❌ Service role key (has full access)
- ❌ Database password
- ❌ API admin keys

The anon key only allows:
- Reading public data
- Following RLS policies
- Inserting visitor records (if policy allows)
- No admin operations

---

## 📋 Quick Reference

| Secret Name | Value | Purpose |
|------------|-------|---------|
| `SUPABASE_URL` | `https://ikxgwmujogucdamjgqkp.supabase.co` | Supabase project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` | Public anonymous key for API access |

**Where to add:** Repository → Settings → Secrets and variables → Actions → New repository secret

**Test command:** Actions tab → Database Keep-Alive → Run workflow

**Success indicator:** Green checkmark + "Database ping successful!" in logs

---

## 🆘 Still Having Issues?

If the workflow continues to fail after:
1. ✅ Adding both secrets correctly
2. ✅ Verifying secret names (case-sensitive)
3. ✅ Checking Supabase project is active
4. ✅ Manually triggering workflow

Then check:
- Recent Supabase service status: https://status.supabase.com
- Your project settings in Supabase dashboard
- Contact Supabase support if project is stuck in paused state

---

**Last Updated:** 2026-02-06
