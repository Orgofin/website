# Design System

> **Purpose:** Defines the complete visual token vocabulary — typography, color, spacing, radius, motion, iconography, elevation, breakpoints, dark mode — that every component must be built from.
> **Applies to:** anyone (human or Claude) writing UI/styling code. No component may introduce a raw color, size, or duration value that isn't one of these tokens.

**Target quality bar:** Stripe, Linear, Vercel, Notion, Apple.
**Scope:** tokens and rules only. No components are defined here; see [`frontend.md`](./frontend.md) for how components are structured, and [`branding.md`](./branding.md) for voice/copy (a design system covers _how it looks_, not _what it says_).

**Brand mandate this system exists to satisfy** (per [`docs/product/prd.md`](../../docs/product/prd.md) §8 and the founder's original spec): _"NOT standard black/white. An original Orgofin color system... The palette should become part of Orgofin's identity in the same way Claude → warm tones, ChatGPT → green, Linear → dark purple, Apple → neutral elegance."_ Every decision below is made in service of that — nothing here is generic Tailwind-default blue.

---

## Responsibilities

Owns: type scale, color primitives/semantics, spacing, radius, motion tokens, iconography rules, elevation, accessibility minimums, breakpoints, dark-mode approach, and the token-tier architecture. Does not own component structure (`frontend.md`) or copy voice (`branding.md`).

---

## 1. Typography

### Typefaces

| Role                  | Typeface       | Fallback stack                                                    | Rationale                                                                                                                                                                                       |
| --------------------- | -------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI + Display          | **Geist Sans** | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` | Same family Vercel uses for its own product — open license (SIL OFL), geometric but warm, reads as engineering-grade at any size. Matches the "Vercel" bar in the target quality list directly. |
| Numeric / Data / Code | **Geist Mono** | `ui-monospace, "SF Mono", Menlo, monospace`                       | For metrics, financial figures, GST/compliance numbers, code snippets — tabular figures matter given how much of the product surfaces payroll/financial data.                                   |

Do not introduce a third typeface (e.g., a decorative serif for "editorial" sections). One family, used with weight/size/color contrast, keeps the system disciplined — the moment a second display face appears, it becomes a template-picker aesthetic rather than an identity.

### Scale

Fluid where noted (`clamp()` sizing) so hero/display type scales with viewport instead of jumping at breakpoints — critical for the cinematic chapter format in [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md).

| Token         | Size (fluid or fixed)        | Line height | Weight | Letter spacing | Usage                                                  |
| ------------- | ---------------------------- | ----------- | ------ | -------------- | ------------------------------------------------------ |
| `display-2xl` | clamp(3rem, 6vw, 5.5rem)     | 1.0         | 600    | -0.02em        | Home chapter headlines only (Ch.1–10 hero lines)       |
| `display-xl`  | clamp(2.25rem, 4.5vw, 4rem)  | 1.05        | 600    | -0.02em        | Page hero headlines (Vision, Investors, Company Brain) |
| `display-lg`  | clamp(1.75rem, 3vw, 2.75rem) | 1.1         | 600    | -0.01em        | Section headlines within a page                        |
| `heading-lg`  | 1.5rem                       | 1.25        | 600    | -0.01em        | Sub-headlines                                          |
| `heading-md`  | 1.25rem                      | 1.3         | 600    | 0              | Card/module titles                                     |
| `heading-sm`  | 1.0625rem                    | 1.4         | 600    | 0              | Nav items, form labels                                 |
| `body-lg`     | 1.125rem                     | 1.6         | 400    | 0              | Lead paragraphs, sub-headline support copy             |
| `body-md`     | 1rem                         | 1.6         | 400    | 0              | Default body copy                                      |
| `body-sm`     | 0.875rem                     | 1.5         | 400    | 0              | Secondary copy, helper text                            |
| `caption`     | 0.8125rem                    | 1.4         | 500    | 0.01em         | Microcopy, badges, timestamps                          |
| `micro`       | 0.75rem                      | 1.4         | 500    | 0.02em         | Legal fine print, footer bottom bar                    |
| `mono-md`     | 0.9375rem                    | 1.5         | 400    | 0              | Inline financial/data figures (Geist Mono)             |

**Weight discipline:** only three weights in the whole system — 400 (regular), 500 (medium, for microcopy/labels), 600 (semibold, for everything that needs emphasis). No 700/800/900 — heavier weights read as generic-SaaS-bold, not premium. Emphasis comes from size and color, not boldness.

---

## 2. Color

### Brand anchor: "Orgofin Blue"

Not a generic SaaS blue (`#2563EB`/Tailwind `blue-600` territory is explicitly banned — it's the default every template ships with). Orgofin Blue is a deep, slightly cool cobalt that reads as confident/technical rather than "trustworthy corporate" — closer to a satellite-instrument blue than a fintech blue.

| Token      | HSL           | Hex (approx.) | Usage                                                       |
| ---------- | ------------- | ------------- | ----------------------------------------------------------- |
| `blue-50`  | 217° 100% 97% | #EFF5FF       | Tinted backgrounds, hover states on light surfaces          |
| `blue-100` | 217° 95% 93%  | #DCE9FF       | Subtle badges, chip backgrounds                             |
| `blue-300` | 217° 90% 78%  | #93B8FF       | Borders/dividers on accent surfaces                         |
| `blue-500` | 217° 85% 60%  | #3D7FFF       | Secondary accent, links (light mode)                        |
| `blue-600` | 219° 90% 52%  | #1E63F0       | **Primary brand accent** — CTAs, active states, brand marks |
| `blue-700` | 221° 85% 42%  | #1A4FC4       | Hover/pressed state of primary accent                       |
| `blue-900` | 224° 70% 22%  | #0F2559       | Deep accent for gradients, dark-mode glow cores             |
| `blue-950` | 226° 65% 14%  | #081334       | Gradient terminus, dark-mode background tint                |

### Neutrals — warm-cool balanced, never pure black/white

| Token                   | HSL          | Hex (approx.) | Usage                                                        |
| ----------------------- | ------------ | ------------- | ------------------------------------------------------------ |
| `neutral-0` (light bg)  | 220° 30% 99% | #FAFBFD       | Light-mode page background — _not_ `#FFFFFF`                 |
| `neutral-50`            | 220° 25% 97% | #F3F5F9       | Light-mode raised surface                                    |
| `neutral-100`           | 218° 20% 93% | #E6E9F0       | Borders, dividers (light)                                    |
| `neutral-300`           | 218° 12% 75% | #B4BAC8       | Disabled text, placeholders                                  |
| `neutral-500`           | 220° 10% 50% | #7B8194       | Secondary text                                               |
| `neutral-700`           | 222° 15% 30% | #3B4152       | Primary text (light mode)                                    |
| `neutral-900`           | 224° 25% 10% | #12151F       | Primary text (dark mode) / near-black, not `#000000`         |
| `neutral-950` (dark bg) | 226° 30% 6%  | #080A11       | Dark-mode page background — deep navy-black, _not_ `#000000` |

### Semantic tokens

These are what components should ever reference — never a raw scale value directly.

| Semantic token            | Light mode    | Dark mode                                               |
| ------------------------- | ------------- | ------------------------------------------------------- |
| `color-bg-page`           | `neutral-0`   | `neutral-950`                                           |
| `color-bg-surface`        | `neutral-50`  | `#0D1019` (neutral-950 +1 step lighter)                 |
| `color-bg-surface-raised` | `#FFFFFF`     | `#141826`                                               |
| `color-border-default`    | `neutral-100` | `rgba(255,255,255,0.08)`                                |
| `color-border-strong`     | `neutral-300` | `rgba(255,255,255,0.16)`                                |
| `color-text-primary`      | `neutral-700` | `neutral-100`-equivalent (`#E8EAF0`)                    |
| `color-text-secondary`    | `neutral-500` | `#9AA1B5`                                               |
| `color-text-tertiary`     | `neutral-300` | `#5C6478`                                               |
| `color-accent`            | `blue-600`    | `blue-500` _(lightened for legibility against dark bg)_ |
| `color-accent-hover`      | `blue-700`    | `blue-300`                                              |
| `color-accent-subtle-bg`  | `blue-50`     | `rgba(30,99,240,0.12)`                                  |
| `color-success`           | `#178A4C`     | `#3DDC8A`                                               |
| `color-warning`           | `#B8790C`     | `#F2B84B`                                               |
| `color-danger`            | `#C4362E`     | `#F0645C`                                               |
| `color-info`              | `blue-500`    | `blue-300`                                              |

### Gradients & glow (the identity signature)

This is what makes the palette memorable rather than "blue like everyone else":

| Token                 | Definition                                                                         | Usage                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `gradient-brand-text` | linear-gradient, `blue-600 → blue-900`, 135°                                       | Hero headline accent words only (used sparingly — one phrase per chapter max)                                    |
| `gradient-brand-cta`  | linear-gradient, `blue-500 → blue-700`, 120°                                       | Primary button fill                                                                                              |
| `glow-ambient`        | radial-gradient, `blue-600` at 18% opacity → transparent, large radius (600–900px) | Background ambient glow behind Company Brain graph, hero sections — dark mode only, near-invisible in light mode |
| `glow-focus`          | radial-gradient, `blue-500` at 30% opacity → transparent, small radius (200–300px) | Behind interactive graph nodes on hover/active                                                                   |

### Glass surfaces

| Token               | Definition                                                                                                                          | Usage                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `glass-surface`     | background `rgba(255,255,255,0.04)` (dark) / `rgba(255,255,255,0.6)` (light), backdrop-blur 20px, 1px border `color-border-default` | Nav bar, floating cards over the graph/animation layers, modals                                                                                  |
| `glass-border-glow` | 1px border, `blue-500` at 24% opacity                                                                                               | Edge highlight on glass surfaces in dark mode only — light mode uses plain `color-border-default` (glow reads as a smudge on white, not premium) |

**Rule:** glass and glow effects are dark-mode-forward. In light mode they're dialed down substantially or omitted — glow effects that look premium on near-black backgrounds usually look like a rendering bug on near-white ones.

---

## 3. Spacing

Base unit: **4px**, aligned to Tailwind's default spacing scale (the PRD mandates Tailwind CSS — the token scale should ride the framework's grain, not fight it with a bespoke scale that requires config overrides everywhere).

| Token      | Value | Typical usage                                |
| ---------- | ----- | -------------------------------------------- |
| `space-1`  | 4px   | Icon-to-label gap                            |
| `space-2`  | 8px   | Tight inline gaps                            |
| `space-3`  | 12px  | Form field internal padding                  |
| `space-4`  | 16px  | Default component padding                    |
| `space-6`  | 24px  | Card padding                                 |
| `space-8`  | 32px  | Gap between related components               |
| `space-12` | 48px  | Gap between distinct content blocks          |
| `space-16` | 64px  | Sub-section spacing                          |
| `space-24` | 96px  | Section spacing (mobile/tablet)              |
| `space-32` | 128px | Section spacing (desktop)                    |
| `space-48` | 192px | Chapter-to-chapter spacing on Home (desktop) |

**Rule:** section-level spacing (`space-24`–`space-48`) should scale down proportionally at smaller breakpoints rather than staying fixed — a 192px gap between chapters is cinematic on a 27" display and just empty scrolling on a tablet.

---

## 4. Border Radius

A restrained scale — premium products (Linear, Vercel, Stripe) use fewer radius steps than generic UI kits, applied consistently by component category rather than case-by-case.

| Token         | Value  | Usage                                                       |
| ------------- | ------ | ----------------------------------------------------------- |
| `radius-xs`   | 4px    | Badges, tags, checkboxes                                    |
| `radius-sm`   | 8px    | Buttons, inputs, small chips                                |
| `radius-md`   | 12px   | Cards, dropdown menus                                       |
| `radius-lg`   | 16px   | Modals, large panels, product screenshots/frames            |
| `radius-xl`   | 24px   | Hero-level containers, the Company Brain graph canvas frame |
| `radius-full` | 9999px | Pills, avatars, the theme toggle                            |

No arbitrary in-between values (e.g., no 10px, no 20px) — consistency here is what separates "designed system" from "whatever felt right at the time."

---

## 5. Motion Language

Governs Framer Motion usage per [`docs/product/prd.md`](../../docs/product/prd.md) §9 ("animations must feel meaningful, no random floating elements").

### Durations

| Token              | Value      | Usage                                                                                        |
| ------------------ | ---------- | -------------------------------------------------------------------------------------------- |
| `motion-instant`   | 100ms      | Micro-feedback (button press, checkbox toggle)                                               |
| `motion-fast`      | 180ms      | Hover states, tooltips                                                                       |
| `motion-base`      | 280ms      | Default transitions — modals opening, dropdowns                                              |
| `motion-slow`      | 450ms      | Section reveals, staggered list items                                                        |
| `motion-cinematic` | 700–1000ms | Chapter transitions, the Company Brain graph assembling, page-level scroll-triggered reveals |

### Easing

| Token                 | Curve                                               | Usage                                                                                                                                                                                                     |
| --------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ease-standard`       | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out)          | Default for nearly everything — fast start, gentle settle. This single curve is what gives Linear/Vercel-style UI its "premium" feel; overuse of `ease-in-out` is what makes generic sites feel sluggish. |
| `ease-in`             | `cubic-bezier(0.4, 0, 1, 1)`                        | Elements leaving the screen                                                                                                                                                                               |
| `ease-spring-ui`      | Framer spring: `stiffness 260, damping 26, mass 1`  | Interactive elements users directly manipulate (drag, toggle, graph node press)                                                                                                                           |
| `ease-spring-ambient` | Framer spring: `stiffness 80, damping 20, mass 1.2` | Ambient/background motion (floating glow, idle graph drift) — slower, heavier, never distracting                                                                                                          |

### Principles

1. **Stagger increment:** 40–80ms between siblings in a reveal group — never more than 6–8 items staggered before it reads as slow rather than elegant.
2. **Parallax ratio:** background layers move at 0.3–0.5x scroll speed relative to foreground; never invert (foreground never moves faster than background).
3. **One motion idea per section.** A chapter gets _one_ signature motion (e.g., Ch.5's graph assembles once) — not simultaneous parallax + stagger + 3D tilt competing for attention.
4. **`prefers-reduced-motion`:** every `motion-cinematic` and `motion-slow` transition degrades to a plain opacity cross-fade at `motion-fast` duration. No parallax, no 3D transforms, no auto-playing graph animation — this is not a lesser experience, it's the accessible default rendering of the same content.

---

## 6. Iconography

- **Style:** line icons only, single stroke weight, rounded caps and joins — no filled/duotone/gradient icons, no emoji as UI icons.
- **Stroke weight:** 1.5px at 24px grid (scales proportionally at other sizes — never a fixed 1.5px regardless of icon size).
- **Grid sizes:** `icon-sm` 16px (inline with `caption`/`body-sm` text), `icon-md` 20px (default, inline with `body-md`/nav), `icon-lg` 24px (buttons, standalone), `icon-xl` 32px (feature/module icons on the Products page).
- **Source system:** a Lucide/Phosphor-class open icon set as the base library — matches the visual weight of Linear/Vercel's own UI rather than a heavier icon set (e.g., Font Awesome solid) that would clash with the thin-stroke typographic system above.
- **Custom icons** (Company Brain node types, Agent icons, module glyphs) must be drawn on the same 24px grid at the same 1.5px stroke — a custom icon set that doesn't match the base library's weight is the single fastest way to make a design system look assembled rather than designed.
- **Color:** icons inherit `color-text-secondary` by default, `color-accent` only when indicating an active/selected state — icons are never colored decoratively.

---

## 7. Elevation

Premium products avoid heavy drop-shadows (they read as Material Design/dated). Elevation here is communicated primarily through **background lightness shift + hairline borders**, with shadow as a secondary, subtle signal — and the approach differs by theme because shadows barely register on dark backgrounds.

| Level         | Light mode                                                               | Dark mode                                                        | Usage                                                  |
| ------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------ |
| `elevation-0` | flat, no shadow, `color-bg-page`                                         | flat, `color-bg-page`                                            | Page background                                        |
| `elevation-1` | `color-bg-surface` + 1px border + shadow `0 1px 2px rgba(15,20,35,0.04)` | `color-bg-surface` (one step lighter than page) + 1px border     | Cards, static panels                                   |
| `elevation-2` | `color-bg-surface-raised` + shadow `0 4px 12px rgba(15,20,35,0.08)`      | surface one step lighter still + subtle `blue-900` tinted shadow | Hover state of cards, dropdown triggers                |
| `elevation-3` | shadow `0 8px 24px rgba(15,20,35,0.10)`                                  | + faint `glow-focus` bleed                                       | Open dropdowns, popovers                               |
| `elevation-4` | shadow `0 16px 40px rgba(15,20,35,0.14)`                                 | + `glass-surface` treatment                                      | Modals, dialogs                                        |
| `elevation-5` | shadow `0 20px 48px rgba(15,20,35,0.18)`                                 | + `glass-border-glow`                                            | Toasts, command palette, the topmost interactive layer |

**Rule:** never stack more than one elevation jump on hover (e.g., `elevation-1 → elevation-2` on hover is correct; jumping straight to `elevation-4` reads as broken, not delightful).

---

## 8. Accessibility

Ties directly to [`docs/product/prd.md`](../../docs/product/prd.md) §13 (WCAG AA target) — stated here as concrete, checkable rules rather than a goal.

- **Contrast:** body text ≥ 4.5:1 against its background at all times in both themes (verify `color-text-secondary` against `color-bg-surface`, not just against page background — secondary text on a raised card is the usual failure point). Large text/UI components (≥ 24px or bold ≥ 19px) ≥ 3:1.
- **Focus states:** every interactive element gets a visible 2px focus ring in `color-accent`, offset 2px from the element edge. Never `outline: none` without an equivalent replacement — this is non-negotiable regardless of how it looks in a hover-only mockup.
- **Touch targets:** minimum 44×44px hit area, even where the visible icon/label is smaller (pad invisibly, don't enlarge the icon itself).
- **Motion:** see Motion §5 principle 4 — `prefers-reduced-motion` is a first-class rendering path, not an afterthought toggle.
- **Color independence:** status/state is never communicated by color alone (e.g., success/error states pair color with an icon and/or text label — relevant given how much of the eventual product surfaces compliance/approval states).
- **Semantic HTML first:** headings in document order (no skipped levels for visual sizing — use type tokens for size, not heading level), real `<button>`/`<a>` elements, ARIA only to fill genuine gaps (e.g., the interactive Company Brain graph will need real ARIA authoring since it's a custom visualization with no native semantic equivalent).
- **Keyboard:** every scroll-triggered or hover-triggered reveal must also be reachable and triggerable via keyboard navigation — a chapter that only animates in on scroll-into-view must still render its full content for a keyboard/screen-reader user who tabs to it directly.

---

## 9. Responsive Breakpoints

Matches the device tiers in the founder's original spec (Desktop, Laptop, Tablet, Large Mobile) plus the explicit <390px lockout, with an added top tier since this is a cinematic, scroll-driven experience that should be designed deliberately for large displays, not just capped at "desktop."

| Token           | Range           | Treatment                                                                                                                                                                                                                       |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bp-blocked`    | < 390px         | Full-screen premium lockout message (per PRD §7) — no layout attempted                                                                                                                                                          |
| `bp-mobile-lg`  | 390px – 767px   | Single-column, chapters stack vertically, motion reduced to opacity/slide only (no parallax/3D)                                                                                                                                 |
| `bp-tablet`     | 768px – 1023px  | Two-column where appropriate, light parallax reintroduced                                                                                                                                                                       |
| `bp-laptop`     | 1024px – 1365px | Full experience, standard parallax/stagger                                                                                                                                                                                      |
| `bp-desktop`    | 1366px – 1919px | Full experience, baseline design target                                                                                                                                                                                         |
| `bp-desktop-xl` | ≥ 1920px        | Content max-width capped (`~1440–1600px` reading/visual column) and centered — never stretch the cinematic layout edge-to-edge on ultrawide/large displays; excess space becomes ambient glow/background, not stretched content |

---

## 10. Dark Mode

Dark mode is treated as the **primary designed experience**, not a CSS-filter inversion of light mode — consistent with the brand mandate that glows/glass/gradients are dark-mode-forward (§2).

- **Base:** deep navy-black (`neutral-950`, §2) rather than true black — true black next to the `blue-900`/`blue-950` glow tokens produces harsh, unpleasant contrast; a navy-tinted dark keeps everything feeling like one coherent hue family.
- **Accent recalibration:** `color-accent` shifts from `blue-600` (light) to the lighter `blue-500` (dark) — the same hex value that's a confident accent on white becomes murky and low-contrast on near-black, so the token _value_ changes per theme even though its _role_ doesn't.
- **Elevation via lightness, not shadow:** each elevation step in dark mode gets progressively lighter background rather than a heavier shadow (shadows don't read on dark backgrounds) — see §7 table.
- **Glow and glass are amplified:** ambient background glows, graph-node glows, and glass blur are all more pronounced in dark mode — this is deliberate, not an inconsistency between themes.
- **Theme switching:** instant token swap, no cross-fade animation longer than `motion-fast` (180ms) — a slow theme-transition animation reads as gimmicky on repeated toggling, which is exactly what happens when someone is testing it (a tracked GA4 event per PRD §10).
- **No "system default only":** light, dark, and an explicit user override must all be available and persisted — don't force system-preference-follows-only.

---

## 11. Design Tokens — Architecture

A three-tier structure, so nothing in the eventual component layer ever references a raw value directly:

```
Primitive tokens        →   Semantic tokens              →   Component tokens (optional)
(raw scale values,           (purpose-named, theme-aware,      (narrow overrides for a
 never used directly)         swap value per light/dark)        specific component only)

blue-600                 →   color-accent                 →   button-primary-bg
neutral-950               →   color-bg-page                →   modal-bg
space-6                   →   space-card-padding            →   card-padding
```

**Naming convention:** `{category}-{property}-{variant?}-{state?}`
Examples: `color-bg-surface-hover`, `color-text-accent-default`, `space-inline-md`, `radius-card`, `motion-duration-cinematic`, `motion-ease-standard`.

**Rules:**

1. Components reference **semantic** tokens only. If a component needs something a semantic token doesn't cover, add a new semantic token — never reach back to a primitive (`blue-600`) from component-level styling.
2. Every semantic color token must resolve in **both** themes — a token that's only defined for light mode isn't done.
3. Component-level tokens (tier 3) are the exception, not the rule — introduce one only when a component's need is genuinely narrower than any existing semantic token, not as a default habit.
4. Token names describe **role**, never **appearance** (`color-accent`, not `color-blue`) — this is what lets the entire palette be revisited later (e.g., a rebrand) without renaming anything that references it.

This document defines the vocabulary. Component specs (buttons, cards, nav, the Company Brain graph visualization, forms) are a deliberately separate deliverable — none are defined here.

## Design Decisions

The two decisions most likely to be second-guessed later, recorded so they're revisited deliberately rather than drifted from: (1) "Orgofin Blue" was chosen specifically to avoid Tailwind's default `blue-600` — if a future contributor reaches for a raw Tailwind blue class, that's a signal this doc wasn't consulted; (2) glow/glass effects are deliberately dark-mode-forward and intentionally dialed down in light mode — this is not an inconsistency to "fix."

## Implementation — Token Source of Truth

As of Phase 10 (Core Infrastructure), these tokens are **implemented** in [`src/app/globals.css`](../../src/app/globals.css) using Tailwind v4's CSS-first `@theme` / `@theme inline` — that file is now the _source of truth_ for values; this document is the _rationale_ layer. Motion tokens are additionally mirrored for Framer Motion in [`src/lib/motion/tokens.ts`](../../src/lib/motion/tokens.ts).

The Tailwind **utility names** are role-based and slightly abbreviated from this doc's prose token names, so the mapping is explicit here:

| This doc's concept                      | CSS var (globals.css)                              | Tailwind utility                                                             |
| --------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `color-bg-page`                         | `--page`                                           | `bg-page`                                                                    |
| `color-bg-surface` / `-raised`          | `--surface` / `--surface-raised`                   | `bg-surface` / `bg-surface-raised`                                           |
| `color-text-primary/secondary/tertiary` | `--fg` / `--fg-muted` / `--fg-subtle`              | `text-fg` / `text-fg-muted` / `text-fg-subtle`                               |
| `color-border-default` / `-strong`      | `--border` / `--border-strong`                     | `border-border` / `border-border-strong`                                     |
| `color-accent` (+ hover/subtle)         | `--accent` (+ `-hover`/`-subtle`)                  | `text-accent` / `bg-accent` / `-accent-hover` / `bg-accent-subtle`           |
| status success/warning/danger/info      | `--success` … `--info`                             | `text-success` / `bg-danger` / …                                             |
| type scale                              | `--text-display-2xl` …                             | `text-display-2xl` … `text-mono-md`                                          |
| radius / shadow / easing                | `--radius-*` / `--shadow-elevation-*` / `--ease-*` | `rounded-*` / `shadow-elevation-*` / `ease-standard`                         |
| gradients / glass / glow                | `--gradient-*` / `--glass-*` / `--glow-*`          | `text-gradient-brand` / `bg-brand-cta` / `glass-surface` / `bg-glow-ambient` |
| breakpoints (device tiers)              | `--breakpoint-mobile…wide`                         | `mobile:` / `tablet:` / `laptop:` / `desktop:` / `wide:`                     |
| content widths                          | `--container-readable…wide`                        | `max-w-readable` … `max-w-wide`                                              |

Primitive scale values (`--blue-*`, `--neutral-*`) are deliberately **not** exposed as Tailwind utilities — components consume semantic utilities only, structurally enforcing §11 rule 1. Named device-tier breakpoints are added alongside (not replacing) Tailwind's default `sm/md/lg/xl/2xl`.

**`cn()` must be taught every custom type-scale utility.** tailwind-merge only recognises Tailwind's default font sizes, so it classifies the custom `text-display-*`/`text-heading-*`/`text-body-*`/`text-caption`/`text-micro`/`text-mono-md` utilities as text _colors_ and silently drops one whenever a size and a color share a `cn()` call. [`src/lib/utils.ts`](../../src/lib/utils.ts) extends tailwind-merge's `font-size` class group with the full scale — **adding a new `--text-*` token to `globals.css` requires adding it there in the same PR**, or the new size will vanish wherever it's merged with a color.

## Current Status

Implemented. All token categories in this document exist in `globals.css` for both themes; consumed by the Phase 10 component library ([`docs/architecture/frontend-infrastructure.md`](../../docs/architecture/frontend-infrastructure.md)). The automated contrast-matrix check (§8 TODO) and a rendered token-preview page are not yet built.

## Future Improvements

- Add a visual token reference (Storybook or a static token-preview page) — a markdown table of hex values is a starting point, not a permanent substitute for seeing them rendered.

## TODO

- [ ] Run the full color pairing matrix (all text/background token combinations, both themes) through an automated contrast checker before implementation — the ratios stated in §8 are targets, not yet verified programmatically.
- [ ] Confirm final typeface licensing (Geist Sans/Mono, SIL OFL) with whoever handles legal/brand sign-off.

## References

- [`docs/product/prd.md`](../../docs/product/prd.md) §7, §8, §9, §13 — the requirements this system satisfies
- [`docs/product/website-strategy.md`](../../docs/product/website-strategy.md) — narrative/emotional intent the visual system supports
- [`branding.md`](./branding.md) — voice/tone counterpart to this visual system

## Related Documents

- [`frontend.md`](./frontend.md)
- [`animations.md`](./animations.md)
- [`accessibility.md`](./accessibility.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Design/Engineering (TODO: assign a DRI)
