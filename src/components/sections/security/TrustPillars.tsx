import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";

type Pillar = {
  eyebrow: string;
  headline: string;
  body: string;
  /** Optional region chips (data residency only). */
  regions?: readonly string[];
};

/**
 * The three trust pillars, verbatim from `docs/product/copy.md` §4 — data
 * residency, regulatory posture, access & audit. This is the *canonical* full
 * treatment; `/platform`'s `SecurityLayer` shows only a teaser and links here,
 * so the substantive copy lives in one place (IA §6/§7). Rendered as roomy
 * stacked blocks rather than the compact card grid the teaser uses — the same
 * teaser/full density split as `SixMoatsList`.
 */
const PILLARS: readonly Pillar[] = [
  {
    eyebrow: "Data residency",
    headline: "Your data stays where your business operates.",
    body: "Dedicated infrastructure across India, UK, and US — because “the cloud” isn’t a good enough answer for a payroll system.",
    regions: ["India", "United Kingdom", "United States"],
  },
  {
    eyebrow: "Regulatory posture",
    headline: "Built for DPDP. Ready for GDPR and CCPA.",
    body: "India’s Digital Personal Data Protection Act shaped Company Brain’s architecture from day one — not retrofitted after a legal review.",
  },
  {
    eyebrow: "Access & audit",
    headline: "Every access, logged. Every action, attributable.",
    body: "Full audit trails on every approval, every agent action, every document — because “who approved this and why” should never require a Slack search.",
  },
];

export function TrustPillars() {
  return (
    <Section spacing="lg" aria-label="How we handle your data">
      <Container size="content">
        <Stagger className="flex flex-col gap-16 md:gap-24">
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.eyebrow}>
              <div className="flex flex-col gap-5">
                <SectionHeading
                  eyebrow={pillar.eyebrow}
                  title={pillar.headline}
                  subtitle={pillar.body}
                />
                {pillar.regions ? (
                  <ul className="flex flex-wrap gap-2" aria-label="Regions">
                    {pillar.regions.map((region) => (
                      <li key={region}>
                        <Badge variant="neutral" dot={false}>
                          {region}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
