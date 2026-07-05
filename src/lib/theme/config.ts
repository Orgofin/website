/**
 * Shared theme constants and types. Imported by both the pre-hydration
 * ThemeScript and the client ThemeProvider so the storage key and the set of
 * valid themes can never drift between them.
 */

export const THEME_STORAGE_KEY = "orgofin-theme";

/** What the user can choose. `system` follows the OS preference. */
export type Theme = "light" | "dark" | "system";

/** What actually renders — `system` is always resolved to one of these. */
export type ResolvedTheme = "light" | "dark";

export const THEMES: readonly Theme[] = ["light", "dark", "system"] as const;
