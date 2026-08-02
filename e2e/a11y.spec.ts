import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { ROUTES, routeLabel } from "./routes";

/**
 * Automated accessibility regression (accessibility.md, E1.2.3).
 *
 * Every sitemap route, in both themes. Both themes is not thoroughness for its
 * own sake: this palette has had **three** separate contrast defects, and every
 * one of them was theme-specific (`--fg-subtle` failed at 1.87:1 in light and
 * 3.34:1 in dark; a later fix landed light on exactly 4.50:1, which is a
 * threshold, not a pass). Checking one theme would have caught none of them
 * reliably.
 *
 * This also supersedes the "automated contrast check over the token matrix"
 * that design-system.md has had open since 2026-07-18 — and supersedes it with
 * something strictly better. A token-pair matrix checks combinations someone
 * remembered to enumerate; axe checks what is **actually rendered**, including
 * the case that broke twice here, where text sits over a surface nobody thought
 * to pair it with.
 *
 * Scope note: axe catches a meaningful subset of accessibility problems, not
 * all of them. A green run here is a floor, not a certificate — the periodic
 * manual screen-reader pass in accessibility.md is still owed.
 */

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe — ${scheme}`, () => {
    test.use({ colorScheme: scheme });

    for (const route of ROUTES) {
      test(`${routeLabel(route)} has no WCAG AA violations`, async ({
        page,
      }) => {
        await page.goto(route);
        // Scroll the whole page so IntersectionObserver-gated sections mount;
        // content that never mounted cannot be found in violation of anything,
        // which would make this pass for the wrong reason.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 40));
          }
          window.scrollTo(0, 0);
        });

        // Let reveal animations settle before scanning.
        //
        // Not cosmetic — this was a real intermittent failure. Returning to the
        // top re-enters elements into view, and axe scanning one mid-fade sees
        // its *transient* opacity, computes a lower effective contrast and
        // reports a genuine-looking `[serious] color-contrast` violation that
        // passes on retry. WCAG applies to the settled state, so the scan has
        // to wait for it. `prefers-reduced-motion` (set globally) shortens the
        // cross-fade but does not remove it — animations.md keeps opacity
        // transitions on the reduced path deliberately.
        await page.evaluate(() =>
          Promise.all(
            document
              .getAnimations()
              .map((a) => a.finished.catch(() => undefined)),
          ),
        );
        // Framer Motion drives some transitions off rAF rather than the Web
        // Animations API, so `getAnimations()` cannot see them; this covers the
        // remainder. `motion-slow` is 450ms.
        await page.waitForTimeout(600);

        const { violations } = await new AxeBuilder({ page })
          .withTags(WCAG_AA)
          .analyze();

        // Name the rule and the element in the failure, so a red build says
        // what to fix rather than just how many things are wrong.
        const detail = violations
          .map(
            (v) =>
              `\n  [${v.impact}] ${v.id}: ${v.help}\n    ${v.nodes
                .slice(0, 3)
                .map((n) => n.target.join(" "))
                .join("\n    ")}`,
          )
          .join("");

        expect(
          violations,
          `${violations.length} accessibility violation(s) on ${route} (${scheme}):${detail}`,
        ).toEqual([]);
      });
    }
  });
}

test("the consent banner is reachable and dismissible by keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Analytics consent" });
  await expect(banner).toBeVisible();

  // It is last in the DOM so tab order matches its visual position; both of its
  // controls must be operable without a pointer.
  await expect(
    banner.getByRole("button", { name: /Only Essential/i }),
  ).toBeVisible();
  await banner.getByRole("button", { name: /Only Essential/i }).press("Enter");
  await expect(banner).toBeHidden();
});
