"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { useMounted } from "@/hooks/useMounted";
import {
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme/config";

type ThemeContextValue = {
  /** The user's selection, including `system`. */
  theme: Theme;
  /** The concrete theme currently applied (`system` resolved to light/dark). */
  resolvedTheme: ResolvedTheme;
  /** Whether the provider has mounted — false during SSR / first paint. */
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  /** Flip between light and dark based on what's currently resolved. */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme(fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : fallback;
}

function subscribeSystem(onChange: () => void): () => void {
  const media = window.matchMedia(MEDIA_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function applyTheme(resolved: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export type ThemeProviderProps = {
  children: React.ReactNode;
  /** Used only until the client reads the persisted value. */
  defaultTheme?: Theme;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const mounted = useMounted();
  // Initialized from persisted storage on the client; the ThemeScript already
  // applied the matching class pre-paint, so there's no flash.
  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(defaultTheme),
  );

  const systemTheme: ResolvedTheme = useSyncExternalStore(
    subscribeSystem,
    () => (window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light"),
    () => "light",
  );

  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  // Sync the DOM (an external system) with the resolved theme. Not a setState.
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Cross-tab sync: adopt a theme change made in another tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        setThemeState(getStoredTheme(defaultTheme));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [defaultTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, mounted, setTheme, toggleTheme }),
    [theme, resolvedTheme, mounted, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return context;
}
