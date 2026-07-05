import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type SpinnerProps = Omit<
  React.ComponentProps<typeof LoaderCircle>,
  "ref"
> & {
  /** Accessible label; omit and set `aria-hidden` when purely decorative. */
  label?: string;
};

/** Indeterminate loading spinner. */
export function Spinner({
  size = 20,
  label = "Loading",
  className,
  ...rest
}: SpinnerProps) {
  return (
    <LoaderCircle
      role="status"
      aria-label={label}
      size={size}
      className={cn("text-current motion-safe:animate-spin", className)}
      {...rest}
    />
  );
}
