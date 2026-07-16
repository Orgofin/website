import { Caption } from "@/components/ui/Caption";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/**
 * The specialised workers from `.claude/knowledge/ai-agents.md`'s named-agent
 * table (source PDF §4.3) — names verbatim, functions near-verbatim. The CEO
 * Intelligence Agent is deliberately absent here: it is the vignette above
 * this diagram (PRD §305 makes the vignette the chapter's payoff, not a node).
 */
const SPECIALISTS: ReadonlyArray<{ name: string; focus: string }> = [
  {
    name: "HR Operations Agent",
    focus: "Onboarding, offboarding, leave approvals, payroll queries",
  },
  {
    name: "Finance Agent",
    focus: "Reconciles bank statements, flags anomalies, generates GST reports",
  },
  {
    name: "Sales Agent",
    focus: "Enriches leads, drafts proposals, follows up on stalled deals",
  },
  {
    name: "Support Agent",
    focus: "Resolves L1 tickets, escalates the rest, updates the CRM",
  },
];

/** Vertical flow connector. The label is real text (it carries the reading
 *  order for screen readers); only the line glyphs are decorative. */
function FlowConnector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <span aria-hidden="true" className="bg-border-strong h-4 w-px" />
      {label ? (
        <span className="text-micro text-fg-subtle uppercase">{label}</span>
      ) : null}
      <span aria-hidden="true" className="bg-border-strong h-4 w-px" />
    </div>
  );
}

/**
 * The multi-agent collaboration protocol from `ai-agents.md`, drawn as a
 * static top-down flow: request → orchestrator → specialised agents, with the
 * human-in-the-loop rule as the caption. Deliberately motion-free — Ch.6's one
 * signature motion is the vignette stagger (animations.md) — and built from
 * semantic DOM rather than SVG/canvas, so the diagram is its own crawlable,
 * screen-reader-readable text equivalent (the E9.3.4 accessible fallback).
 * Microcopy recorded in `docs/product/copy.md` §1 Ch.6 (flagged synthesized).
 */
export function AgentOrchestrationDiagram({
  className,
}: {
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div className="border-border bg-surface rounded-full border px-5 py-2">
        <span className="text-body-sm text-fg-muted">A business request</span>
      </div>

      <FlowConnector />

      <Card className="w-full max-w-sm text-center">
        <span className="text-heading-sm text-fg block font-semibold">
          Orchestrator Agent
        </span>
        <p className="text-body-sm text-fg-muted mt-1.5">
          Breaks the request into sub-tasks, delegates them, and synthesises the
          results.
        </p>
      </Card>

      <FlowConnector label="delegates to" />

      <ul
        role="list"
        aria-label="Specialised agents"
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {SPECIALISTS.map((agent) => (
          <li key={agent.name}>
            <Card padding="sm" className="h-full">
              <span className="text-body-sm text-fg block font-semibold">
                {agent.name}
              </span>
              <p className="text-caption text-fg-muted mt-1">{agent.focus}</p>
            </Card>
          </li>
        ))}
      </ul>

      <figcaption className="mt-6 max-w-md text-center">
        <Caption as="p">
          Results come back as one synthesised output — with human approval
          checkpoints for high-stakes actions, like payroll runs above ₹10L.
        </Caption>
      </figcaption>
    </figure>
  );
}
