# Orgofin Brand Assets — the Company Brain mark

> **Purpose:** Documents the shipped Orgofin visual identity (the founder-supplied brain/circuit mark), the production asset set in this repo, how the assets are regenerated, and usage rules.
> **Applies to:** engineers touching branding, icons, or metadata, and anyone producing marketing/deck collateral.
> **Classification:** Internal.

---

## Responsibilities

Owns the shipped brand assets and their usage rules. Does not own the design tokens ([`.claude/context/design-system.md`](../../.claude/context/design-system.md)) or voice ([`.claude/context/branding.md`](../../.claude/context/branding.md)). The superseded in-house exploration is kept as provenance in [`logo-explorations.md`](./logo-explorations.md), [`logo-concepts.md`](./logo-concepts.md) and [`round-3/`](./round-3/).

---

## 1. The mark

A **brain split down the middle**: organic lobes on the left, circuit traces terminating in nodes on the right. It states the product thesis literally — a Company Brain, half intelligence and half infrastructure — which is why it beat the in-house exploration despite that exploration being further along.

Founder-supplied 2026-07-26. Source files, as delivered, are preserved unmodified in [`logo/`](./logo/) (`Harshitha.ai` is the Illustrator original; `Anna-05.svg` is the variant selected as the base).

### It ships as two drawings, deliberately

This is the one thing to understand before editing anything here. The delivered artwork carries **40 paths at ~0.7% stroke width**. That is beautiful at 96px and above, and it physically cannot render below about 48px — at 16px it resolves to a grey smudge. Inlining it would also put 33KB of path data into the navbar **and** footer of every page.

So there are two cuts of one mark:

| Cut                                                                                                                                              | Where it is used                                | Why                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------- |
| **Full detail** — [`public/logo.svg`](../../public/logo.svg), [`logo-mono.svg`](../../public/logo-mono.svg), [`logo.png`](../../public/logo.png) | OG card, press, schema.org logo, anything ≥96px | The founders' artwork, unchanged in geometry             |
| **Simplified** — [`src/app/icon.svg`](../../src/app/icon.svg), `Logo.tsx`, every raster icon                                                     | Navbar (28px), favicon (16–48px), app icons     | Fewer, thicker elements so the mark survives small sizes |

The simplified cut reduces **density only**. Silhouette, proportion, the central split and the brain-left/circuit-right reading are all preserved. Keep them visually in step: a change to one is a change to both.

### Colour

**Cobalt Prime**, matching the site accent — `#1E63F0` in light, `#3D7FFF` in dark.

The delivered files are a single flat `#037AB8`, a tealish blue that is **not** the site's blue. Founder decision 2026-07-26: recolour the mark rather than re-theme the site, so one blue runs across logo, CTAs, links and gradients. Adopting `#037AB8` sitewide was the considered alternative and was rejected as the larger change — it would have re-themed every CTA and focus ring and required a full WCAG AA re-verification.

The delivered files also have a second problem the recolour fixes: being single-colour `#037AB8` (and in four of the eight variants, pure `#000`), they **disappear against the dark page**. Both cuts now carry a colour that follows the theme, so the mark can never go invisible:

- **On the site** (`Logo.tsx`) the mark paints `currentColor`, set to the `--accent` token. It re-themes with the palette, no component edit needed.
- **In the browser tab / press files** (`icon.svg`, `logo.svg`) an embedded `@media (prefers-color-scheme: dark)` swaps to the dark-theme accent.
- **`logo-mono.svg`** is pure `currentColor` for one-colour reproduction.

### App-icon tile

App and PWA icons are **not** transparent: the mark sits on a full-bleed Cobalt gradient tile (`#3D7FFF → #1A4FC4`) in white. A transparent mark on an unknown home-screen wallpaper is unreadable. Because the manifest declares `maskable`, Android may crop to a circle — the mark is held inside the central **62%** to stay clear of the safe zone.

---

## 2. Asset inventory

| Asset                     | Path                             | Cut             | Purpose                                                           |
| ------------------------- | -------------------------------- | --------------- | ----------------------------------------------------------------- |
| SVG favicon               | `src/app/icon.svg`               | simplified      | Primary favicon; Next auto-links it. Theme-aware via media query. |
| Legacy favicon            | `src/app/favicon.ico`            | simplified      | 16/32/48 multi-res fallback. Transparent, accent blue.            |
| Apple touch icon          | `src/app/apple-icon.png`         | simplified      | 180×180 opaque gradient tile (iOS applies its own rounding).      |
| PWA icon (small)          | `public/icon-192.png`            | simplified      | 192×192 tile.                                                     |
| PWA icon (large/maskable) | `public/icon-512.png`            | simplified      | 512×512 tile, serves `any` + `maskable`.                          |
| Web manifest              | `src/app/manifest.ts`            | —               | Generates `/manifest.webmanifest`; theme colour.                  |
| Logo (SVG)                | `public/logo.svg`                | **full detail** | General-purpose, transparent, theme-aware.                        |
| Logo (mono)               | `public/logo-mono.svg`           | **full detail** | One-colour `currentColor` for press/overlays.                     |
| Logo (PNG)                | `public/logo.png`                | **full detail** | 512×512 transparent — schema.org `Organization.logo`.             |
| Social share image        | `public/og/default.png`          | simplified      | 1200×630 OG/Twitter card.                                         |
| `Logo` component          | `src/components/layout/Logo.tsx` | simplified      | Inline mark + wordmark, used in Navbar and Footer.                |
| Delivered originals       | `docs/brand/logo/`               | —               | Founder-supplied source, unmodified. Provenance.                  |

**Wiring:** `siteConfig.ogImage` → `/og/default.png`; JSON-LD logo → `/logo.png`. Favicon/apple/manifest use Next's file conventions — no manual `<link>` tags.

---

## 3. Regenerating the rasters

PNGs and the `.ico` are generated from the SVG sources with headless Chromium — no design tool needed. The generator is not committed (it relies on a scratchpad Playwright install). The procedure:

1. The simplified mark's path data is the single source; it is duplicated in `Logo.tsx` and `icon.svg` (JSX cannot share a literal with a static SVG file). **Change one, change both.**
2. Render with Playwright at exact pixel sizes, `deviceScaleFactor: 1`. `omitBackground: true` for transparent assets (favicon PNGs, `logo.png`); opaque for tiles and the OG card.
3. Build `favicon.ico` from the 16/32/48 PNGs via `png-to-ico`.
4. Screenshot the OG layout at 1200×630.

**Re-verify after any regeneration** — at minimum the favicon at 16px in both schemes, the app icon inside a circular mask, and the OG card in a social-card debugger.

---

## 4. Usage rules

- **Minimum size:** 16px, and only with the simplified cut. Never scale `logo.svg` below 96px — its strokes stop resolving.
- **Clear space:** keep space equal to the width of the brain's outer stroke around the mark.
- **Do not:** use the delivered `#037AB8` files directly on the site (wrong blue, and they vanish on dark); place the transparent mark on an arbitrary photo or brand colour (use `logo-mono.svg`); stretch the mark; add effects; or thicken the full-detail cut to force it small — that is what the simplified cut exists for.
- **Backgrounds:** the theme-aware files handle light and dark automatically. For anything else, `logo-mono.svg`.
- **Wordmark:** Geist Semibold, tight tracking, sentence-case "Orgofin".

---

## Design Decisions

| Decision     | Choice                                                        | Date       | By          |
| ------------ | ------------------------------------------------------------- | ---------- | ----------- |
| Identity     | Founder-supplied brain/circuit mark, replacing "Eclipse"      | 2026-07-26 | Founder     |
| Base variant | `Anna-05.svg` — free-standing, single-colour, no container    | 2026-07-26 | Founder     |
| Brand blue   | Recolour the mark to Cobalt Prime, not re-theme the site      | 2026-07-26 | Founder     |
| Icon style   | Outline (matches the artwork's own character) over solid mass | 2026-07-26 | Founder     |
| Two cuts     | Full detail for ≥96px, simplified for UI and icons            | 2026-07-26 | Engineering |

**Why "Eclipse" was retired.** It was a competent in-house mark (a disc with a geometric F in negative space) built to unblock launch when no logo existed. It never said anything about the product. The brain/circuit mark does, and the founders had it drawn externally. Eclipse's exploration record is kept for provenance, not for reuse.

**Why the tiled variants were not chosen** (`Anna-02`, `Anna-04`). They were the only delivered files legible on both themes — but only because they carry their own black tile, which reads as an app icon rather than a logo and drops a heavy black square onto the light page. Making the free-standing mark theme-aware achieves the same robustness without the container.

---

## Current Status

Shipped 2026-07-26, replacing the Eclipse identity. Both cuts, the full raster set and the OG card are regenerated and wired. Colour is final (Cobalt Prime), not provisional.

## Future Improvements

- A dedicated 16px-optimised bitmap in the `.ico` (currently a downscale of the same drawing) if the mark reads thin in real tabs.
- Optional animated mark — circuit traces drawing in — for the hero/loader, respecting reduced-motion.
- Dynamic per-page OG image route to replace the single static card.
- Full brand-guidelines doc (misuse, co-branding, motion) as the company scales.

## TODO

- [ ] **Founder:** confirm the mark reads correctly at 16px in a real browser tab on your own display, and on an iOS/Android home screen. A screenshot at 5× is not the same test.
- [ ] **Founder/designer:** the delivered set has no wordmark lockup — the wordmark is currently Geist Semibold set alongside the mark. Commission a kerned wordmark if a bespoke one is wanted; requirements are in [`logo-delivery-spec.md`](./logo-delivery-spec.md).
- [ ] **Engineering:** verify the OG card in the Twitter/LinkedIn card debuggers once DNS/caching settles (launch-readiness P-02).

## References

- [`logo/`](./logo/) — the delivered source files, unmodified
- [`logo-delivery-spec.md`](./logo-delivery-spec.md) — what to require from an external designer
- [`logo-explorations.md`](./logo-explorations.md), [`logo-concepts.md`](./logo-concepts.md), [`round-3/`](./round-3/) — superseded in-house exploration, kept as provenance
- `src/app/icon.svg`, `src/app/manifest.ts`, `src/components/layout/Logo.tsx`
- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)

## Related Documents

- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md) — B-01 (brand assets) closed by the original Eclipse set; this replaces it in kind.

---

**Last Updated:** 2026-07-26
**Owner:** Orgofin Engineering (production) · Orgofin Founders (brand decision)
