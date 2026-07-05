"use client";

import { BREAKPOINTS } from "@/hooks/useBreakpoint";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * True when the viewport is below the `tablet` tier (i.e. phone-sized).
 * Thin convenience wrapper over `useMediaQuery` / the breakpoint tokens.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.tablet - 1}px)`);
}
