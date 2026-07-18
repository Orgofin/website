"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Show the "Orgofin" wordmark next to the mark. Default true. */
  withWordmark?: boolean;
  /** Mark size in px (square). Default 28. */
  size?: number;
  className?: string;
};

/**
 * The Orgofin brand lockup — the "Eclipse" mark (a gradient disc = the O, with
 * the letter F in true negative space) plus the wordmark. Source of truth for
 * the mark is `public/logo.svg` / `src/app/icon.svg`; this inlines it so it
 * renders crisply at any size and inherits the wordmark's typography. The
 * gradient id is per-instance (`useId`) so multiple logos on one page never
 * collide.
 *
 * The F is drawn in the page background colour (`var(--page)`), so it reads as a
 * carved-out counter that flips with the theme — light on light, dark on dark —
 * rather than a fixed white letter.
 *
 * Brand colour is the indigo→violet gradient from the selected concept
 * (docs/brand/logo-explorations.md, "07 Eclipse"); re-sync with the palette
 * decision when it lands.
 */
export function Logo({ withWordmark = true, size = 28, className }: LogoProps) {
  const gradientId = useId();

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label={withWordmark ? "Orgofin" : "Orgofin home"}
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="31" fill={`url(#${gradientId})`} />
        {/* Negative-space F: fill matches the page background so it looks
            knocked out of the disc and adapts to light/dark. */}
        <g style={{ fill: "var(--page)" }}>
          <rect x="23" y="16" width="6" height="32" />
          <rect x="23" y="16" width="18" height="6" />
          <rect x="23" y="30" width="12" height="6" />
        </g>
      </svg>
      {withWordmark && (
        <span className="text-heading-md text-fg font-semibold tracking-tight">
          Orgofin
        </span>
      )}
    </span>
  );
}
