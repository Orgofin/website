import { cn } from "@/lib/utils";

export type SectionSpacing = "none" | "sm" | "md" | "lg";

/**
 * Vertical rhythm scales down at smaller breakpoints rather than staying fixed
 * (design-system.md §3): a cinematic gap on desktop is just empty scrolling on
 * a tablet.
 */
const spacingClass: Record<SectionSpacing, string> = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
};

export type SectionProps = React.ComponentProps<"section"> & {
  spacing?: SectionSpacing;
};

/**
 * A full-width vertical band with semantic `<section>` element and consistent
 * section-level vertical spacing. Compose a `<Container>` inside it to control
 * content width.
 */
export function Section({ spacing = "lg", className, ...rest }: SectionProps) {
  return (
    <section
      className={cn("relative w-full", spacingClass[spacing], className)}
      {...rest}
    />
  );
}
