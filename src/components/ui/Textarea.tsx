import { cn } from "@/lib/utils";

export type TextareaProps = React.ComponentProps<"textarea"> & {
  /** Marks the field invalid — sets `aria-invalid` and the danger border. */
  invalid?: boolean;
};

/**
 * Multi-line text input primitive. Shares the field styling and the global
 * `:focus-visible` ring with `Input`; grows vertically and is user-resizable on
 * the vertical axis only. Associate a label via a matching `id` +
 * `<label htmlFor>`. Refs are forwarded to the `<textarea>`.
 */
export function Textarea({ invalid, className, ...rest }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "text-body-md text-fg bg-surface-raised border-border min-h-24 w-full resize-y rounded-sm border px-3 py-2",
        "placeholder:text-fg-subtle",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...rest}
    />
  );
}
