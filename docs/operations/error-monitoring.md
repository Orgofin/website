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
| Console breadcrumbs                           | Not removed by `beforeSend` but by dropping the integration entirely — arbitrary log text cannot be scrubbed structurally. See below.  |

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

**Wired 2026-07-28, server-side only, shipped to production, `SENTRY_DSN` set in Vercel, and ingest verified end-to-end on 2026-07-29.** All routes remain statically prerendered.

### Ingest and scrubbing, verified against a real event

Performed 2026-07-29 on a **preview** deployment from a throwaway branch (never merged, deleted afterwards). A temporary route threw on POST so Next's `onRequestError` fired, carrying a genuine request through `captureRequestError` → `beforeSend` → Sentry — the same path a waitlist 500 takes. The request seeded four distinct markers, one per branch of `scrubEvent`.

**Result: the issue arrived with `environment: preview`, and none of the four markers appear anywhere in the stored event.**

| Seeded in the request   | Scrub branch under test                      | Present in the event?     |
| ----------------------- | -------------------------------------------- | ------------------------- |
| JSON body with a marker | `delete request.data`                        | **No** — no body at all   |
| `?leak=…` query string  | `delete request.query_string` + `stripQuery` | **No** — URL has no query |
| `Cookie:` with a marker | `delete request.cookies`                     | **No**                    |
| `x-leak-marker:` header | header allowlist                             | **No**                    |

The header result is the most informative of the four: `x-leak-marker` is a header no blocklist would have anticipated, so its absence is direct evidence that the **allowlist** design does what the PII-guarantee section claims. The seven headers that survived are exactly `SAFE_HEADERS`, no more.

Two things worth knowing rather than rediscovering:

- **Sentry's UI can lag.** The first check reported "no issue in Sentry" and prompted a fruitless hunt for a broken transport; the event was simply not visible yet. Give it a few minutes before concluding anything is wrong.
- **`Content-Length` is on the allowlist, so the body's _size_ is recorded** even though its contents are not. Accepted deliberately: a length is not "the contents" under any reading, and content-length is genuinely useful when diagnosing a malformed request. Noted here so it is a decision rather than an oversight.

### Console breadcrumbs are disabled

The verification above surfaced a second channel into Sentry that `beforeSend` does not cover. `scrubEvent` cleans `event.user` and `event.request`, but the Node SDK's console integration turns every server-side `console.error` into a breadcrumb — and a breadcrumb's payload is arbitrary formatted text, so it cannot meaningfully be scrubbed the way a structured `request` object can.

That was not hypothetical. [`src/lib/api/*`](../../src/lib/api/) log raw Supabase errors on failure, and a Postgres error carries submitted values in `details`: a CHECK violation renders as `Failing row contains (…, user@example.com, …)`. Nothing leaked, but only because [`waitlist.ts`](../../src/lib/api/waitlist.ts) returns early on unique-violation `23505` — the one case whose error text holds an address — _before_ reaching its `console.error`. A published promise resting on a single early return is exactly the arrangement [`scrub.ts`](../../src/lib/observability/scrub.ts) was written to replace.

The `Console` integration is therefore **filtered out of the default set** in [`src/instrumentation.ts`](../../src/instrumentation.ts) — deny-by-default, the same reasoning as the header allowlist. The cost is low: the exception and its full stack are still captured, and breadcrumbs earn their keep by reconstructing a user's journey, which a server-side-only integration does not have. `console.error` still reaches the Vercel runtime logs, where it belongs.

Four tests in [`instrumentation.test.ts`](../../src/instrumentation.test.ts) assert the filter drops `Console`, keeps the other defaults (so this never becomes a blanket opt-out), and that `sendDefaultPii` and `tracesSampleRate` stay put.

### Client-bundle verification

The claim that matters here is that the "no browser SDK" decision above is a fact about what ships, not an intention. Measured **2026-07-29 against the live production bundle** — 22 unique chunks across `/`, `/platform`, `/about`, `/privacy`, `/terms`, `/contact`, ~1.18 MB of JavaScript, searched **case-insensitively**:

| Token              | Hits | Meaning                                                       |
| ------------------ | ---- | ------------------------------------------------------------- |
| `@sentry/`         | 0    | No SDK module ever bundled.                                   |
| `captureException` | 0    | No SDK surface.                                               |
| `getCurrentHub`    | 0    | No SDK surface.                                               |
| `sentry-trace`     | 0    | No trace propagation header — consistent with no browser SDK. |
| `ingest.sentry.io` | 0    | The client never has an endpoint to talk to.                  |
| `SENTRY_DSN`       | 3    | **The variable name only — not its value.** See below.        |

The three `SENTRY_DSN` hits are all `@t3-oss/env-nextjs`, which bundles the whole `createEnv` schema — including the server half — into the client. They read `SENTRY_DSN: lg.string().url().optional()` (the schema) and `SENTRY_DSN: l.default.env.SENTRY_DSN` (a runtime property access that resolves to `undefined` in a browser). **The DSN is a lookup that fails at runtime, never an inlined literal**; no DSN-shaped string appears anywhere in the bundle. The same is true of `SUPABASE_SERVICE_ROLE_KEY` beside it. Harmless, but it means "the string `SENTRY_DSN` appears in the bundle" is the expected state and is not evidence of a leak.

**Two traps for whoever repeats this check:**

- **`grep -rl sentry .next/static/chunks` is not a valid test.** It is case-sensitive and can never match `SENTRY_DSN`; it returns nothing whether or not the SDK is present. An earlier revision of this document cited exactly that command as its verification. Right conclusion, method that could not have proved it — which is worse than no check, because it reads as settled.
- **`beforeSend` is a false positive.** It matches 8 times in production and **none of them are Sentry** — it is Vercel Speed Insights' own option, called through `window.si`. Do not treat a hit on it as an SDK sighting.

Re-run this against production (not a local build) whenever a dependency that could pull in `@sentry/*` transitively changes.

## Future Improvements

- Revisit the browser SDK once the mobile performance gap closes or the target is re-baselined. If it is ever added it **must** be consent-gated, like Speed Insights, for the reasons in that component's header comment.
- Alert routing: a Sentry project with no notification rule is an untested control, exactly like an uptime monitor that has never fired.

## TODO

- [x] **Founder:** create the Sentry project and set `SENTRY_DSN` in Vercel. Done 2026-07-28. Which environment scopes it covers is not yet recorded here — the end-to-end check below needs it on **Preview**.
- [ ] **Engineering:** configure a Sentry alert rule and **test-fire it**, then record here what it routes to. Use an **Issues** alert, not a Metrics one — `tracesSampleRate` is 0, so metric alerts would never fire. Condition: "a new issue is created", environment `production`, no rate threshold (a single 500 on a waitlist POST is the event that matters).
- [ ] **Engineering:** revisit source-map upload — either adopt `withSentryConfig` deliberately, having re-checked it does not disturb the CSP or static rendering, or upload maps out-of-band. Until then, server stack traces point at built output.
- [x] **Engineering:** verify end-to-end against a real Sentry ingest that the event arrives with the body absent. Done 2026-07-29 — see "Ingest and scrubbing, verified against a real event" above.
- [x] **Engineering:** close the breadcrumb gap. Done 2026-07-29 — the `Console` integration is filtered out; see "Console breadcrumbs are disabled" above.

## References

- [`src/instrumentation.ts`](../../src/instrumentation.ts) — registration, and why there is no browser SDK
- [`src/lib/observability/scrub.ts`](../../src/lib/observability/scrub.ts) — the `beforeSend` scrubbing
- [`../launch/lighthouse-baseline.md`](../launch/lighthouse-baseline.md) — the performance gap that decided the scope

## Related Documents

- [`monitoring-and-analytics.md`](./monitoring-and-analytics.md)
- [`../deployment/environment-variables.md`](../deployment/environment-variables.md)
- [`../launch/launch-playbook.md`](../launch/launch-playbook.md)

---

**Last Updated:** 2026-07-29
**Owner:** Orgofin Engineering (TODO: assign a DRI)
