import { expect, test } from "@playwright/test";

import { ROUTES, routeLabel } from "./routes";

/**
 * Route-level smoke: every sitemap route renders, titles itself, and does so
 * without the browser complaining (E1.2.3, testing.md).
 *
 * The console assertion is the load-bearing part. A Next.js page can return 200
 * and look correct while a hydration mismatch, a failed chunk or a thrown
 * effect quietly degrades it to a static shell — the visible symptom is usually
 * "a button stopped working", noticed days later by a human.
 */
test.describe("smoke", () => {
  for (const route of ROUTES) {
    test(`${routeLabel(route)} renders cleanly`, async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error")
          problems.push(`console.error: ${msg.text()}`);
      });
      page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));

      const response = await page.goto(route);
      expect(response?.status(), `${route} did not return 200`).toBe(200);

      // Exactly one *visible* h1 — heading order is a documented rule
      // (design-system.md §8) and a page with none is usually a section that
      // failed to render. Visible, not present: `MobileBlockScreen` renders its
      // own h1 into every page and hides it with `display: none` above 320px,
      // so it is in the DOM but out of the accessibility tree. Counting raw
      // elements would report 2 on every route and assert nothing useful.
      await expect(page.locator("h1:visible")).toHaveCount(1);
      await expect(page).toHaveTitle(/\S/);

      // The nav and footer chrome is layout-level; if it is missing on one
      // route, that route escaped the marketing layout.
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();

      expect(
        problems,
        `browser errors on ${route}:\n${problems.join("\n")}`,
      ).toEqual([]);
    });
  }

  test("the skip link is the first tab stop and moves focus to main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /Skip to content/i });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page.locator("#main-content")).toBeAttached();
  });
});

test.describe("theme", () => {
  test("an explicit theme choice survives a reload", async ({ page }) => {
    // Persistence is the whole point of the ThemeProvider + pre-hydration
    // ThemeScript pair; if it regresses, the site flashes the wrong theme on
    // every navigation and the bug reads as "flickering", not "not persisted".
    await page.goto("/");

    // The control cycles light -> dark -> system; it is not a binary toggle, so
    // a single click from `system` lands on `light` and changes nothing
    // observable. Drive the cycle until dark is actually active instead of
    // assuming which click does it — that keeps the test independent of the
    // starting state and of the cycle's order.
    const isDark = () =>
      page.evaluate(() => document.documentElement.classList.contains("dark"));
    // Scoped to the header: the footer renders a second, identical toggle, so
    // an unscoped locator matches two elements and fails strict mode.
    const toggle = page
      .getByRole("banner")
      .getByRole("button", { name: /^Theme:/ });

    for (let i = 0; i < 3 && !(await isDark()); i++) {
      await toggle.click();
      await page.waitForTimeout(250);
    }
    expect(
      await isDark(),
      "cycling the theme control never reached the dark theme",
    ).toBe(true);

    await page.reload();
    expect(
      await isDark(),
      "the explicit dark choice was lost across a reload — the persisted value " +
        "is not being applied by ThemeScript before first paint",
    ).toBe(true);
  });
});
