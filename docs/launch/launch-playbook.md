# Launch Playbook — Orgofin Website

> **Purpose:** The operational plan to take the Orgofin website from internal-only to public launch and keep it healthy through the first month — pre-launch, launch-day, first-week, and first-month checklists, a disaster-recovery plan, and Orgofin-specific growth ideas.
> **Applies to:** founders and engineering running the launch.
> **Classification:** Internal.

---

## Responsibilities

Owns the launch sequence and early-operations checklists. Depends on [`production-readiness-review.md`](./production-readiness-review.md) (what must be true to launch) and [`../security/security-audit-report.md`](../security/security-audit-report.md) (security blockers). Ongoing steady-state operations live in [`../operations/operating-the-website.md`](../operations/operating-the-website.md); monitoring detail in [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md).

---

## Pre-Launch Checklist

Nothing below is optional for a _public_ launch. Group owners in brackets.

> **Every `[Founder]` item is also indexed in [`founder-inputs.md`](./founder-inputs.md)**, grouped by what it blocks rather than by checklist section. Use that file to work through founder-side items; use this one to sequence the launch.

### Blockers (from the readiness review + security audit)

- [x] **Assets:** `public/og/default.png` + `public/brand/logo.png` committed and serving `200` on the apex. Social-card _render_ still to verify in the debuggers (P-02). [Eng]
  > **Path changed 2026-07-27.** The brand assets moved into `public/brand/` with the new mark, so `/logo.png` now **404s** and `/brand/logo.png` is the live URL. This line said `/logo.png` until 2026-07-30. Nothing in the app was broken by the move — `lib/seo/structured-data.ts` and `app/manifest.ts` both point at `/brand/…` — but any external reference (a press kit, an old social post, a partner listing) written against the old path is dead. Re-verified 2026-07-30: `/og/default.png` **200**, `/brand/logo.png` **200**, `/logo.png` **404**.
- [x] **Domain:** `orgofin.com` live in Vercel, DNS + TLS valid, `www`→apex **308** working, `NEXT_PUBLIC_SITE_URL=https://orgofin.com` set in Production; canonicals/OG resolve to the apex (verified 2026-07-19). [Founder+Eng]
- [x] **Security headers + CSP** live: CSP, HSTS (preload), `X-Frame-Options: DENY`, nosniff, Referrer/Permissions-Policy (`next.config.ts`). Confirm Grade A on securityheaders.com at launch. [Eng]
- [x] **Rate limiting + bot protection** shipped app-layer (per-IP in-memory limiter + honeypot on both routes). Edge upgrade (Upstash/Cloudflare + Turnstile) recommended — security audit H-02/M-02/M-04. [Eng]
- [x] **Brand experiment graduated** (2026-07-18): Cobalt Prime folded into `globals.css`; `brands.css`, `BrandSwitcher`, and `.env.development`/`NEXT_PUBLIC_BRAND_SWITCHER` deleted. Confirm the flag is also unset in Vercel Preview/Production envs. [Eng]

### Data & backend

- [ ] Waitlist migration applied to prod Supabase; test signup lands in the **prod** table. [Eng]
- [ ] Data-room decision: if in launch scope, migration applied + private bucket created + `SUPABASE_SERVICE_ROLE_KEY` set + `storagePath` flipped; else confirm graceful "in preparation" state. [Founder+Eng]
- [ ] Only competitor-safe collateral (deck/one-pager) in the data-room catalog (M-01 discipline). [Founder]
- [ ] Lead-table backup/export configured; Supabase plan backup/PITR coverage confirmed. [Eng]
- [x] All Production env vars present and correctly scoped (Supabase prod, GA4, site URL, Sentry). [Eng] — **verified 2026-07-30, each by observing its effect in production rather than by reading the Vercel dashboard**, so the check proves the value is both set _and_ working: `NEXT_PUBLIC_SITE_URL` (canonicals/OG resolve to the apex), Supabase URL + service-role key (`/api/health/retention` returns `healthy` — that path runs Next → env → Supabase → RPC), `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`G-JJ0EPH3TVF` present in the served client chunks), `SENTRY_DSN` (an event reached the Sentry project on 2026-07-29).

### Quality

- [x] CI green on `main`; `npm audit` clean. [Eng] — **verified 2026-07-30.** Latest `main` run (`#148` merge) **success**. `npm audit --omit=dev --audit-level=high` → **0 vulnerabilities**, which is the merge-blocking gate.
  > **A bare `npm audit` reports 9 high findings, and that is expected — do not treat it as a launch blocker.** All nine resolve to one advisory chain (`brace-expansion`/`minimatch` via `@eslint/config-array` and `@eslint/eslintrc`) reaching the tree only through **ESLint 9 devDependencies**. None of it ships to a visitor. npm's only offered remedy is ESLint 10, a semver-major flat-config break already attempted and closed as **#84**. This is exactly why `ci.yml` runs two audits — blocking on `--omit=dev`, advisory-only on the full tree.
- [x] ~~Manual Lighthouse baseline recorded~~ — **done 2026-07-27** against production: [`lighthouse-baseline.md`](./lighthouse-baseline.md). A11y **100** and SEO **100** on every route; desktop perf **100**. Two gaps: mobile perf 91–93 on four routes, and Best Practices capped at **96** by the deliberate `unsafe-inline` CSP — a target that currently conflicts with the static-rendering performance target and needs a founder call. [Eng]
- [x] ~~Manual axe pass~~ — **done 2026-07-27**: axe WCAG 2.0/2.1 A+AA across **13 routes × both themes, 0 violations**, corroborating Lighthouse a11y 100. Still run by hand; the CI step (E1.2.3) is unbuilt. [Eng]
- [ ] Browser matrix pass: iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari/Edge, 320px width. [Eng]
- [ ] All copy proofread; no `TODO`/placeholder/fabricated business facts visible (founder names, traction, pricing). [Founder]

### Analytics & monitoring (see monitoring doc)

- [x] GA4 **property live** — measurement ID `G-JJ0EPH3TVF` is present in the client chunks served from production (verified 2026-07-30). [Eng]
- [ ] GA4 **events** (`waitlist_submit`, data-room unlock) confirmed firing in prod. [Eng] — **not yet observed, and it cannot be checked passively:** GA4 only loads after the consent banner is accepted, so realtime correctly shows nothing until someone accepts. Needs one deliberate consented run-through on the live site. Do this at **T-30m** on launch day, where the playbook already schedules it.
- [x] Error tracking (Sentry) wired with PII scrubbing. [Eng] — done 2026-07-28, **server-side only** and inert until `SENTRY_DSN` is set. Scope, the PII guarantee, and why there is no browser SDK: [`../operations/error-monitoring.md`](../operations/error-monitoring.md).
- [x] Create the Sentry project and set `SENTRY_DSN` in Vercel. [Founder] — **done; proven end to end 2026-07-29**, not merely configured. A deliberately-thrown error on a preview deploy produced a real Sentry issue, and four seeded PII markers (one per branch of `scrubEvent`) were **all absent** from it. The `x-leak-marker` header case is the one that carries weight: no blocklist could have anticipated that name, so its absence is direct evidence the **allowlist** works. See [`../operations/error-monitoring.md`](../operations/error-monitoring.md).
- [x] ~~Uptime monitor (Better Stack/UptimeRobot)~~ — **live 2026-07-27**, watching `/` and `/api/health/retention`. The second is the retention alarm: it returns 503 once no purge has succeeded for 48 hours, so an ordinary uptime alert is the mechanism and nothing extra needed configuring ([`../deployment/data-retention.md`](../deployment/data-retention.md)). [Eng]
  > **`/api/waitlist` is deliberately NOT monitored.** This line used to list it; a GET returns **405** (the route is POST-only), so a standard monitor reads it as permanently down and the alert trains you to ignore it. Nothing is lost — `/api/health/retention` exercises a strictly longer path: Next runtime → env vars → Supabase → RPC. If you do want it watched, configure the monitor to expect 405 rather than 2xx.
- [x] Alert routing (email/Slack) configured and test-fired. [Eng] — **done 2026-07-29, and the test-fire was real rather than simulated.** Sentry's project-default issue alert ("Send a notification for high priority issues") fired on the verification event above at 05:56 UTC and the founder **received the email** from `noreply@md.getsentry.com`. The full chain is confirmed: server error → `onRequestError` → scrubbed event → issue → rule → inbox.
  > Two properties were reviewed and **deliberately kept**: the condition is "high priority" rather than "new issue", and environments is "All". Both are intentional — do not tighten them without a decision to revisit. The alert's destination is still _derived_ ("Suggested Assignees, else Recently Active Members") rather than a named recipient; pinning it is optional hardening, not a launch blocker.

### Legal/compliance

- [x] Privacy policy published (covers lead PII; DPDP-aware, India-first) — `/privacy`, 2026-07-24. **Pending counsel review** ([`../legal/README.md`](../legal/README.md)). [Founder/Eng]
- [x] Cookie/analytics consent posture decided (GA4) **and reflected on site** — banner shipped 2026-07-24; GA4 loads only on acceptance. Note for the launch-day analytics checks: GA4 realtime will only show visitors who accepted. [Founder+Eng]
- [x] Terms page present — `/terms`, 2026-07-24. [Founder/Eng]
- [x] `/contact` published (2026-07-25) and serving `200`. Both legal pages and the contact page resolve to the same address, `contact@orgofin.com`, from a single constant (`lib/site/contact.ts`) imported by both — so a published policy can never name a channel the contact page doesn't. [Eng]

### Go/No-Go

- [x] **Rollback procedure known.** [Eng] — deliberately **not** a recorded SHA; the target is derived at the moment it is needed. Run `npm run rollback-target`, which prints the commit currently in production, the one to roll back to, and the steps below.

  **To roll back:**

  1. **Vercel → Deployments → filter Production.** The entry directly below **Current** is the target. Use **Promote to Production** — promoting an existing build is faster than reverting and redeploying, and that build has already been verified once.
  2. Cross-check the commit identity against `npm run rollback-target`. **Vercel's list is authoritative** — it contains only deployments that actually built, whereas `main` could in principle carry a commit whose deploy failed. If the two disagree, trust Vercel.
  3. Re-run the production sweep afterwards (below).

  > **Why there is no SHA written here.** There was one, twice, and it was wrong both times. It goes stale on **every** promotion, not just the launch deploy — and a stale pointer that still carries its own "verified in production" timestamp reads as a current, checked fact rather than an old one. Correcting it by hand cost a full four-PR promotion cycle on 2026-07-30 (#156) and again on 2026-08-01 (#165). A value that must be re-verified every cycle to stay true is a procedure wearing a value's clothing, so it is now written as the procedure it always was.
  > The route sweep reads the route list out of the live `sitemap.xml` rather than a list typed from memory — a hardcoded list can only confirm what you already believed, and cannot notice a route that disappeared. Same principle, same reason.

- [ ] On-call/owner for launch window named and reachable. [Founder+Eng]
- [ ] Final go/no-go sign-off. [Founder]

---

## Launch Day Checklist (hour-by-hour)

Assumes launch at **T-0**. Adjust to your timezone; keep the window during working hours for your team.

| Time    | Action                                                                                                                                                 | Owner       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| T-24h   | Freeze non-essential changes. Final CI green on `main`. Re-verify domain/TLS/headers.                                                                  | Eng         |
| T-2h    | Deploy the launch build to Production. Smoke test: home, all nav pages, waitlist submit, data-room gate, 404, dark mode.                               | Eng         |
| T-1h    | Run the security post-deploy smoke (header check + RLS probe). Confirm monitoring/alerts live.                                                         | Eng         |
| T-30m   | Verify GA4 realtime shows your own test traffic — **accept the consent banner first**, or it correctly shows nothing. Confirm uptime monitor is green. | Eng         |
| **T-0** | **Flip public / announce.** Submit sitemap in Search Console. Post launch announcements.                                                               | Founder+Eng |
| T+15m   | Watch GA4 realtime + Sentry + uptime for the first real traffic. Confirm signups land in prod table.                                                   | Eng         |
| T+1h    | Check error rate, p95 latency, any 4xx/5xx spikes. Confirm no rate-limit false-positives on real users.                                                | Eng         |
| T+3h    | Review first analytics: traffic sources, top pages, waitlist conversion. Respond to inbound.                                                           | Founder+Eng |
| T+6h    | Second smoke test. Check Search Console for crawl activity. Triage any bug reports.                                                                    | Eng         |
| EOD     | Retro note: what broke, what surprised you, what to fix tomorrow. Confirm backups ran.                                                                 | Founder+Eng |

**Break-glass during launch:** if error rate spikes or the site is down → **roll back immediately** (Vercel: promote last known-good deployment) before debugging. A rollback buys time; the fix is a follow-up PR.

---

## First Week Checklist (monitor)

- [ ] **Daily:** uptime, error rate (Sentry), traffic + waitlist conversion (GA4), Search Console coverage/crawl errors.
- [ ] Watch for **abuse**: bot signups, data-room scripting, rate-limit hits — tune thresholds to avoid blocking real users.
- [ ] Confirm the sitemap is indexed and the home page appears for `site:orgofin.com`.
- [ ] Verify Core Web Vitals with **field data** (GA4/CrUX) once real traffic exists, not just lab Lighthouse.
- [ ] Triage and fix any launch bugs via fix-forward PRs (no hotfixing straight to prod outside the pipeline).
- [ ] Review lead quality (real vs junk) and export leads to the owner-controlled store.
- [ ] Respond to every inbound (waitlist replies, investor data-room requests) within the promised 48h.

---

## First Month Checklist (operational)

- [ ] **Weekly:** dependency updates (Dependabot PRs), `npm audit`, review analytics trends, review error backlog.
- [ ] Establish a regular content/update cadence (see growth ideas) if a blog/changelog is in scope.
- [ ] Review and tune rate limits / WAF rules against real traffic patterns.
- [ ] Run the full security manual checklist once with real production config (post-domain).
- [ ] Confirm backups are running and **test a restore** (a backup you haven't restored is a hope, not a backup).
- [ ] Review SEO: rankings for brand + category terms, backlinks, Search Console performance.
- [ ] Revisit the data-room decision: is instant-unlock still right, or is inbound volume/sensitivity high enough to warrant magic-link verification (M-01 upgrade)?
- [ ] Retro: what would you change about the launch; update this playbook accordingly.

---

## Disaster Recovery Plan

### Rollback strategy

- **Primary:** Vercel keeps every deployment immutable. Roll back by promoting the last known-good deployment (Dashboard → Deployments → ⋯ → Promote to Production, or `vercel rollback`). Instant, no rebuild.
- **Then** open a fix-forward PR for the actual bug. A rollback is a tourniquet, not a cure.
- **Config regressions** (bad env var, bad header): fix the value in Vercel and redeploy; if the build itself is bad, roll back first.

### Incident handling (define the DRI — currently a TODO)

1. **Detect** — alert fires (uptime/error-rate/latency) or a human reports it.
2. **Assess severity** — Sev1 (site down / data at risk), Sev2 (major feature broken), Sev3 (minor).
3. **Mitigate first** — roll back or enable Cloudflare "Under Attack" mode if under abuse; stop the bleeding before diagnosing.
4. **Diagnose** — logs (Vercel/Sentry), recent deploys, recent config changes.
5. **Fix** — fix-forward PR through CI.
6. **Communicate** — status to founders/affected users; if a status page exists, update it.
7. **Post-mortem** — blameless write-up: timeline, root cause, action items. File as an incident doc.

### Communication

- **Internal:** a dedicated channel (Slack/WhatsApp) for launch + incidents; the DRI drives updates.
- **External:** for user-visible outages, a short honest status note (email to waitlist / social) beats silence. For investor data-room issues, the founder follows up directly.

### Backups & recovery

- **Code:** GitHub is the source of truth; every deploy is reproducible from a commit.
- **Data (leads):** rely on Supabase backups/PITR (confirm plan coverage) **plus** an independent periodic export (CSV/`pg_dump`) to an owner-controlled store — so a Supabase-side problem or accidental deletion is recoverable.
- **Secrets:** stored in Vercel; keep an offline record of _which_ secrets exist and where to regenerate them (not the values), so a lost account can be rebuilt.
- **Recovery test:** at least once in the first month, restore a backup into the non-prod project and confirm integrity.

### Specific scenarios → response

| Scenario                     | Immediate response                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| Site down / bad deploy       | Roll back to last good deployment; then fix-forward.                                 |
| Vercel outage                | Nothing to deploy against — monitor Vercel status; comms to stakeholders; wait.      |
| Supabase outage              | Forms degrade gracefully (friendly error). Comms; queue signups return when back.    |
| Cloudflare outage            | Switch DNS to "DNS only" (bypass proxy) if it's the proxy failing; monitor status.   |
| Under active bot attack/DDoS | Cloudflare "Under Attack" mode; tighten rate limits; block offending ASNs/IPs.       |
| Leaked service-role key      | Rotate the key in Supabase immediately; update Vercel; redeploy; audit access logs.  |
| Accidental data deletion     | Restore from PITR/export into non-prod, verify, then promote.                        |
| Expired domain / DNS         | Renew immediately; keep auto-renew on; DNS records documented in the domain runbook. |

---

## Unique Growth Ideas (Orgofin-specific)

Not generic marketing — ideas that fit an **India-first, AI-agent-native Enterprise OS** launching with HRMS, targeting SME founders/CFOs/HR heads and investors. Prioritized for fit.

### Tier 1 — highest fit, do first

1. **Founder-led "build in public" on the Company Brain thesis.** The strongest asset is the _narrative_ ("build the brain first, products emerge from it"). Serialize the thesis — fragmentation tax, the six moats, India-compliance depth — as founder posts on LinkedIn/X. This is where Indian SME founders and B2B investors actually are.
2. **The "Fragmentation Calculator" interactive demo.** A small interactive tool: "How many SaaS tools does your company run? What's your per-employee SaaS spend?" → shows the fragmentation tax vs. a unified Company Brain. Highly shareable, captures a qualified lead, and dramatizes the core problem. Fits the site's existing form/analytics infra.
3. **India-compliance content moat.** Publish genuinely useful technical/regulatory explainers (PF/ESI, GST e-invoicing, Form 16/24Q, DPDP for HR data). This is real expertise, ranks for high-intent SME queries, and demonstrates the compliance depth that is Moat #3.
4. **CA/CS partner waitlist.** Moat #6 is the 350,000-CA distribution channel — start it now with a dedicated partner interest form. Early CA advocates become a launch flywheel.

### Tier 2 — strong, sequence after Tier 1

5. **Waitlist with referral mechanics.** Position on the waitlist improves by referring peers (a la classic B2C waitlists, applied to B2B founders). Adds a viral coefficient to an audience that talks to each other.
6. **"Agent of the week" teardown series.** Show a concrete AI agent doing a real HR/finance task end-to-end (payroll run, offer-letter generation, compliance filing). Makes AGaaS tangible instead of abstract.
7. **Design-partner cohort.** Recruit 10–20 SMEs as named design partners with white-glove onboarding; their logos + quotes become the traction the company currently lacks (per the open TODOs in `company.md`).
8. **Enterprise/BFSI outreach track.** The highest-ARPU segment. Targeted 1:1 outreach + a security/compliance one-pager (this repo's security docs are an asset here) rather than broad marketing.

### Tier 3 — opportunistic

9. **AI/dev community presence.** Since the product is agent-native, a technical audience cares — a well-written engineering post on _how_ the Company Brain graph or agent orchestration works (once built) earns credibility on HN / AI communities.
10. **Launch sequencing across geographies.** India → UK South-Asian SMBs → US India-ops companies mirrors the ICP order; sequence announcements and localized landing content accordingly rather than one global blast.
11. **Investor-update loop as content.** Turn monthly investor updates into (redacted) public progress notes — compounding proof-of-momentum that also feeds the data-room narrative.

**Measurement:** every idea ties to the existing typed analytics vocabulary (waitlist_submit, cta_click, data_room_request) — extend the union rather than adding ad-hoc events, so growth stays measurable and PII-free.

---

## Current Status

Playbook drafted 2026-07-18 for the first public launch. Pre-launch blockers are tracked in the readiness review and security audit. No launch date set.

## Future Improvements

After the first launch, convert this into a reusable template and record actuals (what the launch-day timeline really looked like) for the next major release.

## TODO

- [ ] Assign a launch DRI and an incident DRI.
- [ ] Set the launch date once pre-launch blockers clear.
- [ ] Stand up a status/comms channel.

## References

- [`production-readiness-review.md`](./production-readiness-review.md)
- [`../security/security-audit-report.md`](../security/security-audit-report.md)
- [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md)
- [`../operations/operating-the-website.md`](../operations/operating-the-website.md)
- [`docs/deployment/README.md`](../deployment/README.md), [`docs/deployment/custom-domain-setup.md`](../deployment/custom-domain-setup.md)

## Related Documents

- [`docs/product/company.md`](../product/company.md) — business facts behind the growth ideas.

---

**Last Updated:** 2026-08-02 (rollback target is now derived, not recorded)
**Owner:** Orgofin Founders + Engineering (TODO: assign DRIs)

> **On the ticks in this file.** Each `[x]` added on 2026-07-30 was set by observing the behaviour in production, not by reading a previous version of this document. That distinction matters: the `/logo.png` line had been ticked and true when written, and was silently false for three days after the asset moved. **When you tick something here, record how you checked it** — a checklist that carries claims forward is how a launch ships on stale confidence.
