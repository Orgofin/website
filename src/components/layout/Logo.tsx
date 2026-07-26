import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Show the "Orgofin" wordmark next to the mark. Default true. */
  withWordmark?: boolean;
  /** Mark size in px (square). Default 48 — see the note on legibility below. */
  size?: number;
  className?: string;
};

/**
 * The Orgofin brand lockup — the delivered mark plus the wordmark.
 *
 * **The artwork is used unmodified.** Both files are byte-identical copies of
 * delivered files (`cmp`-verified, see docs/brand/brand-assets.md). Nothing here
 * redraws, recolours or restrokes them — an earlier simplified redraw was
 * rejected by the founders, and the delivered files are the design of record.
 *
 * ## Why two files
 *
 * The delivery has no inverted (light-ink) untiled variant — every `lOGO-*` file
 * is dark ink despite the naming, which is only visible if you render them on a
 * mid-grey background. So a single untiled file cannot serve both themes: on the
 * dark page its brain half disappears and only the circuit traces survive.
 *
 * The pair that does work, using files as delivered:
 *
 * - **Light:** `LOGO-4-518.svg` — untiled, single-colour blue. Transparent, so
 *   it sits directly on the page with nothing to blend away.
 * - **Dark:** `LOGO-5-518.svg` — white brain and blue traces on a near-black
 *   (`#000`) tile. Against the `#080a11` page that tile is all but
 *   indistinguishable, so clipped to a circle it blends into the background and
 *   the mark reads as free-standing.
 *
 * Two CSS properties do the blending, and both are needed:
 *
 * - `rounded-full` clips the dark file's square tile to a circle; unclipped, its
 *   straight edge is visible against the page. A no-op for the light file, which
 *   has no tile, but applied to both so the themes share one footprint.
 * - `mix-blend-screen` on the dark file only. The tile is pure `#000`, and
 *   `screen` maps black to "leave the backdrop alone", so the disc disappears
 *   exactly instead of almost. Without it the disc is faintly visible on the
 *   page and **obviously** visible on a raised surface (`#10141f`), where the
 *   two blacks no longer nearly match. It must not go on the light file — screen
 *   against a light backdrop would erase dark artwork entirely.
 *
 * Neither touches the artwork; both are presentation.
 *
 * ## Size
 *
 * 48px by default. This artwork carries real interior detail: side-by-side
 * renders show it only resolving from about 36px, and 48px is where the brain is
 * unambiguous. Raising the size is the only legibility lever available while
 * editing the artwork is off the table.
 */
const MARK_CLASSES = "shrink-0 rounded-full";

/**
 * Both files are near-square but not exactly (light 0.984, dark 1.009), and
 * Tailwind Preflight sets `img { height: auto }` — which overrides the `height`
 * attribute and would render a 48×49 ellipse instead of a circle. An inline
 * style beats Preflight, forcing a true square; the ≤1.6% distortion that costs
 * is imperceptible and is the price of a real circle.
 */
const squareStyle = (size: number) => ({ width: size, height: size });

export function Logo({ withWordmark = true, size = 48, className }: LogoProps) {
  const alt = withWordmark ? "" : "Orgofin home";
  const ariaHidden = withWordmark ? true : undefined;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* Two files, swapped by theme — see the component doc for why one cannot
          serve both. `dark:` is bound to the `.dark` class, so this follows the
          site's theme toggle rather than the OS setting.

          eslint-disable-next-line is on each: next/image adds nothing for a
          vector (nothing to resize or re-encode) and would need
          `dangerouslyAllowSVG` enabled project-wide to pass an SVG through. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/orgofin-mark-light.svg"
        alt={alt}
        aria-hidden={ariaHidden}
        width={size}
        height={size}
        style={squareStyle(size)}
        className={cn(MARK_CLASSES, "dark:hidden")}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/orgofin-mark-dark.svg"
        alt={alt}
        aria-hidden={ariaHidden}
        width={size}
        height={size}
        style={squareStyle(size)}
        className={cn(MARK_CLASSES, "hidden dark:block", "mix-blend-screen")}
      />
      {withWordmark && (
        <span className="text-heading-md text-fg font-semibold tracking-tight">
          Orgofin
        </span>
      )}
    </span>
  );
}
