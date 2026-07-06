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
  },
});
