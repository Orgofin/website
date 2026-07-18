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
 * The mark is a solid disc containing a CUSTOM, modular "F" built from uniform
 * square blocks (a digital-matrix glyph, deliberately not a font character).
 * Both the disc and the F invert with the theme via the `--logo-disc` /
 * `--logo-f` tokens (globals.css):
 *   - Light: purple disc, white F.
 *   - Dark:  white disc, dark F.
 *
 * The block coordinates are the single source of truth shared with the static
 * assets (`src/app/icon.svg`, `public/logo.svg`). Keep them in sync.
 */

/** The 8 uniform blocks that compose the F, on a 64×64 grid (x, y; size 7). */
const F_BLOCKS: ReadonlyArray<readonly [number, number]> = [
  [20, 11.5],
  [28.5, 11.5],
  [37, 11.5], // top arm
  [20, 20], // stem
  [20, 28.5],
  [28.5, 28.5], // mid arm
  [20, 37], // stem
  [20, 45.5], // stem
];

export function Logo({ withWordmark = true, size = 28, className }: LogoProps) {
  const titleId = useId();

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-labelledby={titleId}
        className="shrink-0"
      >
        <title id={titleId}>{withWordmark ? "Orgofin" : "Orgofin home"}</title>
        <circle cx="32" cy="32" r="31" style={{ fill: "var(--logo-disc)" }} />
        <g style={{ fill: "var(--logo-f)" }}>
          {F_BLOCKS.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" />
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
