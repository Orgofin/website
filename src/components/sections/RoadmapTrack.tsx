import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export type RoadmapStage = {
  /** Stage name — e.g. "HRMS" (teaser) or "H1 — HRMS Wedge" (full). */
  label: string;
  /** Time horizon, full variant — e.g. "0–12 months". */
  timeframe?: string;
  /** Revenue/milestone target, full variant — e.g. "$2–5M ARR". Geist Mono. */
  target?: string;
  /** Marks the current stage (accent + dot treatment). */
  active?: boolean;
};

export type RoadmapTrackVariant = "teaser" | "full";

export type RoadmapTrackProps = {
  /** `teaser` = Home Ch.8 chip sequence; `full` = the /investors horizon list. */
  variant: RoadmapTrackVariant;
  stages: readonly RoadmapStage[];
  /** Accessible name for the sequence list. */
  "aria-label": string;
  className?: string;
};

/**
 * The roadmap sequence shared by Home Ch.8 (`variant="teaser"`) and the
 * Investors page (`variant="full"`) — one component driven by different data,
 * per the teaser/full reuse principle (`frontend.md` §3, E6.2.2). Content-
 * agnostic: stages come from the consuming section, never imported here.
 * Signature motion: the stages reveal in sequence, reading as the roadmap
 * order (reduced motion collapses to a plain fade via the shared `Stagger`).
 */
export function RoadmapTrack({
  variant,
  stages,
  className,
  "aria-label": ariaLabel,
}: RoadmapTrackProps) {
  if (variant === "teaser") {
    return (
      <Stagger
        className={cn("flex flex-wrap items-center gap-x-2 gap-y-3", className)}
        stagger={0.05}
        role="list"
        aria-label={ariaLabel}
      >
        {stages.map((stage, index) => (
          <StaggerItem
            key={stage.label}
            role="listitem"
            className="flex items-center gap-x-2"
          >
            {index > 0 ? (
              <span className="text-fg-subtle" aria-hidden="true">
                →
              </span>
            ) : null}
            <Badge
              variant={stage.active ? "accent" : "neutral"}
              dot={Boolean(stage.active)}
            >
              {stage.label}
            </Badge>
          </StaggerItem>
        ))}
      </Stagger>
    );
  }

  return (
    <Stagger
      className={cn("flex flex-col", className)}
      role="list"
      aria-label={ariaLabel}
    >
      {stages.map((stage) => (
        <StaggerItem
          key={stage.label}
          role="listitem"
          className="border-border border-t py-5 first:border-t-0"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
            <span className="flex items-baseline gap-2">
              {stage.active ? (
                <span
                  className="bg-accent size-1.5 shrink-0 self-center rounded-full"
                  aria-hidden="true"
                />
              ) : null}
              <span className="text-heading-sm text-fg font-semibold">
                {stage.label}
              </span>
            </span>
            {stage.target ? (
              <span className="text-mono-md text-fg font-mono tabular-nums">
                {stage.target}
              </span>
            ) : null}
          </div>
          {stage.timeframe ? (
            <p className="text-body-sm text-fg-muted mt-1">{stage.timeframe}</p>
          ) : null}
        </StaggerItem>
      ))}
    </Stagger>
  );
}
