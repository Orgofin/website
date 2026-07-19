# Production Readiness Review — Orgofin Website

> **Purpose:** A pre-public-launch assessment of everything except security (which has its own report) — SEO, performance, accessibility, indexing, configuration, caching/CDN, images, compatibility, and mobile — with concrete go/no-go findings.
> **Applies to:** engineering and founders deciding whether the site is launch-ready.
> **Classification:** Internal.

---

## Responsibilities

Owns the non-security launch-readiness assessment. Pairs with [`../security/security-audit-report.md`](../security/security-audit-report.md) and feeds the [`launch-playbook.md`](./launch-playbook.md). Does not restate the SEO/accessibility standing rules — those live in [`.claude/context/seo.md`](../../.claude/context/seo.md) and [`.claude/context/accessibility.md`](../../.claude/context/accessibility.md); this checks whether they are _met in practice_.

---

## 1. Readiness Summary & Verdict

**Verdict: NOT YET — small, well-built site with three concrete launch blockers, all Low/Medium effort.**

The engineering foundation is strong: strict TypeScript, App Router with Server Components by default, centralized SEO metadata, programmatic sitemap/robots, JSON-LD structured data, theme-aware design with a 320px mobile floor, motion that respects reduced-motion, and a CI gate. The blockers are asset and configuration gaps, not architectural problems.

### Blockers (must fix before public launch)

| ID   | Blocker                                                                                          | Effort  | Impact |
| ---- | ------------------------------------------------------------------------------------------------ | ------- | ------ |
| B-01 | Missing social/brand assets — `/og/default.png` and `/logo.png` don't exist (`public/` is empty) | Low     | High   |
| B-02 | Custom domain + `NEXT_PUBLIC_SITE_URL` not yet live (E13.1.3) — canonical URLs point at fallback | Medium  | High   |
| B-03 | Security headers/CSP + rate limiting absent (see security audit H-01/H-02)                       | Low–Med | High   |

### High-priority (fix before or immediately at launch)

| ID   | Item                                                                              | Effort | Impact |
| ---- | --------------------------------------------------------------------------------- | ------ | ------ |
| P-01 | Lighthouse CI gate + Playwright/axe not wired (targets defined, unverified in CI) | Medium | Medium |
| P-02 | No verified OG render / Twitter card (depends on B-01)                            | Low    | Medium |
| P-03 | Google Search Console + Bing Webmaster not set up; no indexing verification       | Low    | High   |
| P-04 | Backup/export of lead tables not established (security L-06)                      | Low    | Medium |

---

## 2. SEO Readiness

| Item                                  | Status     | Evidence / Notes                                                                                                                                                                                                           |
| ------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `robots.txt`                          | ✅ Good    | `src/app/robots.ts` — allows `/`, disallows `/api/` and `/investors/data-room`; emits sitemap+host.                                                                                                                        |
| `sitemap.xml`                         | ✅ Good    | `src/app/sitemap.ts` — home/vision/investors with priority tiers; data-room deliberately absent.                                                                                                                           |
| Metadata                              | ✅ Good    | `createMetadata()` builds unique title+description, canonical, OG, Twitter per page; root has `metadataBase`.                                                                                                              |
| Canonical URLs                        | ⚠️ Blocked | Correct mechanism, but driven by `NEXT_PUBLIC_SITE_URL`; until B-02, canonicals use the `https://orgofin.com` fallback while the site serves from `*.vercel.app` — a **mismatch** that must be resolved at domain cutover. |
| Structured data                       | ✅ Good    | `Organization` + `WebSite` JSON-LD in root layout, `<` escaped; Article/Breadcrumb helpers ready. **But** `organizationSchema` references `/logo.png` which is **missing** (B-01).                                         |
| Open Graph / Twitter                  | ⚠️ Blocked | Tags are emitted, but the referenced image `/og/default.png` **does not exist** (B-01) → broken social previews.                                                                                                           |
| `noindex` on gated/confirmation pages | ✅ Good    | Data room and `/waitlist/thank-you` correctly excluded from index/sitemap.                                                                                                                                                 |
| Search Console / Bing                 | ❌ Missing | Not set up (P-03) — needed to submit the sitemap and verify indexing.                                                                                                                                                      |
| Keywords/semantics                    | ✅ Good    | Centralized keyword set; semantic headings; skip-link present.                                                                                                                                                             |

**Actions:** create the OG image (1200×630) and logo, place in `public/og/default.png` and `public/logo.png` (B-01); complete domain cutover so canonicals match the served host (B-02); register Search Console + Bing and submit the sitemap post-launch (P-03).

---

## 3. Performance & Core Web Vitals

| Aspect             | Status       | Notes                                                                                                                                               |
| ------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework defaults | ✅ Good      | Next 16 App Router, RSC by default → minimal client JS; static generation for marketing pages.                                                      |
| Fonts              | ✅ Good      | `next/font` (Geist) self-hosts and preloads — no layout shift, no third-party font request.                                                         |
| Motion             | ✅ Good      | `LazyMotionProvider` + reduced-motion hooks → animation doesn't block or bloat the main thread.                                                     |
| Heavy component    | ✅ Good      | `CompanyBrainGraph` (d3-force) is lazy-loaded (`CompanyBrainGraphLazy`) with a text alternative.                                                    |
| Images             | ⚠️ Verify    | An `Image` UI wrapper exists; ensure all imagery uses `next/image` with explicit dimensions once assets are added (none in `public/` yet).          |
| Analytics loading  | ✅ Good      | GA4 via `@next/third-parties` (deferred, production-only) — no blocking script.                                                                     |
| Lighthouse gate    | ❌ Not wired | Targets are defined (Perf 95+, A11y/SEO/Best-Practices 100) but the CI gate (E1.2.4) isn't implemented — **unverified** (P-01).                     |
| Caching / CDN      | ✅ Good      | Vercel CDN serves static assets with immutable hashing; RSC/static pages cached at edge. Add explicit `Cache-Control` for any future dynamic route. |

**Actions:** run Lighthouse manually against a preview build now to get a real baseline; wire the Lighthouse CI gate (P-01); verify `next/image` usage as real imagery lands.

---

## 4. Accessibility

| Aspect               | Status       | Notes                                                                                                                      |
| -------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Semantic structure   | ✅ Good      | `<main id="main-content">`, skip-to-content link, heading hierarchy components.                                            |
| Live regions         | ✅ Good      | Forms use `role="status" aria-live="polite"` for errors/success.                                                           |
| Forms                | ✅ Good      | `FormField` wires label/hint/error with proper `htmlFor`/ids; `autoComplete` set.                                          |
| Reduced motion       | ✅ Good      | `useReducedMotion` + motion tokens respect the OS setting.                                                                 |
| Text alternative     | ✅ Good      | The graph has a dedicated `GraphTextAlternative` for non-visual users.                                                     |
| Color contrast       | ⚠️ Verify    | Design tokens are theme-aware; run an automated contrast pass (esp. if a new brand palette graduates from the experiment). |
| Automated a11y (axe) | ❌ Not wired | Planned CI step (E1.2.3) not yet implemented — **unverified in CI** (P-01).                                                |

**Actions:** run axe against key pages manually before launch; wire the Playwright+axe CI step; include a contrast pass in the brand-palette graduation.

---

## 5. Indexing Readiness

- **Before launch:** keep the current `robots` policy. If you want to prevent premature indexing of the `*.vercel.app` preview host, ensure only the canonical production domain is indexable (Vercel preview deployments are `noindex` by default via the platform).
- **At launch (after B-02):** verify `sitemap.xml`/`robots.txt` emit absolute `https://orgofin.com/...` URLs, and that `<link rel=canonical>`/`og:url` reference the apex — not the Vercel origin.
- **Post-launch:** register Google Search Console + Bing Webmaster Tools, submit the sitemap, request indexing of the home page, and monitor Coverage for errors (P-03).

---

## 6. Production Configuration

| Item                             | Status      | Notes                                                                                                                                                       |
| -------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Env vars (Supabase/GA4/site URL) | ⚠️ Partial  | Typed/validated via `@t3-oss/env-nextjs`, kept optional so builds don't require them. Confirm all are set in Vercel **Production** before launch.           |
| Supabase migrations              | ⚠️ Action   | Waitlist migration applied; **data-room migration NOT yet applied** and bucket not created (per runbook) — required before the data room serves real files. |
| Two-project isolation            | ✅ Good     | Prod vs non-prod Supabase projects scoped per Vercel environment.                                                                                           |
| Error boundaries                 | ✅ Good     | `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx` all present.                                                                                |
| `next.config.ts`                 | ❌ Empty    | No headers/redirects config — the vehicle for B-03 (security headers) and any www→apex redirect fallback.                                                   |
| Brand experiment                 | ✅ Resolved | Graduated 2026-07-18: Cobalt Prime folded into `globals.css`; `BrandSwitcher`/`brands.css`/`.env.development` + `NEXT_PUBLIC_BRAND_SWITCHER` deleted.       |

---

## 7. Browser & Device Compatibility

| Aspect             | Status    | Notes                                                                                                    |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------- |
| Modern browsers    | ✅ Good   | Next 16 / React 19 target evergreen browsers; no legacy polyfill concerns for the target audience.       |
| Mobile responsive  | ✅ Good   | Supported floor lowered to 320px (founder decision, #63–65); `MobileBlockScreen` + breakpoint hooks.     |
| Theme (light/dark) | ✅ Good   | Pre-paint `ThemeScript` prevents FOUC; `color-scheme` set; theme-aware tokens.                           |
| Manual matrix      | ⚠️ Verify | Do a pre-launch pass on iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari/Edge, and 320px width. |

---

## 8. Prioritized Action List

**Must-do before public launch:**

1. **B-01** — Create and commit `public/og/default.png` (1200×630) and `public/logo.png`; verify OG/Twitter render (P-02) and JSON-LD logo resolves. _(Low)_
2. **B-02** — Attach `orgofin.com`, set `NEXT_PUBLIC_SITE_URL` in Production, redeploy, verify canonicals/sitemap/robots use the apex. _(Medium)_
3. **B-03** — Add security headers + CSP and rate limiting (security audit H-01/H-02). _(Low–Med)_
4. Apply the data-room migration + create the private bucket **if** the data room is part of launch scope; otherwise confirm it stays in graceful "in preparation" state. _(Low)_
5. ~~Remove/graduate the brand experiment~~ — **done 2026-07-18** (Cobalt Prime graduated; experiment files deleted). Confirm `NEXT_PUBLIC_BRAND_SWITCHER` is unset in Vercel envs. _(Low)_
6. Run Lighthouse + axe manually and record a baseline; fix any Perf<95 / a11y issues. _(Med)_

**At/just after launch:** 7. **P-03** — Search Console + Bing, submit sitemap, verify indexing. 8. **P-01** — Wire Lighthouse CI + Playwright/axe gates. 9. **P-04** — Establish lead-table backup/export.

---

## Current Status

Reviewed 2026-07-18 on `dev`. Site is architecturally launch-grade; three concrete blockers (assets, domain, headers) and a handful of verification gaps remain. None are large.

## Future Improvements

- Dynamic OG image route (per-page share images) to replace the single static asset.
- Wire the remaining CI gates so readiness is machine-verified on every PR, not manually re-checked.

## TODO

- [ ] B-01 assets · B-02 domain · B-03 headers+rate-limit (launch blockers).
- [ ] Manual Lighthouse/axe baseline + browser matrix pass.
- [ ] Search Console/Bing setup post-launch.

## References

- [`launch-playbook.md`](./launch-playbook.md)
- [`../security/security-audit-report.md`](../security/security-audit-report.md)
- [`.claude/context/seo.md`](../../.claude/context/seo.md), [`.claude/context/accessibility.md`](../../.claude/context/accessibility.md)
- [`docs/deployment/custom-domain-setup.md`](../deployment/custom-domain-setup.md)

## Related Documents

- [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md)

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (TODO: assign a DRI)
