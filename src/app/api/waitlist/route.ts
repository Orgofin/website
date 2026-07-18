import { NextResponse } from "next/server";

import { submitWaitlist, waitlistSchema } from "@/lib/api/waitlist";
import { isHoneypotTriggered } from "@/lib/security/bot-protection";
import {
  checkRateLimit,
  clientIpFromHeaders,
  rateLimitHeaders,
} from "@/lib/security/rate-limit";

/**
 * POST /api/waitlist — validate a signup and hand it to the `lib/api` seam.
 * Returns a typed `{ error }` shape on failure; never leaks an exception.
 *
 * Abuse controls (security audit H-02/M-02): a best-effort per-IP rate limit
 * and a honeypot bot check run before any work. See
 * docs/security/rate-limiting-and-bot-protection.md.
 *
 * Runs on the default (Node) runtime for now. Per `frontend.md` §11 it is
 * edge-eligible (Supabase's client uses `fetch`); revisit once the project is
 * provisioned and edge behaviour can actually be verified.
 */
const RATE_LIMIT = { limit: 5, windowMs: 60_000 }; // 5 signups / minute / IP

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  const limit = await checkRateLimit(`waitlist:${ip}`, RATE_LIMIT);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
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

  // Honeypot: a filled hidden field means a bot. Return the success shape with
  // no side effect so the bot learns nothing and stops retrying.
  if (isHoneypotTriggered(body)) {
    return NextResponse.json(
      { ok: true },
      { status: 201, headers: rateLimitHeaders(limit) },
    );
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400, headers: rateLimitHeaders(limit) },
    );
  }

  const result = await submitWaitlist(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: 502, headers: rateLimitHeaders(limit) },
    );
  }

  return NextResponse.json(
    { ok: true },
    { status: 201, headers: rateLimitHeaders(limit) },
  );
}
