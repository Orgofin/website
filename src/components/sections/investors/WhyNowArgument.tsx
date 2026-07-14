import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Text } from "@/components/ui/Text";

/** The timing argument from copy.md §6 (Why Now), one force per beat. */
const FORCES: readonly string[] = [
  "AI has crossed the threshold for reliable multi-step business automation.",
  "India’s GST, DPDP, and e-invoicing mandates are forcing 60M+ SMEs to replace legacy tools.",
  "The average mid-market company spends $3,500 per employee per year on fragmented SaaS.",
  "Foundation models made context-aware agents affordable for the first time.",
  "No India-born company has attempted this since Zoho.",
];

/**
 * Why Now — the investor-facing timing argument. Copy verbatim from
 * `docs/product/copy.md` §6, rendered one force per line (the same dash-list
 * treatment as Home Ch.8.5, which carries the visitor-facing version of this
 * argument). Signature motion: the forces stagger in sequence.
 */
export function WhyNowArgument() {
  return (
    <Section spacing="lg" aria-labelledby="why-now-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          title={
            <span id="why-now-title">
              The timing isn&rsquo;t a slide. It&rsquo;s the whole argument.
            </span>
          }
        />

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
      </Container>
    </Section>
  );
}
