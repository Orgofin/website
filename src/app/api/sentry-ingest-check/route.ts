import { NextResponse } from "next/server";

/**
 * TEMPORARY — DO NOT MERGE. Delete this branch once the check is recorded.
 *
 * `lib/observability/scrub.ts` has nine unit tests, but until now it had never
 * met a real Sentry ingest. Unit tests prove the function does what we think;
 * they cannot prove the event that actually leaves the server is shaped the way
 * the tests assume, or that `beforeSend` is even reached on this code path.
 * /privacy publishes "we record the technical error, never the contents" as a
 * statement of fact, so it deserves one observation against the real pipeline.
 *
 * This route throws on POST so Next's `onRequestError` hook fires, carrying the
 * request through `captureRequestError` → `beforeSend` → Sentry, exactly as a
 * waitlist 500 would.
 *
 * ## Safety rails
 *
 * - Refuses outright when `VERCEL_ENV === "production"`. This lives on a
 *   throwaway branch that is never merged, but the guard means the route is
 *   inert even if that ever went wrong. Belt and braces on a route whose whole
 *   job is to fail.
 * - Only POST throws. GET describes the check, so hitting it in a browser is
 *   harmless.
 */

/** Distinguishes this issue in the Sentry UI. Safe to keep — it is the "technical error". */
const ERROR_MARKER = "SENTRY-INGEST-CHECK-2026-07-29";

/**
 * Values seeded into the request that MUST NOT appear anywhere in the Sentry
 * event. Each one exercises a different branch of `scrubEvent`.
 */
const LEAK_MARKERS = {
  body: "LEAKCHECK-BODY-8f3a1c",
  query: "LEAKCHECK-QUERY-8f3a1c",
  cookie: "LEAKCHECK-COOKIE-8f3a1c",
  header: "LEAKCHECK-HEADER-8f3a1c",
} as const;

function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export async function GET() {
  if (isProduction()) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  return NextResponse.json({
    what: "Temporary Sentry ingest verification. POST to this route to throw a server error.",
    errorMarker: ERROR_MARKER,
    leakMarkers: LEAK_MARKERS,
    expected:
      "An issue appears in Sentry with environment=preview and the error marker in its title. None of the leak markers appear anywhere in the event.",
  });
}

export async function POST(request: Request) {
  if (isProduction()) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  // Read the body so it is genuinely part of the request Sentry sees.
  await request.text();

  throw new Error(
    `${ERROR_MARKER}: deliberate error to verify Sentry ingest and PII scrubbing.`,
  );
}
