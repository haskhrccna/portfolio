import { supabase } from "@/integrations/supabase/client";

/**
 * Keep-alive service to prevent Supabase free tier from pausing
 * Pings the database periodically with a lightweight query
 */

const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRY_DELAY = 30 * 60 * 1000; // 30 minutes max retry delay

let pingIntervalId: NodeJS.Timeout | null = null;
let consecutiveFailures = 0;

/**
 * Performs a lightweight database ping to keep the connection active
 */
export const pingDatabase = async (): Promise<boolean> => {
  try {
    console.log('[KeepAlive] Pinging database...');

    // Lightweight query - just count visitors without retrieving data
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[KeepAlive] Ping failed:', error.message);
      consecutiveFailures++;
      return false;
    }

    console.log(`[KeepAlive] Ping successful! Current visitor count: ${count}`);
    consecutiveFailures = 0; // Reset on success
    return true;
  } catch (error: any) {
    console.error('[KeepAlive] Ping error:', error?.message);
    consecutiveFailures++;
    return false;
  }
};

/**
 * Starts the keep-alive service
 * @param interval - Ping interval in milliseconds (default: 5 minutes)
 */
export const startKeepAlive = (interval: number = PING_INTERVAL) => {
  // Prevent multiple instances
  if (pingIntervalId) {
    console.log('[KeepAlive] Already running');
    return;
  }

  console.log(`[KeepAlive] Starting service (interval: ${interval / 1000 / 60} minutes)`);

  // Initial ping
  pingDatabase();

  // Set up periodic pinging
  pingIntervalId = setInterval(() => {
    // Exponential backoff on failures (but keep trying)
    const delay = Math.min(
      PING_INTERVAL * Math.pow(2, Math.min(consecutiveFailures, 3)),
      MAX_RETRY_DELAY
    );

    if (consecutiveFailures > 0) {
      console.log(`[KeepAlive] ${consecutiveFailures} consecutive failures, retrying...`);
    }

    pingDatabase();
  }, interval);
};

/**
 * Stops the keep-alive service
 */
export const stopKeepAlive = () => {
  if (pingIntervalId) {
    console.log('[KeepAlive] Stopping service');
    clearInterval(pingIntervalId);
    pingIntervalId = null;
    consecutiveFailures = 0;
  }
};

/**
 * Checks if keep-alive service is running
 */
export const isKeepAliveRunning = (): boolean => {
  return pingIntervalId !== null;
};

// Auto-start keep-alive when module loads (browser only)
if (typeof window !== 'undefined') {
  // Wait a bit before starting to let the app initialize
  setTimeout(() => {
    startKeepAlive();
  }, 3000); // Start after 3 seconds

  // Clean up on page unload
  window.addEventListener('beforeunload', stopKeepAlive);

  // Expose functions to window for debugging
  (window as any).pingDatabase = pingDatabase;
  (window as any).startKeepAlive = startKeepAlive;
  (window as any).stopKeepAlive = stopKeepAlive;
  (window as any).isKeepAliveRunning = isKeepAliveRunning;
}
