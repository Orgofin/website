import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Investors hero — the page's single `<h1>`. Copy verbatim from
 * `docs/product/copy.md` §6. Gradient treatment mirrors `VisionHero` (one
 * gradient phrase per section max, design-system.md §2). Signature motion: a
 * single reveal of the whole block.
 */
export function InvestorsHero() {
  return (
    <Section spacing="lg" aria-labelledby="investors-hero-title">
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
              <span id="investors-hero-title">
                We&rsquo;re not pitching a feature. We&rsquo;re pitching a
                category.
              </span>
            }
            subtitle="Company Brain plus Agent-as-a-Service — a $500B+ addressable market moving from fragmented tools to unified intelligence."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
