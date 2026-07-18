import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkRateLimit,
  clientIpFromHeaders,
  rateLimitHeaders,
  setRateLimitStore,
} from "@/lib/security/rate-limit";

describe("checkRateLimit (in-memory store)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit, then blocks", async () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 3, windowMs: 60_000 };

    for (let i = 0; i < 3; i++) {
      const r = await checkRateLimit(key, opts);
      expect(r.success).toBe(true);
    }
    const blocked = await checkRateLimit(key, opts);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window elapses", async () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 1, windowMs: 1_000 };

    expect((await checkRateLimit(key, opts)).success).toBe(true);
    expect((await checkRateLimit(key, opts)).success).toBe(false);

    vi.advanceTimersByTime(1_001);
    expect((await checkRateLimit(key, opts)).success).toBe(true);
  });

  it("tracks separate keys independently", async () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect((await checkRateLimit("a", opts)).success).toBe(true);
    expect((await checkRateLimit("b", opts)).success).toBe(true);
  });
});

describe("clientIpFromHeaders", () => {
  it("takes the first hop of x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(clientIpFromHeaders(h)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip, then a constant", () => {
    expect(clientIpFromHeaders(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe(
      "9.9.9.9",
    );
    expect(clientIpFromHeaders(new Headers())).toBe("unknown");
  });
});

describe("rateLimitHeaders", () => {
  it("omits Retry-After when the request succeeded", () => {
    const headers = rateLimitHeaders({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 1000,
      retryAfterSeconds: 1,
    });
    expect(headers["RateLimit-Limit"]).toBe("5");
    expect(headers["Retry-After"]).toBeUndefined();
  });

  it("includes Retry-After on a block", () => {
    const headers = rateLimitHeaders({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 30_000,
      retryAfterSeconds: 30,
    });
    expect(headers["Retry-After"]).toBe("30");
  });
});

describe("setRateLimitStore", () => {
  it("delegates to a custom (e.g. Redis) store", async () => {
    // Runs last in this file: swapping the module-level store here does not
    // affect the in-memory tests above (they already ran), and Vitest isolates
    // module state per test file.
    const hit = vi.fn(() => ({ count: 99, reset: Date.now() + 1000 }));
    setRateLimitStore({ hit });
    const r = await checkRateLimit("x", { limit: 5, windowMs: 1000 });
    expect(hit).toHaveBeenCalledOnce();
    expect(r.success).toBe(false);
  });
});
