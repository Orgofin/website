import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { AgentOrchestrationDiagram } from "@/components/sections/home/AgentOrchestrationDiagram";
import { Text } from "@/components/ui/Text";

/** The CEO Intelligence Agent's overnight work, verbatim from copy.md §1 Ch.6. */
const VIGNETTE: readonly string[] = [
  "Flagged that payroll in Hyderabad rose 11%, traced to three hires approved last Tuesday",
  "Noticed a key customer has gone quiet for six weeks, and drafted an outreach email",
  "Spotted 23 days of inventory left on a critical SKU, and raised a draft purchase order",
  "Prepared Thursday’s board deck — from real numbers, not a template",
  "Reminded an employee about overdue compliance training, before it became a problem",
];

/**
 * Chapter 6 — AI Agents. The CEO Intelligence Agent vignette, verbatim from
 * `docs/product/copy.md` §1 Ch.6 ("show, don't tell"), followed by the
 * `AgentOrchestrationDiagram` (E9.3.4) showing the multi-agent protocol behind
 * it. Signature motion: the overnight actions stagger in like a feed — the
 * diagram is deliberately motion-free (one signature motion per section).
 */
export function AgentsVignette() {
  return (
    <Section id="agents" spacing="lg" className="scroll-mt-16">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          title="Digital employees, not chatbots."
          subtitle="Orgofin agents don’t wait to be asked. They work."
        />

        <Reveal>
          <Text size="body-lg" tone="muted">
            Every morning, before you’ve opened your laptop, your CEO
            Intelligence Agent has already —
          </Text>
        </Reveal>

        <Stagger
          className="flex flex-col gap-3"
          role="list"
          aria-label="What your CEO Intelligence Agent did overnight"
        >
          {VIGNETTE.map((item) => (
            <StaggerItem key={item} role="listitem">
              <div className="border-border-strong flex gap-3 border-l-2 pl-4">
                <Text size="body-md" tone="default">
                  {item}
                </Text>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <Text size="body-lg" tone="muted">
            No agent works alone.
          </Text>
        </Reveal>

        <AgentOrchestrationDiagram />

        <Reveal>
          <Text size="body-lg" className="text-fg font-medium">
            This isn’t automation. It’s a company that runs on intelligence.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
