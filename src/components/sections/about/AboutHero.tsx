import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";

/**
 * About hero — the page's single `<h1>`. Headline and body verbatim from
 * `docs/product/copy.md` §10. The gradient accent is this page's one gradient
 * phrase (design-system.md §2). Signature motion: a single reveal of the block.
 */
export function AboutHero() {
  return (
    <Section spacing="lg" aria-labelledby="about-hero-title">
      <Container size="readable" className="flex flex-col gap-8 py-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            level={1}
            size="display-xl"
            titleClassName="text-gradient-brand"
            title={
              <span id="about-hero-title">
                We got tired of watching good companies drown in bad software.
              </span>
            }
          />
          <Text size="body-lg" balance>
            Every founder we talked to had the same story: Tally for accounting,
            Zoho for CRM, Keka for HR, Slack for everything else — and none of
            it connected. Decisions took days because data lived in five places.
            Good employees left, and took years of undocumented knowledge with
            them. We didn’t think the answer was tool #46. We thought the answer
            was a different kind of company entirely — one built around a single
            brain, not a stack of apps.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
