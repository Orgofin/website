import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Products hero — the page's single `<h1>`. Copy verbatim from
 * `docs/product/copy.md` §3. `/products` is canonical for the suite grid
 * (`seo.md` rule 3); `/platform`'s `SuitesLayer` is the teaser that deep-links
 * here. The gradient accent is this page's one gradient phrase
 * (design-system.md §2). Signature motion: a single reveal of the block.
 */
export function ProductsHero() {
  return (
    <Section spacing="lg" aria-labelledby="products-hero-title">
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
              <span id="products-hero-title">
                One subscription. Every function your company needs.
              </span>
            }
            subtitle="Not 40 separate products. One brain, expressed as 40+ modules — each one smarter because of everything around it."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
