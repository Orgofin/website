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

// jsdom has no `matchMedia` either, which `ThemeProvider` and `useMediaQuery`
// both call at mount. `matches: false` is a deliberate default, not an
// arbitrary one: it resolves `prefers-color-scheme: dark` to light, so a test
// that renders anything theme-aware gets the same result on every machine
// regardless of the host OS appearance setting. A test that needs dark mode
// overrides this per-case rather than relying on the ambient environment.
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      // Deprecated pre-`addEventListener` API, still on the interface.
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
