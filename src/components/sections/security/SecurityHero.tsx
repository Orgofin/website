import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Security hero — the page's single `<h1>`. Copy verbatim from
 * `docs/product/copy.md` §4. `/security` is canonical for this narrative
 * (`seo.md` rule 3); `/platform`'s `SecurityLayer` is the teaser that
 * deep-links here. The gradient accent is this page's one gradient phrase
 * (design-system.md §2). Signature motion: a single reveal of the block.
 */
export function SecurityHero() {
  return (
    <Section spacing="lg" aria-labelledby="security-hero-title">
      <Container
        size="content"
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            level={1}
            size="display-xl"
            titleClassName="text-gradient-brand"
            title={
              <span id="security-hero-title">
                Compliance isn’t a feature we sell. It’s how we operate.
              </span>
            }
            subtitle="If we’re asking you to trust us with your company’s data, we should show you exactly how we handle it."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
