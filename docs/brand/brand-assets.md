# Orgofin Brand Assets — the Company Brain mark

> **Purpose:** Documents the shipped Orgofin visual identity (the delivered brain/circuit mark), which delivered files are in use and why, the production asset set, how the rasters are regenerated, and usage rules.
> **Applies to:** engineers touching branding, icons, or metadata, and anyone producing marketing/deck collateral.
> **Classification:** Internal.

---

## Responsibilities

Owns the shipped brand assets and their usage rules. Does not own the design tokens ([`.claude/context/design-system.md`](../../.claude/context/design-system.md)) or voice ([`.claude/context/branding.md`](../../.claude/context/branding.md)). The superseded in-house exploration is kept as provenance in [`logo-explorations.md`](./logo-explorations.md), [`logo-concepts.md`](./logo-concepts.md) and [`round-3/`](./round-3/).

---

## 1. The mark

A **brain split down the middle**: organic lobes on the left, circuit traces terminating in nodes on the right. It states the product thesis literally — a Company Brain, half intelligence and half infrastructure.

Externally designed and delivered by the founders. **The delivered files are used unmodified.** [`logo/`](./logo/) holds all 122 delivered files exactly as received (`Harshitha.ai` is the Illustrator source).

> **Do not redraw, simplify or recolour this mark.** A simplified redraw was attempted on 2026-07-26 and rejected by the founders: it lost the character of the design. The delivered artwork is the design of record. If it needs to work at a size it currently doesn't, the answer is a new export from the designer, not a reinterpretation here.

### What the delivery actually contains

Five designs (LOGO-1 … LOGO-5), each exported at 16/24/32/64/128/256/518 in SVG, PNG and PDF. Three things about it are not obvious and cost time to discover:

1. **The size suffix on the SVGs is meaningless.** Every `LOGO-N-*.svg` is byte-identical regardless of the number — SVG is scalable. Only the PNG/PDF exports differ by size.
2. **There is no inverted (light-ink) variant.** The lowercase `lOGO-*` files look like they should be white counterparts. They are not: rendered on a **mid-grey** background, every one is dark ink. On the dark page `lOGO--4` shows only its blue circuit traces (the brain vanishes) and `lOGO--3` shows only its internal gyri lines. This is invisible if you only ever test on white or only on black — grey is what reveals it.
3. **The PNG exports are not square** (16×17, 32×33, 128×130), so they cannot be used directly as icons.

### Which files are in use

Because there is no inverted variant, **no single file serves both themes**. The pair that works, both used as delivered:

| Theme     | File             | Why                                                                                                                       |
| --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Light** | `LOGO-4-518.svg` | Untiled, single-colour blue, transparent. **Used byte-identical — do not touch it**, it is signed off as-is               |
| **Dark**  | `LOGO-5-518.svg` | White brain + blue traces — the only form showing the _complete_ mark on dark. Its background plate is removed; see below |

**The dark file's background plate is removed** (founder request, 2026-07-26). `LOGO-5-518.svg` ships with a black rounded rect behind the mark; against the translucent `glass-surface` navbar it reappeared as a visible black box on scroll.

This is **the one edit made to any delivered file**, and it is deliberately surgical: the plate is the single `<rect>` in the file carrying no `class` (every other rect has a `cls-*` and is part of the artwork). The generator asserts both that the plate is present and that exactly one unclassed rect exists before touching anything, then diffs the result against the original to prove the mark is otherwise byte-identical. Regenerate with `scratchpad/make-dark-transparent.mjs`.

Two earlier workarounds are gone with it — `rounded-full` to clip the plate into a circle, and `mix-blend-screen` to map its black to "leave the backdrop alone". Both only held while the backdrop was flat, which is precisely why the plate resurfaced over the glass navbar. **Do not reintroduce `mix-blend-screen`**; with transparent files it alters the artwork's own colours for nothing.

**Mark size is 48px.** This artwork carries real interior detail; side-by-side renders show it only resolving from about 36px, and 48px is where the brain is unambiguous. Raising the size is the only legibility lever available while editing is off the table.

**Switching design is a file swap**, not a code change: copy a different `LOGO-N-518.svg` over the paths in §2 and re-run the raster generator (§3).

### Colour

The mark keeps its **delivered colour** — the designers' blue, untouched. This differs from the site's Cobalt Prime accent (`#1E63F0`). That is a deliberate, accepted mismatch: the brand mark is allowed its own colour, and recolouring the artwork is exactly the kind of edit that is off-limits. If the two should converge, that is a founder/designer decision, and the site accent is the cheaper side to move.

---

## 2. Asset inventory

Every SVG below is a **byte-identical copy** of a delivered file — verified with `cmp`, not by eye.

| Asset               | Path                                  | Source                           | Purpose                                           |
| ------------------- | ------------------------------------- | -------------------------------- | ------------------------------------------------- |
| Site mark (light)   | `public/brand/orgofin-mark-light.svg` | `LOGO-4-518.svg`                 | Light theme. Byte-identical to delivered          |
| Site mark (dark)    | `public/brand/orgofin-mark-dark.svg`  | `LOGO-5-518.svg`                 | Dark theme, background plate removed              |
| SVG/PNG favicon     | `src/app/icon.png`                    | `fav icons/ai-brain-favicon.png` | **Primary favicon.** Byte-identical copy          |
| Legacy favicon      | `src/app/favicon.ico`                 | rendered from the same           | 16/32/48 fallback, transparent                    |
| Apple touch icon    | `src/app/apple-icon.png`              | rendered from the same           | 180×180 on an opaque dark plate — see below       |
| PWA icon (small)    | `public/brand/icon-192.png`           | rendered from the same           | 192×192, opaque plate                             |
| PWA icon (maskable) | `public/brand/icon-512.png`           | rendered from the same           | 512×512, opaque plate                             |
| Web manifest        | `src/app/manifest.ts`                 | —                                | Generates `/manifest.webmanifest`                 |
| Logo (PNG)          | `public/brand/logo.png`               | rendered                         | 512×512 circular — schema.org `Organization.logo` |
| Social share image  | `public/og/default.png`               | rendered                         | 1200×630 OG/Twitter card                          |
| `Logo` component    | `src/components/layout/Logo.tsx`      | —                                | Theme-paired `<img>` lockup                       |
| Delivered originals | `docs/brand/logo/`                    | —                                | All 122 files as received. Provenance.            |

### The favicon is a different mark, on purpose

The tab icon is **not** the site logo. It comes from [`fav icons/ai-brain-favicon.png`](<./fav icons/ai-brain-favicon.png>), founder-supplied 2026-07-26, and is used byte-identical.

The reason is measurable. Earlier favicons cut from the site mark were **invisible on dark browser chrome** — a dark mark on a `#1f1f1f` tab is nothing at all, which is what "the favicon isn't showing up" looked like. Rendered across light tab (`#e8eaed`), dark tab (`#1f1f1f`), white and the site's own dark page, the chosen file is the only candidate legible on **all four**, because its pink→cyan gradient sits mid-tone against both extremes. The alternative supplied alongside it (`brain-favicon - 2.png`, black line art) failed on dark chrome exactly as the previous ones did.

`src/app/icon.png` is the primary favicon (Next prefers it); `favicon.ico` carries 16/32/48 as the legacy fallback. Both come from that one source.

**Home-screen icons sit on an opaque dark plate.** The OS applies its own mask (iOS rounds; Android may crop to a circle), and transparent corners get composited against white or black, which looks broken. Only the tab icon is transparent, because there the corners land on tab chrome.

`Logo.tsx` serves the marks as `<img>` rather than inlining them: each file is ~33KB of path data, and inlining would put that in the navbar **and** footer of every page instead of being fetched once and cached.

### Where the files live, and why some cannot move

Every brand asset that is fetched by URL lives in **`public/brand/`** — one folder, so "where is the logo" has one answer. The exception is `public/og/default.png`: `/og/` is a conventional, externally-linked path that appears in scraped social cards, and is left alone.

**`src/app/icon.png`, `src/app/apple-icon.png` and `src/app/favicon.ico` are not free to move or rename.** They are Next.js App Router _file conventions_ — the framework discovers them by exact filename in that exact directory and generates the `<link rel>` tags from them. Renaming `icon.png` to something more descriptive, or relocating it into `public/brand/`, silently removes the favicon. They are already at their standard names; leave them.

Two files were removed in the 2026-07-27 cleanup: `public/logo.svg` (a byte-identical duplicate of `orgofin-mark-light.svg`) and `public/logo-mono.svg` (the untouched delivered `LOGO-5-518.svg`, superseded by the plate-removed dark mark). Neither was referenced by any code. Both remain in `docs/brand/logo/` as delivered, so nothing is lost.

---

## 3. Regenerating the rasters

PNGs and the `.ico` are rendered from the delivered SVG with headless Chromium — the artwork is never edited, only rasterised. The generator is not committed (it relies on a scratchpad Playwright install). The procedure:

1. Source is `docs/brand/logo/LOGO-5-518.svg` (the tiled design — it is the one that reads on any background).
2. **One render-time-only adjustment:** the delivered tile is 1848.93 × 1831.76 — square to within 0.94%. Icons must be exactly square, so the render stretches by that amount to fill the square edge-to-edge, rather than letterboxing the tile or cropping its rounded corners. **In-memory only; files on disk are untouched.**
3. Render at exact pixel sizes with `deviceScaleFactor: 1`. `omitBackground: true` for the circular tab icon; opaque for the full-bleed home-screen icons.
4. Build `favicon.ico` from the circular 16/32/48 renders via `png-to-ico`.
5. Screenshot the OG layout at 1200×630.

**Re-verify after any regeneration** — the favicon at 16px in a real tab, the app icon inside a circular mask, and the OG card in a social-card debugger.

---

## 4. Usage rules

- **Never edit the artwork.** No redrawing, recolouring, simplifying, or restroking. Copies must stay byte-identical to `docs/brand/logo/`; `cmp` is the check.
- **Use the theme-appropriate file.** The light file on a dark background loses its brain half; the dark file on a light background shows a black disc.
- **`mix-blend-screen` belongs to the dark file only.** On a light backdrop it erases the artwork.
- **Minimum size:** 48px is the shipped size and where the brain is unambiguous. It renders below that but detail degrades; see the founder TODO.
- **Clear space:** keep space equal to the mark's radius around it.
- **Do not:** stretch the mark beyond the documented 0.94% square correction in the icon renders, add effects, or use a PNG export directly as an icon (they are not square).
- **Wordmark:** Geist Semibold, tight tracking, sentence-case "Orgofin".

---

## Design Decisions

| Decision          | Choice                                                            | Date       | By      |
| ----------------- | ----------------------------------------------------------------- | ---------- | ------- |
| Identity          | Externally designed brain/circuit mark, replacing "Eclipse"       | 2026-07-26 | Founder |
| Simplified redraw | **Rejected** — lost the design's character                        | 2026-07-26 | Founder |
| Files             | Use as delivered, unmodified                                      | 2026-07-26 | Founder |
| Theme handling    | Separate light and dark files (LOGO-4 / LOGO-5)                   | 2026-07-26 | Founder |
| Light mark        | Signed off as-is — **do not change it**                           | 2026-07-26 | Founder |
| Dark mark         | Background plate removed; fully transparent                       | 2026-07-26 | Founder |
| Favicon           | Separate supplied artwork, not the site mark                      | 2026-07-26 | Founder |
| Mark size         | 48px                                                              | 2026-07-26 | Founder |
| Lockup spacing    | Tightened to `gap-1`                                              | 2026-07-26 | Founder |
| Colour            | Keep the delivered blue; accept the mismatch with the site accent | 2026-07-26 | Founder |

**Why a single file was tried first, and why it failed.** LOGO-5's tile is self-contained, so one file appeared to serve both themes. It does _render_ on both — but on the light page it is a heavy black disc, which is the opposite of blending. Once the requirement was "blend with the background", the untiled design became necessary for light, and that forced a pair.

**Why "Eclipse" was retired.** It was a competent in-house mark (a disc with a geometric F in negative space) built to unblock launch when no logo existed. It never said anything about the product. Its exploration record is kept for provenance, not reuse.

---

## Current Status

Shipped 2026-07-26, replacing the Eclipse identity. Theme-paired files at 48px, both transparent, tight lockup. Favicon from separate supplied artwork. Full raster set and OG card regenerated.

## Future Improvements

- **Ask the designer for a genuine light-ink (inverted) version of the untiled design.** It would let the dark theme use the same drawing as the light one instead of a plate-stripped variant, removing the only edit in this repo.
- **A purpose-drawn reduced-detail version for 16–32px**, if the site mark is ever wanted as the favicon again.
- Optional animated mark (circuit traces drawing in) for the hero/loader, respecting reduced-motion.
- Dynamic per-page OG image route to replace the single static card.
- Full brand-guidelines doc (misuse, co-branding, motion) as the company scales.

## TODO

- [ ] **Founder:** confirm the favicon now appears in a real tab — hard-refresh first, browsers cache favicons aggressively and a stale one will look like nothing changed. Also check the app icon on an iOS/Android home screen.
- [ ] **Founder:** the favicon's pink→cyan gradient is a different palette from both the site mark and the site accent. It was chosen for legibility on dark chrome; worth deciding whether that difference is acceptable long-term or whether the designer should supply a favicon in the brand palette.
- [ ] **Founder:** decide whether the mark's blue and the site accent should converge. They currently differ; the site accent is the cheaper side to move.
- [ ] **Founder/designer:** request an inverted (light-ink) untiled export — it would remove the only edit made to any delivered file.
- [ ] **Founder/designer:** the delivery contains no wordmark lockup — the wordmark is Geist Semibold set alongside the mark. Commission a kerned wordmark if one is wanted; requirements are in [`logo-delivery-spec.md`](./logo-delivery-spec.md).
- [ ] **Engineering:** verify the OG card in the Twitter/LinkedIn card debuggers once caching settles (launch-readiness P-02).

## References

- [`logo/`](./logo/) — all 122 delivered files, unmodified
- [`logo-delivery-spec.md`](./logo-delivery-spec.md) — what to require from an external designer
- [`logo-explorations.md`](./logo-explorations.md), [`logo-concepts.md`](./logo-concepts.md), [`round-3/`](./round-3/) — superseded in-house exploration, kept as provenance
- `src/app/manifest.ts`, `src/components/layout/Logo.tsx`
- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)

## Related Documents

- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md) — B-01 (brand assets) closed by the original Eclipse set; this replaces it in kind.

---

**Last Updated:** 2026-07-26
**Owner:** Orgofin Engineering (production) · Orgofin Founders (brand decision)
