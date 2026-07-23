import { z } from "zod";

import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

/**
 * Shared validation schema for a data-room access request (copy.md §7 fields;
 * name/email/firm required per the E11.1.4 decision, check size optional).
 * Used by the API route, the seam function (defense in depth), and the client
 * gate form — validation rules live in exactly one place.
 */
export const dataRoomRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  firm: z.string().trim().min(2, "Enter your firm or fund.").max(160),
  checkSize: z.string().trim().max(120).optional(),
});

export type DataRoomRequestInput = z.infer<typeof dataRoomRequestSchema>;

/** Private storage bucket holding the investor documents. Never public. */
export const DATA_ROOM_BUCKET = "investor-data-room";

/** How long a minted download link stays valid. */
export const SIGNED_URL_TTL_SECONDS = 900; // 15 minutes

export type DataRoomDocument = {
  slug: string;
  title: string;
  description: string;
  /**
   * Path inside the private bucket — `null` while the slot awaits its
   * founder-supplied file. Flipping this to the uploaded path is the only
   * change needed to go live (runbook: docs/deployment/data-room-storage.md).
   */
  storagePath: string | null;
};

/**
 * The document slots (E11.1.3). Titles describe document types; the files
 * themselves are founder-supplied business artifacts — never authored here
 * (CLAUDE.md non-negotiable #1). Content discipline per the E11.1.4 decision:
 * only competitor-safe collateral belongs in this catalog; diligence-grade
 * material (financial model, cap table, per-category TAM) is shared 1:1 from
 * a founder-controlled room instead.
 */
export const DATA_ROOM_DOCUMENTS: readonly DataRoomDocument[] = [
  {
    slug: "pitch-deck",
    title: "Pitch Deck",
    description:
      "The full investor narrative — problem, market, product, moats, roadmap, and the ask.",
    // Live 2026-07-22: founder uploaded the investor-safe deck to the private
    // `investor-data-room` bucket root and set SUPABASE_SERVICE_ROLE_KEY in
    // Vercel. Path is the exact, case-sensitive object key (runbook step 5:
    // docs/deployment/data-room-storage.md).
    storagePath: "pitch-deck.pptx",
  },
  {
    slug: "one-pager",
    title: "One-Pager",
    description: "The executive summary on a single page.",
    // TODO(E11.1.3 content): founder-supplied PDF pending — see above.
    storagePath: null,
  },
];

export type DataRoomDocumentAccess = {
  slug: string;
  title: string;
  description: string;
  /** Time-limited signed download URL — `null` while the file is pending. */
  url: string | null;
};

export type DataRoomAccessResult =
  | { ok: true; documents: DataRoomDocumentAccess[] }
  | { ok: false; error: string };

/**
 * Register an access request and unlock the room (`frontend.md` §11 seam —
 * Supabase today, a future backend swaps in here without touching callers).
 *
 * Two-step by design: (1) store the lead via the anon client + insert-only
 * RLS, exactly like the waitlist; (2) mint time-limited signed URLs for each
 * uploaded document via the service-role client. Signing failures never lose
 * the lead — the room opens with documents shown as pending instead.
 * Always returns a typed result; never throws.
 */
export async function requestDataRoomAccess(
  input: DataRoomRequestInput,
): Promise<DataRoomAccessResult> {
  const parsed = dataRoomRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid request.",
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("data_room_requests").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      firm: parsed.data.firm,
      check_size: parsed.data.checkSize ?? null,
    });

    if (error) {
      console.error("requestDataRoomAccess: insert failed", error);
      return {
        ok: false,
        error: "We couldn't register your request. Please try again.",
      };
    }
  } catch (cause) {
    console.error("requestDataRoomAccess: unexpected error", cause);
    return {
      ok: false,
      error: "The data room isn't available right now. Please try again later.",
    };
  }

  return { ok: true, documents: await signDocuments() };
}

async function signDocuments(): Promise<DataRoomDocumentAccess[]> {
  const uploaded = DATA_ROOM_DOCUMENTS.filter(
    (doc) => doc.storagePath !== null,
  );

  const urls = new Map<string, string>();
  if (uploaded.length > 0) {
    try {
      const admin = createSupabaseAdminClient();
      for (const doc of uploaded) {
        if (!doc.storagePath) continue;
        const { data, error } = await admin.storage
          .from(DATA_ROOM_BUCKET)
          .createSignedUrl(doc.storagePath, SIGNED_URL_TTL_SECONDS);
        if (error || !data?.signedUrl) {
          console.error(
            `requestDataRoomAccess: signing failed for "${doc.slug}"`,
            error,
          );
          continue;
        }
        urls.set(doc.slug, data.signedUrl);
      }
    } catch (cause) {
      // Service key absent (local/preview) or storage unreachable — the lead
      // is already stored; degrade to the pending state rather than failing.
      console.error("requestDataRoomAccess: signing unavailable", cause);
    }
  }

  return DATA_ROOM_DOCUMENTS.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    url: urls.get(doc.slug) ?? null,
  }));
}
