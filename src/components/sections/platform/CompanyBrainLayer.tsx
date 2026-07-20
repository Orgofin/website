import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Text } from "@/components/ui/Text";

/**
 * What the Brain knows — the six "every X" clauses from `docs/product/copy.md`
 * §2 ("Section — What it knows"), split into their natural list form rather
 * than run together as one paragraph.
 */
const WHAT_IT_KNOWS: readonly string[] = [
  "Every employee — role, skills, performance, compliance status.",
  "Every customer — lifecycle, invoices, tickets, contracts.",
  "Every transaction — mapped to cost centers and GST categories automatically.",
  "Every document — searchable by meaning, not just keywords.",
  "Every workflow — who approved what, when, and why.",
  "Every decision — with the reasoning behind it, not just the outcome.",
];

/**
 * Layer 1 — Company Brain. Summarises `docs/product/copy.md` §2 for the
 * overview; the full deep-dive (Context Engine, Decision Intelligence, the
 * worked payroll example) lives on `/company-brain` when that page ships, and
 * this section links to it then. Signature motion: the clauses stagger in as
 * an accumulating picture.
 */
export function CompanyBrainLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-brain-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Layer one — the foundation"
          title={
            <span id="platform-brain-title">
              It knows your business the way your best employee would — if they
              never forgot anything.
            </span>
          }
          subtitle="Company Brain is a living, real-time map of your organization — not a dashboard you check, but a system that already knows. A data warehouse tells you what happened last night; Company Brain updates the instant anything happens."
        />
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {WHAT_IT_KNOWS.map((item) => (
            <StaggerItem key={item}>
              <Text size="body-lg" balance>
                {item}
              </Text>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
