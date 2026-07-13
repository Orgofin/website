// Extends Vitest's `expect` with jest-dom matchers (toBeInTheDocument, etc.)
// and unmounts the rendered tree after each test so cases stay isolated.
// Loaded via `setupFiles` in vitest.config.ts.
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom has no IntersectionObserver, which framer-motion's `whileInView`
// (the shared Reveal/Stagger primitives) requires at mount. A no-op stub is
// enough: tests assert rendered content, not scroll-triggered animation.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "0px";
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = IntersectionObserverStub;
}
