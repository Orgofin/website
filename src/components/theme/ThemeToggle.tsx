"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { type Theme } from "@/lib/theme/config";

const CYCLE: readonly Theme[] = ["light", "dark", "system"];

const ICON: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const NEXT_LABEL: Record<Theme, string> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export type ThemeToggleProps = {
  className?: string;
};

/**
 * Cycles theme: light → dark → system. Renders the `system` icon until mounted
 * to avoid a hydration mismatch (the real class was already applied pre-paint by
 * ThemeScript). The label announces the next state for screen-reader users.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();
  const active: Theme = mounted ? theme : "system";
  const Icon = ICON[active];

  const advance = () => {
    const index = CYCLE.indexOf(active);
    const next = CYCLE[(index + 1) % CYCLE.length] ?? "system";
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      onClick={advance}
      className={className}
      aria-label={`Theme: ${active}. Switch to ${NEXT_LABEL[active]}.`}
    >
      <Icon size={18} aria-hidden="true" />
    </Button>
  );
}
