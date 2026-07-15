import { NextResponse } from "next/server";

import {
  dataRoomRequestSchema,
  requestDataRoomAccess,
} from "@/lib/api/data-room";

/**
 * POST /api/data-room — validate an access request and hand it to the
 * `lib/api` seam; on success returns the document list with time-limited
 * signed URLs (null while a slot's file is pending). Returns a typed
 * `{ error }` shape on failure; never leaks an exception. Same runtime notes
 * as /api/waitlist.
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

  const parsed = dataRoomRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const result = await requestDataRoomAccess(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ documents: result.documents }, { status: 201 });
}
