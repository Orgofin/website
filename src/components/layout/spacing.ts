/**
 * Shared gap scale for the layout primitives (Grid, Stack). Maps named sizes to
 * Tailwind gap utilities, which ride the 4px spacing grain from design-system.md §3.
 */

export type Gap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const gapClass: Record<Gap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
  "2xl": "gap-16",
};
