import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";

/**
 * Where we're starting — copy verbatim from `docs/product/copy.md` §10. The
 * closing "India → UK → USA" line is the geography from
 * `docs/product/company.md` (Company Snapshot), not an invented expansion plan.
 */
export function WhereWeStart() {
  return (
    <Section spacing="lg" aria-labelledby="about-start-title">
      <Container size="readable" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title={<span id="about-start-title">Where we’re starting.</span>}
          />
          <Text size="body-lg" balance>
            India first — because India’s compliance requirements (GST, PF, ESI,
            DPDP) are exactly specific and exactly painful enough to prove this
            works before we take it anywhere else. India → UK → USA.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
