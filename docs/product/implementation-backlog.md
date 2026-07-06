# Implementation Backlog — Orgofin Website

> **Purpose:** The complete, dependency-ordered engineering backlog to take the Orgofin marketing/waitlist website from its current scaffold state to a launch-ready site that satisfies every standing rule in `.claude/`. Broken into Epics → Features → Tasks, each task independently implementable in under one day.
> **Applies to:** anyone (human or Claude) planning, estimating, or picking up implementation work on this repository.

**Derived from:** every document in [`.claude/context/`](../../.claude/context/), [`.claude/knowledge/`](../../.claude/knowledge/), and [`.claude/prompts/`](../../.claude/prompts/), reconciled against the **actual** repository state (not the "no code exists yet" claim in several context docs, which is now stale — the Next.js scaffold is present).

---

## Responsibilities

Owns: the task-level breakdown of website implementation work, sequencing, and per-task acceptance criteria. Does **not** own the conventions those tasks must satisfy — those live in `.claude/context/` and are referenced, not duplicated, here. When a rule and this backlog disagree, the rule wins and this file is corrected.

---

## How To Read This Backlog

- **Epic** = a large, shippable capability area. **Feature** = a coherent group of work inside an epic. **Task** = one independently implementable unit, sized under one engineer-day.
- **Task ID** = `E{epic}.{feature}.{task}` (e.g., `E2.1.3`). IDs are stable; dependencies reference them.
- **Dependencies** list task IDs that must be Done first. `—` means none (can start immediately).
- **Acceptance Criteria** are the task-specific, checkable outcomes.
- **Definition of Done (DoD)** for _every_ task = its Acceptance Criteria met **AND** the [Universal Definition of Done](#universal-definition-of-done) checklist below fully passing. The Universal DoD is stated once rather than repeated 150 times, per this repo's "never duplicate documentation" rule.

### Current Repository Baseline (what already exists — do not re-scope)

- Next.js 16 (App Router) + React 19 + TypeScript strict, `src/`-rooted.
- Tailwind v4 (CSS-first), **shadcn default theme still in place** — Orgofin tokens NOT yet applied.
- ESLint (`eslint-config-next` + `eslint-config-prettier`), Prettier (+ `prettier-plugin-tailwindcss`), Husky **pre-commit** with `lint-staged`.
- Typed env via `@t3-oss/env-nextjs` (`src/env.ts`), all vars optional.
- `src/lib/utils.ts` (`cn()` helper), Geist Sans/Mono via `next/font` in root layout.
- Folder skeleton present as empty `.gitkeep` placeholders (`components/{ui,layout,sections,graph,forms,motion,icons}`, `lib/{supabase,api,analytics,seo}`, `hooks`, `content`, `types`, `styles`).
- Dependencies already installed: `framer-motion`, `radix-ui`, `shadcn`, `class-variance-authority`, `lucide-react`, `zod`, `tailwind-merge`, `tw-animate-css`.

### Not Yet Present (the backlog fills these)

Design tokens, ThemeProvider, every component, every route beyond the default scaffold `page.tsx`, Supabase client, `lib/api` seam, forms, API routes, SEO/metadata/sitemap/robots/OG, analytics, blog/MDX, tests (no runner), CI (`.github/` empty), Lighthouse gate, PR template, pre-push hook.

---

## Universal Definition of Done

A task is **not Done** until all of the following hold (in addition to its own Acceptance Criteria):

1. **Passes the local gate:** `npm run lint`, `npm run format:check`, `npm run typecheck` all clean — zero errors, zero warnings.
2. **TypeScript discipline** (`coding-standards.md`): strict mode, no `any`, no `as` casts to silence errors, no enums (string unions), named exports only (except Next `page`/`layout`/`route`/`sitemap`/`robots`/`not-found`), explicit `{Component}Props` types, no prop drilling past two levels.
3. **Server Component by default** (`frontend.md` §8): `"use client"` only where interactivity/browser API/animation state genuinely requires it, and justified in a comment or PR note.
4. **Design tokens only** (`design-system.md`): no raw hex/px/duration/easing values in UI; Tailwind utilities composed via `cn()`; no arbitrary values unless a documented one-off.
5. **Accessibility** (`accessibility.md`, `design-system.md` §8): semantic HTML, visible 2px focus ring, ≥44×44px hit areas, AA contrast against the actual surface, color never the sole state indicator, keyboard parity, `axe` clean.
6. **Motion** (`animations.md`): at most one signature motion per section; every `motion-slow`/`motion-cinematic` transition has a `prefers-reduced-motion` opacity-only equivalent via the shared `components/motion/` primitives — never re-implemented inline.
7. **Architecture seam** (`frontend.md` §11): no `@supabase/*` import outside `lib/supabase/*`; components/pages/routes call `lib/api/*` only.
8. **Tier discipline** (`frontend.md` §2): one component per file; composition flows one direction (primitive → molecule → organism → page); a lower tier never imports a higher one.
9. **Tests** (`testing.md`): logic in `lib/` has unit tests; primitives/molecules/forms have component tests; critical paths have/extend E2E coverage. No test added for pure static content beyond the E2E that renders it.
10. **Docs synchronized** (`workflows.md` table): any change to architecture, tokens, routes, conventions, or a component's contract updates the matching `.claude/` doc in the same PR. No stale docs merged.
11. **No debt smells:** no `console.log`, no empty `catch {}`, no undocumented code `TODO` (every code TODO has a matching entry in the relevant doc's TODO section), no business facts invented (missing facts become `TODO` placeholders).
12. **PR hygiene** (`workflows.md`, `repository.md`): one PR does one thing; Conventional Commit messages; self-reviewed diff; CI green including the Lighthouse gate for any task that renders a page (Performance ≥95, A11y/SEO/Best-Practices 100); renders correctly in **both** light and dark on the preview deploy.

---

## Epic Dependency Overview

```
E1 Engineering Foundation & CI/CD ─┐
E2 Design System Implementation ───┼─▶ E3 UI Primitives ─▶ E4 Theme & Layout Chrome ─┐
                                   │                                                  │
E5 Motion System ──────────────────┘                                                  │
                                                                                      ▼
E6 Molecules & Shared Section Components ◀── E3, E4, E5                                │
E7 Data Layer & API Seam ◀── E1                                                        │
E8 Forms ◀── E3, E6, E7                                                                │
                                                                                      ▼
E9 Home Page Narrative ◀── E4, E5, E6, E8                                              │
E10 Platform/Product/Trust Pages ◀── E9 shared components                             │
E11 Investor/Vision/Company Pages ◀── E8, E9 shared components                        │
E12 Blog & Content Engine ◀── E4                                                       │
E13 SEO, Metadata & Structured Data ◀── E4 (parallel with pages)                      │
E14 Analytics & Instrumentation ◀── E7, E8                                            │
E15 Testing, Accessibility & Launch Hardening ◀── everything                          ▼
```

---

# EPIC 1 — Engineering Foundation & CI/CD

**Goal:** Make the standing rules in `coding-standards.md`, `deployment.md`, `testing.md`, and `workflows.md` _enforced by tooling_, not just documented. Unblocks trustworthy iteration on everything else.

## Feature 1.1 — Lint / Format / Hooks Hardening

**E1.1.1 — Add custom ESLint rules for repo conventions**

- Depends on: —
- Acceptance criteria:
  - ESLint enforces import order (external → `@/` → relative → styles), `no-default-export` (with exceptions for Next special files), and `no-console` (allow `warn`/`error`).
  - `no-restricted-imports` rule forbids `@supabase/*` outside `src/lib/supabase/**`.
  - Running `npm run lint` on a deliberately-violating sample file reports each rule; the sample is then removed.

**E1.1.2 — Confirm Prettier + Tailwind class ordering config**

- Depends on: —
- Acceptance criteria:
  - `prettier-plugin-tailwindcss` is active; a file with hand-disordered classes is reordered by `npm run format`.
  - `.prettierignore` excludes build artifacts and `package-lock.json`.

**E1.1.3 — Add Husky pre-push type-check hook**

- Depends on: —
- Acceptance criteria:
  - `.husky/pre-push` runs `npm run typecheck` and blocks the push on failure.
  - Documented in `deployment.md` (local gate section) if wording drifts.

## Feature 1.2 — Continuous Integration

**E1.2.1 — Base CI workflow (lint → format → typecheck → build)**

- Depends on: E1.1.1, E1.1.2
- Acceptance criteria:
  - `.github/workflows/ci.yml` runs on PRs to `dev`/`uat`/`main`: install → lint → format check → typecheck → `next build`.
  - Any step failing fails the check; steps run in the order defined in `deployment.md`.
  - `docs/deployment/` / `deployment.md` updated to link the workflow instead of describing it in prose.

**E1.2.2 — Wire unit + component test step into CI**

- Depends on: E1.2.1, E15.1.1
- Acceptance criteria:
  - CI runs the unit/component suite after typecheck, before build; failure blocks merge.

**E1.2.3 — Wire Playwright E2E + axe step into CI**

- Depends on: E1.2.1, E15.2.1
- Acceptance criteria:
  - CI installs Playwright browsers (cached), builds, starts the app, runs E2E incl. the axe pass; failure blocks merge.

**E1.2.4 — Lighthouse CI gate**

- Depends on: E1.2.1
- Acceptance criteria:
  - `@lhci/cli` runs against a production build of representative routes (Home, Products, a blog post, a legal page).
  - Thresholds enforced: Performance ≥95, Accessibility 100, SEO 100, Best Practices 100 (`deployment.md`, PRD §6). Regression fails the check.
  - Config committed (`lighthouserc.*`) and referenced from `deployment.md`.

## Feature 1.3 — PR & Contribution Guardrails

**E1.3.1 — PR template encoding the Documentation Synchronization checklist**

- Depends on: —
- Acceptance criteria:
  - `.github/PULL_REQUEST_TEMPLATE.md` includes the `workflows.md` sync table as a checklist ("if you changed X, you updated Y") plus a "one PR does one thing" and "docs updated" checkbox.

**E1.3.2 — Verify `.env.example` completeness and env wiring**

- Depends on: —
- Acceptance criteria:
  - `.env.example` lists every variable in `src/env.ts` (Supabase URL/anon key, service role key, GA4 id) with placeholder values and a comment on where it's provisioned.
  - `docs/deployment/environment-variables.md` matches the same list.

**E1.3.3 — [DECISION] Supabase environment isolation strategy**

- Depends on: —
- Acceptance criteria:
  - Decision recorded (separate Supabase project vs. RLS-separated tables) as an ADR in `docs/adr/`, resolving the open TODO in `frontend.md` §11 and `deployment.md`.
  - `deployment.md` and `architecture.md` updated to reference the ADR.

---

# EPIC 2 — Design System Implementation

**Goal:** Turn `design-system.md` from a table of values into the actual token layer every component consumes. This replaces the shadcn default theme currently shipping in `globals.css`. **Blocks all UI work.**

## Feature 2.1 — Token Foundation

**E2.1.1 — Implement color primitives + semantic tokens (both themes)**

- Depends on: —
- Acceptance criteria:
  - `globals.css` `@theme` defines the Orgofin Blue scale (`blue-50…950`) and warm-cool neutrals (`neutral-0…950`) from `design-system.md` §2 — replacing shadcn's default grayscale oklch values.
  - Every semantic token (`color-bg-page`, `color-bg-surface`, `color-bg-surface-raised`, `color-border-*`, `color-text-*`, `color-accent*`, `color-success/warning/danger/info`) resolves in **both** light and `.dark`.
  - No component-referenced token is undefined in either theme.

**E2.1.2 — Implement gradient, glow, and glass tokens**

- Depends on: E2.1.1
- Acceptance criteria:
  - `gradient-brand-text`, `gradient-brand-cta`, `glow-ambient`, `glow-focus`, `glass-surface`, `glass-border-glow` defined per §2.
  - Glass/glow are dark-mode-forward (dialed down or omitted in light mode) as the spec requires.

**E2.1.3 — Implement typography scale + weight discipline**

- Depends on: —
- Acceptance criteria:
  - Type tokens `display-2xl…micro` + `mono-md` defined with the specified sizes (fluid `clamp()` where noted), line-heights, weights, letter-spacing (§1).
  - Only weights 400/500/600 are available/used; Geist Sans (UI/display) and Geist Mono (numeric/data) mapped correctly.

**E2.1.4 — Implement spacing, radius, breakpoint tokens**

- Depends on: —
- Acceptance criteria:
  - Spacing scale (`space-1…48`) aligned to Tailwind's 4px grain; radius scale (`radius-xs…full`, no in-between values); breakpoint tokens (`bp-blocked…bp-desktop-xl`) per §3/§4/§9.

**E2.1.5 — Implement motion + elevation tokens**

- Depends on: E2.1.1
- Acceptance criteria:
  - Duration tokens (`motion-instant…cinematic`) and easing tokens (`ease-standard`, `ease-in`, `ease-spring-ui`, `ease-spring-ambient`) exposed for both CSS and Framer Motion consumption (§5).
  - Elevation levels `elevation-0…5` defined with theme-differentiated treatment (shadow in light, lightness-shift/glow in dark) per §7.

## Feature 2.2 — Token Governance

**E2.2.1 — Automated contrast verification of the token pairing matrix**

- Depends on: E2.1.1
- Acceptance criteria:
  - A script (run in CI or as a test) checks all text/background semantic-token pairs in both themes against WCAG AA (≥4.5:1 body, ≥3:1 large/UI) — resolving the `design-system.md` §8 TODO.
  - Any failing pair is either fixed or explicitly waived with rationale; result documented in `design-system.md`.

**E2.2.2 — Link `design-system.md` to the token source of truth**

- Depends on: E2.1.1–E2.1.5
- Acceptance criteria:
  - `design-system.md` "Future Improvements" resolved: the doc now links `globals.css` as the source of truth and positions itself as the rationale layer.

**E2.2.3 — [DECISION] Confirm typeface licensing sign-off**

- Depends on: —
- Acceptance criteria:
  - Geist Sans/Mono SIL OFL licensing confirmed with brand/legal owner; `design-system.md` §1 TODO closed or flagged blocked with a named owner. (Business/legal fact — do not self-certify.)

---

# EPIC 3 — UI Primitives Library

**Goal:** Build the tier-1 primitives in `components/ui/` that every higher tier composes. All are content-agnostic, token-styled, `axe`-clean.

## Feature 3.1 — Form & Action Primitives

**E3.1.1 — `Button`**

- Depends on: E2.1.*
- Acceptance criteria:
  - Variants `primary` (gradient-brand-cta) / `secondary` / `ghost` / `link`; sizes `sm`/`md`/`lg`; disabled + loading states.
  - Renders a real `<button>` (or `<a>` when `asChild`/link); visible focus ring; ≥44px hit area; no hardcoded copy.

**E3.1.2 — `Input`, `Textarea`**

- Depends on: E2.1.*
- Acceptance criteria:
  - Wired to the focus-ring token; error/invalid visual state; forwards refs; associates with external `<label>` via `id`.

**E3.1.3 — `Select`, `Checkbox`**

- Depends on: E2.1.*
- Acceptance criteria:
  - Built on `radix-ui` primitives; keyboard-operable; focus-visible ring; checked/indeterminate states styled from tokens.

## Feature 3.2 — Display & Overlay Primitives

**E3.2.1 — `Badge`**

- Depends on: E2.1.*
- Acceptance criteria:
  - Variants sufficient for "Available Now" vs "Roadmap" tags; state conveyed by **icon/text + color**, never color alone.

**E3.2.2 — `Card`**

- Depends on: E2.1.5
- Acceptance criteria:
  - Elevation variants map 1:1 to `elevation-1…3`; hover raises at most one elevation step; theme-correct in light and dark.

**E3.2.3 — `Dialog` / `Sheet`**

- Depends on: E2.1.*
- Acceptance criteria:
  - Built on `radix-ui`; focus trapped on open and restored on close; `Esc`/overlay-click close; used later by data-room gate and mobile nav.

**E3.2.4 — `Tooltip`**

- Depends on: E2.1.*
- Acceptance criteria:
  - Keyboard-focus and hover triggerable; respects reduced motion; token-styled.

## Feature 3.3 — Iconography

**E3.3.1 — Icon system setup (Lucide base + sizing convention)**

- Depends on: E2.1.4
- Acceptance criteria:
  - A thin wrapper/convention establishes `icon-sm/md/lg/xl` sizes, 1.5px-equivalent stroke at 24px grid, `currentColor` inheritance, default `color-text-secondary` (`design-system.md` §6).
  - Icons are inline SVG components, never `<img>`/`next/image`.

**E3.3.2 — Custom icon scaffold (Company Brain node types, Agent, module glyphs)**

- Depends on: E3.3.1
- Acceptance criteria:
  - At least the placeholder set needed by Home/Products drawn on the same 24px / 1.5px grid; visually consistent with the Lucide base weight.

---

# EPIC 4 — Theme & Layout Chrome

**Goal:** The persistent shell — theming, navigation, footer, responsive gates, page wrapper — so pages compose into a coherent site.

## Feature 4.1 — Theming Infrastructure

**E4.1.1 — `ThemeProvider` + server-read initial theme**

- Depends on: E2.1.1
- Acceptance criteria:
  - Light/dark/explicit-override supported and persisted (cookie + localStorage); root layout reads the cookie server-side to set the initial `<html>` class → no flash-of-wrong-theme (`frontend.md` §4/§9, `design-system.md` §10).
  - No "system-only" lock-in.

**E4.1.2 — `ThemeToggle`**

- Depends on: E4.1.1, E3.1.1
- Acceptance criteria:
  - Instant token swap (no transition longer than `motion-fast`); accessible label; keyboard-operable; emits a GA4 event hook (wired in E14).

**E4.1.3 — Enhance root `layout.tsx`**

- Depends on: E4.1.1
- Acceptance criteria:
  - Mounts `ThemeProvider`, a real skip-to-content link, and the analytics boot slot; keeps self-hosted Geist fonts; semantic landmarks present.

## Feature 4.2 — Navigation & Footer

**E4.2.1 — `Nav` (desktop, dropdown clusters)**

- Depends on: E4.1.2, E3.2.3, E3.3.1
- Acceptance criteria:
  - Matches `information-architecture.md` §2: Platform▾ / Vision / Investors / Company▾ / persistent Join-Waitlist button / theme toggle.
  - Keyboard-navigable dropdowns; `glass-surface` treatment; active-route indication.

**E4.2.2 — `Nav` mobile menu**

- Depends on: E4.2.1
- Acceptance criteria:
  - `Sheet`-based mobile menu with focus trap; all top-level + nested links reachable; ≥44px targets.

**E4.2.3 — `Footer`**

- Depends on: E3.3.1
- Acceptance criteria:
  - Four columns + bottom bar per `information-architecture.md` §4; every site page reachable within one click (incl. `/partners`, which is excluded from header nav); theme toggle + Join-Waitlist repeated.

## Feature 4.3 — Layout Wrappers & Gates

**E4.3.1 — `PageShell`**

- Depends on: E2.1.4
- Acceptance criteria:
  - Enforces `bp-desktop-xl` max-width cap (~1440–1600px centered) and vertical rhythm spacing between sections; no page hand-rolls container widths (`frontend.md` §4).

**E4.3.2 — `MobileBlockScreen` (<390px lockout)**

- Depends on: E2.1.*
- Acceptance criteria:
  - Full-screen premium lockout below 390px (`design-system.md` §9 `bp-blocked`, PRD §7); mounted once at the marketing layout level; has an E2E test asserting it appears.

**E4.3.3 — Marketing route group + layout**

- Depends on: E4.2.1, E4.2.3, E4.3.1, E4.3.2
- Acceptance criteria:
  - `app/(marketing)/layout.tsx` renders `Nav` + children + `Footer`, mounts `MobileBlockScreen`, wraps content in `PageShell`.

**E4.3.4 — Legal route group**

- Depends on: E4.3.3
- Acceptance criteria:
  - `app/(legal)/` reuses the marketing chrome (no separate layout duplication) per `frontend.md` §4.

---

# EPIC 5 — Motion System

**Goal:** The shared Framer Motion primitives and the single reduced-motion path, so no section re-implements motion or the accessibility fallback.

## Feature 5.1 — Motion Foundation

**E5.1.1 — `LazyMotion` provider + `useReducedMotion` hook**

- Depends on: E2.1.5
- Acceptance criteria:
  - `LazyMotion` with `domAnimation` feature bundle configured (not full `motion` import) per `frontend.md` §8.
  - `hooks/useReducedMotion.ts` wraps Framer's check and is the single source every motion primitive consumes.

**E5.1.2 — `Reveal` primitive**

- Depends on: E5.1.1
- Acceptance criteria:
  - Scroll-triggered fade/translate via `whileInView`, pulling duration/easing from tokens; reduced-motion → opacity-only at `motion-fast`; content fully rendered for keyboard/no-JS users.

**E5.1.3 — `Stagger` primitive**

- Depends on: E5.1.1
- Acceptance criteria:
  - Wraps `staggerChildren` at the 40–80ms token increment; caps recommended sibling count guidance (≤6–8); reduced-motion degrades correctly.

**E5.1.4 — `Parallax` primitive**

- Depends on: E5.1.1
- Acceptance criteria:
  - Wraps `useScroll`/`useTransform` at 0.3–0.5x ratio, never inverting; disabled under reduced motion and below `bp-tablet`.

**E5.1.5 — `ChapterTransition` primitive**

- Depends on: E5.1.1
- Acceptance criteria:
  - Home's cinematic cross-chapter beat at `motion-cinematic`; reduced-motion equivalent; usable by the Home page tree only.

---

# EPIC 6 — Molecules & Shared Section Components

**Goal:** Content-agnostic tier-2 molecules plus the reused organisms whose duplication the architecture explicitly forbids (parametrized by `variant`).

## Feature 6.1 — Molecules

**E6.1.1 — `SectionHeading`**

- Depends on: E2.1.3
- Acceptance criteria:
  - Headline + sub-headline pattern used on every page; accepts copy as props (never imports copy); correct heading level independent of visual size.

**E6.1.2 — `StatCallout`**

- Depends on: E2.1.3
- Acceptance criteria:
  - Single-number callouts (TAM/ARR/the ₹/$ cost stats) rendered in Geist Mono tabular figures; label + value; token-styled.

**E6.1.3 — `CalloutBox`**

- Depends on: E3.2.2
- Acceptance criteria:
  - "THE CORE INSIGHT" / "THE FUNDAMENTAL DIFFERENCE" styled emphasis block; variant support; accessible as a semantic aside.

**E6.1.4 — `ModuleCard`**

- Depends on: E3.2.1, E3.2.2, E3.3.2
- Acceptance criteria:
  - Products suite card carrying an Available/Roadmap `Badge`; hover elevation ≤1 step; state not color-only.

**E6.1.5 — `FormField`**

- Depends on: E3.1.2
- Acceptance criteria:
  - `<label htmlFor>` + input + inline error linked via `aria-describedby`; error shown next to the field, never a top-of-page alert (`coding-standards.md` error handling).

## Feature 6.2 — Reused CTA & Shared Organisms

**E6.2.1 — `CTABand`**

- Depends on: E3.1.1
- Acceptance criteria:
  - The one consistent end-of-page waitlist CTA reused on every non-legal page (`information-architecture.md` §6, `website-strategy.md` §6); accepts a variant but is a single component, not per-page rebuilds. (Wires to `WaitlistForm` once E8 exists.)

**E6.2.2 — `RoadmapTrack` (`variant="teaser"|"full"`)**

- Depends on: E5.1.2, E6.1.1
- Acceptance criteria:
  - One component drives both Home Ch.8 (teaser) and `/investors` (full) from different data (`frontend.md` §3); roadmap horizons from `enterprise-os.md`.

**E6.2.3 — `CompetitorTeardownTable` / `SixMoatsList` (`variant="teaser"|"full"`)**

- Depends on: E6.1.1
- Acceptance criteria:
  - Shared by Home Ch.7.5 and `/investors`, same reuse pattern; table is a real accessible `<table>` with headers; horizontally scrollable within its own container on narrow viewports.

---

# EPIC 7 — Data Layer & API Seam

**Goal:** The backend-migration seam (`frontend.md` §11) and the persistence for waitlist/newsletter/contact/demo/partner, so a future NestJS/Go backend swaps in without touching components.

## Feature 7.1 — Supabase Boundary

**E7.1.1 — Supabase client/server/types module**

- Depends on: E1.3.2
- Acceptance criteria:
  - `lib/supabase/{client,server,types}.ts` are the **only** files importing `@supabase/supabase-js`; the ESLint restriction from E1.1.1 passes; env consumed via `src/env.ts`.

**E7.1.2 — Provision Supabase schema (waitlist, newsletter, contact, demo, partner, analytics-event)**

- Depends on: E1.3.3, E7.1.1
- Acceptance criteria:
  - Tables + RLS policies created per PRD §5 for the six write surfaces; migration/SQL committed under version control; dev vs. prod isolation follows the E1.3.3 ADR.

## Feature 7.2 — `lib/api` Wrappers

**E7.2.1 — `submitWaitlist` + Zod schema**

- Depends on: E7.1.1
- Acceptance criteria:
  - Thin `lib/api/waitlist.ts` wrapper with a shared Zod schema and typed result (`{ ok } | { error }`); no component references Supabase directly; unit-tested with a mocked client.

**E7.2.2 — `submitNewsletter`, `submitContact`, `requestDemo`, `submitPartnerApplication` wrappers**

- Depends on: E7.1.1
- Acceptance criteria:
  - Each has a Zod schema + typed result + unit tests; all route through `lib/api/*` only.

## Feature 7.3 — API Routes

**E7.3.1 — `api/waitlist` route handler**

- Depends on: E7.2.1
- Acceptance criteria:
  - Validates with the shared schema, calls `lib/api`, returns a typed `{ error: string }` shape on failure (never leaks a stack); edge-eligible where practical.

**E7.3.2 — `api/newsletter`, `api/contact`, `api/demo-request`, `api/partner-application` route handlers**

- Depends on: E7.2.2
- Acceptance criteria:
  - Same validation/typed-error contract as E7.3.1 for each surface.

---

# EPIC 8 — Forms

**Goal:** The lead-capture surfaces — the site's primary conversion mechanism — each self-contained (RHF + Zod) and fully accessible.

## Feature 8.1 — Primary Conversion Forms

**E8.1.1 — `WaitlistForm`**

- Depends on: E6.1.5, E7.2.1, E7.3.1
- Acceptance criteria:
  - React Hook Form + shared Zod schema; submits via `lib/api`; success/error microcopy announced through an `aria-live="polite"` region; inline field errors; redirects/links to `/waitlist/thank-you`.

**E8.1.2 — `NewsletterInline`**

- Depends on: E6.1.5, E7.2.2, E7.3.2
- Acceptance criteria:
  - Compact single-field inline variant; same accessibility + `lib/api` rules; used in footer/blog.

**E8.1.3 — `DemoRequestForm`**

- Depends on: E6.1.5, E7.2.2, E7.3.2
- Acceptance criteria:
  - Fields per Contact page needs; validation; `lib/api` submission; accessible status announcement.

**E8.1.4 — `PartnerApplicationForm`**

- Depends on: E6.1.5, E7.2.2, E7.3.2
- Acceptance criteria:
  - CA/CS channel fields (referral structure context); validation; `lib/api` submission; accessible.

**E8.1.5 — Connect `CTABand` to `WaitlistForm`**

- Depends on: E6.2.1, E8.1.1
- Acceptance criteria:
  - `CTABand` renders/opens the waitlist capture consistently everywhere it appears; one integration, reused.

---

# EPIC 9 — Home Page Narrative

**Goal:** The 10(+2)-chapter cinematic Home spine (`information-architecture.md` §3), each chapter a `Section` organism consuming `docs/product/copy.md`, one signature motion each. **Pull copy from the copy deck — never improvise it.**

## Feature 9.1 — Home Infrastructure

**E9.1.1 — Home `ScrollProgressProvider` (Home-tree-scoped)**

- Depends on: E5.1.1
- Acceptance criteria:
  - Lightweight context local to the Home tree (not global) driving nav active-chapter highlight + optional progress indicator (`frontend.md` §4/§9).

**E9.1.2 — Home page assembly + `generateMetadata`**

- Depends on: E4.3.3, E9.1.1
- Acceptance criteria:
  - `app/(marketing)/page.tsx` composes chapter Sections in order and sets metadata; single H1; ends on `CTABand`.

## Feature 9.2 — Narrative Chapters (one task each)

Each task: build the chapter `Section` from the matching `docs/product/copy.md` section, one signature motion + reduced-motion equivalent, tokens only, unique copy (esp. Ch.9 — must be summary copy, not a `/vision` duplicate, per SEO canonical rule).

**E9.2.1 — Ch.1 World Today** · Depends on: E5.1.2, E6.1.1
**E9.2.2 — Ch.2 Hidden Cost** (uses `StatCallout` for the $52K–$220K / ₹1.5Cr stat) · Depends on: E6.1.2
**E9.2.3 — Ch.3 A Better Way** · Depends on: E5.1.2
**E9.2.4 — Ch.4 Company Brain intro** (uses `CalloutBox` core-insight) · Depends on: E6.1.3
**E9.2.5 — Ch.7 Enterprise OS** · Depends on: E6.1.1
**E9.2.6 — Ch.8.5 Why Now** · Depends on: E6.1.1
**E9.2.7 — Ch.9 Vision teaser (unique summary copy)** · Depends on: E5.1.2
**E9.2.8 — Ch.10 Waitlist** · Depends on: E6.2.1, E8.1.5

- Acceptance criteria (all E9.2.x):
  - Renders the exact copy-deck section; exactly one signature motion; reduced-motion opacity-only fallback; keyboard user sees full content; tokens only; correct heading hierarchy.

## Feature 9.3 — Signature Visualizations

**E9.3.1 — [DECISION] CompanyBrainGraph rendering approach**

- Depends on: —
- Acceptance criteria:
  - Decide physics/force-graph library (e.g., d3-force / react-force-graph) vs. bespoke; recorded resolving `frontend.md` §10 TODO; performance/bundle implications noted.

**E9.3.2 — Ch.5 `CompanyBrainGraph` (isolated, code-split client component)**

- Depends on: E9.3.1, E5.1.1
- Acceptance criteria:
  - `next/dynamic` `ssr:false` + IntersectionObserver-gated mount; Framer Motion only for entrance; entity graph reflects `company-brain.md` (Entity Graph / Event / Context / Decision Intelligence).
  - Not driven by Framer Motion's transition system; loads only when scrolled near; never blocks first paint.

**E9.3.3 — `CompanyBrainGraph` accessible text alternative**

- Depends on: E9.3.2
- Acceptance criteria:
  - Visually-hidden structured text/table of the same entity relationships, toggleable via a visible "view as text" control; crawlable static equivalent present in the same DOM position (`accessibility.md`, `frontend.md` §6/§7).

**E9.3.4 — Ch.6 `AgentOrchestrationDiagram` + CEO Intelligence Agent vignette**

- Depends on: E5.1.2
- Acceptance criteria:
  - Renders the CEO Intelligence Agent vignette from `ai-agents.md` verbatim/near-verbatim ("show, don't tell"); multi-agent orchestration depicted; accessible fallback for any non-text visual.

**E9.3.5 — Ch.7.5 Why We Win + Ch.8 Roadmap (mount shared organisms)**

- Depends on: E6.2.2, E6.2.3
- Acceptance criteria:
  - Home mounts `CompetitorTeardownTable`/`SixMoatsList` and `RoadmapTrack` in `variant="teaser"`, linking to `/investors` and `/products` respectively.

---

# EPIC 10 — Platform, Product & Trust Pages

**Goal:** The product-substance pages. Reuse Home organisms in `variant="full"` where applicable.

## Feature 10.1 — Company Brain & Agents

**E10.1.1 — `/company-brain` page**

- Depends on: E9.3.2, E6.1.1, E6.1.3
- Acceptance criteria:
  - Sections per `information-architecture.md` §3: plain-English hero → entity-graph deep-dive → Context Engine → Decision Intelligence → the "why did Bangalore payroll rise 12%?" worked example → `CTABand`. Reuses the graph component. Cross-links to `/products` and `/security`.

**E10.1.2 — [DECISION] `/agents` standalone vs. fold into `/company-brain`**

- Depends on: —
- Acceptance criteria:
  - Resolve the open `information-architecture.md` §8 TODO; update the sitemap tree + nav in the same change; if standalone, scope its sections from `ai-agents.md`.

## Feature 10.2 — Products & Security

**E10.2.1 — `/products` suite grid + per-suite anchors**

- Depends on: E6.1.4
- Acceptance criteria:
  - 8-suite grid (`enterprise-os.md`), each module tagged Available vs Roadmap via `Badge` — resolving the MVP-vs-roadmap presentation (PRD §19.4). **No module asserted "Available" without founder confirmation** (`hrms.md` open question); unconfirmed → Roadmap or `TODO`. Cross-links to `/company-brain` and `/security`.

**E10.2.2 — `/security` page**

- Depends on: E6.1.1
- Acceptance criteria:
  - Sections: data residency (India/UK/US) → DPDP/GDPR/CCPA approach → encryption/access model (`information-architecture.md` §3). Highest-leverage page for the CFO/HR-Head persona; claims stay factual (no invented certifications).

---

# EPIC 11 — Investor, Vision & Company Pages

**Goal:** Trust/narrative pages for investors, press, and candidates. Founder/business facts that don't exist become `TODO` placeholders — never fabricated.

## Feature 11.1 — Investor & Vision

**E11.1.1 — `/vision` page (canonical Vision narrative)**

- Depends on: E5.1.5, E6.1.1
- Acceptance criteria:
  - Full 10-year narrative, Windows/iOS analogy, Enduring Promise (`enterprise-os.md`); set as canonical (Home Ch.9 stays unique summary) per SEO rule.

**E11.1.2 — `/investors` page**

- Depends on: E6.2.2, E6.2.3, E6.1.2
- Acceptance criteria:
  - Why Now → TAM/SAM/SOM → Why We Win → Six Moats → Roadmap + revenue targets → unit economics → CTA to Data Room; reuses `RoadmapTrack`/`SixMoatsList` in `variant="full"`; conflicting TAM figures surfaced as a decision, not silently picked (PRD §22).

**E11.1.3 — `/investors/data-room` gated page**

- Depends on: E3.2.3, E8.1.1
- Acceptance criteria:
  - Gated email capture → deck/one-pager download → optional founder follow-up; ships `noindex, nofollow`; gating mechanism per the resolved `information-architecture.md` §8 / PRD §22.6 decision.

**E11.1.4 — [DECISION] Data-room gating mechanism**

- Depends on: —
- Acceptance criteria:
  - Confirm the gate (email-only vs. verified access vs. manual approval); recorded; unblocks E11.1.3.

## Feature 11.2 — Company Pages

**E11.2.1 — `/about` page** · Depends on: E6.1.1 — origin story, links to Vision + Team.
**E11.2.2 — `/team` page** · Depends on: E6.1.1 — founder bios/advisors + hiring tie-in; **all bios are `TODO` placeholders until founders provide them** (`information-architecture.md` note, PRD §18.1/§22.5). Photos via `next/image`.
**E11.2.3 — `/careers` page** · Depends on: E8.1.* — premium "coming soon" + culture teaser + register-interest form; `JobPosting` schema deferred until real roles exist.
**E11.2.4 — `/partners` page** · Depends on: E8.1.4 — CA/CS channel pitch + referral structure + apply CTA; footer-linked, not in header nav.
**E11.2.5 — `/contact` page** · Depends on: E8.1.3 — demo request (primary) + general inquiry + partner-inquiry redirect.

- Acceptance criteria (all E11.2.x): sections per `information-architecture.md` §3; single H1; `CTABand`; missing business facts are visible `TODO`s, never invented.

## Feature 11.3 — Legal & Confirmation

**E11.3.1 — `/privacy` + `/terms`** · Depends on: E4.3.4 — trust-building intro framing, not raw boilerplate; legal copy from source or flagged `TODO`.
**E11.3.2 — `/waitlist/thank-you`** · Depends on: E8.1.1 — confirmation state after signup; suppressed from primary nav.
**E11.3.3 — `not-found.tsx`** · Depends on: E4.3.3 — on-brand 404 within the marketing shell.

---

# EPIC 12 — Blog & Content Engine

**Goal:** The SEO growth engine (`seo.md` rule 7) — MDX blog with day-one category taxonomy and the compliance calculators from the GTM plan.

## Feature 12.1 — Blog Platform

**E12.1.1 — MDX pipeline + frontmatter contract**

- Depends on: E4.3.3
- Acceptance criteria:
  - MDX authoring in `content/blog/*.mdx` with `title`/`description`/`date`/`category` frontmatter; typed loader; `generateStaticParams` for `blog/[slug]`.

**E12.1.2 — `/blog` index + category taxonomy**

- Depends on: E12.1.1
- Acceptance criteria:
  - Category taxonomy (Compliance Guides, Product & Engineering, Vision, Company News — `copy.md` §12) present from the first post; filterable listing; `BreadcrumbList` schema.

**E12.1.3 — `/blog/[slug]` post template**

- Depends on: E12.1.1
- Acceptance criteria:
  - Statically generated; `Article` structured data; links back to relevant `/products` module + Home waitlist CTA (the SEO→PLG funnel, `information-architecture.md` §6).

## Feature 12.2 — Compliance Calculators (SEO assets)

**E12.2.1 — PF calculator**

- Depends on: E12.1.1, E3.1.*
- Acceptance criteria:
  - Interactive, accessible calculator embeddable in an MDX post; logic unit-tested; figures in Geist Mono; crawlable static explanation alongside the interactive widget.

**E12.2.2 — TDS calculator** · Depends on: E12.1.1, E3.1.* — same contract as E12.2.1.
**E12.2.3 — GST calculator / Form 16 helper** · Depends on: E12.1.1, E3.1.* — same contract as E12.2.1.

---

# EPIC 13 — SEO, Metadata & Structured Data

**Goal:** Satisfy every rule in `seo.md` / `frontend.md` §6 structurally, so no page can ship without unique metadata.

## Feature 13.1 — Metadata & Crawl

**E13.1.1 — `lib/seo/metadata.ts` builder (defaults + per-page overrides)**

- Depends on: E2.1.3
- Acceptance criteria:
  - Centralized metadata builder sourcing per-page titles/descriptions from `copy.md`; every page uses `generateMetadata`; canonical URLs set explicitly (`/vision` canonical for the Vision narrative).

**E13.1.2 — `sitemap.ts` + `robots.ts`**

- Depends on: E13.1.1
- Acceptance criteria:
  - Programmatic sitemap with the priority tiers from `information-architecture.md` §7; `/investors/data-room` and any gated route excluded (`noindex, nofollow`); canonical domain per the E13.1.3 decision.

**E13.1.3 — [DECISION] Canonical domain (apex vs. www)**

- Depends on: —
- Acceptance criteria:
  - Confirmed and recorded (`seo.md` TODO closed); unblocks sitemap/robots absolute URLs.

## Feature 13.2 — Structured Data & Social

**E13.2.1 — `<StructuredData>` component + `Organization` schema**

- Depends on: E4.1.3
- Acceptance criteria:
  - Shared JSON-LD component; `Organization` in root layout; validates against a schema linter.

**E13.2.2 — `Article` / `BreadcrumbList` / `JobPosting` schemas**

- Depends on: E13.2.1
- Acceptance criteria:
  - `Article` per blog post, `BreadcrumbList` on Blog/Products, `JobPosting` gated behind real Careers roles existing.

**E13.2.3 — Dynamic OG image route (`api/og`)**

- Depends on: E2.1.1, E2.1.3
- Acceptance criteria:
  - `next/og` route generating per-archetype images (home / generic page / blog post), token-consistent, aggressively cached; referenced by metadata builder.

---

# EPIC 14 — Analytics & Instrumentation

**Goal:** GA4 measurement of the CTA hierarchy without modeling analytics as state.

**E14.1 — GA4 boot + `trackEvent`/`trackPageView` helpers**

- Depends on: E4.1.3, E1.3.2
- Acceptance criteria:
  - GA4 loaded via `next/script` `afterInteractive`; `lib/analytics/*` fire-and-forget helpers; `NEXT_PUBLIC_GA_MEASUREMENT_ID` gated (no-op when unset).

**E14.2 — Instrument conversion + theme events**

- Depends on: E14.1, E8.1.1, E4.1.2
- Acceptance criteria:
  - Waitlist submit, demo request, partner apply, and theme-toggle events fire (PRD §10); no PII sent; helpers unit-tested (mocked).

**E14.3 — [OPTIONAL] Evaluate Partytown worker offload**

- Depends on: E14.1, E1.2.4
- Acceptance criteria:
  - Measure GA4 main-thread cost in Lighthouse; adopt `strategy="worker"` only if it measurably helps; decision recorded in `frontend.md` §8.

---

# EPIC 15 — Testing, Accessibility & Launch Hardening

**Goal:** Make quality gates real, per `testing.md` / `accessibility.md` / `deployment.md`.

## Feature 15.1 — Test Infrastructure

**E15.1.1 — [DECISION] + set up unit/component runner (Vitest recommended)**

- Depends on: —
- Acceptance criteria:
  - Runner chosen (Vitest vs Jest — `testing.md` TODO) and configured with React Testing Library; a sample `lib/` unit test and a `Button` component test pass locally.

**E15.1.2 — Playwright setup**

- Depends on: E15.1.1
- Acceptance criteria:
  - Playwright installed/configured; a smoke test (Home renders, has one H1) passes locally and headless.

**E15.1.3 — `@axe-core` integration (dev + Playwright)**

- Depends on: E15.1.2
- Acceptance criteria:
  - `@axe-core/react` in dev; `@axe-core/playwright` axe pass in E2E; a known violation fails the run (`accessibility.md` TODO).

## Feature 15.2 — Critical-Path E2E

**E15.2.1 — Critical user-path E2E suite**

- Depends on: E15.1.2, E8.1.1, E4.1.2, E4.3.2
- Acceptance criteria:
  - E2E covers: waitlist signup end-to-end, demo request submit, theme-toggle persistence across reload, and the <390px lockout appearing (`testing.md`); runs green in CI (E1.2.3).

## Feature 15.3 — Launch Hardening

**E15.3.1 — Manual screen-reader + keyboard pass**

- Depends on: E9._, E10._, E11.*
- Acceptance criteria:
  - VoiceOver/NVDA + keyboard-only walkthrough of every route; issues automated axe missed are filed and fixed; graph "view as text" verified.

**E15.3.2 — Cross-breakpoint visual QA**

- Depends on: E9._, E10._, E11.*
- Acceptance criteria:
  - Every route verified across `bp-mobile-lg…bp-desktop-xl` in both themes, incl. ultrawide max-width cap and section-spacing scale-down.

**E15.3.3 — Lighthouse budget verification on real content**

- Depends on: E1.2.4, E12._, E13._
- Acceptance criteria:
  - Representative routes hit Performance ≥95 / A11y 100 / SEO 100 / Best-Practices 100 on production builds with real copy and images; any miss fixed before launch tag.

**E15.3.4 — Reduced-motion full-site pass**

- Depends on: E9._, E5._
- Acceptance criteria:
  - With `prefers-reduced-motion: reduce`, every chapter/section renders full content with opacity-only transitions, no parallax/3D, and no auto-playing graph animation (`animations.md`, `design-system.md` §5 principle 4).

---

## Cross-Cutting Decision Log (resolve early — they block dependents)

| ID      | Decision                                | Blocks                      |
| ------- | --------------------------------------- | --------------------------- |
| E1.3.3  | Supabase env isolation (project vs RLS) | E7.1.2                      |
| E2.2.3  | Geist typeface licensing sign-off       | — (legal)                   |
| E9.3.1  | CompanyBrainGraph: library vs bespoke   | E9.3.2, E10.1.1             |
| E10.1.2 | `/agents` standalone vs folded          | nav/sitemap                 |
| E11.1.4 | Data-room gating mechanism              | E11.1.3                     |
| E13.1.3 | Canonical domain apex vs www            | E13.1.2                     |
| E15.1.1 | Unit test runner Vitest vs Jest         | E1.2.2, all component tests |

## Business-Fact Placeholders (never invent — `TODO` until sourced)

Founder bios/photos (`/team`), finalized pricing (`/products`), legal entity details (legal pages), any "Available Now" module status (`/products` — confirm with founders per `hrms.md`), conflicting TAM/SAM/SOM figures (`/investors` — PRD §22), real Careers roles (`JobPosting` schema).

---

## Design Decisions

- **Sequencing is dependency-driven, not value-driven.** Tokens (E2) and chrome (E3–E5) precede pages because every page depends on them; a "start with the highest-value page" ordering would repeatedly block on missing primitives. Within the page epics, order by shared-component readiness.
- **The Universal DoD is stated once, not per task.** Repeating twelve DoD bullets across ~150 tasks would violate the repo's no-duplication rule and rot on the first convention change; tasks inherit it by reference.
- **Decisions are first-class tasks.** Every open `TODO`/`[DECISION]` scattered across `.claude/` is surfaced as an explicit, dependency-carrying task so it's resolved deliberately rather than defaulted silently mid-implementation.
- **Scaffold is treated as Done, not re-scoped.** Several context docs still say "no code exists yet"; the backlog reflects the _actual_ repo (scaffold present) and flags those docs' "Current Status" sections for update as their subjects get implemented.

## Current Status

Backlog authored from the `.claude/` corpus and the current repo baseline (2026-07-05).

**Phase 10 (Core Infrastructure) — done:** the bulk of **E2** (design tokens, incl. gradient/glass/glow; contrast-matrix check E2.2.1 still open), **E3** (UI primitives — Button, Card, typography, Spinner, Image; Dialog via Radix in the mobile nav), **E4** (theme + layout chrome — ThemeProvider/Script/Toggle, PageShell/Container/Section/Grid/Stack, Navbar, Footer; MobileBlockScreen and the `(marketing)` route group still pending page-building), **E5** (motion primitives), and the metadata/sitemap/robots/structured-data slice of **E13** (E13.1.1–E13.2.2, minus the dynamic OG route E13.2.3). Plus utility hooks, `Image`, and App Router state files. Verified: typecheck, lint, build, format all clean. Catalog: [`docs/architecture/frontend-infrastructure.md`](../architecture/frontend-infrastructure.md).

**E1 (Engineering Foundation & CI/CD) — first slice done:** the `@supabase/*` import-boundary ESLint rule and zero-warning lint (E1.1.1), Prettier + Tailwind ordering confirmed and a repo-wide `.gitattributes` (`eol=lf`) so the format gate behaves identically on Windows and CI (E1.1.2), Husky pre-push typecheck (E1.1.3), the base `.github/workflows/ci.yml` gate — lint → format → typecheck → build (E1.2.1), the Vitest test step wired into CI (E1.2.2), the PR template encoding the doc-sync checklist (E1.3.1), and `.env.example` ↔ `environment-variables.md` reconciliation (E1.3.2). Still open in E1: the E2E/Lighthouse CI steps (E1.2.3–E1.2.4) and the Supabase env-isolation ADR (E1.3.3). Concept explainer for non-engineers: [`docs/engineering/quality-gates-explained.md`](../engineering/quality-gates-explained.md).

**E15.1.1 (test runner) — done:** Vitest + React Testing Library configured ([`vitest.config.ts`](../../vitest.config.ts)), with a `lib/` unit test and a `Button` component test passing in CI. Decision recorded in [`.claude/context/testing.md`](../../.claude/context/testing.md).

**E6 (molecules) — first slice done:** the content-agnostic presentational molecules `SectionHeading` (E6.1.1), `StatCallout` (E6.1.2), and `CalloutBox` (E6.1.3), each with component tests, in a new `src/components/molecules/` folder (recorded in [`frontend.md`](../../.claude/context/frontend.md) §1–2). Still open in E6: `ModuleCard` (E6.1.4, blocked on `Badge` E3.2.1 + custom icons E3.3.2), `FormField` (E6.1.5, blocked on `Input`/`Textarea` E3.1.2), and the shared organisms `CTABand`/`RoadmapTrack`/`CompetitorTeardownTable` (E6.2.x).

Not started: E7–E12, E14, and the rest of E15 (Playwright/E2E, axe, launch hardening), plus all marketing/page work. Task IDs are stable and safe to reference from a tracker.

## Future Improvements

- Add rough estimates/story points and a suggested milestone grouping (e.g., "Internal alpha = E1–E9", "Public launch = +E10–E15") once a team/velocity exists.
- Once a tracker (GitHub Projects/Linear) is adopted, mirror these IDs there and let this file become the rationale/source rather than the live board.

## TODO

- [ ] Assign a DRI per epic.
- [ ] Resolve the seven Cross-Cutting Decision Log items before their dependents start.
- [ ] Reconcile the stale "no code exists yet" claims in `architecture.md`, `frontend.md`, `design-system.md`, etc., as each subject is implemented (per the `workflows.md` sync rule).

## References

- `.claude/context/*` — every standing rule these tasks satisfy (architecture, design-system, frontend, coding-standards, accessibility, seo, animations, testing, deployment, workflows, information-architecture, branding, repository)
- `.claude/knowledge/*` — domain concepts (company-brain, hrms, ai-agents, enterprise-os) the content tasks draw from
- [`docs/product/prd.md`](./prd.md), [`docs/product/copy.md`](./copy.md), [`docs/product/website-strategy.md`](./website-strategy.md) — requirements, copy, and narrative the tasks implement
- [`CLAUDE.md`](../../CLAUDE.md) — the constitution governing every task's DoD

## Related Documents

- [`.claude/context/frontend.md`](../../.claude/context/frontend.md)
- [`.claude/context/information-architecture.md`](../../.claude/context/information-architecture.md)
- [`.claude/context/workflows.md`](../../.claude/context/workflows.md)

---

**Last Updated:** 2026-07-05
**Owner:** Orgofin Engineering (TODO: assign a DRI)
