# Production Readiness Review — Orgofin Website

> **Purpose:** A pre-public-launch assessment of everything except security (which has its own report) — SEO, performance, accessibility, indexing, configuration, caching/CDN, images, compatibility, and mobile — with concrete go/no-go findings.
> **Applies to:** engineering and founders deciding whether the site is launch-ready.
> **Classification:** Internal.

---

## Responsibilities

Owns the non-security launch-readiness assessment. Pairs with [`../security/security-audit-report.md`](../security/security-audit-report.md) and feeds the [`launch-playbook.md`](./launch-playbook.md). Does not restate the SEO/accessibility standing rules — those live in [`.claude/context/seo.md`](../../.claude/context/seo.md) and [`.claude/context/accessibility.md`](../../.claude/context/accessibility.md); this checks whether they are _met in practice_.

---

## 1. Readiness Summary & Verdict

**Verdict (updated 2026-07-19): GO — all three original launch blockers are resolved in production. Remaining items are High-priority launch-day polish, not blockers.**

The engineering foundation is strong: strict TypeScript, App Router with Server Components by default, centralized SEO metadata, programmatic sitemap/robots, JSON-LD structured data, theme-aware design with a 320px mobile floor, motion that respects reduced-motion, and a CI gate. The blockers were asset and configuration gaps, not architectural problems — and all three have since shipped and are verified live on `https://orgofin.com`.

### Blockers — all cleared (verified live 2026-07-19)

| ID   | Blocker                                                                                          | Status  | Verification                                                                                                                         |
| ---- | ------------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| B-01 | Missing social/brand assets — `/og/default.png` and `/logo.png` don't exist (`public/` is empty) | ✅ Done | Eclipse brand shipped; `/og/default.png` + `/logo.png` return `200 image/png` on the apex.                                           |
| B-02 | Custom domain + `NEXT_PUBLIC_SITE_URL` not yet live (E13.1.3) — canonical URLs point at fallback | ✅ Done | `orgofin.com` serves `200`, `www` 308→apex, canonicals/OG resolve to the apex.                                                       |
| B-03 | Security headers/CSP + rate limiting absent (see security audit H-01/H-02)                       | ✅ Done | CSP, HSTS (preload), `X-Frame-Options: DENY`, nosniff, Referrer/Permissions-Policy live; app-layer rate limiting + honeypot shipped. |

### High-priority (fix before or immediately at launch)

| ID   | Item                                                                              | Effort | Impact |
| ---- | --------------------------------------------------------------------------------- | ------ | ------ |
| P-01 | Lighthouse CI gate + Playwright/axe not wired (targets defined, unverified in CI) | Medium | Medium |
| P-02 | No verified OG render / Twitter card (depends on B-01)                            | Low    | Medium |
| P-03 | Google Search Console + Bing Webmaster not set up; no indexing verification       | Low    | High   |
| P-04 | Backup/export of lead tables not established (security L-06)                      | Low    | Medium |

---

## 2. SEO Readiness

| Item                                  | Status     | Evidence / Notes                                                                                                                                                      |
| ------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `robots.txt`                          | ✅ Good    | `src/app/robots.ts` — allows `/`, disallows `/api/` and `/investors/data-room`; emits sitemap+host.                                                                   |
| `sitemap.xml`                         | ✅ Good    | `src/app/sitemap.ts` — home/vision/investors with priority tiers; data-room deliberately absent.                                                                      |
| Metadata                              | ✅ Good    | `createMetadata()` builds unique title+description, canonical, OG, Twitter per page; root has `metadataBase`.                                                         |
| Canonical URLs                        | ✅ Good    | Driven by `NEXT_PUBLIC_SITE_URL`, now set to the live apex — canonicals resolve to `https://orgofin.com` and match the served host (B-02 done). www 308→apex.         |
| Structured data                       | ✅ Good    | `Organization` + `WebSite` JSON-LD in root layout, `<` escaped; Article/Breadcrumb helpers ready. `organizationSchema`'s `/logo.png` now resolves (`200`, B-01 done). |
| Open Graph / Twitter                  | ✅ Good    | Tags emitted and `/og/default.png` resolves (`200`, B-01 done). Live render still to be verified in the social-card debuggers (P-02).                                 |
| `noindex` on gated/confirmation pages | ✅ Good    | Data room and `/waitlist/thank-you` correctly excluded from index/sitemap.                                                                                            |
| Search Console / Bing                 | ❌ Missing | Not set up (P-03) — needed to submit the sitemap and verify indexing.                                                                                                 |
| Keywords/semantics                    | ✅ Good    | Centralized keyword set; semantic headings; skip-link present.                                                                                                        |

**Actions:** ~~create the OG image + logo (B-01)~~ done; ~~complete domain cutover (B-02)~~ done; verify the OG/Twitter card in the social-card debuggers (P-02); register Search Console + Bing and submit the sitemap post-launch (P-03).

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
| `next.config.ts`                 | ✅ Good     | Security headers + static CSP configured here (B-03 done); www→apex redirect handled at the platform/DNS layer (308).                                       |
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

**Original blockers — all cleared (verified live 2026-07-19):**

1. ~~**B-01** — OG image + logo~~ **done** (Eclipse assets serve `200` on the apex; render check → P-02).
2. ~~**B-02** — Custom domain + `NEXT_PUBLIC_SITE_URL`~~ **done** (`orgofin.com` live, www 308→apex, canonicals resolve to apex).
3. ~~**B-03** — Security headers + CSP + rate limiting~~ **done** (headers/CSP/HSTS live; app-layer rate limiting + honeypot shipped).

**Remaining before/at public launch (High-priority, not blockers):**

4. Data-room: confirm it stays in graceful "in preparation" state for launch (founder PDFs pending); apply migration + create bucket only if it enters launch scope. _(Low)_
5. Run Lighthouse + axe manually and record a baseline; fix any Perf<95 / a11y issues. _(Med)_
6. **P-03** — Search Console + Bing, submit sitemap, verify indexing. **P-01** — Wire Lighthouse CI + Playwright/axe gates. **P-04** — Establish lead-table backup/export. **P-02** — Verify OG/Twitter card render in the debuggers.

---

## Current Status

Reviewed 2026-07-18 on `dev`; **blockers reconciled 2026-07-19** — all three (assets, domain, headers) are shipped and verified live on `https://orgofin.com`. Verdict is now **GO**; only High-priority launch-day items remain (Lighthouse CI, Search Console, backup, OG-render check).

## Future Improvements

- Dynamic OG image route (per-page share images) to replace the single static asset.
- Wire the remaining CI gates so readiness is machine-verified on every PR, not manually re-checked.

## TODO

- [x] B-01 assets · B-02 domain · B-03 headers+rate-limit — all live/verified 2026-07-19.
- [ ] Manual Lighthouse/axe baseline + browser matrix pass.
- [ ] Search Console/Bing setup post-launch.
- [ ] Verify OG/Twitter card render in the social-card debuggers (P-02).

## References

- [`launch-playbook.md`](./launch-playbook.md)
- [`../security/security-audit-report.md`](../security/security-audit-report.md)
- [`.claude/context/seo.md`](../../.claude/context/seo.md), [`.claude/context/accessibility.md`](../../.claude/context/accessibility.md)
- [`docs/deployment/custom-domain-setup.md`](../deployment/custom-domain-setup.md)

## Related Documents

- [`../operations/monitoring-and-analytics.md`](../operations/monitoring-and-analytics.md)

---

**Last Updated:** 2026-07-19 (launch blockers B-01/B-02/B-03 reconciled — all live; verdict → GO)
**Owner:** Orgofin Engineering (TODO: assign a DRI)
