import { cn } from "@/lib/utils";

export type LabelProps = React.ComponentProps<"label"> & {
  /** Show a required-field indicator after the label text. */
  required?: boolean;
};

/**
 * Form field label. Always pair with a control via `htmlFor` (accessibility.md).
 * The required marker is paired with text, never color alone.
 */
export function Label({
  required = false,
  className,
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      className={cn(
        "text-heading-sm text-fg inline-flex items-center gap-1",
        className,
      )}
      {...rest}
    >
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
