# GitHub Actions Keep-Alive Setup

This guide shows you how to keep your Supabase database active 24/7 using GitHub Actions - **even when nobody visits your site**.

## 🎯 How It Works

- **GitHub Actions** runs a scheduled workflow every 5 minutes
- The workflow pings your Supabase database using the REST API
- Runs on GitHub's servers (completely independent of site visitors)
- **100% free** - GitHub Actions gives you 2,000 free minutes/month
- Your database never pauses, even with zero traffic

## ⚡ Setup (5 Minutes)

### Step 1: Get Your Supabase Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**: `https://xxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Add the first secret:
   - **Name:** `SUPABASE_URL`
   - **Secret:** Paste your Project URL (e.g., `https://xxxxxx.supabase.co`)
   - Click **Add secret**
6. Click **New repository secret** again
7. Add the second secret:
   - **Name:** `SUPABASE_ANON_KEY`
   - **Secret:** Paste your anon public key
   - Click **Add secret**

### Step 3: Enable GitHub Actions

1. Go to the **Actions** tab in your repository
2. If workflows are disabled, click **I understand my workflows, go ahead and enable them**
3. You should see the workflow: **"Database Keep-Alive"**

### Step 4: Test the Workflow (Optional)

1. Go to **Actions** tab
2. Click on **Database Keep-Alive** workflow (left sidebar)
3. Click **Run workflow** button (right side)
4. Click green **Run workflow** button
5. Wait ~10 seconds and refresh the page
6. Click on the running/completed workflow to see logs
7. Look for: ✅ **Database ping successful!**

### Step 5: Done! ✅

The workflow will now run automatically every 5 minutes, keeping your database active forever!

---

## 📊 Monitoring

### View Workflow Runs

1. Go to **Actions** tab in your repository
2. Click **Database Keep-Alive** on the left
3. You'll see all runs (every 5 minutes)
4. Click any run to see detailed logs

### What You'll See in Logs

```
🔄 Pinging Supabase database to keep project active...
Timestamp: 2026-02-04T20:30:00Z
Response code: 200
✅ Database ping successful!
Keep-alive ping completed at 2026-02-04T20:30:00Z

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Database Keep-Alive Status Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Workflow: Database Keep-Alive
Run Number: 142
Triggered by: schedule
Status: success
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⚙️ Configuration

### Change Ping Frequency

Edit `.github/workflows/database-keepalive.yml` line 6:

```yaml
# Every 5 minutes (default)
- cron: '*/5 * * * *'

# Every 10 minutes
- cron: '*/10 * * * *'

# Every 15 minutes
- cron: '*/15 * * * *'

# Every 30 minutes
- cron: '*/30 * * * *'

# Every hour
- cron: '0 * * * *'

# Every 2 hours
- cron: '0 */2 * * *'
```

**Recommended frequencies:**
- **Every 5 minutes**: Maximum protection (default)
- **Every 10 minutes**: Good balance
- **Every 15-30 minutes**: Conservative but effective

### Cron Syntax Reference

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Examples:
- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour, on the hour
- `0 0 * * *` - Every day at midnight
- `0 */6 * * *` - Every 6 hours

---

## 💰 Cost & Limits

### GitHub Actions Free Tier

- **2,000 minutes per month** (free)
- **Unlimited for public repositories**
- Each workflow run takes ~10 seconds

### Usage Calculation

**Every 5 minutes:**
- Runs per hour: 12
- Runs per day: 288
- Runs per month: ~8,640
- Total minutes used: ~1,440 minutes/month (within free tier!)

**Every 10 minutes:**
- Runs per month: ~4,320
- Total minutes used: ~720 minutes/month

**Even at 5-minute intervals, you're well within the free tier!** ✅

### Supabase Free Tier

- **50,000 API requests/month**
- This workflow uses ~8,640 requests/month (at 5-min intervals)
- That's only **17% of your quota**
- Combined with visitor tracking and browser keep-alive: still under 50%

---

## 🔒 Security

### Are These Secrets Safe?

✅ **Yes!** GitHub Secrets are:
- Encrypted at rest
- Never exposed in logs
- Only accessible to your workflows
- Cannot be read by anyone (even you, after setting them)

### Is the Anon Key Safe?

✅ **Yes!** The Supabase `anon` key is:
- Designed for client-side use
- Safe to expose publicly
- Protected by Row Level Security (RLS) policies
- Cannot perform privileged operations

**The anon key is already in your client code, so storing it in GitHub Secrets is extra secure, not less secure.**

---

## 🎯 Benefits Over Browser-Only Keep-Alive

| Feature | Browser Keep-Alive | GitHub Actions Keep-Alive |
|---------|-------------------|---------------------------|
| Works without visitors | ❌ No | ✅ Yes |
| Runs 24/7 guaranteed | ❌ Only when visited | ✅ Always |
| Requires open browser | ✅ Yes | ❌ No |
| Resource usage | User's browser | GitHub's servers |
| Setup complexity | Easy | Easy |
| Cost | Free | Free |
| Reliability | Depends on traffic | 100% reliable |

**Best practice: Use both!**
- Browser keep-alive: Extra pings from visitors
- GitHub Actions: Guaranteed baseline pinging

---

## 🐛 Troubleshooting

### Workflow doesn't appear in Actions tab

1. Make sure file is at: `.github/workflows/database-keepalive.yml`
2. Make sure it's pushed to your default branch (main/master)
3. Make sure GitHub Actions is enabled (Settings → Actions → General)

### Workflow fails with "401 Unauthorized"

- Check that `SUPABASE_ANON_KEY` secret is set correctly
- Verify you copied the full anon key (starts with `eyJ...`)
- Make sure there are no extra spaces in the secret

### Workflow fails with "404 Not Found"

- Check that `SUPABASE_URL` secret is correct
- Should be: `https://yourproject.supabase.co` (no trailing slash)
- Make sure the Supabase project is active (not paused)

### Workflow runs but database still pauses

- Check Supabase dashboard to see when it was last accessed
- Verify RLS policies are set (run `DATABASE_SETUP.sql`)
- Try running workflow manually to test
- Check workflow logs for actual response codes

### "Resource not accessible by integration"

- Go to Settings → Actions → General
- Under "Workflow permissions", select "Read and write permissions"
- Click Save

---

## 🎮 Manual Control

### Run Manually

1. Go to **Actions** tab
2. Select **Database Keep-Alive**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

### Pause the Workflow

1. Go to **Actions** tab
2. Select **Database Keep-Alive**
3. Click the **"..."** menu (top right)
4. Click **Disable workflow**

### Resume the Workflow

1. Go to **Actions** tab
2. Select **Database Keep-Alive**
3. Click **Enable workflow**

### Delete the Workflow

Just delete the file:
```bash
rm .github/workflows/database-keepalive.yml
git add .github/workflows/database-keepalive.yml
git commit -m "Remove database keep-alive workflow"
git push
```

---

## 📈 Advanced: Add Notifications (Optional)

Want to get notified if keep-alive fails? Add this step to the workflow:

```yaml
- name: Notify on Failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: '⚠️ Database Keep-Alive Failed',
        body: 'The database keep-alive workflow failed. Check the logs for details.'
      })
```

Or use a service like:
- Slack webhook
- Discord webhook
- Email notification action
- Better Uptime

---

## ✅ Verification Checklist

- [ ] GitHub Secrets added: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- [ ] Workflow file exists: `.github/workflows/database-keepalive.yml`
- [ ] Workflow file pushed to GitHub
- [ ] GitHub Actions enabled in repository settings
- [ ] Workflow appears in Actions tab
- [ ] Manual test run successful (green checkmark)
- [ ] Automatic runs happening every 5 minutes
- [ ] Logs show "✅ Database ping successful!"
- [ ] Supabase project stays active

---

## 🎉 Success!

Your database will now stay active 24/7, even with zero site traffic. GitHub Actions will ping it every 5 minutes, completely automatically and for free!

Check the Actions tab periodically to see the workflow running. You should see a new run every 5 minutes with a green checkmark. ✅

---

## 📁 Files

- `.github/workflows/database-keepalive.yml` - The workflow file
- `GITHUB_ACTIONS_KEEPALIVE.md` - This documentation
- `KEEP_ALIVE_GUIDE.md` - Browser-based keep-alive docs
- `src/utils/keepAlive.ts` - Browser keep-alive service

**Both keep-alive systems work together for maximum reliability!** 🚀
