import { afterEach, describe, expect, it, vi } from "vitest";

const { getHealthMock } = vi.hoisted(() => ({ getHealthMock: vi.fn() }));

vi.mock("@/lib/api/retention", async (importOriginal) => ({
  // Keep the real `isRetentionPurgeHealthy` — the status-to-HTTP mapping under
  // test here is only meaningful together with the real definition of healthy.
  ...(await importOriginal<typeof import("@/lib/api/retention")>()),
  getRetentionPurgeHealth: getHealthMock,
}));

import { GET } from "@/app/api/health/retention/route";

/**
 * The rate limiter buckets per IP, so every case sends a distinct one —
 * otherwise the 30/minute limit would leak across tests.
 */
let ipCounter = 0;
function requestFromNewIp() {
  ipCounter += 1;
  return new Request("https://orgofin.com/api/health/retention", {
    headers: { "x-forwarded-for": `203.0.113.${ipCounter}` },
  });
}

function healthy(status: string) {
  return {
    ok: true as const,
    health: {
      status,
      lastRunAt: "2026-07-27T03:15:00.000Z",
      lastRunStatus: "success",
      lastSuccessAt: "2026-07-27T03:15:00.000Z",
      hoursSinceSuccess: 6.2,
      staleAfterHours: 48,
    },
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/health/retention", () => {
  it("returns 200 only when the purge is healthy", async () => {
    getHealthMock.mockResolvedValue(healthy("healthy"));

    const response = await GET(requestFromNewIp());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "healthy",
      staleAfterHours: 48,
    });
  });

  // This is the alerting contract: the uptime monitor treats non-2xx as down.
  // A 200 here for any of these would mean a stalled purge never pages anyone —
  // the exact silent failure this endpoint exists to end.
  it.each(["failing", "stale", "unknown"])(
    "returns 503 when the purge is %s",
    async (status) => {
      getHealthMock.mockResolvedValue(healthy(status));

      const response = await GET(requestFromNewIp());

      expect(response.status).toBe(503);
    },
  );

  it("returns 503, not 500, when the check itself is unavailable", async () => {
    getHealthMock.mockResolvedValue({ ok: false, error: "not configured" });

    const response = await GET(requestFromNewIp());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      status: "unavailable",
    });
  });

  it("never caches — a stale 'healthy' is worse than no answer", async () => {
    getHealthMock.mockResolvedValue(healthy("healthy"));

    const response = await GET(requestFromNewIp());

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("rate-limits repeated polling from one IP", async () => {
    getHealthMock.mockResolvedValue(healthy("healthy"));
    const request = requestFromNewIp();

    let last = await GET(request);
    for (let i = 0; i < 31 && last.status !== 429; i += 1) {
      last = await GET(request);
    }

    expect(last.status).toBe(429);
  });
});
