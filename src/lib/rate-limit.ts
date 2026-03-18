// Simple in-memory sliding-window rate limiter

const windows = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if a key (typically IP address) has exceeded the rate limit.
 * @returns true if the request should be BLOCKED
 */
export function isRateLimited(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || entry.resetAt < now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > maxAttempts) {
    return true;
  }

  return false;
}

// Periodic cleanup (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of windows) {
      if (val.resetAt < now) windows.delete(key);
    }
  }, 5 * 60 * 1000);
}
