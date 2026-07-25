# Orgofin Brand Assets — "Eclipse" Identity

> **Purpose:** Documents the selected Orgofin visual identity (concept **07 · Eclipse**), the production asset set shipped in this repo, how the assets are generated/regenerated, and usage rules. Resolves launch blocker **B-01** (missing logo/OG/favicon assets).
> **Applies to:** engineers touching branding, icons, or metadata, and anyone producing marketing/deck collateral.
> **Classification:** Internal.

---

## Responsibilities

Owns the shipped brand assets and their usage. The concept exploration and rationale live in [`logo-explorations.md`](./logo-explorations.md) (concept 07 was selected from it); this document is the _implemented_ result. Does not own the design tokens ([`.claude/context/design-system.md`](../../.claude/context/design-system.md)) or voice ([`.claude/context/branding.md`](../../.claude/context/branding.md)).

---

## 1. The selected mark

**Concept 07 · Eclipse** — reproduced exactly from the reviewed reference (`docs/brand/preview.html`): a **solid circular disc** with a clean, **sharp-cornered geometric "F" in negative space**. The F is a custom vector symbol (uniform stroke, 90° corners, no typeface), built from three connected blocks — stem + top arm + shorter mid arm. App icon first, letter second — recognizable from the disc alone and legible down to 16px.

- **Brand colour: Cobalt Prime** (the shipped identity) — cobalt gradient `#3D7FFF → #1A4FC4`, accent `#1E63F0`.
- **The mark fully inverts by theme** (matching the reference):
  - **Light:** Cobalt Prime gradient disc (`#3D7FFF → #1A4FC4`), white F.
  - **Dark:** white disc `#FFFFFF`, dark F `#0B1020`. **The disc is not coloured in dark mode — it inverts to white.**
- **Custom geometric F:** three rectangles on a 64-grid, uniform 6-unit stroke — stem `(23, 16.5, 6×31)`, top arm `(29, 16.5, 15×6)`, mid arm `(29, 30, 9×6)`. These coordinates are shared verbatim across `Logo.tsx`, `icon.svg`, and `logo.svg` — change them in one place and mirror.
- **How the inversion is wired:**
  - **On the site** (`Logo` component) the disc gradient reads the `--logo-grad-from` / `--logo-grad-to` tokens (globals.css, default Cobalt Prime = `--blue-500`/`--blue-700`) and paints white in dark via `dark:fill-white`; the F paints white with `dark:fill-[#0b1020]` — so the whole mark flips with the site theme toggle (the `dark:` variant is bound to `.dark`).
  - **In the browser tab** (`icon.svg`, `logo.svg`) an embedded `@media (prefers-color-scheme: dark)` inverts disc + F to match the OS/browser theme.
- **Container forms:** a **disc** for favicon / site logo / social; a **full-bleed tile** (same F) for app/PWA/Apple icons (opaque, maskable-safe — light variant: gradient tile + white F).
- **Mono variant:** [`public/logo-mono.svg`](../../public/logo-mono.svg) — single `currentColor` disc with the F knocked out (true negative space) for one-colour use.

> **Brand = Cobalt Prime; kept flexible for a future change.** The **on-site logo** is driven by two CSS tokens — repoint `--logo-grad-from` / `--logo-grad-to` in `globals.css` (e.g. to Indigo Meridian's values) and the live logo re-themes with **zero component edits**. The **static assets** (favicon, app icons, OG) are baked images: to re-theme them, update the hex in `src/app/icon.svg` + `public/logo.svg`, the generator's `tile-square.svg`/`og.html`, and `manifest.ts` `theme_color`, then re-run the generator (§3). Cobalt Prime keeps the base accent/gradient, so it also stays consistent with the site's CTA/accent colours.

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

To change the mark or colour: edit the F rectangles + gradient stops in `Logo.tsx` (and the `dark:` colours), and the matching colours/geometry in the source SVGs (`icon.svg`, `logo.svg`); then re-run the generator and re-verify (favicon at 16px in light + dark, OG render, app icon in a rounded mask).

---

## 4. Usage rules

- **Clear space:** keep space equal to the F's stem width around the mark.
- **Minimum size:** 16px (favicon). Below that, prefer the disc mark with no wordmark.
- **Do not:** rebuild the F from a font, round its corners, or change its geometry; stretch the disc; add effects; keep the disc purple in dark mode (it must invert to white).
- **Backgrounds:** use the theme-appropriate variant (purple-on-light, white-on-dark). On arbitrary brand-coloured backgrounds, use `logo-mono.svg`.
- **Wordmark:** Geist Semibold, tight tracking, sentence-case "Orgofin".

---

## 5. Verification (done)

- `lint`, `typecheck`, `test` (91), and `build` all pass.
- Production build exposes `/icon.svg`, `/apple-icon.png`, `/manifest.webmanifest`; `<head>` emits the icon/apple/manifest links and `og:image` resolves to `/og/default.png` (verified via `curl`).
- The **concept-07 F** and the **full disc inversion** were verified with headless screenshots: navbar logo (gradient disc/white F in light → white disc/dark F in dark), favicon at 16/32/64/128 in both light and dark (inverts via media query, legible at 16px), the light app-icon tile (gradient + white F), and the dark OG card (white disc + dark F).

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
- [ ] An external logo commission is in progress (2026-07-24). Requirements for the delivered files are specified in [`logo-delivery-spec.md`](./logo-delivery-spec.md); on delivery, run its §10 acceptance tests before wiring anything in.

## References

- [`logo-delivery-spec.md`](./logo-delivery-spec.md) — what to require from an external designer producing a replacement mark (formats, sizes, variants, acceptance tests).
- [`logo-explorations.md`](./logo-explorations.md) — concept 07 rationale (the selected direction).
- [`logo-concepts.md`](./logo-concepts.md) — round-one concepts.
- `src/app/icon.svg`, `src/app/manifest.ts`, `src/components/layout/Logo.tsx`
- [`.claude/context/design-system.md`](../../.claude/context/design-system.md), [`.claude/context/branding.md`](../../.claude/context/branding.md)

## Related Documents

- Production-readiness review (B-01) — in the launch-readiness PR.

---

**Last Updated:** 2026-07-18
**Owner:** Orgofin Engineering (production) · Orgofin Founders (brand decision)
