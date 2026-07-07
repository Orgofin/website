import { type Gap, gapClass } from "@/components/layout/spacing";
import { cn } from "@/lib/utils";

type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around";

const alignClass: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClass: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export type StackProps = React.ComponentProps<"div"> & {
  direction?: "row" | "col";
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
};

/** Flexbox stack — vertical by default, with a consistent gap scale. */
export function Stack({
  direction = "col",
  gap = "md",
  align,
  justify,
  wrap = false,
  className,
  ...rest
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        gapClass[gap],
        align && alignClass[align],
        justify && justifyClass[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...rest}
    />
  );
}
