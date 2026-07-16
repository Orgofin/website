---
name: verify
description: Build, launch, and drive the Orgofin website locally to verify a change end-to-end in a real browser.
---

# Verifying changes in the running website

## Build + launch

```powershell
npm run build     # production build (Turbopack)
npm start         # serves the build on http://localhost:3000 — run in background
```

`npm run dev` also works for quick iteration, but verify against `npm start` — it exercises the real SSG output (what a crawler sees in the HTML matters here; client-only components must NOT be in it).

## Drive it in a real browser

No Playwright in the repo (by design — E2E is a future epic). Recipe that works on this machine:

1. Install `playwright-core` (no browser download) in the session scratchpad, **not** the repo.
2. Launch the system Edge:

```js
import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
```

3. Useful contexts: `{ reducedMotion: "reduce" }` for the reduced-motion path, `{ colorScheme: "dark" }` for dark mode (ThemeScript follows system preference by default), a ~600px viewport for mobile.

## Mobile overflow audit (the 320px floor)

The supported floor is **320px** (design-system §9; lockout only below that). Any layout-touching change should re-run the overflow audit: for each route × width in {320, 360, 375}, load the page, scroll through it so lazy content mounts, then assert `document.documentElement.scrollWidth <= clientWidth` and walk `body *` for elements whose bounding rect exceeds the viewport — skipping elements inside an ancestor with `overflow-x: auto|scroll` (tables/wide content are allowed to scroll inside their own container, the page body is not). Boundary checks: the `[aria-label="Screen too small"]` lockout is `display: none` at ≥320px and visible at 319px.

## Gotchas

- **Continuously animating elements (e.g., the CompanyBrainGraph ambient drift) never pass Playwright's stability check** — `hover()`/`click()` time out with "element is not stable." Use `{ force: true }`; the graph's 22-unit hit radius tolerates the ±3-unit drift.
- Lazily mounted components (IntersectionObserver-gated) need a `scrollIntoViewIfNeeded()` on nearby text before their locator resolves.
- Raw-HTML assertions (crawlable equivalents, no-JS content): plain `fetch(BASE)` from Node, not the browser.
- The section worth screenshotting is found via `page.locator("section", { hasText: "…heading…" }).first()`. Element screenshots can include the sticky navbar band mid-frame — an artifact of scroll position, not a page bug.
- **GA4 events:** build with `$env:NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TESTLOCAL1"` (baked at build time — setting it at `npm start` alone does nothing), block `**googletagmanager.com/**` via `page.route` to stay hermetic, then inspect `window.dataLayer`. gtag pushes `arguments` objects (array-LIKE, `Array.isArray` is false) — normalize with `Array.from(entry)` inside `page.evaluate` or every event looks missing.
