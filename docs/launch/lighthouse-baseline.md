# Lighthouse Baseline — Production

> **Purpose:** The first real measurement of the PRD's Lighthouse targets against live production, what passes, what does not, and why one target is currently unreachable by design.
> **Applies to:** engineering working on performance, and founders deciding whether the remaining gaps block launch.
> **Classification:** Internal.

---

## Responsibilities

Owns the recorded Lighthouse numbers and their interpretation. Does not own the targets themselves ([`../product/prd.md`](../product/prd.md) §6), the CI gate that will eventually enforce them ([`../../.claude/context/deployment.md`](../../.claude/context/deployment.md), E1.2.4 — not yet built), or the CSP decision this report runs into ([`../security/security-headers-and-csp.md`](../security/security-headers-and-csp.md)).

## Why this exists

The targets — **Performance 95+, Accessibility / SEO / Best Practices 100** — have been written down since the PRD and were never measured. The CI gate that would enforce them (E1.2.4) is still unbuilt, so "unverified" was the honest status and stayed that way through launch preparation. This is the first actual run.

## Method

Lighthouse CLI against **`https://orgofin.com`** (real production, not a local build), 2026-07-27, six representative routes.

**Mobile is the graded configuration** — it is Lighthouse's default, it is the harsher one (4× CPU throttle, slow 4G), and it is what Google's page-experience signals reflect. Desktop is recorded for contrast, not as the pass/fail number.

## Results

### Mobile — the graded run

| Route            | Perf   | A11y    | Best Practices | SEO     | LCP   | TBT    |
| ---------------- | ------ | ------- | -------------- | ------- | ----- | ------ |
| `/`              | **91** | 100     | **96**         | 100     | 3.3 s | 140 ms |
| `/platform`      | **91** | 100     | **96**         | 100     | 3.4 s | 90 ms  |
| `/products`      | **93** | 100     | **96**         | 100     | 3.1 s | 100 ms |
| `/company-brain` | 98     | 100     | **96**         | 100     | 2.4 s | 80 ms  |
| `/investors`     | **93** | 100     | **96**         | 100     | 3.2 s | 80 ms  |
| `/privacy`       | 98     | 100     | 100            | 100     | 2.4 s | 40 ms  |
| **Target**       | **95** | **100** | **96**         | **100** | —     | —      |

### Desktop

Performance **100 on every route**, LCP 0.3–0.7 s, TBT 0 ms. Accessibility and SEO 100; Best Practices matches mobile (96, except `/privacy` at 100).

## What passes

**Accessibility 100 and SEO 100 on every route, both form factors.** Two of the four targets are met outright, and the accessibility number is independently corroborated — an axe WCAG 2.0/2.1 A+AA sweep across 13 routes × both themes reports 0 violations.

Cumulative Layout Shift is **0 everywhere**. Desktop performance is perfect.

## What does not — and why

### 1. Best Practices 96 — a deliberate CSP trade-off, not a defect

Every content route loses exactly 4 points to a single audit, `inspector-issues`, reporting one item: **`Content security policy`**.

The cause is `script-src 'unsafe-inline'` in [`next.config.ts`](../../next.config.ts). That is not an oversight — it is the recorded decision in [`../security/security-headers-and-csp.md`](../security/security-headers-and-csp.md): a nonce-based CSP forces dynamic rendering, which would cost the static generation the performance target depends on. The app ships two inline scripts it controls (the pre-paint `ThemeScript` and the escaped JSON-LD blob) plus GA4's bootstrap.

**So two PRD targets were in direct conflict:** Best Practices 100 requires removing `'unsafe-inline'`; Performance 95+ is currently underwritten by the static rendering that keeping it allows.

> **Resolved 2026-07-28 (founder decision):** keep static rendering, **accept 96**, and amend the PRD target to match. The PRD now reads Best Practices **96+** ([`../product/prd.md`](../product/prd.md) §6, with the reasoning recorded inline). The four points were a lab-score checkbox, not a user-facing win. **96 is now a floor, not a ceiling to relax further.**

The documented path out is hash-based CSP: hashes (unlike nonces) do not force dynamic rendering, so in principle both targets can be met. That work is unscoped and, after this decision, no longer urgent.

> **Unexplained:** `/privacy` scores 100 while every other route scores 96, though the CSP header is identical site-wide and both `ThemeScript` and the JSON-LD blob are in the root layout. Consistent across mobile and desktop runs, so it is structural rather than flaky. Worth understanding before anyone tries to fix the 96 — whatever `/privacy` does differently is the answer.

### 2. Mobile performance 91–93 on four routes

Below the 95 target, though not badly. The audits, in order of estimated saving:

| Audit                     | Detail                                                  |
| ------------------------- | ------------------------------------------------------- |
| `unused-javascript`       | ~43 KiB on `/`, est. 150 ms                             |
| `legacy-javascript`       | ~14 KiB — transpiled output modern browsers do not need |
| `network-dependency-tree` | request chain depth before first paint                  |
| `render-blocking`         | stylesheet in the critical path                         |
| `forced-reflow`           | on `/` only — a layout read/write interleave            |

LCP is the binding metric: **3.1–3.4 s on the failing routes vs 2.4 s on the two that pass**. The pattern is clear — the two routes at 98 (`/company-brain`, `/privacy`) are the ones with the least JavaScript. This is a bundle problem, not a server or image problem (CLS is 0 and there is no image-weight finding anywhere).

## Investigated 2026-07-30 — the two obvious causes are already ruled out

Before launch, the mobile gap was re-examined to decide whether it was a **defect** (fix now) or an **optimization** (schedule). It is an optimization. The two structural explanations anyone would reach for first are both already handled:

- **Framer Motion is already on the light path.** `LazyMotionProvider` loads only the `domAnimation` feature bundle and every primitive uses `m.*`, with `strict` enabled so a full `motion.*` import throws rather than silently restoring the heavy bundle. There is nothing to win here.
- **The d3-force graph is already code-split and gated.** `CompanyBrainGraphLazy` mounts it via `next/dynamic` with `ssr: false`, only once the frame is within 320 px of the viewport, with the aspect ratio reserved up front — which is why CLS is 0 rather than merely low.

So the remaining `unused-javascript` is **spread across the framework and page chunks, not concentrated in one avoidable import**. There is no single change that closes the gap.

The one untried build-configuration lever is a **`browserslist` targeting modern browsers**, aimed at the ~14 KiB `legacy-javascript` finding. It was deliberately **not** taken before launch: it changes the compiled output for _every_ visitor, its blast radius is "older browsers silently break", and the browser-matrix check that would catch that ([`launch-playbook.md`](./launch-playbook.md) → Quality) has not been run. Trading an unbounded compatibility risk for ~4 lab points on a metric whose desktop score is already 100 is the wrong side of that bet in a launch week. **Do it after launch, behind the browser matrix.**

## Current Status

**Measured for the first time 2026-07-27, against production.** Three of four targets (Accessibility, SEO, and — after the 2026-07-28 amendment — Best Practices) are now met on every route. Mobile performance is 91–98, short of 95 on four of six routes; desktop is 100 throughout. **Mobile performance is the one remaining gap against the PRD, and it is a known, measured, non-blocking one** (§ above).

Nothing here is a regression — it is the first baseline, so it is the number everything later is compared against.

## Future Improvements

- Wire the CI gate (E1.2.4) so these are enforced rather than sampled by hand. It should assert against **these** recorded numbers first (no regression) rather than the aspirational targets, which would fail the build on day one.
- Field data over lab data: Vercel Speed Insights / CrUX reflect real devices and networks, and Lighthouse's simulated slow-4G is pessimistic for the actual audience. Treat this table as a floor.

## TODO

- [x] **Founder:** decide whether Best Practices 100 or static-rendering performance wins, given they currently conflict (§1). **Done 2026-07-28 — static rendering wins, 96 accepted, PRD §6 amended.**
- [x] **Engineering:** determine whether the mobile gap is a defect or an optimization. **Done 2026-07-30 — an optimization; motion and graph paths were already optimal, see § above.**
- [ ] **Engineering (post-launch):** try a modern `browserslist` against the `legacy-javascript` finding — **only after** the browser matrix runs, for the reason recorded above.
- [ ] **Engineering:** explain why `/privacy` scores 100 on Best Practices when every other route scores 96. Still worth knowing — it is the cheapest lead on reaching 100 without touching the CSP — but no longer blocks a target.
- [ ] **Engineering:** re-run and update this table after any of the above, and after the CI gate exists.

## References

- [`../product/prd.md`](../product/prd.md) §6 — where the targets come from
- [`../security/security-headers-and-csp.md`](../security/security-headers-and-csp.md) — the CSP trade-off §1 runs into
- [`production-readiness-review.md`](./production-readiness-review.md) — P-01, the "unverified" this closes

## Related Documents

- [`launch-playbook.md`](./launch-playbook.md)
- [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md)

---

**Last Updated:** 2026-07-30 (mobile gap triaged as an optimization, not a defect; `browserslist` deliberately deferred past launch)
**Owner:** Orgofin Engineering (TODO: assign a DRI)
