import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-md", {
  variants: {
    variant: {
      standard: "bg-surface border border-border shadow-elevation-1",
      elevated: "bg-surface-raised border border-border shadow-elevation-2",
      glass: "glass-surface",
      interactive:
        "bg-surface border border-border shadow-elevation-1 transition duration-[var(--motion-base)] ease-standard hover:shadow-elevation-2 hover:border-border-strong motion-safe:hover:-translate-y-0.5",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "standard",
    padding: "md",
  },
});

export type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>;

/**
 * Surface primitive. Elevation maps to the design-system.md §7 tokens; the
 * `interactive` variant adds a single hover elevation step (never more than one
 * jump) plus a subtle lift that's disabled under reduced motion. Wrap in a link
 * or button for real interactivity + focus ring.
 */
export function Card({ variant, padding, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...rest}
    />
  );
}

export function CardHeader({
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-heading-md text-fg font-semibold", className)}
      {...rest}
    />
  );
}

export function CardDescription({
  className,
  ...rest
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-body-sm text-fg-muted", className)} {...rest} />
  );
}

export function CardContent({
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return <div className={cn("text-body-md text-fg", className)} {...rest} />;
}

export function CardFooter({
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-3 pt-2", className)} {...rest} />
  );
}

export { cardVariants };
