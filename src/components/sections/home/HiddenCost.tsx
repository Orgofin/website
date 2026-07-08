import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { StatCallout } from "@/components/molecules/StatCallout";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Text } from "@/components/ui/Text";

/** Cost breakdown from copy.md §1 Ch.2 — label + per-year range (mono figures). */
const COST_LINES: ReadonlyArray<{ label: string; range: string }> = [
  { label: "HR & Payroll", range: "$8,000–$24,000/yr" },
  { label: "Finance", range: "$2,400–$12,000/yr" },
  { label: "Sales & CRM", range: "$12,000–$60,000/yr" },
  { label: "Customer Support", range: "$6,000–$30,000/yr" },
  { label: "Collaboration", range: "$12,000–$36,000/yr" },
  { label: "IT & Security", range: "$8,000–$40,000/yr" },
];

/**
 * Chapter 2 — The Hidden Cost. Copy verbatim from `docs/product/copy.md` §1
 * Ch.2. Signature motion: the cost breakdown staggers in row by row (reduced
 * motion collapses it to a single fade via the shared `Stagger` primitive).
 */
export function HiddenCost() {
  return (
    <Section id="cost" spacing="lg" className="scroll-mt-16">
      <Container size="content" className="flex flex-col gap-10">
        <SectionHeading
          title={"Fragmentation isn’t an inconvenience. It’s a line item."}
          subtitle={
            "A 200-person company spends $52,000–$220,000 a year — ₹1.5 crore or more — keeping tools that don’t talk to each other."
          }
        />

        <Reveal>
          <StatCallout
            value="$52K–$220K"
            label="wasted every year on tools that don’t talk to each other"
            gradient
          />
        </Reveal>

        <Stagger
          className="flex flex-col"
          role="list"
          aria-label="Annual cost by category"
        >
          {COST_LINES.map((line) => (
            <StaggerItem key={line.label} role="listitem">
              <div className="border-border flex items-baseline justify-between gap-4 border-b py-3">
                <span className="text-body-md text-fg">{line.label}</span>
                <span className="text-body-md text-fg-muted font-mono tabular-nums">
                  {line.range}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Text size="body-lg" tone="default" className="font-medium">
          Zero unified context. Every time.
        </Text>
      </Container>
    </Section>
  );
}
