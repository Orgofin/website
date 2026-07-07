import { cn } from "@/lib/utils";

export type ContainerSize = "readable" | "narrow" | "content" | "wide" | "full";

const sizeClass: Record<ContainerSize, string> = {
  readable: "max-w-readable",
  narrow: "max-w-narrow",
  content: "max-w-content",
  wide: "max-w-wide",
  full: "max-w-none",
};

export type ContainerProps = React.ComponentProps<"div"> & {
  size?: ContainerSize;
  /** Apply responsive horizontal gutters. */
  gutter?: boolean;
};

/**
 * Centered, max-width-capped content box with responsive gutters. The single
 * place page/section width is decided — nothing hand-rolls its own container
 * width (frontend.md §4).
 */
export function Container({
  size = "content",
  gutter = true,
  className,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClass[size],
        gutter && "px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...rest}
    />
  );
}
