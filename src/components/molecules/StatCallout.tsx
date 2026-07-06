import { cn } from "@/lib/utils";

export type StatCalloutAlign = "start" | "center";
export type StatCalloutSize = "md" | "lg";

export type StatCalloutProps = {
  /** The figure itself, e.g. "$52K–$220K" or "$1.73B". Rendered in Geist Mono. */
  value: React.ReactNode;
  /** Short label describing the figure. */
  label: React.ReactNode;
  /** Optional supporting sentence beneath the label. */
  description?: React.ReactNode;
  align?: StatCalloutAlign;
  size?: StatCalloutSize;
  /** Apply the brand gradient to the figure (hero stats only — use sparingly). */
  gradient?: boolean;
  className?: string;
};

const alignClass: Record<StatCalloutAlign, string> = {
  start: "items-start text-left",
  center: "items-center text-center",
};

const valueSizeClass: Record<StatCalloutSize, string> = {
  md: "text-display-lg",
  lg: "text-display-xl",
};

/**
 * A single-number callout — TAM/ARR figures, the $52K–$220K cost stat, and the
 * like. The figure renders in Geist Mono with tabular figures so digits align
 * (`design-system.md` §1: mono for financial/compliance data). Content-agnostic:
 * value and label are props.
 */
export function StatCallout({
  value,
  label,
  description,
  align = "start",
  size = "lg",
  gradient = false,
  className,
}: StatCalloutProps) {
  return (
    <div className={cn("flex flex-col gap-2", alignClass[align], className)}>
      <span
        className={cn(
          "font-mono font-semibold tabular-nums",
          valueSizeClass[size],
          gradient ? "text-gradient-brand" : "text-fg",
        )}
      >
        {value}
      </span>
      <span className="text-caption text-fg-muted">{label}</span>
      {description ? (
        <span className="text-body-sm text-fg-subtle max-w-prose">
          {description}
        </span>
      ) : null}
    </div>
  );
}
