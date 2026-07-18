import { NextResponse } from "next/server";

import {
  DATA_ROOM_DOCUMENTS,
  dataRoomRequestSchema,
  requestDataRoomAccess,
} from "@/lib/api/data-room";
import { isHoneypotTriggered } from "@/lib/security/bot-protection";
import {
  checkRateLimit,
  clientIpFromHeaders,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

/**
 * POST /api/data-room — validate an access request and hand it to the
 * `lib/api` seam; on success returns the document list with time-limited
 * signed URLs (null while a slot's file is pending). Returns a typed
 * `{ error }` shape on failure; never leaks an exception. Same runtime notes
 * as /api/waitlist.
 *
 * Abuse controls (security audit H-02/M-02): a stricter per-IP rate limit
 * (this endpoint mints signed URLs, so scripted access is more valuable to an
 * attacker) plus a honeypot bot check run before any work. See
 * docs/security/rate-limiting-and-bot-protection.md.
 */
const RATE_LIMIT = { limit: 5, windowMs: 300_000 }; // 5 requests / 5 min / IP

/** Benign response used for bot hits: every document shown as pending, no
 *  lead stored and no signed URL minted, so a bot learns nothing. */
function pendingDocumentsResponse() {
  return DATA_ROOM_DOCUMENTS.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    url: null,
  }));
}

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  const limit = await checkRateLimit(`data-room:${ip}`, RATE_LIMIT);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400, headers: rateLimitHeaders(limit) },
    );
  }

  // Honeypot: a filled hidden field means a bot. Return a benign "pending"
  // room with no lead stored and no URLs minted.
  if (isHoneypotTriggered(body)) {
    return NextResponse.json(
      { documents: pendingDocumentsResponse() },
      { status: 201, headers: rateLimitHeaders(limit) },
    );
  }

  const parsed = dataRoomRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400, headers: rateLimitHeaders(limit) },
    );
  }

  const result = await requestDataRoomAccess(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 502, headers: rateLimitHeaders(limit) },
    );
  }

  return NextResponse.json(
    { documents: result.documents },
    { status: 201, headers: rateLimitHeaders(limit) },
  );
}
