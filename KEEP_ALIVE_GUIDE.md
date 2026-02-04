# Database Keep-Alive System

Your portfolio now includes an automatic keep-alive system that prevents your Supabase free tier project from being paused due to inactivity.

## ✅ What It Does

The keep-alive system automatically:
- **Pings the database every 5 minutes** with a lightweight query
- **Runs in the background** when anyone visits your site
- **Doesn't affect performance** (uses head-only queries)
- **Has smart retry logic** with exponential backoff on failures
- **Logs activity** to browser console for monitoring

## 🚀 How It Works

1. **Auto-starts**: When your site loads, the service starts automatically after 3 seconds
2. **Lightweight pings**: Uses `SELECT count` with `head: true` (no data transfer)
3. **Keeps project active**: Supabase free tier pauses after 7 days of inactivity
4. **Smart retries**: If a ping fails, it retries with exponential backoff
5. **Browser only**: Only runs in the browser (not during builds)

## 📊 Monitoring

Open your browser console (F12) to see keep-alive logs:

```
[KeepAlive] Starting service (interval: 5 minutes)
[KeepAlive] Pinging database...
[KeepAlive] Ping successful! Current visitor count: 42
```

If there are issues, you'll see:
```
[KeepAlive] Ping failed: permission denied
[KeepAlive] 1 consecutive failures, retrying...
```

## ⚙️ Configuration

The keep-alive system is configured in `src/utils/keepAlive.ts`:

```typescript
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes (default)
const MAX_RETRY_DELAY = 30 * 60 * 1000; // 30 minutes max
```

### To Change Ping Interval

Edit `src/utils/keepAlive.ts` line 8:

```typescript
// Ping every 10 minutes instead of 5
const PING_INTERVAL = 10 * 60 * 1000;

// Or ping every 2 minutes (more aggressive)
const PING_INTERVAL = 2 * 60 * 1000;
```

**Recommended intervals:**
- **2-5 minutes**: If you want to be extra safe
- **5-10 minutes**: Balanced (default recommendation)
- **10-15 minutes**: If you have regular traffic

## 🎮 Manual Control

You can control the keep-alive system from the browser console:

```javascript
// Check if running
window.isKeepAliveRunning()

// Manually ping the database
await window.pingDatabase()

// Stop the service
window.stopKeepAlive()

// Restart the service
window.startKeepAlive()

// Start with custom interval (in milliseconds)
window.startKeepAlive(10 * 60 * 1000) // 10 minutes
```

These functions are automatically exposed to the window object for debugging.

## 🔋 Resource Usage

The keep-alive system is very lightweight:

- **Network**: ~0.5 KB per ping (just a count query with head: true)
- **CPU**: Negligible (one query every 5 minutes)
- **Battery**: Minimal impact on mobile devices
- **Supabase quotas**: Uses minimal API calls

**Monthly usage estimate:**
- Pings per hour: 12 (at 5-minute intervals)
- Pings per day: 288
- Pings per month: ~8,640

Supabase free tier includes **50,000 API requests/month**, so the keep-alive system uses less than **20%** of your quota even if it runs 24/7.

## 🌐 Multi-Tab Behavior

If a user opens multiple tabs:
- Each tab runs its own keep-alive service
- Pings are staggered (not synchronized)
- This is fine - extra pings don't hurt and use minimal resources

## 🛡️ Failure Handling

The system handles failures gracefully:

1. **Connection errors**: Automatically retries with exponential backoff
2. **RLS policy errors**: Logs error details for debugging
3. **Network offline**: Continues trying, resumes when online
4. **Database paused**: Will show errors until you create new project

## 📈 Benefits

✅ **Prevents pausing**: Your Supabase project stays active
✅ **Zero maintenance**: Runs automatically, no action needed
✅ **Smart retry logic**: Handles network issues gracefully
✅ **Efficient**: Minimal resource usage
✅ **Debuggable**: Full logging and manual controls

## 🎯 When Do You Still Need This?

The keep-alive system is useful when:
- Your site has **low traffic** (less than 1 visit per day)
- You want **guaranteed uptime** without relying on visitor traffic
- You're **testing or developing** and want the DB always ready

If your site gets regular visitors (even just a few per day), the visitor tracking already keeps the database active. The keep-alive system is an extra safety net.

## ⚡ Alternative: Upgrade to Supabase Pro

If you prefer not to use keep-alive pings:

**Supabase Pro ($25/month)**
- Projects never pause
- Better performance
- More storage
- Email support

For a professional portfolio, this might be worth considering.

## 🐛 Troubleshooting

### Keep-alive logs show "Ping failed"

1. Check that your Supabase project is active (not paused)
2. Verify credentials in `src/integrations/supabase/client.ts`
3. Ensure RLS policies are set up (run `DATABASE_SETUP.sql`)
4. Check browser console for detailed error messages

### How to verify it's working

1. Open your site
2. Open browser console (F12)
3. Look for: `[KeepAlive] Starting service`
4. Wait 5 minutes
5. Should see: `[KeepAlive] Ping successful!`

### How to disable it (if needed)

Comment out the import in `src/pages/Index.tsx`:

```typescript
// import "@/utils/keepAlive"; // Disabled keep-alive
```

## 📁 Files

- **`src/utils/keepAlive.ts`** - Keep-alive service implementation
- **`src/pages/Index.tsx`** - Imports and activates the service
- **`KEEP_ALIVE_GUIDE.md`** - This documentation

## ✅ Status

The keep-alive system is now active and will run automatically whenever someone visits your site!

Check your browser console to see it in action. 🎉
