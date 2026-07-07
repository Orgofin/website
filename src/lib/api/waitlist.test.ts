import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Supabase seam so these are true unit tests — no network, no project.
const { createSupabaseServerClient, insert } = vi.hoisted(() => {
  const insert = vi.fn();
  const createSupabaseServerClient = vi.fn();
  return { createSupabaseServerClient, insert };
});

vi.mock("@/lib/supabase/server", () => ({ createSupabaseServerClient }));

import { submitWaitlist } from "@/lib/api/waitlist";

beforeEach(() => {
  vi.clearAllMocks();
  createSupabaseServerClient.mockReturnValue({
    from: () => ({ insert }),
  });
  insert.mockResolvedValue({ error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("submitWaitlist", () => {
  it("inserts a valid, normalized email and reports success", async () => {
    const result = await submitWaitlist({ email: "  Founder@Orgofin.COM  " });

    expect(result).toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith({
      email: "founder@orgofin.com",
      source: null,
    });
  });

  it("passes an optional source through", async () => {
    await submitWaitlist({ email: "a@b.com", source: "home-hero" });
    expect(insert).toHaveBeenCalledWith({
      email: "a@b.com",
      source: "home-hero",
    });
  });

  it("rejects an invalid email without touching Supabase", async () => {
    const result = await submitWaitlist({ email: "not-an-email" });

    expect(result.ok).toBe(false);
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
  });

  it("treats a unique-violation as success (already signed up)", async () => {
    insert.mockResolvedValue({ error: { code: "23505" } });

    expect(await submitWaitlist({ email: "dupe@b.com" })).toEqual({ ok: true });
  });

  it("returns a safe error on an unexpected database error", async () => {
    insert.mockResolvedValue({ error: { code: "500", message: "boom" } });

    const result = await submitWaitlist({ email: "a@b.com" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).not.toContain("boom");
  });

  it("returns a safe error when Supabase is unconfigured (throws)", async () => {
    createSupabaseServerClient.mockImplementation(() => {
      throw new Error("Supabase is not configured");
    });

    const result = await submitWaitlist({ email: "a@b.com" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).not.toContain("configured");
  });
});
