# Orgofin Brand Assets — "Eclipse" Identity

> **Purpose:** Documents the selected Orgofin visual identity (concept **07 · Eclipse**), the production asset set shipped in this repo, how the assets are generated/regenerated, and usage rules. Resolves launch blocker **B-01** (missing logo/OG/favicon assets).
> **Applies to:** engineers touching branding, icons, or metadata, and anyone producing marketing/deck collateral.
> **Classification:** Internal.

---

## Responsibilities

Owns the shipped brand assets and their usage. The concept exploration and rationale live in [`logo-explorations.md`](./logo-explorations.md) (concept 07 was selected from it); this document is the _implemented_ result. Does not own the design tokens ([`.claude/context/design-system.md`](../../.claude/context/design-system.md)) or voice ([`.claude/context/branding.md`](../../.claude/context/branding.md)).

---

## 1. The selected mark

**Concept 07 · Eclipse** — a **solid circular disc** containing a **custom, modular "F"**. The F is _not_ a font character: it is a digital-matrix glyph built from eight uniform square blocks (uniform stroke, sharp 90° corners, deliberate negative-space gaps). App icon first, letter second — recognizable as the Orgofin mark from the disc alone, and legible down to 16px.

- **The mark fully inverts by theme** (matching the reference), driven by the `--logo-disc` / `--logo-f` tokens in `globals.css`:
  - **Light:** purple disc `#7C3AED`, white F `#FFFFFF`.
  - **Dark:** white disc `#FFFFFF`, dark F `#0B1020`. **The disc is not purple in dark mode — it inverts to white.**
- **Custom geometric F:** eight `7×7` blocks on a 64-grid (top arm = 3 blocks, stem = 4, mid arm = 1 shared corner block), with `1.5`-unit gaps. The block coordinates are shared verbatim across `Logo.tsx`, `icon.svg`, and `logo.svg` — change them in one place and mirror.
- **How the inversion is wired:**
  - **On the site** (`Logo` component) the disc and F read the `--logo-disc` / `--logo-f` tokens, which flip under the `.dark` class — so the whole mark inverts with the site theme toggle.
  - **In the browser tab** (`icon.svg`, `favicon.ico`, `logo.svg`) an embedded `@media (prefers-color-scheme: dark)` inverts disc + F to match the OS/browser theme.
- **Container forms:** a **disc** for favicon / site logo / social; a **full-bleed tile** (same construction) for app/PWA/Apple icons (opaque, maskable-safe — light variant: purple tile + white F).
- **Mono variant:** [`public/logo-mono.svg`](../../public/logo-mono.svg) — single `currentColor` disc with the modular F knocked out (true negative space) for one-colour use.

> **Colours are provisional pending the palette decision.** Purple `#7C3AED` is carried from the reviewed exploration. If the palette experiment lands on a different primary, update `--logo-disc`/`--logo-f` in `globals.css`, the media-query colours in the source SVGs, `manifest.ts` `theme_color`, and re-run the asset generator (§3).

---

## 2. Asset inventory (what shipped, where, why)

| Asset                     | Path                             | Purpose                                                                                |
| ------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| SVG favicon               | `src/app/icon.svg`               | Primary favicon (Next auto-links `<link rel="icon" type="image/svg+xml">`). Disc mark. |
| Legacy favicon            | `src/app/favicon.ico`            | 16/32/48 multi-res `.ico` fallback for older browsers. Disc mark.                      |
| Apple touch icon          | `src/app/apple-icon.png`         | 180×180, opaque full-bleed tile (iOS applies its own rounding).                        |
| PWA icon (small)          | `public/icon-192.png`            | 192×192 tile, referenced by the manifest.                                              |
| PWA icon (large/maskable) | `public/icon-512.png`            | 512×512 tile, used for `any` + `maskable` manifest purposes.                           |
| Web manifest              | `src/app/manifest.ts`            | Generates `/manifest.webmanifest`; install-to-home-screen + theme colour.              |
| Logo (SVG)                | `public/logo.svg`                | General-purpose disc mark (transparent).                                               |
| Logo (PNG)                | `public/logo.png`                | 512×512 disc mark (transparent) — used for schema.org `Organization.logo`.             |
| Logo (mono)               | `public/logo-mono.svg`           | One-colour, true negative-space F variant.                                             |
| Social share image        | `public/og/default.png`          | 1200×630 Open Graph / Twitter card (referenced by `siteConfig.ogImage`).               |
| `Logo` component          | `src/components/layout/Logo.tsx` | Inline SVG mark + wordmark used in the Navbar and Footer.                              |

**Wiring:** `siteConfig.ogImage` (`/og/default.png`) and the JSON-LD logo (`/logo.png`) now resolve to real files. Favicon/apple/manifest are wired via Next's file conventions (no manual `<link>` needed). The `Logo` component replaced the text wordmark in the Navbar and Footer.

---

## 3. Regenerating the raster assets

The PNGs and `.ico` are generated from the SVG sources with headless Chromium — no design tool required. The generator is not committed (it uses a scratchpad Playwright install); the procedure:

1. Sources: `src/app/icon.svg` (disc) and a full-bleed `tile-square.svg` (same mark, no rounding) + `og.html` (the social-card layout).
2. Render with Playwright at exact pixel sizes (`deviceScaleFactor: 1`), `omitBackground: true` for transparent assets (disc favicon, `logo.png`), opaque for tiles.
3. Build `favicon.ico` from 16/32/48 PNGs via `png-to-ico`.
4. Screenshot `og.html` at 1200×630 for `public/og/default.png`.

To change the mark or colour: edit the block coordinates in the SVG sources + `Logo.tsx`, the `--logo-disc`/`--logo-f` tokens in `globals.css`, and the media-query colours in the SVGs; then re-run the generator and re-verify (favicon at 16px in light + dark, OG render, app icon in a rounded mask).

---

## 4. Usage rules

- **Clear space:** keep space equal to the F's stem width around the mark.
- **Minimum size:** 16px (favicon). Below that, prefer the disc mark with no wordmark.
- **Do not:** rebuild the F from a font, round its corners, or alter the block grid/gaps; stretch the disc; add effects; keep the disc purple in dark mode (it must invert to white).
- **Backgrounds:** use the theme-appropriate variant (purple-on-light, white-on-dark). On arbitrary brand-coloured backgrounds, use `logo-mono.svg`.
- **Wordmark:** Geist Semibold, tight tracking, sentence-case "Orgofin".

---

## 5. Verification (done)

- `lint`, `typecheck`, `test` (91), and `build` all pass.
- Production build exposes `/icon.svg`, `/apple-icon.png`, `/manifest.webmanifest`; `<head>` emits the icon/apple/manifest links and `og:image` resolves to `/og/default.png` (verified via `curl`).
- The **custom modular F** and the **full disc inversion** were verified with headless screenshots: navbar logo (purple/white F in light → white/dark F in dark), favicon at 16/32/64/128 in both light and dark (inverts via media query, legible at 16px), the light app-icon tile (purple + white F), and the dark OG card (white disc + dark F).

---

## Current Status

Eclipse identity implemented and wired 2026-07-18. Colour is provisional pending the palette decision. Closes launch blocker **B-01**.

## Future Improvements

- Sync the gradient with the final brand palette when decided; regenerate assets.
- Optional animated mark (the F "resolving" / disc drawing) for the hero/loader, respecting reduced-motion.
- Dynamic per-page OG image route to replace the single static card.
- Full brand-guidelines doc (misuse, co-branding, motion) as the company scales.

## TODO

- [ ] Confirm/adjust brand colour against the palette decision, then regenerate.
- [ ] Replace placeholder wordmark treatment with a finalized kerned wordmark if a bespoke one is commissioned.

## References

- [`logo-explorations.md`](./logo-explorations.md) — concept 07 rationale (the selected direction).
- [`logo-concepts.md`](./logo-concepts.md) — round-one concepts.
- `src/app/icon.svg`, `src/app/manifest.ts`, `src/components/layout/Logo.tsx`
- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)

## Related Documents

- Production-readiness review (B-01) — in the launch-readiness PR.

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (production) · Orgofin Founders (brand decision)
