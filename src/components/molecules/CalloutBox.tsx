import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const calloutVariants = cva("rounded-md", {
  variants: {
    variant: {
      // Quieter inline emphasis — the "THE CORE INSIGHT" aside inside a section.
      insight: "bg-accent-subtle border-l-2 border-accent p-5",
      // A more prominent standalone block — the "THE FUNDAMENTAL DIFFERENCE" beat.
      spotlight: "glass-surface border border-accent p-6",
    },
  },
  defaultVariants: {
    variant: "insight",
  },
});

export type CalloutBoxProps = React.ComponentProps<"aside"> &
  VariantProps<typeof calloutVariants> & {
    /** Small uppercase label, e.g. "THE CORE INSIGHT". */
    label?: React.ReactNode;
  };

/**
 * The styled emphasis block from the source narrative — "THE CORE INSIGHT" /
 * "THE FUNDAMENTAL DIFFERENCE". Renders as a semantic `<aside>` (complementary
 * landmark). Content-agnostic: label and body come from the caller.
 *
 * Pass `aria-label` when the callout should be discoverable as a landmark by
 * name; the visible `label` is decorative styling, not an accessible name.
 */
export function CalloutBox({
  label,
  variant,
  className,
  children,
  ...rest
}: CalloutBoxProps) {
  return (
    <aside className={cn(calloutVariants({ variant }), className)} {...rest}>
      {label ? (
        <p className="text-micro text-accent mb-2 uppercase">{label}</p>
      ) : null}
      <div className="text-body-lg text-fg text-pretty">{children}</div>
    </aside>
  );
}

export { calloutVariants };
