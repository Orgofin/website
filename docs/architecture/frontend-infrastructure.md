# Frontend Infrastructure Catalog

> **Purpose:** The catalog of the shared frontend foundation built in Phase 10 (Core Infrastructure) — what exists, where it lives, and how to consume it. Every future page/section builds on these; none should re-implement them.
> **Applies to:** anyone (human or Claude) building UI on top of the foundation.

**Status:** Implemented and verified (`tsc --noEmit`, `eslint`, `next build`, `prettier --check` all clean). This is a record/reference (a `docs/` artifact); the standing _rules_ these pieces satisfy live in [`.claude/context/`](../../.claude/context/) — this catalogs the implementation, it doesn't restate the rules.

---

## Responsibilities

Owns: the inventory of implemented infrastructure and usage notes. Does **not** own the conventions behind it — tokens ([`design-system.md`](../../.claude/context/design-system.md)), architecture/tiers ([`frontend.md`](../../.claude/context/frontend.md)), motion philosophy ([`animations.md`](../../.claude/context/animations.md)), a11y ([`accessibility.md`](../../.claude/context/accessibility.md)), SEO ([`seo.md`](../../.claude/context/seo.md)).

---

## Folder Structure (implemented)

```
src/
├── app/
│   ├── layout.tsx          # root: fonts, ThemeScript, ThemeProvider, LazyMotion, skip link, JSON-LD, metadata/viewport
│   ├── page.tsx            # placeholder home (NOT the real landing page)
│   ├── globals.css         # design tokens (source of truth)
│   ├── loading.tsx         # route loading UI  → LoadingScreen
│   ├── error.tsx           # route error boundary (client) → ErrorState
│   ├── global-error.tsx    # root error boundary (client, own <html>)
│   ├── not-found.tsx       # 404 → EmptyState
│   ├── sitemap.ts          # programmatic sitemap
│   └── robots.ts           # robots policy
├── components/
│   ├── ui/                 # Button, Card(+parts), Spinner, Image, Heading, Text, Caption, Label, Code, Quote
│   ├── layout/             # Container, Section, PageShell, Grid, Stack, Navbar, Footer (+ spacing.ts)
│   ├── motion/             # LazyMotionProvider, FadeIn, Slide, Scale, Reveal, Stagger, PageTransition, Hoverable, variants.ts
│   ├── theme/              # ThemeProvider, ThemeScript, ThemeToggle
│   ├── seo/                # StructuredData
│   ├── feedback/           # EmptyState, ErrorState, LoadingScreen
│   ├── sections|graph|forms|icons/   # .gitkeep — later phases
├── hooks/                  # useTheme, useMounted, useMediaQuery, useBreakpoint, useIsMobile, useReducedMotion, useScrollPosition
├── lib/
│   ├── seo/                # site.ts (config), metadata.ts (createMetadata), structured-data.ts
│   ├── theme/              # config.ts (storage key + Theme types)
│   ├── motion/             # tokens.ts (durations/easings/springs for Framer)
│   ├── utils.ts            # cn()
│   └── supabase|api|analytics/       # .gitkeep — later phases
└── env.ts                  # typed env (+ NEXT_PUBLIC_SITE_URL)
```

Every folder exposes a barrel `index.ts` (`ui`, `layout`, `motion`, `theme`, `feedback`, `lib/seo`) for ergonomic imports. All exports are named (Next special files excepted).

---

## Design Tokens

Implemented in `app/globals.css` via Tailwind v4 `@theme` / `@theme inline`. Full value reference and the doc-concept → utility-name mapping live in [`design-system.md`](../../.claude/context/design-system.md#implementation--token-source-of-truth). Rule: **components use semantic utilities only** (`bg-surface`, `text-fg`, `border-border`, `text-accent`, `shadow-elevation-2`, `rounded-md`, `text-display-lg`, `ease-standard`, …); primitive scale values are not exposed as utilities.

## Theme System

- `ThemeScript` (server, inlined in `<body>` first) applies the persisted theme class before paint → no flash, and supports **system** detection (which a server cookie can't).
- `ThemeProvider` (client) exposes `{ theme, resolvedTheme, mounted, setTheme, toggleTheme }` via `useTheme()`; persists to `localStorage` (`orgofin-theme`); derives system preference through `useSyncExternalStore`; syncs across tabs.
- `ThemeToggle` cycles light → dark → system; renders the system icon until `mounted` to avoid hydration mismatch.
- Three modes (light/dark/system), all persisted. No `next-themes` dependency.

## Hooks

| Hook                  | Returns / purpose                                                      |
| --------------------- | ---------------------------------------------------------------------- |
| `useTheme()`          | theme context (see above)                                              |
| `useMounted()`        | `boolean`, SSR-safe via `useSyncExternalStore` (no setState-in-effect) |
| `useMediaQuery(q)`    | `boolean`, SSR-safe                                                    |
| `useBreakpoint()`     | `{ breakpoint, width, isAtLeast }` against the device-tier tokens      |
| `useIsMobile()`       | `boolean`, below the `tablet` tier                                     |
| `useReducedMotion()`  | `boolean`, wraps Framer's hook — the single motion-preference source   |
| `useScrollPosition()` | `{ x, y, direction }`, rAF-throttled                                   |

## Motion Primitives

`LazyMotionProvider` (mounted once at root) loads Framer's `domAnimation` bundle with `strict` — all primitives use the lighter `m` component. Every primitive reads durations/easings from `lib/motion/tokens.ts` and degrades to opacity-only via `useReducedMotion`.

- **Mount-triggered:** `FadeIn`, `Slide` / `SlideUp` / `SlideDown`, `Scale`
- **Scroll-triggered:** `Reveal`, `Stagger` + `StaggerItem`
- **Route:** `PageTransition` (for a `template.tsx`)
- **Interaction:** `Hoverable` (spring lift; prefer CSS `hover:` for simple cases)

## Layout Primitives

`Container` (max-width + gutters), `Section` (semantic band + responsive vertical rhythm), `PageShell` (ultrawide content cap), `Grid` (mobile-first responsive columns), `Stack` (flex with gap scale). Content widths and the gap scale are tokenized.

## UI Primitives

- **Actions:** `Button` (variants primary/secondary/outline/ghost/link; sizes sm/md/lg; `iconOnly`; `loading` with spinner; `leftIcon`/`rightIcon`; `asChild` via Radix Slot for links).
- **Surfaces:** `Card` + `CardHeader/Title/Description/Content/Footer` (variants standard/elevated/glass/interactive; one-step hover elevation).
- **Typography:** `Heading` (semantic level decoupled from visual size; optional brand gradient), `Text`, `Caption`, `Label`, `Code`, `Quote`.
- **Media/feedback:** `Image` (next/image + error fallback), `Spinner`.

## Chrome

`Navbar` (client — sticky, glass-on-scroll, desktop dropdown clusters, Radix-Dialog mobile menu with focus trap, active-link support, keyboard-accessible) and `Footer` (columns + utility bar). **Both ship placeholder content only** — real routes are wired in a later phase.

## SEO Infrastructure

- `siteConfig` + `absoluteUrl()` (`lib/seo/site.ts`) — central metadata source.
- `createMetadata()` — per-page `Metadata` with title template, canonical, Open Graph, Twitter Card, robots.
- `structured-data.ts` — `organizationSchema` / `websiteSchema` / `breadcrumbSchema` / `articleSchema`; rendered by `<StructuredData>` (XSS-escaped JSON-LD).
- `app/sitemap.ts`, `app/robots.ts` — programmatic; data room + API disallowed.
- Root layout sets `metadataBase`, default title template, OG/Twitter defaults, and `viewport` theme-color per scheme.

## App States

`loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx` wired to reusable `LoadingScreen` / `ErrorState` / `EmptyState`.

---

## Design Decisions

- **No-flash via inline script, not a cookie.** System-preference detection is only possible client-side; the pre-hydration `ThemeScript` is the correct layer and matches the `next-themes` approach without the dependency. This intentionally supersedes the earlier "server-read cookie" wording in `frontend.md` (now updated).
- **`useSyncExternalStore` over mount effects.** `useMounted` and the theme/system-preference reads avoid `setState`-in-effect (flagged by React 19's lint rule) and are hydration-safe by construction.
- **Semantic-only utilities.** Primitive color scales are not emitted as Tailwind utilities, so a component _cannot_ reach past the semantic layer — the design-system rule is enforced structurally, not by review.
- **Named device-tier breakpoints added, defaults kept.** `mobile/tablet/laptop/desktop/wide` sit alongside Tailwind's `sm…2xl` rather than replacing them, so both vocabularies work.

## Current Status

Complete and verified. Chrome and SEO carry placeholders where real content/routes belong (populated in later phases). No tests yet (the test runner is Epic 15 in the backlog).

## Future Improvements

- Add component/hook unit + a11y tests once the test runner lands (backlog E15).
- Consider a rendered token/component preview page (Storybook or a static gallery).
- Add a dynamic OG image route (`app/api/og`) — currently metadata points at a static `ogImage` path.

## TODO

- [ ] Provide the static `og/default.png` referenced by `siteConfig.ogImage` (or replace with the dynamic OG route).
- [ ] Confirm canonical domain + real social handle in `lib/seo/site.ts` (placeholders, per `seo.md`).
- [ ] Wire these into a `(marketing)` route group layout (Navbar/Footer/PageShell) when page-building begins.

## References

- [`.claude/context/frontend.md`](../../.claude/context/frontend.md), [`design-system.md`](../../.claude/context/design-system.md), [`animations.md`](../../.claude/context/animations.md), [`accessibility.md`](../../.claude/context/accessibility.md), [`seo.md`](../../.claude/context/seo.md)
- [`docs/product/implementation-backlog.md`](../product/implementation-backlog.md) — where this maps to Epics 2–5 & 13

## Related Documents

- [`docs/architecture/platform-overview.md`](./platform-overview.md)

---

**Last Updated:** 2026-07-05
**Owner:** Orgofin Engineering (TODO: assign a DRI)
