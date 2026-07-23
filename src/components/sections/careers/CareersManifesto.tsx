import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

type Pillar = {
  title: string;
  body: string;
};

/**
 * "Why it'll be worth joining" — three reasons grounded strictly in documented
 * mission facts (`docs/product/company.md`, `.claude/knowledge/`): the Company
 * Brain thesis, AI-native from the first commit (AGaaS), and the India-first
 * HRMS wedge. No invented perks, headcount, funding, or team claims — none
 * exist in the source material (CLAUDE.md non-negotiable #1). Signature motion:
 * the pillars stagger in.
 */
const PILLARS: readonly Pillar[] = [
  {
    title: "You'd build the brain, not another app",
    body: "Most software teams ship features onto someone else's platform. We're building the platform — a single Company Brain that unifies what forty disconnected tools keep apart. That's real infrastructure, and it's rare work.",
  },
  {
    title: "AI-native from the first commit",
    body: "Not an AI feature bolted onto a CRUD app. Autonomous agents that read the same brain as everything else are the point of the product, not a roadmap afterthought — so the engineering problems are the interesting ones.",
  },
  {
    title: "India-first, and unapologetically ambitious",
    body: "We start where the work is hardest — GST, PF, ESI, and DPDP compliance most software leaves to you — because getting India right is how you earn the right to go everywhere else.",
  },
];

export function CareersManifesto() {
  return (
    <Section spacing="lg" aria-labelledby="careers-manifesto-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Why the wait is worth it"
          title={
            <span id="careers-manifesto-title">
              We&rsquo;re small on purpose. We&rsquo;re ambitious without
              apology.
            </span>
          }
          subtitle="When we do open roles, this is the work you'd be signing up for — and why the earliest people through the door matter most."
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
