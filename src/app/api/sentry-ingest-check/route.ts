import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

import { env } from "@/env";

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
 * The first run of this probe returned 500 as designed but **no issue reached
 * Sentry**, so the route now bisects the chain instead of just tripping it.
 *
 * ## The chain, and what distinguishes each break
 *
 * 1. `SENTRY_DSN` present on this environment  → `hasDsn`
 * 2. `register()` actually ran and built a client → `clientInitialized`
 * 3. The transport can reach Sentry at all      → `flushed` + `eventId`
 * 4. `onRequestError` fires and survives the freeze → the POST path
 *
 * Step 3 is the interesting one. Without `withSentryConfig` there is no build
 * plugin wrapping route handlers, and on a serverless platform an event that is
 * captured but not flushed dies when the lambda freezes. An explicit
 * `Sentry.flush()` here separates "cannot send" from "never got the chance".
 *
 * ## Safety rails
 *
 * - Refuses outright when `VERCEL_ENV === "production"`.
 * - Only POST throws. GET runs the diagnostic and returns JSON.
 * - Never echoes the DSN secret: host and project id only.
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

/** Host + project id only — never the public key. */
function describeDsn(dsn: string | undefined) {
  if (!dsn) return null;
  try {
    const parsed = new URL(dsn);
    return {
      host: parsed.host,
      projectId: parsed.pathname.replace(/^\//, ""),
      hasPublicKey: Boolean(parsed.username),
    };
  } catch {
    return { malformed: true };
  }
}

export async function GET() {
  if (isProduction()) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  const client = Sentry.getClient();

  // Step 3: can this runtime reach Sentry at all, given an explicit flush?
  const eventId = Sentry.captureMessage(
    `${ERROR_MARKER}: direct captureMessage from the diagnostic route.`,
    "error",
  );
  const flushed = await Sentry.flush(5000);

  return NextResponse.json({
    step1_hasDsn: Boolean(env.SENTRY_DSN),
    step1_dsn: describeDsn(env.SENTRY_DSN),
    step2_clientInitialized: Boolean(client),
    step2_clientDsn: client ? describeDsn(client.getOptions().dsn) : null,
    step3_eventId: eventId,
    step3_flushed: flushed,
    context: {
      vercelEnv: process.env.VERCEL_ENV ?? null,
      nextRuntime: process.env.NEXT_RUNTIME ?? null,
      sentryEnvironment: client?.getOptions().environment ?? null,
    },
    errorMarker: ERROR_MARKER,
    leakMarkers: LEAK_MARKERS,
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
