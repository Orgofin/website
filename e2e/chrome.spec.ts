import { expect, test, type Page } from "@playwright/test";

/**
 * Occlusion invariants for the site chrome (design-system.md §2, §7).
 *
 * This file exists because of a real production defect (2026-08-01): the sticky
 * header and the nav dropdowns were built from `glass-surface`, a decorative
 * 4%-white tint that cannot occlude, and page content read straight through
 * them. Unit tests could not see it — the components emitted exactly the
 * classes they were asked to. The failure was in what the browser painted.
 *
 * Every assertion below is written to fail on a specific way that can recur,
 * not to describe the current implementation. In particular, `backdrop-filter`
 * is read from *computed style in a real engine*, which is the only place the
 * `-webkit-`-only regression is observable at all.
 *
 * Navigation strategy differs per test, deliberately. Tests that only read
 * computed style or hit-test wait for `domcontentloaded`: stylesheets are
 * render-blocking in `<head>`, so the cascade is fully applied by then, and
 * waiting for `load` means waiting for fonts, images and the code-split graph
 * chunk — which made the first Firefox navigation in CI exceed its timeout and
 * land as flake. Tests that *interact* (hover, click) wait for `load`, because
 * they need React to have hydrated and `domcontentloaded` fires before that.
 */

type Surface = { alpha: number; backdropFilter: string; zIndex: string };

/** Effective alpha of an element's own background, plus its filter state. */
async function surfaceOf(page: Page, selector: string): Promise<Surface> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`no element for ${sel}`);
    const cs = getComputedStyle(el);
    const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
    const parts = m?.[1] ? m[1].split(",").map((s) => parseFloat(s)) : [];
    return {
      alpha: parts.length > 3 ? (parts[3] ?? 1) : 1,
      // Firefox exposes only the unprefixed property; Chromium aliases both.
      // Reading the unprefixed one is what makes the -webkit--only build fail.
      backdropFilter: cs.backdropFilter,
      zIndex: cs.zIndex,
    };
  }, selector);
}

/**
 * The core rule, and the one worth stating once: a surface that page content
 * passes behind is legible **either** because it is opaque **or** because it is
 * translucent *and* blurred. Translucent-without-blur is the defect state, and
 * it is exactly what shipped.
 */
function assertOccludes(s: Surface, name: string, minAlphaWithBlur: number) {
  const blurred = s.backdropFilter !== "none" && s.backdropFilter !== "";
  if (!blurred) {
    expect(
      s.alpha,
      `${name}: no backdrop-filter is applied, so the background must be fully ` +
        `opaque. alpha=${s.alpha} means content shows through. This is the ` +
        `production defect from 2026-08-01 — most likely the @supports guard ` +
        `or the -webkit-/unprefixed declaration order in globals.css.`,
    ).toBe(1);
    return;
  }
  expect(
    s.alpha,
    `${name}: blurred, but at alpha=${s.alpha} the blur alone is not enough to ` +
      `occlude high-contrast content.`,
  ).toBeGreaterThanOrEqual(minAlphaWithBlur);
}

for (const scheme of ["light", "dark"] as const) {
  test.describe(`site chrome — ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    test("the header occludes content at every scroll position", async ({
      page,
    }) => {
      await page.goto("/platform", { waitUntil: "domcontentloaded" });
      const header = "header";
      await expect(page.locator(header)).toBeVisible();

      // At rest, and again scrolled — the header must never pass through a
      // transparent state. It previously swapped material on scroll, so the
      // top-of-page state and the scrolled state were genuinely different.
      for (const y of [0, 900]) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(400);
        const s = await surfaceOf(page, header);
        assertOccludes(s, `header at scrollY=${y}`, 0.7);
      }
    });

    test("the header hit-tests above page content", async ({ page }) => {
      await page.goto("/platform", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.scrollTo(0, 900));
      await page.waitForTimeout(300);

      const covered = await page.evaluate(() => {
        const h = document.querySelector("header");
        if (!h) return false;
        const r = h.getBoundingClientRect();
        const hit = document.elementFromPoint(r.width / 2, r.height / 2);
        return !!hit && h.contains(hit);
      });
      expect(
        covered,
        "a point inside the header resolved to page content behind it — the " +
          "header is not on top of the scroll layer",
      ).toBe(true);
    });

    test("an open dropdown is near-opaque and above the header", async ({
      page,
    }) => {
      // Full `load` here, unlike the style-only tests above: this one hovers a
      // control and waits on the state React sets, so it needs hydration to
      // have happened. `domcontentloaded` fires before that, and the hover then
      // lands on an element with no handler attached yet.
      await page.goto("/platform");
      await page.setViewportSize({ width: 1440, height: 900 });

      // Scope every lookup to the banner. Page content legitimately contains
      // its own lists and links with the same names — `/platform` has a
      // "Company Brain" link in its body — so an unscoped locator matches two
      // elements and fails on strict mode rather than on the thing under test.
      const nav = page.getByRole("banner");
      const trigger = nav.getByRole("button", { name: /^Platform/ });
      await trigger.hover();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      const panel = nav
        .getByRole("link", { name: "Company Brain" })
        .locator("xpath=ancestor::ul[1]");
      await expect(panel).toBeVisible();

      const s = await page.evaluate(() => {
        const link = [...document.querySelectorAll("header a")].find(
          (a) => a.textContent?.trim() === "Company Brain",
        );
        const ul = link?.closest("ul");
        if (!ul) throw new Error("dropdown panel not found");
        const cs = getComputedStyle(ul);
        const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
        const parts = m?.[1] ? m[1].split(",").map((x) => parseFloat(x)) : [];
        const r = ul.getBoundingClientRect();
        const hit = document.elementFromPoint(
          r.x + r.width / 2,
          r.y + r.height / 2,
        );
        return {
          alpha: parts.length > 3 ? (parts[3] ?? 1) : 1,
          backdropFilter: cs.backdropFilter,
          zIndex: getComputedStyle(ul.parentElement as Element).zIndex,
          onTop: ul.contains(hit),
        };
      });

      // A menu is stricter than chrome: nobody should ever have to read a menu
      // item against a scrolling paragraph, so blur does not buy it leniency.
      assertOccludes(s, "dropdown panel", 0.95);
      expect(s.onTop, "dropdown did not hit-test on top").toBe(true);
      expect(
        s.zIndex,
        "the dropdown positioner has no z-index of its own — it is relying on " +
          "stacking-context luck, which is what it did before the --z-* ladder",
      ).not.toBe("auto");
    });

    test("the mobile drawer is opaque enough to read over content", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 780 });
      // Full `load` — clicking the menu trigger requires hydration (see above).
      await page.goto("/platform");
      await page.evaluate(() => window.scrollTo(0, 900));

      await page.getByRole("button", { name: "Open menu" }).click();
      const drawer = page.locator('[role="dialog"][data-state="open"]');
      await expect(drawer).toBeVisible();

      const s = await surfaceOf(page, '[role="dialog"][data-state="open"]');
      assertOccludes(s, "mobile nav drawer", 0.95);
    });
  });
}

test("the layering ladder is fully defined and strictly ordered", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const z = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const names = [
      "header",
      "progress",
      "dropdown",
      "banner",
      "overlay",
      "modal",
      "blocker",
      "skip-link",
    ];
    return Object.fromEntries(
      names.map((n) => [n, cs.getPropertyValue(`--z-${n}`).trim()]),
    );
  });

  for (const [name, value] of Object.entries(z)) {
    expect(value, `--z-${name} is not defined in globals.css`).not.toBe("");
  }

  const n = (k: string) => Number(z[k]);
  expect(n("header")).toBeLessThan(n("dropdown"));
  expect(n("dropdown")).toBeLessThan(n("banner"));
  expect(n("banner")).toBeLessThan(n("overlay"));
  expect(n("overlay")).toBeLessThan(n("modal"));
  expect(n("modal")).toBeLessThan(n("blocker"));
  // The skip link is the accessibility entry point to the whole page. If
  // anything can cover it, keyboard users have no way in.
  expect(n("skip-link")).toBe(Math.max(...Object.values(z).map(Number)));
});
