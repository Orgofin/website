"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Device tiers, matching the `--breakpoint-*` tokens in globals.css and the
 * ranges in design-system.md §9. `blocked` is the <320px lockout tier.
 */
export type Breakpoint =
  "blocked" | "mobile" | "tablet" | "laptop" | "desktop" | "wide";

/** Lower bound (px) of each tier, in ascending order. */
export const BREAKPOINTS: Record<Breakpoint, number> = {
  blocked: 0,
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 1366,
  wide: 1920,
};

const ORDER: readonly Breakpoint[] = [
  "blocked",
  "mobile",
  "tablet",
  "laptop",
  "desktop",
  "wide",
];

function toBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.wide) return "wide";
  if (width >= BREAKPOINTS.desktop) return "desktop";
  if (width >= BREAKPOINTS.laptop) return "laptop";
  if (width >= BREAKPOINTS.tablet) return "tablet";
  if (width >= BREAKPOINTS.mobile) return "mobile";
  return "blocked";
}

export type UseBreakpointResult = {
  breakpoint: Breakpoint;
  width: number;
  /** True when the viewport is at or above the given tier. */
  isAtLeast: (target: Breakpoint) => boolean;
};

/**
 * Reports the current responsive tier. Server snapshot assumes `desktop` to
 * avoid a pessimistic mobile flash on hydration; gate layout-critical reads
 * behind `useMounted` if exact first-paint accuracy matters.
 */
export function useBreakpoint(): UseBreakpointResult {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("resize", onChange, { passive: true });
    return () => window.removeEventListener("resize", onChange);
  }, []);

  const width = useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => BREAKPOINTS.desktop,
  );

  const breakpoint = toBreakpoint(width);
  const isAtLeast = (target: Breakpoint) =>
    ORDER.indexOf(breakpoint) >= ORDER.indexOf(target);

  return { breakpoint, width, isAtLeast };
}
