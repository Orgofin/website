import type { ErrorEvent } from "@sentry/nextjs";

/**
 * PII scrubbing for Sentry events.
 *
 * ## Why this is a separate, tested module
 *
 * /privacy makes two promises that an error monitor is the single most likely
 * thing to break:
 *
 *   > "No logging of what you type into a form. If a submission fails, we
 *   >  record the technical error, never the contents."
 *   > "No cookies of our own."
 *
 * The first is not a general aspiration — it is a specific description of
 * exactly what this file does. An error monitor that shipped a request body
 * would falsify a published legal page, and it would do so silently, in a
 * system nobody looks at until something is already broken. So the scrubbing
 * is a pure function with unit tests rather than an inline lambda in the
 * init call, and it is written deny-by-default: strip whole containers, then
 * add back the few fields known to be safe.
 *
 * ## What gets removed
 *
 * - **Request body** (`request.data`) — waitlist and data-room submissions
 *   carry name, work email, company. Dropped wholesale, never inspected.
 * - **Query string** (`request.query_string`) and any query on the URL.
 * - **Headers** except an allowlist — `cookie`, `authorization`, and
 *   `x-forwarded-for` all carry identity.
 * - **`user`** — Sentry's IP inference. `sendDefaultPii: false` should already
 *   prevent this; removing it here means it stays gone if that flag is ever
 *   flipped by someone who did not read this file.
 *
 * ## What is deliberately kept
 *
 * The URL path, HTTP method, status, stack trace, and our own breadcrumbs.
 * That is the "technical error" /privacy says we do record, and without a path
 * and a stack the report is not actionable enough to be worth collecting.
 */

/**
 * Headers safe to keep. Everything else is dropped — an allowlist rather than
 * a blocklist, so a header added by a future proxy is excluded by default
 * instead of leaking until someone notices it.
 */
const SAFE_HEADERS = new Set([
  "content-type",
  "content-length",
  "accept",
  "accept-encoding",
  "accept-language",
  "user-agent",
  "referer",
]);

/** Strips the query string from a URL, keeping origin + path. */
function stripQuery(url: string): string {
  const cut = url.search(/[?#]/);
  return cut === -1 ? url : url.slice(0, cut);
}

function scrubHeaders(headers: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (SAFE_HEADERS.has(key.toLowerCase())) safe[key] = value;
  }
  return safe;
}

/**
 * Sentry `beforeSend` hook. Exported separately from the init call so it can
 * be unit-tested against realistic event shapes.
 *
 * Returning `null` would drop the event entirely; we always return the event,
 * scrubbed, because the technical error is the thing worth keeping.
 */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  // Sentry's IP/user inference. Should already be off via sendDefaultPii.
  delete event.user;

  if (event.request) {
    const { request } = event;

    // The submitted form contents. Never inspected, never sampled.
    delete request.data;
    delete request.cookies;
    delete request.query_string;

    if (typeof request.url === "string") {
      request.url = stripQuery(request.url);
    }

    if (request.headers) {
      request.headers = scrubHeaders(request.headers);
    }
  }

  return event;
}
