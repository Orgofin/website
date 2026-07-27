import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Unit + component test runner. Vitest chosen over Jest (see testing.md): it
// shares Vite's transform pipeline, needs no separate Babel config, and runs
// TS/JSX out of the box via the automatic runtime — so no React plugin (and no
// @swc/core dependency, which conflicts with Next's pinned @swc/helpers) is
// needed for the component tests below.
export default defineConfig({
  resolve: {
    alias: {
      // Mirror the tsconfig "@/*" -> "src/*" path alias for test resolution.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // jsdom gives component tests a DOM; lib/ unit tests ignore it harmlessly.
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Co-located tests next to the code they cover.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Vitest's 5s default is a budget for the test body; here it was acting as
    // a race against machine load. The suites that call `vi.resetModules()` and
    // re-`import()` a module graph (analytics/track, consent) pay Vite's
    // transform cost inside the timed window, and that cost is shared across
    // parallel workers — the same assertion measures ~2ms in isolation and can
    // approach 5s on a loaded CI runner. The visible symptom was worse than a
    // single timeout: the timed-out test left a mock behind and the *next* test
    // failed on it, so one slow machine presented as "2 failed".
    //
    // 15s keeps a genuinely hung test from stalling CI while removing the race.
    // If this ever needs raising again, fix the cause instead — the module-graph
    // reload is what is slow, not the code under test.
    testTimeout: 15_000,
  },
});
