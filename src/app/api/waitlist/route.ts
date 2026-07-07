import { NextResponse } from "next/server";

import { submitWaitlist, waitlistSchema } from "@/lib/api/waitlist";

/**
 * POST /api/waitlist — validate a signup and hand it to the `lib/api` seam.
 * Returns a typed `{ error }` shape on failure; never leaks an exception.
 *
 * Runs on the default (Node) runtime for now. Per `frontend.md` §11 it is
 * edge-eligible (Supabase's client uses `fetch`); revisit once the project is
 * provisioned and edge behaviour can actually be verified.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 },
    );
  }

  const result = await submitWaitlist(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
