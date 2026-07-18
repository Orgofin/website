/**
 * Application-level rate limiting for the public write endpoints.
 *
 * WHY THIS EXISTS
 * ---------------
 * `/api/waitlist` and `/api/data-room` perform an unauthenticated insert on
 * every valid request. Without a limit they can be scripted for spam, lead-
 * table flooding, or (once documents are live) signed-URL harvesting — see the
 * security audit, finding H-02. This module is the first line of defense.
 *
 * IMPORTANT LIMITATION (read before trusting this alone)
 * -----------------------------------------------------
 * The default store is an in-process `Map`. On Vercel's serverless/edge fleet
 * each function instance has its OWN memory, and instances scale out and cycle,
 * so this limiter is *per-instance, best-effort* — it stops naive bursts that
 * hit one warm instance but is NOT a distributed guarantee. The production-grade
 * layers are:
 *   1. Cloudflare Rate Limiting Rules on `/api/*` (the real DDoS/scraping edge
 *      defense — see docs/security/rate-limiting-and-bot-protection.md), and
 *   2. a shared store (Upstash Redis) plugged in via `setRateLimitStore()` — the
 *      doc shows the ~15-line adapter.
 * This in-memory default keeps the app working with zero external provisioning
 * (mirrors how Supabase/GA are optional) while those layers are added.
 */

export type RateLimitResult = {
  success: boolean;
  /** Configured max requests in the window. */
  limit: number;
  /** Requests remaining in the current window (never negative). */
  remaining: number;
  /** Unix ms at which the current window resets. */
  reset: number;
  /** Seconds until reset — for the `Retry-After` header on a 429. */
  retryAfterSeconds: number;
};

export type RateLimitOptions = {
  /** Max requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

/**
 * Pluggable store contract. Swap the default in-memory store for a shared one
 * (e.g. Upstash Redis) via `setRateLimitStore()` without touching call sites.
 */
export type RateLimitStore = {
  /**
   * Record a hit for `key` and return the count in the current window plus the
   * window's reset timestamp (Unix ms).
   */
  hit(
    key: string,
    windowMs: number,
  ):
    | Promise<{ count: number; reset: number }>
    | { count: number; reset: number };
};

type Bucket = { count: number; reset: number };

/**
 * Default in-process fixed-window store. A fixed window is simple and correct
 * for abuse prevention; the small burst-at-boundary imprecision is irrelevant
 * at our thresholds. Stale buckets are swept lazily to bound memory.
 */
function createMemoryStore(): RateLimitStore {
  const buckets = new Map<string, Bucket>();
  let lastSweep = Date.now();

  const sweep = (now: number) => {
    // Sweep at most once a minute to keep the hot path cheap.
    if (now - lastSweep < 60_000) return;
    lastSweep = now;
    for (const [k, b] of buckets) {
      if (b.reset <= now) buckets.delete(k);
    }
  };

  return {
    hit(key, windowMs) {
      const now = Date.now();
      sweep(now);
      const existing = buckets.get(key);
      if (!existing || existing.reset <= now) {
        const bucket: Bucket = { count: 1, reset: now + windowMs };
        buckets.set(key, bucket);
        return { count: bucket.count, reset: bucket.reset };
      }
      existing.count += 1;
      return { count: existing.count, reset: existing.reset };
    },
  };
}

let store: RateLimitStore = createMemoryStore();

/** Swap in a shared/distributed store (e.g. Upstash Redis). See the doc. */
export function setRateLimitStore(next: RateLimitStore): void {
  store = next;
}

/**
 * Check-and-increment the limit for `key` (typically `"<route>:<ip>"`).
 * Returns whether the request is allowed plus headers-friendly metadata.
 */
export async function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): Promise<RateLimitResult> {
  const { count, reset } = await store.hit(key, windowMs);
  const remaining = Math.max(0, limit - count);
  const retryAfterSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  return {
    success: count <= limit,
    limit,
    remaining,
    reset,
    retryAfterSeconds,
  };
}

/**
 * Best-effort client IP from proxy headers. On Vercel `x-forwarded-for` is set
 * to the real client chain; we take the first hop. Falls back to `x-real-ip`,
 * then a constant so a missing header degrades to a shared (stricter) bucket
 * rather than throwing.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Standard rate-limit response headers for both 200 and 429 responses. */
export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
  };
  if (!result.success) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}
