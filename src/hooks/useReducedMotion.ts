"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Centralized reduced-motion signal (frontend.md §7). Wraps Framer Motion's own
 * hook so every motion primitive and any component that needs to branch on
 * motion preference reads from a single source — the reduced-motion path can't
 * drift out of sync section by section. Coerces Framer's `boolean | null` to a
 * plain boolean.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
