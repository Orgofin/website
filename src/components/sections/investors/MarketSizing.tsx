import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { StatCallout } from "@/components/molecules/StatCallout";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";

/**
 * Market — TAM/SAM/SOM. Copy verbatim from `docs/product/copy.md` §6 (Market);
 * the three figures render as `StatCallout`s (the molecule built for exactly
 * these numbers). Publishes ONLY the headline figures the PRD marks
 * directionally safe (§3.3) — founder-approved 2026-07-14. The per-category
 * TAM breakdown stays unpublished until the two conflicting source tables are
 * reconciled (PRD §19.1); do not add it here without that resolution.
 * Signature motion: one reveal of the whole section.
 */
export function MarketSizing() {
  return (
    <Section spacing="lg" aria-labelledby="market-title">
      <Container size="content" className="flex flex-col gap-10">
        <Reveal className="flex flex-col gap-10">
          <SectionHeading
            title={
              <span id="market-title">$500B+ today. Nearly $1T by 2030.</span>
            }
          />

          <div className="grid gap-10 sm:grid-cols-3">
            <StatCallout
              size="md"
              value="$500B+"
              label="Addressable market today"
            />
            <StatCallout size="md" value="~$1T" label="Projected by 2030" />
            <StatCallout
              size="md"
              value="$1.73B"
              label="Serviceable market, next three years"
            />
          </div>

          <Text size="body-lg" tone="muted" className="max-w-prose">
            Our serviceable market across India, UK, and US SMB/mid-market —
            HRMS, Finance, and Collaboration — is roughly $1.73B over the next
            three years. We&rsquo;re targeting $2–5M ARR in Year 1, $20–40M by
            Year 3, $100–200M by Year 5.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
