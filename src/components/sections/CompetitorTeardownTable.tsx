import { cn } from "@/lib/utils";

export type CompetitorRow = {
  /** Competitor name — e.g. "Zoho" or "SAP / Oracle". */
  competitor: string;
  /** The one-line gap Orgofin exploits — e.g. "No unified graph, no real agent layer." */
  gap: string;
};

export type CompetitorTeardownTableVariant = "teaser" | "full";

export type CompetitorTeardownTableProps = {
  /** `teaser` = compact Home Ch.7.5 density; `full` = the /investors treatment. */
  variant: CompetitorTeardownTableVariant;
  rows: readonly CompetitorRow[];
  /** Accessible table name, rendered as a visually-hidden `<caption>`. */
  caption: string;
  className?: string;
};

const cellPadding: Record<CompetitorTeardownTableVariant, string> = {
  teaser: "py-2.5",
  full: "py-4",
};

const gapText: Record<CompetitorTeardownTableVariant, string> = {
  teaser: "text-body-sm",
  full: "text-body-md",
};

/**
 * The competitive teardown shared by Home Ch.7.5 (`variant="teaser"`) and the
 * Investors page (`variant="full"`) — one component, different data, per the
 * teaser/full reuse principle (`frontend.md` §3, E6.2.3). A real `<table>`
 * with column/row headers, horizontally scrollable inside its own container on
 * narrow viewports (never the page). Content-agnostic: rows come from the
 * consuming section. Deliberately motion-free — motion wrappers can't wrap
 * table rows without breaking table semantics, so the consuming section owns
 * the single signature motion (`frontend.md` §2).
 */
export function CompetitorTeardownTable({
  variant,
  rows,
  caption,
  className,
}: CompetitorTeardownTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-md border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-border border-b">
            <th
              scope="col"
              className={cn(
                "text-caption text-fg-muted pr-6 font-medium uppercase",
                cellPadding[variant],
              )}
            >
              Competitor
            </th>
            <th
              scope="col"
              className={cn(
                "text-caption text-fg-muted font-medium uppercase",
                cellPadding[variant],
              )}
            >
              The gap
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.competitor} className="border-border border-b">
              <th
                scope="row"
                className={cn(
                  "text-heading-sm text-fg pr-6 font-semibold whitespace-nowrap",
                  cellPadding[variant],
                )}
              >
                {row.competitor}
              </th>
              <td
                className={cn(
                  "text-fg-muted",
                  gapText[variant],
                  cellPadding[variant],
                )}
              >
                {row.gap}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
