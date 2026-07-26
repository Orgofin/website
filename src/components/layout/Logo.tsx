import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Show the "Orgofin" wordmark next to the mark. Default true. */
  withWordmark?: boolean;
  /**
   * Mark size in px (square). Default 36 — not 28, which is the size the
   * previous geometric mark used. This artwork carries real interior detail, and
   * side-by-side renders in the navbar show it only resolving from about 36px;
   * below that the tile reads as a plain dark square. Raising the size is the
   * one legibility lever available without editing the artwork, which is
   * off-limits (docs/brand/brand-assets.md).
   */
  size?: number;
  className?: string;
};

/**
 * The Orgofin brand lockup — the founders' mark plus the wordmark.
 *
 * The mark is the designers' delivered artwork, used **unmodified**:
 * `docs/brand/logo/LOGO-5-518.svg`, copied byte-identical to
 * `public/brand/orgofin-mark.svg`. Nothing here redraws, recolours or
 * simplifies it — an earlier attempt at a simplified redraw was rejected by the
 * founders, and the delivered file is the design of record.
 *
 * LOGO-5 was chosen from the five delivered designs because it is the only
 * family that stays legible at icon sizes: it is self-contained — a rounded
 * black tile carrying the white brain and blue circuit traces — so it needs no
 * light/dark variant and cannot vanish on either background. The untiled
 * designs are flat single-colour artwork that disappears against the dark page.
 * Full comparison and the evidence behind the choice: `docs/brand/brand-assets.md`.
 *
 * Served as an `<img>` rather than inlined: the file is 33KB of path data, and
 * inlining would put that in the navbar *and* footer of every page instead of
 * fetching it once and caching it.
 */
export function Logo({ withWordmark = true, size = 36, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- next/image adds
          no value for a vector (nothing to resize or re-encode) and would need
          `dangerouslyAllowSVG` enabled project-wide to pass an SVG through. */}
      <img
        src="/brand/orgofin-mark.svg"
        alt={withWordmark ? "" : "Orgofin home"}
        aria-hidden={withWordmark ? true : undefined}
        width={size}
        height={size}
        className="shrink-0"
      />
      {withWordmark && (
        <span className="text-heading-md text-fg font-semibold tracking-tight">
          Orgofin
        </span>
      )}
    </span>
  );
}
