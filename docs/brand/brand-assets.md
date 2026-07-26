# Orgofin Brand Assets — the Company Brain mark

> **Purpose:** Documents the shipped Orgofin visual identity (the delivered brain/circuit mark), which of the delivered designs is in use and why, the production asset set, how the rasters are regenerated, and usage rules.
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

### Which design is in use: LOGO-5

The delivery contains **five designs** (LOGO-1 … LOGO-5), each exported at 16/24/32/64/128/256/518 in SVG, PNG and PDF, in a dark-ink family (`LOGO-*`) and a white family (`lOGO-*`).

**LOGO-5 is the one in use**, and the reason is legibility at icon sizes. Rendering every delivered file at 1:1 on both the light and dark page:

| Design     | Form                                         | Small-size behaviour                                                 |
| ---------- | -------------------------------------------- | -------------------------------------------------------------------- |
| LOGO-1     | Outline, untiled, single colour              | Washed out by 24px; invisible on the dark page                       |
| LOGO-2     | **Tiled**, white mark on a black tile        | Legible at every size, both backgrounds                              |
| LOGO-3     | Filled brain, untiled                        | Reads as a blob below 32px                                           |
| LOGO-4     | Outline + blue circuits, untiled             | Weakest — nearly gone at 16–24px on both backgrounds                 |
| **LOGO-5** | **Tiled**, white brain + blue circuit traces | Legible at every size, both backgrounds, and carries the blue accent |

Only the two **tiled** designs survive icon sizes, because the tile gives the mark its own background and its silhouette stays readable when the interior detail stops resolving. Of those two, LOGO-5 carries the blue circuit accent, so it is the more distinctive.

The tile also removes the need for a light/dark variant entirely: on the light page it supplies its own contrast, and on the dark page it recedes into the background so the mark reads as free-standing. **One file, both themes, no swapping.** That is what the untiled designs cannot do — they are flat single-colour artwork that disappears against `#080a11`, and dark is the site's primary designed experience.

**Switching design is a file swap**, not a code change: copy a different `LOGO-N-518.svg` over the four asset paths in §2 and re-run the raster generator (§3).

### Colour

The mark keeps its **delivered colour** — the designers' blue, untouched. This differs from the site's Cobalt Prime accent (`#1E63F0`). That is a deliberate, accepted mismatch: the brand mark is allowed its own colour, and the alternative — recolouring the artwork — is exactly the kind of edit that is now off-limits. If the two blues need to converge, that is a design decision for the founders and their designer, and the site accent is the cheaper side to move.

The `size` suffix on the delivered **SVG** filenames is cosmetic — every `LOGO-N-*.svg` is byte-identical regardless of the number, because SVG is scalable. Only the PNG/PDF exports differ by size.

---

## 2. Asset inventory

Every SVG below is a **byte-identical copy** of a delivered file — verified with `cmp`, not by eye.

| Asset               | Path                             | Source                         | Purpose                                                   |
| ------------------- | -------------------------------- | ------------------------------ | --------------------------------------------------------- |
| Site mark           | `public/brand/orgofin-mark.svg`  | `LOGO-5-518.svg`               | Rendered by `Logo.tsx` in the navbar and footer           |
| SVG favicon         | `src/app/icon.svg`               | `LOGO-5-518.svg`               | Primary favicon; Next auto-links it                       |
| Legacy favicon      | `src/app/favicon.ico`            | rendered from `LOGO-5-518.svg` | 16/32/48 multi-res fallback                               |
| Apple touch icon    | `src/app/apple-icon.png`         | rendered                       | 180×180 (iOS applies its own rounding)                    |
| PWA icon (small)    | `public/icon-192.png`            | rendered                       | 192×192                                                   |
| PWA icon (maskable) | `public/icon-512.png`            | rendered                       | 512×512, serves `any` + `maskable`                        |
| Web manifest        | `src/app/manifest.ts`            | —                              | Generates `/manifest.webmanifest`                         |
| Logo (SVG)          | `public/logo.svg`                | `LOGO-5-518.svg`               | General-purpose                                           |
| Logo (alt)          | `public/logo-mono.svg`           | `LOGO-4-518.svg`               | Untiled variant, for placement on a controlled background |
| Logo (PNG)          | `public/logo.png`                | rendered                       | 512×512 — schema.org `Organization.logo`                  |
| Social share image  | `public/og/default.png`          | rendered                       | 1200×630 OG/Twitter card                                  |
| `Logo` component    | `src/components/layout/Logo.tsx` | —                              | `<img>` + wordmark lockup                                 |
| Delivered originals | `docs/brand/logo/`               | —                              | All 122 files as received. Provenance.                    |

`Logo.tsx` serves the mark as an `<img>` rather than inlining it: the file is 33KB of path data, and inlining would put that in the navbar **and** footer of every page instead of being fetched once and cached.

---

## 3. Regenerating the rasters

PNGs and the `.ico` are rendered from the delivered SVG with headless Chromium — the artwork is never edited, only rasterised. The generator is not committed (it relies on a scratchpad Playwright install). The procedure:

1. Source is `docs/brand/logo/LOGO-5-518.svg`.
2. **One render-time-only adjustment:** the delivered tile is 1848.93 × 1831.76 — square to within 0.94%. Icons must be exactly square, so the render page sets `preserveAspectRatio="none"` to stretch by that 0.94%. It is imperceptible, and it keeps the tile's rounded corners intact — the alternatives were letterboxing the tile or cropping its corners. **This is applied to the in-memory render only; the files on disk are untouched.**
3. Render at exact pixel sizes with `deviceScaleFactor: 1`, `omitBackground: true` (the tile supplies its own background).
4. Build `favicon.ico` from the 16/32/48 renders via `png-to-ico`.
5. Screenshot the OG layout at 1200×630.

**Re-verify after any regeneration** — the favicon at 16px in a real tab, the app icon inside a circular mask, and the OG card in a social-card debugger.

---

## 4. Usage rules

- **Never edit the artwork.** No redrawing, recolouring, simplifying, or restroking. Copies must stay byte-identical to `docs/brand/logo/`; `cmp` is the check.
- **Use the tiled design (LOGO-5) for anything small or on an uncontrolled background.** The untiled designs are for controlled placements only.
- **Minimum size:** 16px. It is legible there but tight; see the founder TODO below.
- **Clear space:** keep space equal to the tile's corner radius around the mark.
- **Do not:** stretch the mark (beyond the documented 0.94% square correction in the icon renders), add effects, or place an untiled variant on a dark background.
- **Wordmark:** Geist Semibold, tight tracking, sentence-case "Orgofin".

---

## Design Decisions

| Decision          | Choice                                                            | Date       | By                                |
| ----------------- | ----------------------------------------------------------------- | ---------- | --------------------------------- |
| Identity          | Externally designed brain/circuit mark, replacing "Eclipse"       | 2026-07-26 | Founder                           |
| Simplified redraw | **Rejected** — lost the design's character                        | 2026-07-26 | Founder                           |
| Files             | Use as delivered, unmodified                                      | 2026-07-26 | Founder                           |
| Design in use     | LOGO-5 — the only coloured design legible at icon sizes           | 2026-07-26 | Engineering, on measured evidence |
| Colour            | Keep the delivered blue; accept the mismatch with the site accent | 2026-07-26 | Founder                           |

**Why "Eclipse" was retired.** It was a competent in-house mark (a disc with a geometric F in negative space) built to unblock launch when no logo existed. It never said anything about the product. Its exploration record is kept for provenance, not reuse.

**Why untiled designs were not chosen.** They are flat single-colour artwork. Four of the delivered variants are pure black and disappear entirely against the dark page; the coloured untiled variant (LOGO-4) is the weakest of the whole set at 16–24px. The tile is what makes one file work everywhere.

---

## Current Status

Shipped 2026-07-26, replacing the Eclipse identity. LOGO-5 in use, delivered files unmodified, full raster set and OG card regenerated and wired.

## Future Improvements

- If 16px proves too tight in real tabs, ask the designer for a **purpose-drawn small-size variant** — a reduced-detail export from the source artwork. That is the correct fix, and it belongs with the designer, not here.
- Optional animated mark (circuit traces drawing in) for the hero/loader, respecting reduced-motion.
- Dynamic per-page OG image route to replace the single static card.
- Full brand-guidelines doc (misuse, co-branding, motion) as the company scales.

## TODO

- [ ] **Founder:** check the favicon at 16px in a real browser tab on your own display, and the app icon on an iOS/Android home screen. The tiled design is the most legible of the delivered set, but 16px is still tight for artwork this detailed — and a screenshot at 5× is not that test.
- [ ] **Founder:** decide whether the mark's blue and the site accent should converge. They currently differ; the site accent is the cheaper side to move.
- [ ] **Founder/designer:** the delivery contains no wordmark lockup — the wordmark is Geist Semibold set alongside the mark. Commission a kerned wordmark if one is wanted; requirements are in [`logo-delivery-spec.md`](./logo-delivery-spec.md).
- [ ] **Engineering:** verify the OG card in the Twitter/LinkedIn card debuggers once caching settles (launch-readiness P-02).

## References

- [`logo/`](./logo/) — all 122 delivered files, unmodified
- [`logo-delivery-spec.md`](./logo-delivery-spec.md) — what to require from an external designer
- [`logo-explorations.md`](./logo-explorations.md), [`logo-concepts.md`](./logo-concepts.md), [`round-3/`](./round-3/) — superseded in-house exploration, kept as provenance
- `src/app/icon.svg`, `src/app/manifest.ts`, `src/components/layout/Logo.tsx`
- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)

## Related Documents

- [`../launch/production-readiness-review.md`](../launch/production-readiness-review.md) — B-01 (brand assets) closed by the original Eclipse set; this replaces it in kind.

---

**Last Updated:** 2026-07-26
**Owner:** Orgofin Engineering (production) · Orgofin Founders (brand decision)
