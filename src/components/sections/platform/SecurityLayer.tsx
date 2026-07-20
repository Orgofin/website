import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

/** The three pillars, verbatim from `docs/product/copy.md` §4. */
const PILLARS: readonly { title: string; body: string }[] = [
  {
    title: "Your data stays where your business operates.",
    body: "Dedicated infrastructure across India, UK, and US — because “the cloud” isn’t a good enough answer for a payroll system.",
  },
  {
    title: "Built for DPDP. Ready for GDPR and CCPA.",
    body: "India’s Digital Personal Data Protection Act shaped Company Brain’s architecture from day one — not retrofitted after a legal review.",
  },
  {
    title: "Every access, logged. Every action, attributable.",
    body: "Full audit trails on every approval, every agent action, every document — because “who approved this and why” should never require a Slack search.",
  },
];

/**
 * Security & compliance. Copy verbatim from `docs/product/copy.md` §4 — the
 * overview cut; `/security` becomes the canonical deep-dive when it ships. The
 * copy deck's "Read our Privacy Policy" CTA is intentionally not rendered:
 * `/privacy` doesn't exist yet and the footer's never-link-a-404 rule (IA §4)
 * applies to body links too.
 */
export function SecurityLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-security-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Underneath all of it"
          title={
            <span id="platform-security-title">
              Compliance isn’t a feature we sell. It’s how we operate.
            </span>
          }
          subtitle="If we’re asking you to trust us with your company’s data, we should show you exactly how we handle it."
        />
        <Stagger className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <Card variant="standard" padding="lg" className="h-full">
                <CardHeader className="gap-3">
                  <CardTitle>{pillar.title}</CardTitle>
                  <Text size="body-md" tone="muted">
                    {pillar.body}
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
