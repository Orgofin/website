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
 * The Orgofin brand lockup — the "Eclipse" mark plus the wordmark.
 *
 * The mark is exactly concept 07 (docs/brand/preview.html): a solid disc with a
 * clean, sharp-cornered geometric "F" in negative space. It inverts with the
 * theme (matching the reference):
 *   - Light: indigo→violet disc, white F.
 *   - Dark:  white disc, dark F.
 * The inversion uses the `dark:` variant (wired to the `.dark` class in
 * globals.css), so it follows the site theme toggle. Keep the F geometry in
 * sync with `src/app/icon.svg` / `public/logo.svg`.
 */

/** Concept-07 F, as non-overlapping blocks on a 64-grid (x, y, w, h). */
const F_PARTS: ReadonlyArray<readonly [number, number, number, number]> = [
  [23, 16.5, 6, 31], // stem
  [29, 16.5, 15, 6], // top arm
  [29, 30, 9, 6], // mid arm
];

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
        {/* Disc: gradient in light, white in dark. */}
        <circle
          cx="32"
          cy="32"
          r="31"
          fill={`url(#${gradientId})`}
          className="dark:fill-white"
        />
        {/* F in negative space: white in light, dark in dark. */}
        <g fill="#ffffff" className="dark:fill-[#0b1020]">
          {F_PARTS.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
          ))}
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
