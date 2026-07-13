# Frontend Architecture

> **Purpose:** Defines how the Orgofin website codebase is organized — folders, component tiers, rendering strategy, and the seven cross-cutting strategies (images, SEO, accessibility, performance, state, animation, deployment) every implementation must follow.
> **Applies to:** anyone (human or Claude) writing frontend code in this repository.

**Status:** Partially implemented. Phase 10 (Core Infrastructure) built the shared foundation — design tokens, theme system, motion primitives, layout primitives, UI primitives, navigation/footer chrome, SEO utilities, image + feedback components, hooks, and App Router state files. See the catalog: [`docs/architecture/frontend-infrastructure.md`](../../docs/architecture/frontend-infrastructure.md). The Home narrative (E9 static spine) is built — 11 chapter organisms in `components/sections/home/` assembled in `app/(marketing)/page.tsx` — and `/vision` is live (E11.1.1, three organisms in `components/sections/vision/`). Home's two signature visualizations (`CompanyBrainGraph`, `AgentOrchestrationDiagram`) and the remaining marketing pages are unbuilt (see [`docs/product/implementation-backlog.md`](../../docs/product/implementation-backlog.md)).
**Grounded in:** [`docs/product/prd.md`](../../docs/product/prd.md) (tech stack, non-negotiables), [`design-system.md`](./design-system.md) (tokens), [`information-architecture.md`](./information-architecture.md) (page/route list), [`docs/product/copy.md`](../../docs/product/copy.md) (content that populates these components).

Stack per the PRD: Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Supabase, Vercel, ESLint, Prettier, Husky, GitHub Actions. Frontend-first — no dedicated backend yet, but the architecture must isolate that boundary cleanly so a future NestJS/Go backend can slot in without touching components or pages (see §11).

---

## Responsibilities

This document owns: folder structure, component hierarchy/tiering rules, and the seven strategies below. It does **not** own visual tokens (see `design-system.md`), copy voice (see `branding.md`), or the page/route inventory itself (see `information-architecture.md`) — it only defines how those get _implemented_ in code.

---

## 1. Folder Structure

App Router, feature-oriented, `src/`-rooted (matches the existing empty `src/` directory in the repo).

```
src/
├── app/
│   ├── (marketing)/                  # route group: shared Nav+Footer chrome
│   │   ├── layout.tsx                 # Nav, Footer, mobile-block gate, waitlist CTA band
│   │   ├── page.tsx                   # Home — the 10(+2)-chapter story
│   │   ├── company-brain/page.tsx
│   │   ├── products/page.tsx
│   │   ├── security/page.tsx
│   │   ├── vision/page.tsx
│   │   ├── about/page.tsx
│   │   ├── team/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── investors/
│   │   │   ├── page.tsx
│   │   │   └── data-room/page.tsx     # noindex, gated
│   │   └── waitlist/thank-you/page.tsx
│   ├── (legal)/
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── api/
│   │   ├── waitlist/route.ts
│   │   ├── newsletter/route.ts
│   │   ├── contact/route.ts
│   │   ├── demo-request/route.ts
│   │   ├── partner-application/route.ts
│   │   └── og/route.tsx                # dynamic OG image generation
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   ├── layout.tsx                      # root: fonts, ThemeProvider, analytics boot
│   └── globals.css
│
├── components/
│   ├── ui/               # primitives — Button, Input, Textarea, Select, Badge, Card, Dialog, Tooltip
│   ├── molecules/        # tier-2 compositions — SectionHeading, StatCallout, CalloutBox, ModuleCard, FormField
│   ├── layout/           # Nav, Footer, ThemeToggle, MobileBlockScreen, PageShell, SkipLink
│   ├── sections/         # page-section organisms; shared ones at root (CTABand…), per-page chapters grouped in a subfolder (sections/home/ = the Home narrative chapters)
│   ├── graph/            # Company Brain graph visualization (isolated, heavy, code-split)
│   ├── forms/            # WaitlistForm, DemoRequestForm, PartnerApplicationForm, NewsletterInline
│   ├── motion/           # Reveal, Stagger, Parallax, ChapterTransition — shared Framer Motion primitives
│   └── icons/            # custom icon components, 24px grid, matching design-system stroke weight
│
├── content/              # MDX blog posts + structured copy (sourced from docs/product/copy.md)
│   └── blog/*.mdx
│
├── lib/
│   ├── utils.ts           # the cn() helper (clsx + tailwind-merge) — generated by shadcn init,
│   │                       # not a folder: don't add a conflicting lib/utils/ directory
│   ├── supabase/         # client.ts, server.ts, types.ts — the ONLY files that import @supabase/*
│   ├── api/              # thin internal wrapper (submitWaitlist, submitDemoRequest…) — see §11
│   ├── analytics/        # GA4 event helpers (trackEvent, trackPageView…)
│   └── seo/              # metadata builders, structured-data (JSON-LD) builders
│
├── hooks/                 # useReducedMotion, useScrollProgress, useTheme, useInView
├── styles/                 # reserved, currently unused — Tailwind v4's CSS-first config keeps
│                           # theme tokens directly in app/globals.css (see design-system.md);
│                           # this folder is for non-Tailwind CSS needs if they ever arise
└── types/
public/
├── images/
└── og/
```

Fonts are **not** manually placed files in `public/` — Geist Sans/Mono are loaded via `next/font/google` in `app/layout.tsx`, which downloads and self-hosts them at build time (zero runtime request to Google either way, satisfying §8's "no external font request" rule without a separate `geist` package).

**Rule:** `lib/supabase/*` is the only place `@supabase/supabase-js` is ever imported. No component, page, or API route imports it directly — everything goes through `lib/api/*` (see §11).

---

## 2. Component Hierarchy

Four strict tiers, composition flows one direction only (a lower tier never imports a higher one):

```
Pages (app/**/page.tsx)
   └─ compose ─▶ Sections (organisms: WorldToday, WhyWeWin, ModuleGrid, WaitlistBand…)
                     └─ compose ─▶ Molecules (SectionHeading, StatCallout, ModuleCard, FormField…)
                                        └─ compose ─▶ Primitives (Button, Input, Badge, Card…)
```

- **Primitives (`components/ui/`)** — no business logic, no copy hardcoded, styled only from design tokens. A `Button` doesn't know about "Join the Waitlist"; it just renders a variant/size.
- **Molecules (`components/molecules/`)** — small compositions with a specific shape (e.g., `SectionHeading` = headline + sub-headline pattern used on every page per the copy deck) but still content-agnostic — they accept copy as props, never import it directly. They compose primitives and are composed by sections; they never import a section.
- **Sections (organisms)** — the actual chapter/page-block components (`WorldToday`, `HiddenCost`, `WhyWeWinSection`, `RoadmapTrack`, `SixMoatsList`). These _do_ import copy content and _do_ own animation orchestration for their block. This is where [`docs/product/copy.md`](../../docs/product/copy.md) content actually lands.
- **Layout** (`components/layout/`) — page chrome: `Nav`, `Footer`, `ThemeToggle`, `MobileBlockScreen`, `PageShell` (the max-width/padding wrapper enforcing design-system §9's content cap on ultrawide).
- **Pages** — compose Sections in sequence, handle route-level data fetching (e.g., live waitlist count for the social-proof counter flagged in [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md) §6), and set `generateMetadata`.

This mirrors the design-system's own primitive → semantic → component token tiering (`design-system.md` §11) — same discipline, applied to components instead of tokens.

---

## 3. Reusable Components (concrete inventory)

| Component                                                                       | Tier                | Notes                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                        | primitive           | variants: primary (gradient-brand-cta), secondary, ghost, link; sizes sm/md/lg                                                                                                                           |
| `Input`, `Textarea`, `Select`, `Checkbox`                                       | primitive           | form fields, all wired to design-system focus-ring token                                                                                                                                                 |
| `Badge`                                                                         | primitive           | used for "Available Now" / "Roadmap" tags on Products page                                                                                                                                               |
| `Card`                                                                          | primitive           | elevation variants map directly to `design-system.md` §7                                                                                                                                                 |
| `Dialog` / `Sheet`                                                              | primitive           | investor data-room gate, mobile nav menu                                                                                                                                                                 |
| `SectionHeading`                                                                | molecule            | headline + sub-headline, used on every page per the copy deck's consistent pattern                                                                                                                       |
| `StatCallout`                                                                   | molecule            | single-number callouts (TAM figures, ARR targets, the $52K–$220K cost stat)                                                                                                                              |
| `CalloutBox`                                                                    | molecule            | the "THE CORE INSIGHT" / "THE FUNDAMENTAL DIFFERENCE" styled callout blocks from the source PDF                                                                                                          |
| `ModuleCard`                                                                    | molecule            | Products page suite cards, carries the Available/Roadmap `Badge`                                                                                                                                         |
| `FormField`                                                                     | molecule            | label + input + error message, aria-describedby wired                                                                                                                                                    |
| `CTABand`                                                                       | organism            | the repeated end-of-page waitlist CTA block (per [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md) §6 — one consistent CTA treatment reused everywhere, not rebuilt per page) |
| `WaitlistForm`, `DemoRequestForm`, `PartnerApplicationForm`, `NewsletterInline` | organism            | each owns its own React Hook Form + Zod schema, submits via `lib/api/*`                                                                                                                                  |
| `Nav`, `Footer`, `ThemeToggle`, `MobileBlockScreen`                             | layout              | site chrome                                                                                                                                                                                              |
| `CompanyBrainGraph`                                                             | organism (isolated) | the one bespoke heavy visualization — see §10                                                                                                                                                            |
| `AgentOrchestrationDiagram`                                                     | organism            | Chapter 6 visualization                                                                                                                                                                                  |
| `RoadmapTrack`                                                                  | organism            | shared by Home Ch.8 and the Investors page (same component, different data — avoids duplicating the roadmap visualization)                                                                               |
| `CompetitorTeardownTable` / `SixMoatsList`                                      | organism            | shared by Home Ch.7.5 and the Investors page, same reuse logic as `RoadmapTrack`                                                                                                                         |

**Reuse principle:** any block that appears on both Home (as a teaser) and a dedicated page (as the full version — Vision, Investors, Roadmap) is _one_ component parametrized by a `variant="teaser" | "full"` prop, not two separate components — this is what keeps the "one story, not duplicated pitches" principle from [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md) structurally enforced rather than just a copywriting convention.

---

## 4. Layout Strategy

- **Root layout** (`app/layout.tsx`): loads self-hosted fonts via `next/font`, mounts a blocking pre-hydration `ThemeScript` (first child of `<body>`) that applies the persisted theme class to `<html>` before first paint (avoids flash-of-wrong-theme _and_ supports system-preference detection, which a server-read cookie alone cannot do), wraps children in `ThemeProvider` + `LazyMotionProvider`, renders a skip-to-content link, and emits site-wide `Organization`/`WebSite` JSON-LD. _(GA4 boot is deferred to the analytics epic.)_ **Implemented.**
- **Marketing layout** (`app/(marketing)/layout.tsx`): renders `Nav` + `{children}` + `Footer`, and mounts `MobileBlockScreen` here so the <390px lockout (design-system §9 `bp-blocked`) is enforced once, at the layout level — not re-implemented per page.
- **`PageShell`**: every page's content sits inside this wrapper, which enforces the `bp-desktop-xl` max-width cap (~1440–1600px, per `design-system.md` §9) and applies the vertical rhythm spacing tokens (`space-24`/`space-32`) between sections — no page hand-rolls its own container widths.
- **Home is the special case**: a single continuous scroll of `Section` components sharing a `ScrollProgressProvider` (local to the Home tree, not global) that drives the nav's active-chapter highlighting and an optional progress indicator.
- **Legal pages** reuse the same marketing layout — no separate chrome, just simpler section content — avoiding an unnecessary second layout for two pages.
- **Investor Data Room** is not a separate layout; it's the `/investors/data-room` page rendering a gate component before its content, inside the normal marketing shell — keeps it discoverable and on-brand rather than feeling like a different product.

---

## 5. Image Optimization

- `next/image` everywhere, always with explicit `width`/`height` or a `fill` container with a fixed `aspect-ratio` — no layout-shift-prone images.
- Automatic AVIF/WebP negotiation via Next's built-in image pipeline; responsive `sizes` attributes matched to the `design-system.md` §9 breakpoint tokens.
- Icons are inline SVG **components** (not `<img>`/`next/image`), so stroke color can be `currentColor` and follow the design-system's icon color rule (§6) — themeable, crisp at any DPI, zero network request.
- The Company Brain graph and any 3D/animated chapter visuals are canvas/SVG-rendered, not images — no `next/image` involvement, but see §8 for their lazy-load treatment.
- Above-the-fold hero imagery (if any static imagery is used at all — the design leans toward generative/animated visuals over photography) uses `placeholder="blur"`.
- Dynamic OG images generated at the edge via `app/api/og/route.tsx` (`next/og`), one per page archetype (home, generic page, blog post), cached aggressively since content changes infrequently.
- Founder photos (Team page) and any blog imagery go through the same `next/image` pipeline — no exceptions for "it's just a headshot."

---

## 6. SEO Strategy

- **Per-route metadata** via Next's `generateMetadata`, sourced from the SEO title/description already drafted per page in [`docs/product/copy.md`](../../docs/product/copy.md) — centralized defaults + per-page overrides live in `lib/seo/metadata.ts` so tone/format stays consistent.
- `app/sitemap.ts` and `app/robots.ts` generated programmatically; `/investors/data-room` and any other gated route excluded (`noindex, nofollow`), per the flag already raised in the copy deck.
- **Structured data (JSON-LD)** via a shared `<StructuredData>` component: `Organization` schema in the root layout, `Article` schema per blog post, `BreadcrumbList` on Blog and Products, `JobPosting` on Careers once real roles exist.
- **Canonical URLs** set explicitly on every page — specifically resolves the Home-Ch.9-vs-`/vision` duplicate-content risk flagged in [`information-architecture.md`](./information-architecture.md) §7: `/vision` is canonical, Home's chapter renders unique summary copy rather than a repeated block.
- **Static generation (SSG)** for all marketing pages and blog posts at build time (`generateStaticParams` for `blog/[slug]`) — nothing SEO-relevant is client-rendered only.
- Any content that lives inside a client-only interactive component (the Company Brain graph) has a static, crawlable text equivalent rendered in the same DOM position — a crawler (and a no-JS/reduced-motion visitor) still sees the substance of Chapter 5, not a blank canvas.
- Blog content authored as MDX with frontmatter (`title`, `description`, `date`, `category`) — this is also where the GTM-plan SEO engine (PF/TDS/GST calculators, per [`docs/product/prd.md`](../../docs/product/prd.md) §3.8) actually lives.

---

## 7. Accessibility Strategy

- Semantic landmarks (`header`/`nav`/`main`/`footer`) in every layout; a real skip-to-content link, not a hidden one that silently fails focus.
- Centralized `useReducedMotion` hook (wraps Framer Motion's own) consumed by every component in `components/motion/` — individual sections never re-implement the check, so the reduced-motion path can't drift out of sync page by page.
- Forms: every `Input`/`Textarea` has a real `<label htmlFor>`, validation errors are linked via `aria-describedby`, and submit success/error states (per the copy deck's exact microcopy) are announced through an `aria-live="polite"` region, not just a visual toast.
- Focus management: modal/dialog primitives (data-room gate, mobile nav) trap and restore focus correctly on open/close.
- The `CompanyBrainGraph` — a custom canvas/SVG visualization with no native semantics — ships with an accessible alternative: a visually-hidden, structured text/table description of the same entity relationships, toggleable via a visible "view as text" control, not just an `aria-label` slapped on a canvas.
- Every design-system color/spacing/focus token is already vetted for WCAG AA (`design-system.md` §8) — components consume tokens exclusively, never ad hoc hex/px values, so contrast compliance is structural rather than something to audit per component after the fact.
- Automated regression: `@axe-core/react` in development, and an axe pass wired into Playwright E2E runs in CI (see §11) so accessibility regressions fail a build the same way a broken test would.

---

## 8. Performance Strategy

- **Server Components by default.** `"use client"` is opt-in, reserved for components that need interactivity, animation state, or browser APIs (forms, theme toggle, the graph, motion wrappers) — everything else (most Section content) ships zero client JS.
- **Code-splitting the heavy stuff:** `next/dynamic` with `ssr: false` and an `IntersectionObserver`-gated mount for `CompanyBrainGraph` and any 3D chapter visuals — they don't load until scrolled near, and never block first paint.
- **Framer Motion via `LazyMotion` + `domAnimation`** feature bundle instead of the full `motion` import — this is the concrete fix for the tension flagged in [`docs/product/prd.md`](../../docs/product/prd.md) §19.2 ("minimal JavaScript" vs. cinematic animation requirements): the animation vocabulary stays rich, but the shipped bundle is a fraction of the naive import.
- **Fonts** via `next/font` with self-hosted Geist Sans/Mono — no external Google Fonts request, no layout shift from late font swap.
- **Third-party scripts** (GA4) loaded via the first-party `@next/third-parties/google` `GoogleAnalytics` integration (`src/components/analytics/`), which wraps `next/script` `afterInteractive` and additionally fires pageviews on App Router client-side navigations. It is mounted in the root layout but env-gated: it renders nothing unless `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (Production only, per Vercel scoping). This supersedes the earlier hand-rolled `next/script` plan and, as an accepted trade-off, forecloses the speculative Partytown `strategy="worker"` offload (backlog E14.3) — the integration doesn't expose it, and Partytown's GA4 support is notoriously fragile.
- **Caching:** static assets (fonts, icons, images) served with long-lived, content-hashed cache headers off Vercel's CDN; blog/marketing pages are statically generated and revalidated on content change, not rendered per-request.
- **The reduced-motion code path doubles as the performance-safe path** — one maintained implementation, not two (ties §7 and §10 together structurally, not just conceptually).
- **Lighthouse CI gate** in the deploy pipeline enforcing the PRD §6 targets (Performance 95+, Accessibility/SEO/Best Practices 100) before merge — a regression here fails the build, not just a post-launch audit finding.

---

## 9. State Management

Deliberately minimal — this is a marketing/content site, not an authenticated application, and the architecture shouldn't reach for app-scale state tooling it doesn't need yet.

- **Theme (light/dark/system):** a small custom `ThemeProvider` context (`components/theme/`), persisted via `localStorage` (key `orgofin-theme`), with a pre-hydration `ThemeScript` applying the class before paint. `resolvedTheme` derives from `prefers-color-scheme` via `useSyncExternalStore` when the choice is `system`; cross-tab changes sync via a `storage` listener. No `next-themes` dependency. **Implemented.**
- **Scroll/chapter progress** (Home nav highlighting, progress indicator): a lightweight context scoped to the Home page tree only — not global app state, since nothing outside Home needs it.
- **Form state:** React Hook Form + Zod per form (`WaitlistForm`, `DemoRequestForm`, `PartnerApplicationForm`, `NewsletterInline`) — state lives inside each form component; no shared form store.
- **Server-derived data** (live waitlist count for the social-proof counter, blog post listings): fetched directly in Server Components from Supabase at request/build time — no client data-fetching library (no React Query/SWR) since there's no authenticated, frequently-refetched surface yet.
- **No Redux/Zustand/Jotai.** Explicitly called out as a deliberate omission, not an oversight — introducing a global store now would be solving a problem this site doesn't have. Revisit only if/when a genuine authenticated customer dashboard gets built post-backend-migration.
- **Analytics:** fire-and-forget calls from `lib/analytics/trackEvent()` — not modeled as state at all.

---

## 10. Animation Strategy

- Framer Motion is the sole animation library (per PRD §9), accessed only through the shared primitives in `components/motion/` — `Reveal` (scroll-triggered fade/translate via `whileInView`), `Stagger` (wraps `staggerChildren` at the design-system's 40–80ms increment), `Parallax` (wraps `useScroll`/`useTransform` at the 0.3–0.5x ratio), `ChapterTransition` (Home's cinematic cross-chapter beat).
- **Every duration and easing value is pulled from `design-system.md` §5 tokens** — no component hardcodes `duration={0.6}` inline; this mirrors the token-architecture discipline from the design system, applied to motion code.
- `useReducedMotion` (see §7) short-circuits all four primitives to a plain opacity cross-fade at `motion-fast` — implemented once, centrally, so it can't be forgotten in a new section.
- **`CompanyBrainGraph` is not driven by Framer Motion** — Framer Motion handles UI transitions, not a live physics/force-directed graph simulation. It's built as its own isolated client component (likely `requestAnimationFrame` or a lightweight force-graph library), code-split per §8, with Framer Motion only used for its _entrance_ (fade/scale in once mounted).
- **One signature motion per section** — enforced as a review checklist item, not just a stated principle: if a section combines parallax _and_ stagger _and_ a 3D transform simultaneously, that's treated as a defect, not richness (per `design-system.md` §5 principle 3).
- Page-to-page transitions are a simple, fast fade — no full-page wipe/slide — so navigating between marketing pages never feels slower than the content justifies.

---

## 11. Deployment Strategy

- **Host:** Vercel, connected to the GitHub repo, matching the existing branch model from `README.md` (`main` → production, `uat` → staging, `dev` → development) — each branch maps to its own Vercel environment, and every PR gets an automatic preview deployment for design/copy review before merge.
- **CI (GitHub Actions):** lint (ESLint) → format check (Prettier) → type-check (`tsc --noEmit`) → unit tests → Playwright E2E + axe accessibility pass → build → Lighthouse CI gate (PRD §6 thresholds). All required to pass before merge; nothing is merged on a green build alone if Lighthouse regresses.
- **Local gate:** Husky pre-commit runs lint + format on staged files; pre-push runs type-check — catches regressions before they even reach CI.
- **Environment variables** (Supabase URL/anon key, GA4 measurement ID) managed per-environment in Vercel's dashboard — never committed, never shared verbatim between preview and production if the Supabase project is split (see below).
- **Supabase environment isolation:** implemented as two separate projects (prod backs Production; a shared non-prod project backs uat/dev/previews), scoped per-environment in Vercel, so test waitlist submissions never pollute the real investor-facing signup count. Details in `.claude/context/deployment.md`.
- **Rollback:** Vercel's instant rollback to the prior deployment if a production issue surfaces — no manual redeploy-from-git-history needed.
- **Global delivery:** Vercel's edge network naturally serves the India/UK/US audience without extra configuration; OG image generation and any edge-eligible API routes (e.g., waitlist submission) run at the edge for low latency across all three regions.
- **The backend-migration seam (per PRD §5's explicit future-proofing requirement):** components and pages never import `@supabase/*` directly — they only ever call functions in `lib/api/*` (e.g., `submitWaitlist()`, `requestDemo()`). Today, those functions call Supabase directly. When a NestJS/Go backend eventually replaces Supabase for these operations, only the _internals_ of `lib/api/*` change to call the new backend's REST/RPC endpoints instead — no component, page, or form is touched. This seam is the entire point of the "frontend-first, backend-agnostic" architecture and is enforced structurally by the folder boundary in §1, not just by convention.

---

## Design Decisions

The load-bearing calls made here, in one place, so a future editor knows what to preserve if they revisit this doc: Server Components by default (§8); a strict one-way component tier (§2); the `variant="teaser"|"full"` reuse pattern for Home/dedicated-page duplication (§3); `LazyMotion` to reconcile minimal-JS vs. cinematic-animation (§8, §10); and the `lib/api/*` seam as the sole boundary a future backend migration touches (§11).

## Current Status

Scaffold + core infrastructure implemented (Phase 10), with molecules (`components/molecules/`) and the first `lib/api` seam slice now added. The `src/` tree contains the real component library (`components/{ui,molecules,layout,motion,theme,seo,feedback}`), hooks (`hooks/`), and libs (`lib/{seo,theme,motion,utils}`). The §11 seam is now live for the waitlist path: `lib/supabase/{server,types}` (the only `@supabase/*` importers) and `lib/api/waitlist` (Zod schema + `submitWaitlist`), consumed by `app/api/waitlist/route.ts`. The first form is live too: `components/forms/WaitlistForm.tsx` (RHF + the shared `waitlistSchema`) posting to `app/api/waitlist`, with `app/waitlist/thank-you/page.tsx` as the confirmation. The marketing shell is live: the `app/(marketing)/` route group + layout composes `Navbar` + `PageShell` + `Footer` + `MobileBlockScreen`, and the home page (moved into `(marketing)/`) renders a minimal hero + the shared `CTABand` (`components/sections/`) carrying the waitlist. Still placeholder `.gitkeep` folders for `components/{graph,icons}` and `lib/analytics`; the browser Supabase client (`lib/supabase/client.ts`) is deferred until a client-side use exists. Design tokens are live in `app/globals.css`. The full Home narrative (E9 static spine), the `/vision` page (E11.1.1), and the GA4 boot (`components/analytics/`, env-gated) are built; the remaining marketing pages, Home's signature visualizations, and the `lib/analytics` helpers are not. Full catalog: [`docs/architecture/frontend-infrastructure.md`](../../docs/architecture/frontend-infrastructure.md).

## Future Improvements

- Once components exist, split this document: keep folder structure/hierarchy here, move each strategy (§5–§11) into its own file if any single strategy grows past what fits in a section (most likely candidates: state management and animation, once real components exist to reference).
- Add concrete code examples once the first components are built — this document intentionally contains zero code today.

## TODO

- [x] Confirm Supabase environment isolation strategy — decided 2026-07-08: two separate projects (prod + non-prod), scoped per-environment in Vercel. See `.claude/context/deployment.md` (Supabase Environment Isolation).
- [ ] Decide whether `CompanyBrainGraph` uses a physics/force-graph library (e.g., d3-force, react-force-graph) or a bespoke implementation — deferred until the visualization is actually scoped.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) — tech stack mandate and non-negotiables
- [`design-system.md`](./design-system.md) — tokens this architecture consumes
- [`information-architecture.md`](./information-architecture.md) — the route inventory this folder structure implements
- [`docs/product/copy.md`](../../docs/product/copy.md) — content populating these components

## Related Documents

- [`coding-standards.md`](./coding-standards.md)
- [`accessibility.md`](./accessibility.md)
- [`seo.md`](./seo.md)
- [`deployment.md`](./deployment.md)

---

**Last Updated:** 2026-07-13
**Owner:** Orgofin Engineering (TODO: assign a DRI)
