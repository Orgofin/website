import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { rpcMock, adminFactoryMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  adminFactoryMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseAdminClient: adminFactoryMock,
}));

import {
  getRetentionPurgeHealth,
  isRetentionPurgeHealthy,
} from "@/lib/api/retention";

/** One row, shaped exactly as `retention_purge_health()` returns it. */
function healthRow(overrides: Record<string, unknown> = {}) {
  return {
    status: "healthy",
    last_run_at: "2026-07-27T03:15:00.000Z",
    last_run_status: "success",
    last_success_at: "2026-07-27T03:15:00.000Z",
    hours_since_success: 6.2,
    stale_after_hours: 48,
    last_error: null,
    ...overrides,
  };
}

beforeEach(() => {
  adminFactoryMock.mockReturnValue({ rpc: rpcMock });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("isRetentionPurgeHealthy", () => {
  it("treats only an in-window success as healthy", () => {
    expect(isRetentionPurgeHealthy("healthy")).toBe(true);
    expect(isRetentionPurgeHealthy("failing")).toBe(false);
    expect(isRetentionPurgeHealthy("stale")).toBe(false);
    // No run history is a monitoring failure, not an absence of news.
    expect(isRetentionPurgeHealthy("unknown")).toBe(false);
  });
});

describe("getRetentionPurgeHealth", () => {
  it("maps the RPC row onto the health shape", async () => {
    rpcMock.mockResolvedValue({ data: [healthRow()], error: null });

    const result = await getRetentionPurgeHealth();

    expect(rpcMock).toHaveBeenCalledWith("retention_purge_health");
    expect(result).toEqual({
      ok: true,
      health: {
        status: "healthy",
        lastRunAt: "2026-07-27T03:15:00.000Z",
        lastRunStatus: "success",
        lastSuccessAt: "2026-07-27T03:15:00.000Z",
        hoursSinceSuccess: 6.2,
        staleAfterHours: 48,
      },
    });
  });

  it("never forwards the raw database error text", async () => {
    rpcMock.mockResolvedValue({
      data: [
        healthRow({
          status: "failing",
          last_run_status: "failure",
          last_error: 'permission denied for table "waitlist"',
        }),
      ],
      error: null,
    });

    const result = await getRetentionPurgeHealth();

    expect(result.ok).toBe(true);
    // The endpoint serialises whatever comes back, so `last_error` leaking into
    // this object would put schema details on a public URL.
    expect(JSON.stringify(result)).not.toContain("permission denied");
    expect(result).toMatchObject({ health: { status: "failing" } });
  });

  it("carries the staleness threshold from SQL rather than restating it", async () => {
    rpcMock.mockResolvedValue({
      data: [healthRow({ status: "stale", stale_after_hours: 72 })],
      error: null,
    });

    const result = await getRetentionPurgeHealth();

    expect(result).toMatchObject({ health: { staleAfterHours: 72 } });
  });

  it("fails closed when the RPC errors", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "function does not exist" },
    });

    await expect(getRetentionPurgeHealth()).resolves.toMatchObject({
      ok: false,
    });
  });

  it("fails closed when the function returns no row", async () => {
    // The function returns exactly one row by construction; an empty result
    // means the migration is missing, which must not read as healthy.
    rpcMock.mockResolvedValue({ data: [], error: null });

    await expect(getRetentionPurgeHealth()).resolves.toMatchObject({
      ok: false,
    });
  });

  it("fails closed when the service-role key is absent (local, CI, preview)", async () => {
    adminFactoryMock.mockImplementation(() => {
      throw new Error("Supabase admin access is not configured");
    });

    await expect(getRetentionPurgeHealth()).resolves.toMatchObject({
      ok: false,
    });
  });
});
