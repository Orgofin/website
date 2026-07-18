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
 * The Orgofin brand lockup — the "Eclipse" mark (a gradient disc with the
 * letter F in negative space) plus the wordmark. Source of truth for the mark
 * is `public/logo.svg` / `src/app/icon.svg`; this inlines it so it renders
 * crisply at any size and inherits the wordmark's typography. The gradient id
 * is per-instance (`useId`) so multiple logos on one page never collide.
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
        <g fill="#ffffff">
          <rect x="22" y="16" width="6.5" height="32" rx="1.8" />
          <rect x="22" y="16" width="19" height="6.5" rx="1.8" />
          <rect x="22" y="29.5" width="13.5" height="6.5" rx="1.8" />
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
