import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end / accessibility runner (E1.2.3, testing.md).
 *
 * Complements Vitest rather than overlapping it: Vitest asserts what a
 * component renders, this asserts what a *browser* does with it. The
 * distinction is not academic — the 2026-08-01 navbar defect was invisible to
 * every unit test because the component was emitting exactly the classes it was
 * asked to, and the failure was in what the browser then painted.
 *
 * ## Why Firefox is in the matrix and not deferred as "nice to have"
 *
 * That defect shipped as `-webkit-backdrop-filter` with the unprefixed property
 * stripped by the CSS minifier. Chromium honours the `-webkit-` alias; **Firefox
 * never has**. So the site rendered a 4%-opaque navbar with no blur at all, in
 * production, exclusively in Firefox — and a Chromium-only matrix would have
 * reported green throughout. `chrome.spec.ts` asserts the computed
 * `backdrop-filter`, which makes that exact regression a hard failure here.
 *
 * WebKit is deliberately absent for now: it roughly doubles browser install
 * time and iOS Safari's real risks (viewport units, scroll behaviour) are not
 * what this suite currently covers. Tracked in testing.md.
 */
const PORT = 3000;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Deliberately not `src/**` — Vitest owns that tree, and a spec picked up by
  // both runners fails confusingly in whichever one lacks its globals.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry in CI absorbs genuine flake (cold server, slow runner) without
  // hiding a real intermittent failure — a test that needs two retries is a
  // bug report, not a budget request.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Motion is orchestration, not content (animations.md). Reducing it removes
    // the single largest source of E2E flake — Playwright's actionability check
    // never settles on a continuously animating element, e.g. the Company Brain
    // graph's ambient drift.
    //
    // It belongs under `contextOptions`, not at the top level of `use`: the
    // top-level spelling type-errors, and because `next build` type-checks this
    // file too, getting it wrong fails the build rather than just the suite.
    contextOptions: { reducedMotion: "reduce" },
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      // Firefox runs the chrome/occlusion spec only, not the whole suite.
      //
      // It is in the matrix for exactly one reason: CSS feature-support
      // divergence, which is what shipped the navbar defect. The accessibility,
      // smoke and reflow assertions are engine-independent in practice, so
      // re-running them here would roughly double CI wall time to re-confirm
      // results Chromium already established. Widen this the day a defect
      // proves that assumption wrong — not before.
      name: "firefox",
      testMatch: /chrome\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  webServer: {
    // The production build, not `next dev` — this suite exists to check what
    // ships. In CI the build step has already run, so this only boots it.
    command: "npm run start",
    url: baseURL,
    // Local convenience, and a genuine footgun: an `npm start` left running
    // from an earlier build is reused silently, so the suite then tests stale
    // output. That happened during this suite's own development and presented
    // as a dozen unrelated assertion failures. If local results contradict the
    // code, kill whatever holds port 3000 and re-run before debugging anything.
    // Always false in CI, which is why CI cannot hit this.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
