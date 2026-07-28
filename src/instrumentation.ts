import * as Sentry from "@sentry/nextjs";

import { env } from "@/env";
import { scrubEvent } from "@/lib/observability/scrub";

/**
 * Sentry — **server-side only**, and env-gated.
 *
 * ## Why there is no browser SDK
 *
 * The Sentry browser SDK costs roughly 40 KB gzipped on the client. At the time
 * this was wired, mobile Performance (91–93 against a 95 target) was the single
 * remaining gap against the PRD, and `unused-javascript` was already the top
 * offender in the Lighthouse baseline. Spending the site's one failing metric
 * on browser crash reports was the wrong trade for a marketing site whose
 * client-side surface is animation, not application logic.
 *
 * What is worth catching is what happens on the server: a waitlist submission
 * that 500s is a lead lost silently, and that is exactly the class of failure
 * nobody finds by looking at the page. So this instruments API routes, server
 * components, and the retention seam, and nothing in the browser.
 *
 * A pleasant side effect: with no browser SDK there is no third-party script,
 * so this raises none of the consent questions Speed Insights did. Error
 * monitoring here is server-side operational logging, not analytics, and
 * /privacy already describes it ("we record the technical error, never the
 * contents") — a promise `lib/observability/scrub.ts` enforces literally.
 *
 * Revisit the client SDK once the mobile performance gap is closed or the
 * target is re-baselined — see the TODO in docs/operations/error-monitoring.md.
 *
 * ## Why it is env-gated
 *
 * `SENTRY_DSN` is `.optional()` in `src/env.ts` and this function no-ops when
 * it is unset, matching how GA4 and Supabase are handled. CI and local builds
 * therefore need no Sentry project, and switching monitoring on in production
 * is a Vercel environment-variable change, not a deploy.
 *
 * ## Why `withSentryConfig` is not used
 *
 * The Sentry Next.js plugin wraps `next.config.ts`, which is where the CSP
 * lives. That file is load-bearing for security headers and for the static
 * rendering the performance target depends on, and the plugin's benefit here
 * is source-map upload — a debuggability nicety, not a correctness one.
 * Registering the SDK directly keeps the config untouched. The cost is that
 * server stack traces reference built output; recorded as a TODO rather than
 * absorbed silently.
 */
export async function register() {
  if (!env.SENTRY_DSN) return;

  // Edge and Node runtimes both route through here; the SDK picks the right
  // transport from NEXT_RUNTIME itself.
  Sentry.init({
    dsn: env.SENTRY_DSN,

    // Distinguishes production from preview deployments in the Sentry UI.
    // Vercel sets VERCEL_ENV to production | preview | development.
    environment: process.env.VERCEL_ENV ?? "development",

    // Never attach IP addresses, cookies, or request bodies. `scrubEvent`
    // enforces the same thing again at send time — this flag is the policy,
    // that function is the guarantee.
    sendDefaultPii: false,

    // Errors only. Performance tracing would sample every request and is
    // redundant with Speed Insights, which already reports real-user timings.
    tracesSampleRate: 0,

    beforeSend: scrubEvent,
  });
}

/**
 * Next.js calls this for every server-side error (App Router routes, server
 * components, route handlers). `captureRequestError` attaches the route and
 * request context that a bare `captureException` would lose.
 *
 * The event still passes through `beforeSend`, so the scrubbing applies here
 * exactly as it does anywhere else.
 */
export const onRequestError = Sentry.captureRequestError;
