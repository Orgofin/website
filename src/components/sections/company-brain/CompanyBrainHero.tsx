import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Company Brain hero — the page's single `<h1>`. Copy verbatim from
 * `docs/product/copy.md` §2. `/company-brain` is canonical for this narrative
 * (`seo.md` rule 3, IA §7); `/platform`'s `CompanyBrainLayer` is the teaser that
 * deep-links here. The gradient accent is this page's one gradient phrase
 * (design-system.md §2). Signature motion: a single reveal of the block.
 */
export function CompanyBrainHero() {
  return (
    <Section spacing="lg" aria-labelledby="company-brain-hero-title">
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
              <span id="company-brain-hero-title">
                One brain. Every part of your business.
              </span>
            }
            subtitle="Company Brain is a living, real-time map of your organization — not a dashboard you check, but a system that already knows."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
