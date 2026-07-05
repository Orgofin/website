"use client";

/**
 * Re-exported from the ThemeProvider so consumers can import the theme hook
 * from the conventional `@/hooks` location. The implementation is co-located
 * with the context it reads.
 */
export { useTheme } from "@/components/theme/ThemeProvider";
