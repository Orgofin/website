import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "text-micro inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-medium",
  {
    variants: {
      variant: {
        neutral: "text-fg",
        available: "text-fg",
        roadmap: "text-fg-muted",
        accent: "text-accent border-accent/30",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

/** Dot colour per variant. The dot is a secondary cue — the label text is the
 *  primary signal, so state is never conveyed by colour alone (`accessibility.md`). */
const dotColor: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "bg-fg-subtle",
  available: "bg-success",
  roadmap: "bg-fg-subtle",
  accent: "bg-accent",
};

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Leading icon; replaces the status dot when provided. */
    icon?: React.ReactNode;
    /** Show the status dot (ignored when `icon` is set). Defaults to true. */
    dot?: boolean;
  };

/**
 * Status/label pill — e.g. "Available now" vs "On the roadmap" on the Products
 * page. The variant tints the label and a small leading dot, but the label text
 * always carries the meaning so the state survives without colour.
 */
export function Badge({
  variant = "neutral",
  icon,
  dot = true,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...rest}>
      {icon ? (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {icon}
        </span>
      ) : dot ? (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            dotColor[variant ?? "neutral"],
          )}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}

export { badgeVariants };
