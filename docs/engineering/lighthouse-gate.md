# The Lighthouse CI Gate — what it enforces, and what it deliberately does not

> **Purpose:** Explains which Lighthouse thresholds are enforced in CI, which are not, and why the two lists differ. Written because a green CI run must not be mistaken for "the PRD performance target is met".
> **Applies to:** anyone reading a Lighthouse CI failure, or tempted to change a threshold in [`lighthouserc.json`](../../lighthouserc.json).

---

## Responsibilities

Owns the reasoning behind the gate's thresholds. Does not own the measured production scores — those are [`../launch/lighthouse-baseline.md`](../launch/lighthouse-baseline.md) — nor the targets themselves, which are [`../product/prd.md`](../product/prd.md) §6.

---

## The gate

Configured in [`lighthouserc.json`](../../lighthouserc.json), run as the last step of `ci.yml`, against a production build on `/` and `/platform` (three runs each, median).

| Assertion                      | Level     | Threshold | Why this level                                                                                      |
| ------------------------------ | --------- | --------- | --------------------------------------------------------------------------------------------------- |
| `categories:accessibility`     | **error** | 1.00      | Deterministic. Met on every route, and independently corroborated by the axe sweep in the same job. |
| `categories:seo`               | **error** | 1.00      | Deterministic. Met on every route.                                                                  |
| `categories:best-practices`    | **error** | 0.96      | The **amended** PRD target — see below.                                                             |
| `categories:performance`       | **warn**  | 0.95      | Hardware-dependent. See below — this is the important one to understand.                            |
| `total-byte-weight`            | **error** | 600 KiB   | Deterministic; currently 511 KiB.                                                                   |
| `resource-summary:script:size` | **error** | 400 KiB   | Deterministic; currently 314 KiB.                                                                   |

---

## Why performance is a warning, not an error

**A shared CI runner cannot measure the production performance target.** Lighthouse's performance score is a function of the CPU it runs on. The same commit scores:

- **91–98** on production (mobile, measured 2026-07-27 — [`../launch/lighthouse-baseline.md`](../launch/lighthouse-baseline.md))
- **100** on production (desktop, same run)
- **~84–85** on a local production build on a developer machine

Setting `error` at 0.95 would therefore fail every build forever, and the only available response would be to lower the threshold until it stopped complaining — which is how a gate becomes decoration. Setting `error` at a number CI can actually reach (~0.75) would assert something so weak it could not detect a real regression either.

So the performance _score_ stays a warning, keeping the 0.95 target visible in the log without producing a failure nobody can act on, and the regression detection moves to metrics that **do not depend on the runner's CPU**: total byte weight and script byte weight. Those are what actually regress when someone imports a heavy dependency, and they are the documented cause of the current shortfall — `lighthouse-baseline.md` concludes the gap is "a bundle problem, not a server or image problem".

**The PRD's 95+ target is verified against production, not here.** Re-measure per `lighthouse-baseline.md` when it matters; do not read a green CI run as evidence that it is met.

## Why best practices is 0.96 and not 1.00

Not a relaxed standard — an amended one. Reaching 100 requires removing `'unsafe-inline'` from the CSP `script-src`, which the site's static rendering currently depends on. The two PRD targets were in direct conflict, and the founders resolved it on 2026-07-28: keep static rendering, accept 96, amend the PRD. The four points were a lab-score checkbox, not a user-facing win.

**96 is a floor, not a ceiling to relax further.** The single failing audit is `inspector-issues` reporting a `Content security policy` issue, which is that exact trade-off showing up in the score. If this assertion ever fails, something _other_ than the known CSP trade-off has appeared — investigate, do not lower the number.

> `/privacy` scores 100 while every other route scores 96, with an identical site-wide CSP header. That is still unexplained (`lighthouse-baseline.md` §1) and is the thread to pull if anyone tries to reclaim the four points.

## Two audits are skipped, and only because of localhost

- **`canonical`** — every page's canonical points at `https://orgofin.com/…` while the CI document URL is `http://127.0.0.1:3000/…`. Lighthouse reads a cross-origin canonical as invalid. The tag is correct; the test environment is what differs.
- **`uses-http2`** — `next start` serves HTTP/1.1. Production is served over HTTP/2 by Vercel's CDN.

Nothing else is skipped. In particular `is-crawlable` is **not** skipped: it was considered and rejected, because it is a real SEO check that passes.

## Design Decisions

- **Gate on what the environment can actually measure.** Splitting the assertions into "deterministic → error" and "hardware-dependent → warn" is what keeps the gate honest. A threshold that must be lowered whenever it fires was never a threshold.
- **Two URLs, not all twelve.** `/` is the heaviest route (the Company Brain graph) and `/platform` is a representative content page. Twelve routes × three runs would add roughly fifteen minutes to every PR to re-measure pages that are strictly simpler than these two. Widen this if a route develops a materially different weight profile.
- **Three runs, median.** One run is noise; three is enough to stabilise the deterministic assertions without dominating job time.

## Current Status

Live in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) as of 2026-08-02 (E1.2.4). All `error` assertions pass; the performance warning fires at ~0.84–0.85 locally and is expected to fire in CI, by design.

## Future Improvements

- Revisit the `browserslist`-targeting-modern-browsers lever against the ~14 KiB `legacy-javascript` finding, once the browser matrix in [`../launch/launch-playbook.md`](../launch/launch-playbook.md) has actually been run. It was deliberately deferred before launch — it changes compiled output for every visitor and the failure mode is "older browsers silently break".
- If the byte-weight ceilings are ever raised, record _why_ here in the same change. A ceiling that drifts upward with the bundle is not a ceiling.

## TODO

- [ ] Explain why `/privacy` scores Best Practices 100 when every other route scores 96 under an identical CSP.

## References

- [`../launch/lighthouse-baseline.md`](../launch/lighthouse-baseline.md) — the measured production scores this gate is calibrated against
- [`../product/prd.md`](../product/prd.md) §6 — the targets, including the 2026-07-28 Best Practices amendment
- [`../../.claude/context/deployment.md`](../../.claude/context/deployment.md) — the CI pipeline this is the last step of

## Related Documents

- [`quality-gates-explained.md`](./quality-gates-explained.md)
- [`../../.claude/context/testing.md`](../../.claude/context/testing.md)

---

**Last Updated:** 2026-08-02
**Owner:** Orgofin Engineering (TODO: assign a DRI)
