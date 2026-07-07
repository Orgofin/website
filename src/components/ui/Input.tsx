import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> & {
  /** Marks the field invalid — sets `aria-invalid` and the danger border. */
  invalid?: boolean;
};

/**
 * Text input primitive. The visible focus ring is the global `:focus-visible`
 * treatment (`design-system.md` §8), so it is not re-declared here. Associate a
 * label by passing a matching `id` and rendering an external `<label htmlFor>`
 * (the `FormField` molecule wires this up). Refs are forwarded to the `<input>`.
 */
export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "text-body-md text-fg bg-surface-raised border-border h-11 w-full rounded-sm border px-3",
        "placeholder:text-fg-subtle",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    />
  );
}
