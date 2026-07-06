import { Label } from "@/components/ui/Label";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

/** Props handed to the control so it renders correctly wired for accessibility. */
export type FormFieldControlProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
};

export type FormFieldProps = {
  /** Visible label text. */
  label: React.ReactNode;
  /** Stable id shared by the label (`htmlFor`) and the control (`id`). */
  htmlFor: string;
  /** Optional helper text rendered above the control and referenced by it. */
  hint?: React.ReactNode;
  /** Inline error message; its presence marks the field invalid. */
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  /**
   * The control, as a render function receiving the wiring props. Spread them
   * onto the `Input`/`Textarea`/`Select` so label association, description, and
   * invalid state are all correct without the caller re-deriving ids.
   */
  children: (control: FormFieldControlProps) => React.ReactNode;
};

/**
 * Label + control + inline error, with `aria-describedby`/`aria-invalid` wired
 * for you. The error renders next to the field (never as a top-of-page alert,
 * per `coding-standards.md` error handling) and is announced via `role="alert"`.
 */
export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {hint ? (
        <Text id={hintId} as="span" size="body-sm" tone="muted">
          {hint}
        </Text>
      ) : null}
      {children({
        id: htmlFor,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error ? (
        <Text
          id={errorId}
          as="span"
          size="body-sm"
          role="alert"
          className="text-danger"
        >
          {error}
        </Text>
      ) : null}
    </div>
  );
}
