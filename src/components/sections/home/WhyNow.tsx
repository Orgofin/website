import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Text } from "@/components/ui/Text";

/** The four forces from copy.md §1 Ch.8.5. */
const FORCES: readonly string[] = [
  "AI can finally run multi-step business work, not just answer questions.",
  "India’s GST, DPDP, and e-invoicing mandates are forcing 60 million SMEs to modernize.",
  "The average company spends $3,500 per employee, per year, on tools that don’t talk to each other.",
  "No India-born company has tried to build the full stack since Zoho.",
];

/**
 * Chapter 8.5 — Why Now. Copy verbatim from `docs/product/copy.md` §1 Ch.8.5.
 * Signature motion: the four forces stagger in, the closing thesis reveals last.
 */
export function WhyNow() {
  return (
    <Section spacing="lg">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading title="This is the moment fragmented software runs out of road." />

        <Stagger
          className="flex flex-col gap-4"
          role="list"
          aria-label="Why now"
        >
          {FORCES.map((force) => (
            <StaggerItem key={force} role="listitem">
              <div className="flex gap-3">
                <span className="text-accent mt-1 shrink-0" aria-hidden="true">
                  —
                </span>
                <Text size="body-lg" tone="muted">
                  {force}
                </Text>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <Text size="body-lg" className="text-fg font-medium">
            The fragmented SaaS era is ending. We intend to be what replaces it.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
