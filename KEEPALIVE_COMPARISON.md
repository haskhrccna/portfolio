# Keep-Alive Options Comparison

Your portfolio now has **three keep-alive systems** to prevent your Supabase database from pausing. Here's how to choose the right one(s) for you.

## 📊 Quick Comparison

| Feature | Browser Keep-Alive | GitHub Actions (Database) | GitHub Actions (Site) |
|---------|-------------------|---------------------------|----------------------|
| **File** | `src/utils/keepAlive.ts` | `.github/workflows/database-keepalive.yml` | `.github/workflows/site-keepalive.yml` |
| **Works without visitors** | ❌ No | ✅ Yes | ✅ Yes |
| **Requires setup** | ✅ Auto (done) | ⚙️ Need GitHub Secrets | ⚙️ Need to edit URL |
| **Setup time** | 0 min (done) | 5 minutes | 2 minutes |
| **Runs 24/7** | Only when visited | ✅ Yes | ✅ Yes |
| **Pings database** | ✅ Direct | ✅ Direct | 🔄 Via website |
| **Pings website** | ❌ No | ❌ No | ✅ Yes |
| **Cost** | Free | Free | Free |
| **Reliability** | Depends on traffic | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Best for** | Sites with traffic | No-traffic sites | Keeping site + DB active |

---

## 🎯 Recommended Setup

### Option 1: Low/No Traffic Site (Recommended) ⭐

**Use GitHub Actions - Database Keep-Alive**

```
✅ Browser Keep-Alive (already active)
✅ GitHub Actions Database (setup required)
❌ GitHub Actions Site (disable)
```

**Why:**
- Guaranteed 24/7 database activity
- Direct database pinging (most efficient)
- No need to load your entire website
- Works even if site hosting is down

**Setup:** Follow `GITHUB_ACTIONS_KEEPALIVE.md`

---

### Option 2: Want Both Site & Database Active

**Use GitHub Actions - Site Keep-Alive**

```
✅ Browser Keep-Alive (already active)
❌ GitHub Actions Database (disable)
✅ GitHub Actions Site (setup required)
```

**Why:**
- Keeps hosting platform active (GitHub Pages, Vercel, etc.)
- Keeps database active via website visit
- Simpler setup (just edit URL)
- Good for platforms that also pause

**Setup:**
1. Edit `.github/workflows/site-keepalive.yml`
2. Replace line 20 with your site URL:
   ```yaml
   SITE_URL="https://yourusername.github.io/portfolio"
   ```
3. Disable `database-keepalive.yml` (see below)

---

### Option 3: High Traffic Site

**Use Browser Keep-Alive Only**

```
✅ Browser Keep-Alive (already active)
❌ GitHub Actions Database (disable or keep as backup)
❌ GitHub Actions Site (disable)
```

**Why:**
- If you get visitors daily, you don't need GitHub Actions
- Saves GitHub Actions minutes for other uses
- Simpler to maintain

**Setup:** Nothing! Already working. Optionally disable GitHub workflows.

---

## 🔧 How to Disable a Workflow

### Method 1: Via GitHub UI

1. Go to **Actions** tab
2. Select the workflow (e.g., "Site Keep-Alive")
3. Click **"..."** menu (top right)
4. Click **Disable workflow**

### Method 2: Delete the File

```bash
# Delete site keep-alive
rm .github/workflows/site-keepalive.yml

# Or delete database keep-alive
rm .github/workflows/database-keepalive.yml

# Then commit and push
git add .github/workflows/
git commit -m "Remove unused keep-alive workflow"
git push
```

### Method 3: Rename to Disable

```bash
# Rename to .disabled so it won't run
mv .github/workflows/site-keepalive.yml .github/workflows/site-keepalive.yml.disabled

# Can re-enable later by renaming back
```

---

## ⚙️ Configuration Summary

### Browser Keep-Alive

**File:** `src/utils/keepAlive.ts`

**Settings:**
- Interval: 5 minutes (line 8)
- Auto-start delay: 3 seconds (line 97)

**To disable:**
Comment out in `src/pages/Index.tsx`:
```typescript
// import "@/utils/keepAlive";
```

---

### GitHub Actions - Database

**File:** `.github/workflows/database-keepalive.yml`

**Settings:**
- Interval: `*/5 * * * *` (every 5 minutes, line 6)

**Required secrets:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**Setup guide:** `GITHUB_ACTIONS_KEEPALIVE.md`

---

### GitHub Actions - Site

**File:** `.github/workflows/site-keepalive.yml`

**Settings:**
- Interval: `*/10 * * * *` (every 10 minutes, line 8)
- Site URL: Line 20 (must edit)

**No secrets required** - just edit the URL

---

## 💰 Cost Comparison

All options are **completely free**:

### Browser Keep-Alive
- **Your cost:** $0
- **User cost:** Negligible bandwidth (~0.5 KB per ping)
- **Works when:** Someone visits your site

### GitHub Actions (5-min intervals)
- **Monthly runs:** ~8,640
- **Minutes used:** ~1,440 minutes
- **Free tier:** 2,000 minutes
- **Cost:** $0 (within free tier)

### GitHub Actions (10-min intervals)
- **Monthly runs:** ~4,320
- **Minutes used:** ~720 minutes
- **Cost:** $0 (within free tier)

**Even running both GitHub Actions workflows is free!**

---

## 🎯 My Recommendations

### For Most Portfolios (Low Traffic)

```yaml
Use:
  ✅ Browser Keep-Alive (already active)
  ✅ GitHub Actions - Database (5-min intervals)

Skip:
  ❌ GitHub Actions - Site
```

**Why:** Maximum protection, direct database pinging, within free tier.

### For High-Traffic Portfolios

```yaml
Use:
  ✅ Browser Keep-Alive (already active)

Skip:
  ❌ Both GitHub Actions workflows
```

**Why:** Traffic keeps it active naturally. Save Actions minutes.

### For Multi-Purpose Protection

```yaml
Use:
  ✅ Browser Keep-Alive (already active)
  ✅ GitHub Actions - Database (5-min intervals)

Optional:
  ⭐ GitHub Actions - Site (10-min intervals, as backup)
```

**Why:** Triple redundancy. Site stays active even if database is paused. Good for critical portfolios.

---

## 📈 Monitoring All Systems

### Browser Keep-Alive

Open browser console (F12) on your site:
```
[KeepAlive] Ping successful! Current visitor count: 42
```

### GitHub Actions

Go to **Actions** tab → Select workflow → View runs

---

## ❓ Which Should I Use?

**Quick decision tree:**

1. **Do you get daily visitors?**
   - Yes → Just use Browser Keep-Alive ✅
   - No → Continue to #2

2. **Do you want guaranteed 24/7 uptime?**
   - Yes → Use GitHub Actions - Database ✅
   - No → Just use Browser Keep-Alive

3. **Does your hosting platform also pause?**
   - Yes → Use GitHub Actions - Site ✅
   - No → Use GitHub Actions - Database ✅

4. **Want maximum protection?**
   - Yes → Use all three! ✅
   - No → Pick one GitHub Actions workflow

---

## ✅ Current Status

**Already Active:**
- ✅ Browser Keep-Alive (automatic)

**Setup Required:**
- ⚙️ GitHub Actions - Database (5 min setup)
- ⚙️ GitHub Actions - Site (2 min setup)

**Choose your workflow(s) and follow the setup guide!**

---

## 📚 Documentation

- `GITHUB_ACTIONS_KEEPALIVE.md` - GitHub Actions Database setup
- `KEEP_ALIVE_GUIDE.md` - Browser keep-alive details
- `KEEPALIVE_COMPARISON.md` - This guide

**Need help? Open any of these files for detailed instructions!** 🚀
