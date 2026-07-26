import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Show the "Orgofin" wordmark next to the mark. Default true. */
  withWordmark?: boolean;
  /** Mark size in px (square). Default 28. */
  size?: number;
  className?: string;
};

/**
 * The Orgofin brand lockup — the brain mark plus the wordmark.
 *
 * The mark is a brain split into a biological half and a circuit half: the
 * Company Brain, stated literally. It is simplified from the founders' artwork
 * (`docs/brand/logo/Anna-05.svg`), and the reason is measurable rather than
 * aesthetic — that drawing carries 40 paths at ~0.7% stroke width, which is
 * invisible below about 48px and would inline 33KB into the navbar *and*
 * footer of every page. This version keeps the silhouette and proportion and
 * drops the density. The full-detail original ships as `public/logo.svg` for
 * OG images, press and large display; keep the two visually in step.
 *
 * Colour comes from `currentColor`, set here to the `--accent` token, so the
 * mark re-themes with the palette and can never go invisible on either
 * background — which is the failure mode of the delivered files: they are flat
 * single-colour artwork and disappear against the dark page. Recoloured to
 * Cobalt Prime by founder decision, 2026-07-26, so one blue runs across logo,
 * CTAs and links; the delivered colour is recorded in
 * `docs/brand/brand-assets.md`.
 *
 * Keep the geometry in sync with `src/app/icon.svg` and the raster icons
 * (docs/brand/brand-assets.md §3).
 */
export function Logo({ withWordmark = true, size = 28, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label={withWordmark ? "Orgofin" : "Orgofin home"}
        fill="none"
        className="text-accent shrink-0"
      >
        <g
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Brain: scalloped contour. The bumps are what make it read as a
              brain at 16–28px; a smooth curve reads as a bracket. */}
          <path d="M32 10c-4.6-.6-7.6 1-9 3.8-4.3-1-7.6 1.6-7.6 5.6-3.9.8-6 4-4.6 7.7-3.2 2.3-3.2 6.2 0 8.5-1.4 3.7.7 6.9 4.6 7.7 0 4 3.3 6.6 7.6 5.6 1.4 2.8 4.4 4.4 9 3.8" />
          <path d="M32 22c-4.4-.4-7 1.6-6.4 5" />
          <path d="M32 37c-4.4-.4-7 1.6-6.4 5" />
          {/* Spine: the division the whole mark turns on. */}
          <path d="M32 10v42" />
          {/* Circuit half. */}
          <path d="M32 19h9l4-4h4" />
          <path d="M32 31h14" />
          <path d="M32 43h9l4 4h4" />
        </g>
        <g fill="currentColor">
          <circle cx="52" cy="15" r="3.2" />
          <circle cx="49.5" cy="31" r="3.2" />
          <circle cx="52" cy="47" r="3.2" />
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
