# Error Monitoring — Sentry

> **Purpose:** What Sentry is wired to on this site, what it deliberately does **not** watch, and how the PII promises in `/privacy` are enforced in code rather than by convention.
> **Applies to:** engineering operating the site, and anyone auditing what a third party receives when something breaks.
> **Classification:** Internal.

---

## Responsibilities

Owns the Sentry integration: its scope, its consent posture, and its scrubbing guarantees. Does not own analytics ([`monitoring-and-analytics.md`](./monitoring-and-analytics.md)), uptime checks (same file), the retention health endpoint ([`../deployment/data-retention.md`](../deployment/data-retention.md)), or the environment-variable inventory ([`../deployment/environment-variables.md`](../deployment/environment-variables.md)).

## What is instrumented

**Server-side only.** API routes, route handlers, and server components — via [`src/instrumentation.ts`](../../src/instrumentation.ts) and Next's `onRequestError` hook.

The failure this exists to catch is a **waitlist or data-room submission that 500s**. That is a lead lost silently: the visitor sees a generic error, and nothing else in the stack would tell anyone it happened. Uptime monitoring answers "is the site up", not "did that POST succeed".

## What is deliberately NOT instrumented

**There is no browser SDK.** This is a considered trade, not an oversight.

The Sentry browser SDK costs roughly **40 KB gzipped** on the client. When this was wired (2026-07-28), mobile Performance — 91–93 against a 95 target — was the **only** remaining gap against the PRD ([`../launch/lighthouse-baseline.md`](../launch/lighthouse-baseline.md)), and `unused-javascript` was already the top offender in that baseline. Spending the site's one failing metric on browser crash reports is the wrong trade for a marketing site whose client-side surface is animation, not application logic.

Two consequences worth stating plainly:

- **Client-side crashes are not reported.** A React error boundary firing in a visitor's browser is invisible to us. The mitigation is that `error.tsx` / `global-error.tsx` already degrade gracefully, and the interactive surface is presentational.
- **It raises no consent question.** With no third-party browser script, there is nothing to gate — unlike Speed Insights, which had to be consent-gated to keep `/privacy` honest. Server-side error monitoring is operational logging, not analytics.

## The PII guarantee

`/privacy` publishes two promises that an error monitor is the single most likely thing to break:

> "No logging of what you type into a form. If a submission fails, we record the technical error, never the contents."
> "No cookies of our own."

The first is not an aspiration — it is a literal description of [`src/lib/observability/scrub.ts`](../../src/lib/observability/scrub.ts), which runs as Sentry's `beforeSend` hook. It is a **pure, unit-tested function** rather than an inline lambda in the init call, precisely because a regression would falsify a legal page silently, inside a system nobody reads until an incident is already underway.

| Removed                                       | Why                                                                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `request.data`                                | The submitted form body — name, work email, company. Dropped wholesale, never inspected.                                               |
| `request.query_string` + any query on the URL | A routine accidental PII carrier.                                                                                                      |
| `request.cookies`                             | Identity.                                                                                                                              |
| Headers outside an allowlist                  | `cookie`, `authorization`, `x-forwarded-for` all carry identity.                                                                       |
| `event.user`                                  | Sentry's IP inference. `sendDefaultPii: false` should prevent it; this removes it again so it stays gone if that flag is ever flipped. |

| Kept                            | Why                                                             |
| ------------------------------- | --------------------------------------------------------------- |
| URL path, HTTP method, status   | Without a path the report is not actionable.                    |
| Stack trace and exception value | This is the "technical error" `/privacy` says we **do** record. |

Headers are handled as an **allowlist, not a blocklist** — a header introduced by a future proxy is excluded by default rather than leaking until someone notices. Nine tests in [`scrub.test.ts`](../../src/lib/observability/scrub.test.ts) assert this against a realistic waitlist payload, including a full-payload serialization check that no seeded value survives anywhere.

## Configuration

| Variable     | Scope                           | Required?                              |
| ------------ | ------------------------------- | -------------------------------------- |
| `SENTRY_DSN` | Server (**not** `NEXT_PUBLIC_`) | No — the integration no-ops without it |

Env-gated exactly like GA4 and Supabase: `.optional()` in [`src/env.ts`](../../src/env.ts), and `register()` returns early when unset. **CI and local builds therefore need no Sentry project**, and turning monitoring on in production is a Vercel environment-variable change, not a deploy.

`environment` is taken from `VERCEL_ENV`, so production and preview separate in the Sentry UI. `tracesSampleRate` is **0** — performance tracing would sample every request and is redundant with Speed Insights, which already reports real-user timings.

## Design Decisions

**`withSentryConfig` is not used.** The Sentry Next.js plugin wraps `next.config.ts` — the file that carries the CSP and is load-bearing for the static rendering the performance target depends on. The plugin's main benefit here is source-map upload, a debuggability nicety rather than a correctness one. Registering the SDK directly leaves that config untouched. **The cost is real:** server stack traces reference built output rather than original sources. Recorded below rather than absorbed silently.

**Scrubbing lives in `lib/observability/`, not inline.** Testability was the whole point — see the PII guarantee above.

## Current Status

**Wired 2026-07-28, server-side only, and inert until `SENTRY_DSN` is set in Vercel.** Verified at build time that **zero** Sentry code reaches the client bundle (`grep` over `.next/static/chunks` returns nothing) while it is present in the server and edge builds. All routes remain statically prerendered.

## Future Improvements

- Revisit the browser SDK once the mobile performance gap closes or the target is re-baselined. If it is ever added it **must** be consent-gated, like Speed Insights, for the reasons in that component's header comment.
- Alert routing: a Sentry project with no notification rule is an untested control, exactly like an uptime monitor that has never fired.

## TODO

- [ ] **Founder:** create the Sentry project and set `SENTRY_DSN` in Vercel (Production scope first). Until then this is inert.
- [ ] **Engineering:** configure a Sentry alert rule and **test-fire it**, then record here what it routes to.
- [ ] **Engineering:** revisit source-map upload — either adopt `withSentryConfig` deliberately, having re-checked it does not disturb the CSP or static rendering, or upload maps out-of-band. Until then, server stack traces point at built output.
- [ ] **Engineering:** once a DSN exists, verify end-to-end by forcing a server error on a preview deploy and confirming the event arrives **with the body absent** — the scrubbing is unit-tested, but it has never been observed against a real Sentry ingest.

## References

- [`src/instrumentation.ts`](../../src/instrumentation.ts) — registration, and why there is no browser SDK
- [`src/lib/observability/scrub.ts`](../../src/lib/observability/scrub.ts) — the `beforeSend` scrubbing
- [`../launch/lighthouse-baseline.md`](../launch/lighthouse-baseline.md) — the performance gap that decided the scope

## Related Documents

- [`monitoring-and-analytics.md`](./monitoring-and-analytics.md)
- [`../deployment/environment-variables.md`](../deployment/environment-variables.md)
- [`../launch/launch-playbook.md`](../launch/launch-playbook.md)

---

**Last Updated:** 2026-07-28
**Owner:** Orgofin Engineering (TODO: assign a DRI)
