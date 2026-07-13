import { cn } from "@/lib/utils";

export type SixMoatsListVariant = "teaser" | "full";

export type SixMoatsListProps = {
  /** `teaser` = compact two-column Home Ch.7.5 grid; `full` = the /investors list. */
  variant: SixMoatsListVariant;
  moats: readonly string[];
  /** Accessible name for the list. */
  "aria-label": string;
  className?: string;
};

const listLayout: Record<SixMoatsListVariant, string> = {
  teaser: "grid gap-x-8 gap-y-4 sm:grid-cols-2",
  full: "flex flex-col gap-5",
};

const moatText: Record<SixMoatsListVariant, string> = {
  teaser: "text-body-sm",
  full: "text-body-lg",
};

/**
 * The six-moats list shared by Home Ch.7.5 (`variant="teaser"`) and the
 * Investors page (`variant="full"`) — one component, different density, per
 * the teaser/full reuse principle (`frontend.md` §3, E6.2.3). An ordered list
 * with visible mono numerals (the sequence is part of the pitch). Content-
 * agnostic: moats come from the consuming section. Deliberately motion-free —
 * the consuming section owns the single signature motion (`frontend.md` §2).
 */
export function SixMoatsList({
  variant,
  moats,
  className,
  "aria-label": ariaLabel,
}: SixMoatsListProps) {
  return (
    <ol className={cn(listLayout[variant], className)} aria-label={ariaLabel}>
      {moats.map((moat, index) => (
        <li key={moat} className="flex items-baseline gap-3">
          <span
            className="text-mono-md text-accent font-mono tabular-nums"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={cn("text-fg-muted", moatText[variant])}>{moat}</span>
        </li>
      ))}
    </ol>
  );
}
