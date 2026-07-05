import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: layout, focus, disabled, and the transition are shared by every variant.
  "relative inline-flex select-none items-center justify-center rounded-sm font-medium whitespace-nowrap transition-colors duration-[var(--motion-fast)] ease-standard disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-cta text-on-accent shadow-elevation-1 hover:brightness-105",
        secondary:
          "bg-surface-raised text-fg border border-border hover:bg-surface",
        outline: "text-fg border border-border-strong hover:bg-surface",
        ghost: "text-fg hover:bg-surface",
        link: "text-accent underline-offset-4 hover:underline hover:text-accent-hover",
      },
      size: {
        sm: "h-9 gap-1.5 px-3 text-body-sm",
        md: "h-11 gap-2 px-5 text-body-md",
        lg: "h-12 gap-2 px-7 text-body-lg",
      },
      iconOnly: {
        true: "aspect-square px-0",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconOnly: true, class: "w-9" },
      { size: "md", iconOnly: true, class: "w-11" },
      { size: "lg", iconOnly: true, class: "w-12" },
      // The link variant is inline text, not a sized control.
      { variant: "link", class: "h-auto gap-1 px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element (e.g. an `<a>` or `<Link>`) via Radix Slot. */
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

/**
 * The single button primitive for the whole site — no page rolls its own.
 * Variants/sizes/state come from tokens; the focus ring is the global one.
 *
 * `asChild` renders the child element (for links) and — per Radix's single-child
 * contract — skips icon/spinner injection; use `leftIcon`/`rightIcon`/`loading`
 * on a real `<button>`.
 */
export function Button({
  variant,
  size,
  iconOnly,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, iconOnly }), className);

  if (asChild) {
    return (
      <Slot.Root className={classes} {...rest}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner
          size={size === "lg" ? 22 : 18}
          aria-hidden="true"
          label=""
          className="motion-safe:animate-spin"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

export { buttonVariants };
