import { afterEach, describe, expect, it, vi } from "vitest";

const { insertMock, adminFactoryMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  adminFactoryMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
  createSupabaseAdminClient: adminFactoryMock,
}));

import {
  DATA_ROOM_DOCUMENTS,
  dataRoomRequestSchema,
  requestDataRoomAccess,
} from "@/lib/api/data-room";

afterEach(() => {
  vi.clearAllMocks();
});

const VALID_INPUT = {
  name: "Ada Lovelace",
  email: "ada@fund.com",
  firm: "Analytical Capital",
};

describe("dataRoomRequestSchema", () => {
  it("requires name, email, and firm; check size stays optional", () => {
    expect(dataRoomRequestSchema.safeParse(VALID_INPUT).success).toBe(true);
    expect(
      dataRoomRequestSchema.safeParse({ ...VALID_INPUT, checkSize: "$250K" })
        .success,
    ).toBe(true);
    expect(
      dataRoomRequestSchema.safeParse({ ...VALID_INPUT, email: "not-an-email" })
        .success,
    ).toBe(false);
    expect(
      dataRoomRequestSchema.safeParse({ ...VALID_INPUT, firm: "" }).success,
    ).toBe(false);
  });

  it("normalizes the email like the waitlist schema", () => {
    const parsed = dataRoomRequestSchema.parse({
      ...VALID_INPUT,
      email: "  ADA@Fund.com ",
    });
    expect(parsed.email).toBe("ada@fund.com");
  });
});

describe("DATA_ROOM_DOCUMENTS catalog", () => {
  it("has unique slugs and complete labels", () => {
    const slugs = DATA_ROOM_DOCUMENTS.map((doc) => doc.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const doc of DATA_ROOM_DOCUMENTS) {
      expect(doc.title).not.toBe("");
      expect(doc.description).not.toBe("");
    }
  });
});

describe("requestDataRoomAccess", () => {
  it("rejects invalid input without touching Supabase", async () => {
    const result = await requestDataRoomAccess({
      name: "A",
      email: "bad",
      firm: "",
    });
    expect(result.ok).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("stores the lead and returns every catalog slot", async () => {
    insertMock.mockResolvedValue({ error: null });

    const result = await requestDataRoomAccess(VALID_INPUT);

    expect(insertMock).toHaveBeenCalledExactlyOnceWith({
      name: "Ada Lovelace",
      email: "ada@fund.com",
      firm: "Analytical Capital",
      check_size: null,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.documents.map((doc) => doc.slug)).toEqual(
        DATA_ROOM_DOCUMENTS.map((doc) => doc.slug),
      );
    }
  });

  it("signs uploaded documents and leaves pending slots null", async () => {
    insertMock.mockResolvedValue({ error: null });
    const createSignedUrl = vi.fn(async (path: string) => ({
      data: { signedUrl: `https://signed.example/${path}` },
      error: null,
    }));
    adminFactoryMock.mockReturnValue({
      storage: { from: () => ({ createSignedUrl }) },
    });

    const result = await requestDataRoomAccess(VALID_INPUT);

    // At least one live document (e.g. the pitch deck) means signing is
    // attempted; uploaded slots resolve to a signed URL, pending slots stay
    // null. Assertions derive from the catalog so they survive future flips.
    const uploaded = DATA_ROOM_DOCUMENTS.filter((doc) => doc.storagePath);
    expect(adminFactoryMock).toHaveBeenCalledTimes(uploaded.length > 0 ? 1 : 0);
    expect(result.ok).toBe(true);
    if (result.ok) {
      for (const doc of result.documents) {
        const source = DATA_ROOM_DOCUMENTS.find((d) => d.slug === doc.slug);
        if (source?.storagePath) {
          expect(doc.url).toBe(`https://signed.example/${source.storagePath}`);
        } else {
          expect(doc.url).toBeNull();
        }
      }
    }
  });

  it("degrades to pending (no throw, null urls) when signing is unavailable", async () => {
    insertMock.mockResolvedValue({ error: null });
    // No service-role client (e.g. local/CI without the key) → signing fails,
    // but the lead is still stored and the room opens with documents pending.
    adminFactoryMock.mockReturnValue(undefined);

    const result = await requestDataRoomAccess(VALID_INPUT);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.documents.every((doc) => doc.url === null)).toBe(true);
    }
  });

  it("returns a typed error when the insert fails", async () => {
    insertMock.mockResolvedValue({ error: { code: "XX000" } });

    const result = await requestDataRoomAccess(VALID_INPUT);

    expect(result).toEqual({
      ok: false,
      error: "We couldn't register your request. Please try again.",
    });
  });

  it("returns a typed error when Supabase is unreachable", async () => {
    insertMock.mockRejectedValue(new Error("network down"));

    const result = await requestDataRoomAccess(VALID_INPUT);

    expect(result.ok).toBe(false);
  });
});
