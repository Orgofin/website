/** Barrel export for the theme system. */
export {
  ThemeProvider,
  useTheme,
  type ThemeProviderProps,
} from "@/components/theme/ThemeProvider";
export { ThemeScript } from "@/components/theme/ThemeScript";
export {
  ThemeToggle,
  type ThemeToggleProps,
} from "@/components/theme/ThemeToggle";
export {
  THEME_STORAGE_KEY,
  THEMES,
  type Theme,
  type ResolvedTheme,
} from "@/lib/theme/config";
