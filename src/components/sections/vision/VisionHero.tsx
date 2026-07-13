import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Vision hero — the page's single `<h1>`. Copy verbatim from
 * `docs/product/copy.md` §5. The gradient accent mirrors Home's Ch.9 teaser
 * treatment of the same line (one gradient phrase per section max,
 * design-system.md §2). Signature motion: a single reveal of the whole block.
 */
export function VisionHero() {
  return (
    <Section spacing="lg" aria-labelledby="vision-hero-title">
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
              <span id="vision-hero-title">
                The Operating System for Every Company.
              </span>
            }
            subtitle="Windows was the operating system for personal computers. iOS was the operating system for mobile. This is the operating system for companies."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
