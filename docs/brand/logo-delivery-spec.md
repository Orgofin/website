# Logo Delivery Spec — What to Request from the Designers

> **Purpose:** The exact file formats, sizes, variants and technical requirements to ask a logo designer for, derived from what this codebase and its distribution channels actually consume. Hand this to the designers verbatim.
> **Applies to:** the founders commissioning the logo, and the engineer who will wire the delivered assets.
> **Classification:** Internal — safe to share with an external designer.

---

## Responsibilities

Owns the _acceptance criteria_ for externally-produced logo assets. Does not own the mark's design direction ([`logo-round-3.md`](./logo-round-3.md) and [`logo-explorations.md`](./logo-explorations.md)), nor the currently-shipped Eclipse identity and its wiring ([`brand-assets.md`](./brand-assets.md)) — this document is what a _replacement_ must deliver to swap in cleanly.

---

## 0. Read this first

**One deliverable matters more than all the others: a clean, correctly-constructed master SVG of each variant.** Everything else on this list — every PNG size, the `.ico`, the social card — we can generate ourselves from that file in minutes, and we already have the pipeline to do it ([`brand-assets.md`](./brand-assets.md) §3). What we cannot fix downstream is a vector that's built wrong: negative space faked with a white shape on top, a wordmark that still references a font, strokes that haven't been outlined, or 400 decimal-place coordinates.

So if the designers can only give you one thing, make it §2. If they'll give you everything, use §3–§8.

**Scope note:** the founders have not yet picked from round 3 (27 concepts, `docs/brand/round-3/`). This spec applies to whichever mark is chosen, and the shipped Eclipse mark stays live until then.

---

## 1. What the mark has to survive

Context worth passing to the designers, because it constrains the design and not just the file export. This is not a logo that will only ever live on a deck.

| Constraint                 | Why                                                                                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Legible at 16×16 px**    | It's a browser-tab favicon. Detail that disappears at 16px is detail that doesn't exist for most viewers.                                                                                                       |
| **Works as a flat solid**  | Needs a true one-colour version for print, embroidery, watermarks and dark arbitrary backgrounds.                                                                                                               |
| **Inverts for dark mode**  | The site has a dark theme. Our current mark doesn't recolour — the disc flips from gradient to solid white. The new one must have a defined dark-mode treatment, not just "the same logo on a dark background". |
| **Survives a circle mask** | Android maskable icons and most social avatars crop to a circle or squircle. Anything near the corners will be cut.                                                                                             |
| **Reads at 1200×630**      | The Open Graph card is how the brand appears in every shared link.                                                                                                                                              |
| **No font dependency**     | It gets inlined into HTML and rendered on machines that have never had the designers' fonts installed.                                                                                                          |

---

## 2. The master vector — the essential deliverable

Ask for **one SVG per variant** (variants listed in §4), each meeting all of the following. These are the requirements designers most often miss; they're worth quoting directly.

- **`viewBox` present**, on a clean square grid for the mark (`0 0 64 64`, `0 0 128 128` or `0 0 512 512` — any is fine, square matters). Width/height attributes optional; the viewBox is what makes it scale.
- **All text converted to outlines/paths.** No `<text>` elements, no `font-family` references anywhere in the file. This is non-negotiable — a wordmark referencing a font renders as fallback Times on our servers.
- **All strokes expanded to fills** (Object → Expand / Outline Stroke). A `stroke-width` scales inconsistently and changes apparent weight at small sizes.
- **Negative space as true knockout**, not a white shape stacked on top. If the mark has a letterform or cut-out inside a solid shape, it must be a single compound path with a hole (`fill-rule="evenodd"` or `nonzero`, stated explicitly), so the background shows through. Test: place the SVG on a red background — the cut-out should be red, not white.
- **No embedded raster images.** No `<image>` tags, no base64 PNG payloads. If the mark contains a texture or a photographic effect, we can't use it as a logo.
- **No external references** — no linked fonts, no linked images, no `<use>` pointing outside the file.
- **Minimal clipping/masking.** Prefer plain paths. Clip paths and masks survive but complicate every downstream conversion.
- **Coordinates rounded** to 2–3 decimals. Not 12.
- **Gradient and filter IDs prefixed and unique**, e.g. `id="orgofin-grad-primary"`, never `id="a"` or `id="linearGradient-1"`. We inline this SVG into React and render it more than once per page; short generic IDs collide and one instance steals the other's fill.
- **Optimised** (SVGO or equivalent) but with the `viewBox` retained and IDs preserved. Target: **under 5 KB** for the mark, under 15 KB for the full lockup.
- **No `<style>` blocks with generic class names** (`.a`, `.cls-1`). Use presentation attributes (`fill="#..."`) instead. Class names leak into the host document when inlined.

Alongside the SVGs, ask for the **editable master**:

- **Adobe Illustrator `.ai`** (CC 2020 or later), _or_ a **Figma file** (share link with edit access), _or_ both. Layers named and organised — not one flattened group called "Layer 1 copy 3".
- **`.eps`** (Illustrator 10 / EPS Level 3) if any printer, fabricator or press might ever need it.
- Keep an **un-outlined copy of the wordmark** in the editable master (on a hidden layer) so it can be re-kerned later. The _exported_ files stay outlined.

---

## 3. Deliverables checklist

Give the designers this table. "We can generate" means don't pay extra for it — but take it if it's included.

| #   | Deliverable                         | Format                        | Size / spec                                      | Priority           |
| --- | ----------------------------------- | ----------------------------- | ------------------------------------------------ | ------------------ |
| 1   | Mark, primary (light backgrounds)   | SVG                           | square viewBox, per §2                           | **Essential**      |
| 2   | Mark, dark-mode variant             | SVG                           | square viewBox, per §2                           | **Essential**      |
| 3   | Mark, one-colour (mono)             | SVG                           | single fill, true knockout                       | **Essential**      |
| 4   | Horizontal lockup (mark + wordmark) | SVG                           | outlined text                                    | **Essential**      |
| 5   | Editable master                     | `.ai` and/or `.fig`           | layered, named                                   | **Essential**      |
| 6   | Wordmark alone                      | SVG                           | outlined text                                    | High               |
| 7   | Stacked/vertical lockup             | SVG                           | outlined text                                    | High               |
| 8   | Full-bleed square app tile          | SVG + PNG                     | opaque, content in safe zone (§5)                | High               |
| 9   | Mark PNG set                        | PNG-24 + alpha                | 16, 32, 48, 64, 128, 180, 192, 256, 512, 1024 px | We can generate    |
| 10  | Lockup PNG set                      | PNG-24 + alpha                | at 1×/2×/3× of intended display width            | We can generate    |
| 11  | Favicon                             | `.ico`                        | multi-res 16/32/48                               | We can generate    |
| 12  | Social card                         | PNG                           | 1200 × 630                                       | We can generate    |
| 13  | Print vector                        | PDF (PDF/X-1a) + EPS          | CMYK, outlined                                   | If print is likely |
| 14  | Colour specification                | Written (or in the brand PDF) | hex, RGB, CMYK, Pantone C+U                      | High               |
| 15  | Mini usage guide                    | PDF                           | clear space, min size, misuse                    | Nice to have       |

---

## 4. Variants required

Each of these is a separate file, not a colour swap we apply ourselves.

1. **Primary** — for light backgrounds. Full colour, gradients allowed.
2. **Dark-mode** — for dark backgrounds. Note this is a _design decision_, not an inversion filter: ask the designers explicitly what the mark becomes on `#080A11`. (Our current mark flips its disc to solid white rather than keeping the brand colour, because a mid-blue disc on near-black loses its edge.)
3. **One-colour black** — flat `#000000`, true knockout for negative space.
4. **One-colour white** — flat `#FFFFFF`, true knockout. For dark arbitrary backgrounds, photos, and print.
5. **Full-bleed square tile** — the mark on an _opaque_ square with no rounded corners, for app/PWA/Apple icons. iOS and Android apply their own corner rounding; a pre-rounded icon gets double-rounded and looks wrong.

Lockups, for each of the above where sensible: **mark only**, **mark + wordmark horizontal**, **mark + wordmark stacked**.

---

## 5. Raster sizes and quality

- **Format:** PNG-24 with an **8-bit alpha channel**. Not PNG-8, not JPEG (JPEG has no transparency and will ring around sharp edges), not WebP for deliverables.
- **Colour profile:** **sRGB IEC61966-2.1**, embedded. Anything in Adobe RGB or a display-P3 profile will shift colour in browsers.
- **No interlacing**, no metadata bloat, `deviceScaleFactor: 1` (i.e. a 512px asset is exactly 512 px, not a 2× export of 256).
- **Transparent** background for the mark and lockups; **opaque** for app tiles.
- **Sizes:** 16, 32, 48, 64, 128, 180, 192, 256, 512, 1024 px square for the mark. The odd ones are real: 180 is the Apple touch icon, 192 and 512 are the PWA manifest sizes.
- **Rendered from vector at each size**, not upscaled from a single export. Ideally hand-checked at 16 and 32 — sharp geometric marks usually need a nudge to sit on the pixel grid at those sizes.

**Maskable safe zone** (for #8, the app tile): Android crops maskable icons to a circle whose diameter is **80% of the icon**. Keep all content within the central **80%**, and anything critical within the central **66%**. Practically: on a 512px tile, keep the mark inside a centred 410px circle, with the important part inside 340px.

**Social card** (#12), if they produce it: 1200 × 630 PNG, sRGB, under ~300 KB. Keep text away from the outer 60px — different platforms crop differently.

---

## 6. Colour specification

Ask for all four, written down:

| Space         | Why                                                                               |
| ------------- | --------------------------------------------------------------------------------- |
| **Hex / RGB** | Everything digital. Required.                                                     |
| **CMYK**      | Print. A cobalt that's perfect on screen can go muddy or purple in CMYK.          |
| **Pantone**   | Both **coated (C)** and **uncoated (U)** — they print differently.                |
| **Gradients** | Exact stop colours _and_ stop positions _and_ the angle, if any gradient is used. |

Also ask: **what is the minimum contrast pairing** — which backgrounds is each variant approved for. And whether the mark is approved to sit on the brand colour itself.

For reference, the current shipped identity is Cobalt Prime: gradient `#3D7FFF → #1A4FC4`, accent `#1E63F0`, dark-mode disc `#FFFFFF` with `#0B1020` knockout. A new mark doesn't have to match, but if it doesn't, the site's accent tokens change too — flag that to us early, it's a separate piece of work.

---

## 7. Wordmark and typography

- Which typeface the wordmark is built from, **and its licence**. If it's a commercial font, confirm that outlining it for logo use is permitted — most licences allow it, some don't.
- Whether the wordmark is **custom-drawn or set-and-kerned**. If set, we need the font name so headings can be visually related.
- Confirm the capitalisation: our current treatment is sentence-case **"Orgofin"**, tight tracking. If the designers want all-caps or a different letterform, that's a brand decision to make consciously rather than absorb from an export.
- The delivered wordmark must be **outlined** (§2), with an un-outlined copy retained in the editable master.

---

## 8. Usage rules to ask for

Short is fine — a single page beats a 40-page guideline nobody opens.

- **Clear space:** minimum margin around the mark, expressed as a fraction of the mark (e.g. "half the disc's radius"), not in pixels.
- **Minimum size:** in px for digital and mm for print. State it for each lockup — a horizontal lockup has a much higher minimum than the mark alone.
- **Misuse:** the specific don'ts for _this_ mark — don't stretch, don't recolour, don't add effects, don't rebuild the letterform from a font, don't place on a busy photo, don't rotate.
- **Co-branding:** how it sits beside another logo (relative sizing and separation).

---

## 9. What we do not need

Say so up front; it saves the designers time and you money.

- Rounded-corner app icons — iOS/Android round them; pre-rounded gets double-rounded.
- Mockups, business cards, letterheads, tote bags. Nice for a pitch, not a website deliverable.
- A 40-page brand book at this stage.
- Animated versions — genuinely wanted eventually ([`brand-assets.md`](./brand-assets.md) Future Improvements), but as a separate brief once the static mark is locked. If it comes free, ask for **Lottie JSON** or a **CSS/SVG-animatable SVG**, not an MP4 or GIF.
- Favicon `.ico`, PWA PNGs, and the social card — we generate these from the vector.

---

## 10. Acceptance tests

What we'll actually check when the files land, so the designers can pre-empt it:

1. Open each SVG in a text editor: no `<text>`, no `font-family`, no `<image>`, no base64, no generic IDs, `viewBox` present.
2. Render the mono variant on a saturated background — the negative space shows the background colour, not white.
3. Render the mark at 16px and 32px in light and dark — still identifiable as Orgofin.
4. Drop the app tile into a circular mask at 512px — nothing important is clipped.
5. Open the SVG on a machine without the designers' fonts — nothing shifts.
6. Inline the SVG twice on one page — both instances keep their own fill (the ID-collision test).
7. Check every PNG's embedded profile is sRGB, and that a 512px file is 512px of real detail.
8. File sizes within the §2 targets.

---

## Design Decisions

- **Vector-first, rasters generated.** We already render every PNG and the `.ico` from SVG with headless Chromium ([`brand-assets.md`](./brand-assets.md) §3), so paying a designer per-size is waste — and a generated set can be regenerated the day the brand colour changes, which a delivered set cannot.
- **Dark mode is specified as a design question, not a filter.** The current mark's disc inverts to white rather than staying blue. Asking the designers to decide this deliberately avoids us inventing a dark treatment they'd disown.
- **The ID-collision and knockout requirements are called out explicitly** because both have bitten real projects and neither is visible in a design tool — they only show up once the SVG is inlined into a component, which is exactly how this site uses it.

## Current Status

Written 2026-07-24 for the in-progress external logo commission. The round-3 selection is still open (27 concepts, [`logo-round-3.md`](./logo-round-3.md)); the shipped Eclipse mark ([`brand-assets.md`](./brand-assets.md)) stays live until the founders choose. No delivered assets have been received or reviewed yet.

## Future Improvements

- Fold the accepted assets into `brand-assets.md` and retire the generator step for anything the designers supply directly.
- Add the §10 acceptance tests as a script once there are files to run them against.

## TODO

- [ ] **Founders:** pick the direction from round 3 before commissioning production files — paying for a full asset set across variants only makes sense once the mark is settled.
- [ ] **Founders:** confirm with the designers whether the new mark keeps the Cobalt Prime palette. If not, the site's accent tokens and every generated asset change with it — that's a separate PR and worth knowing in advance.
- [ ] **Engineering:** on delivery, run §10, then update `brand-assets.md`, `Logo.tsx`, `icon.svg`, `logo.svg`, `manifest.ts` `theme_color`, and regenerate the raster set.

## References

- [`brand-assets.md`](./brand-assets.md) — the currently shipped Eclipse identity, its asset inventory and the raster generator
- [`logo-round-3.md`](./logo-round-3.md) — the concepts awaiting a founder decision
- [`logo-explorations.md`](./logo-explorations.md), [`logo-concepts.md`](./logo-concepts.md) — earlier rounds
- [`../../.claude/context/design-system.md`](../../.claude/context/design-system.md) — colour tokens the mark must sit inside

## Related Documents

- [`../../.claude/context/branding.md`](../../.claude/context/branding.md)

---

**Last Updated:** 2026-07-24
**Owner:** Orgofin Founders (brand decision) · Orgofin Engineering (acceptance)
