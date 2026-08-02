import { expect, test } from "@playwright/test";

import { ROUTES, routeLabel } from "./routes";

/**
 * The 320px floor (design-system.md §9, PRD §7).
 *
 * 320px is the WCAG 1.4.10 reflow width and the supported minimum; below it the
 * site shows a deliberate lockout instead of attempting a layout. Horizontal
 * overflow is the failure mode that reaches users as "the page is broken on my
 * phone" and is almost never noticed on a desktop review.
 */

const WIDTHS = [320, 360, 375] as const;

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });

    for (const route of ROUTES) {
      test(`${routeLabel(route)} does not scroll horizontally`, async ({
        page,
      }) => {
        await page.goto(route);
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });

        const result = await page.evaluate(() => {
          const de = document.documentElement;
          const offenders: string[] = [];

          for (const el of document.querySelectorAll("body *")) {
            // Content inside a deliberately scrollable container is allowed to
            // exceed the viewport — wide tables and code blocks scroll in their
            // own box. The page body is what must not.
            let p = el.parentElement;
            let scrollable = false;
            while (p) {
              const ox = getComputedStyle(p).overflowX;
              if (ox === "auto" || ox === "scroll") {
                scrollable = true;
                break;
              }
              p = p.parentElement;
            }
            if (scrollable) continue;

            const r = el.getBoundingClientRect();
            // Elements parked far off-screen left are the standard visually-
            // hidden technique, not overflow. Only the right edge matters.
            if (r.width > 0 && r.right > de.clientWidth + 1) {
              offenders.push(
                `${el.tagName}${el.className ? "." + String(el.className).slice(0, 60) : ""} right=${Math.round(r.right)}`,
              );
            }
          }

          return {
            documentOverflow: de.scrollWidth > de.clientWidth,
            scrollWidth: de.scrollWidth,
            clientWidth: de.clientWidth,
            offenders: offenders.slice(0, 5),
          };
        });

        expect(
          result.documentOverflow,
          `the document scrolls horizontally (${result.scrollWidth} > ${result.clientWidth}). ` +
            `Offending elements:\n  ${result.offenders.join("\n  ")}`,
        ).toBe(false);
        expect(result.offenders, "elements extend past the right edge").toEqual(
          [],
        );
      });
    }
  });
}

test.describe("the lockout boundary", () => {
  test("is hidden at exactly 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/");
    await expect(
      page.getByRole("dialog", { name: "Screen too small" }),
    ).toBeHidden();
  });

  test("is shown at 319px", async ({ page }) => {
    // One pixel below the floor. Asserting both sides is what makes this a
    // boundary test rather than a restatement of the CSS.
    await page.setViewportSize({ width: 319, height: 720 });
    await page.goto("/");
    await expect(
      page.getByRole("dialog", { name: "Screen too small" }),
    ).toBeVisible();
  });
});
