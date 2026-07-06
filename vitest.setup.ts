// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc.)
// and unmounts the rendered tree after each test so cases stay isolated.
// Loaded via `setupFiles` in vitest.config.ts.
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
