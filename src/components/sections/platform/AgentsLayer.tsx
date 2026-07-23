import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

type NamedAgent = {
  name: string;
  function: string;
  phase: "V1" | "V2" | "V3";
};

/**
 * The named agents, verbatim from `.claude/knowledge/ai-agents.md` (source PDF
 * §4.3) — name, one-line function, and roadmap phase. Phase is shown as-is
 * ("V1"/"V2"/"V3"); it is a roadmap position from the source material, not a
 * shipping date, and must never be rendered as one.
 */
const NAMED_AGENTS: readonly NamedAgent[] = [
  {
    name: "HR Operations Agent",
    function:
      "Processes onboarding, offboarding, leave approvals, and payroll queries.",
    phase: "V1",
  },
  {
    name: "Finance Agent",
    function:
      "Reconciles bank statements, flags anomalies, and generates GST reports.",
    phase: "V2",
  },
  {
    name: "Sales Agent",
    function:
      "Enriches leads, drafts proposals, and follows up on stalled deals.",
    phase: "V2",
  },
  {
    name: "Support Agent",
    function:
      "Resolves L1 tickets, escalates L2+, and updates the CRM automatically.",
    phase: "V2",
  },
  {
    name: "Compliance Agent",
    function:
      "Monitors regulatory changes, flags violations, and auto-files returns.",
    phase: "V3",
  },
  {
    name: "CEO Intelligence Agent",
    function:
      "Daily business briefing, anomaly alerts, and strategic recommendations.",
    phase: "V3",
  },
];

/**
 * Layer 2 — the agents. Deliberately the *roster*, not the CEO vignette: Home
 * Ch.6 (`AgentsVignette`) is canonical for the vignette, so repeating it here
 * would split the ranking signal and violate IA §6. This section is the
 * additive view — who the agents are and where each sits on the roadmap.
 * Signature motion: the roster staggers in.
 */
export function AgentsLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-agents-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Layer two — the workforce"
          title={
            <span id="platform-agents-title">
              Digital employees, not chatbots.
            </span>
          }
          subtitle="Orgofin agents don’t wait to be asked. They work. No agent works alone either — an Orchestrator Agent breaks a request into sub-tasks, delegates them, and synthesises the results, with human approval checkpoints for high-stakes actions like payroll runs above ₹10L."
        />
        <Stagger className="grid gap-4 md:grid-cols-2">
          {NAMED_AGENTS.map((agent) => (
            <StaggerItem key={agent.name}>
              <Card variant="standard" padding="lg" className="h-full">
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle>{agent.name}</CardTitle>
                    <Badge variant="roadmap">{agent.phase}</Badge>
                  </div>
                  <Text size="body-md" tone="muted">
                    {agent.function}
                  </Text>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
