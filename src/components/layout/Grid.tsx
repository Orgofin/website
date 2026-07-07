import { type Gap, gapClass } from "@/components/layout/spacing";
import { cn } from "@/lib/utils";

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;

/**
 * Column counts degrade gracefully to fewer columns on smaller viewports —
 * mobile-first, never a fixed multi-column grid that overflows on phones.
 */
const colsClass: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-2 sm:grid-cols-6 lg:grid-cols-12",
};

export type GridProps = React.ComponentProps<"div"> & {
  cols?: GridCols;
  gap?: Gap;
};

/** Responsive CSS grid primitive. */
export function Grid({ cols = 3, gap = "lg", className, ...rest }: GridProps) {
  return (
    <div
      className={cn("grid", colsClass[cols], gapClass[gap], className)}
      {...rest}
    />
  );
}
