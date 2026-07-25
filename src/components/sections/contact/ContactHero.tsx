import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Contact hero — the page's single `<h1>`. Headline is `docs/product/copy.md`
 * §13 verbatim; the sub-headline keeps the deck's promise of an honest answer
 * but drops its "Company Brain fixes it" framing for something we can actually
 * deliver today, since nothing is publicly available yet (founder statement
 * 2026-07-22, the same accuracy correction `/products` carries).
 *
 * The gradient accent is this page's one gradient phrase (design-system.md §2).
 */
export function ContactHero() {
  return (
    <Section spacing="lg" aria-labelledby="contact-hero-title">
      <Container
        size="content"
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            level={1}
            size="display-xl"
            title={
              <span id="contact-hero-title">
                Let&rsquo;s talk about your business,{" "}
                <span className="text-gradient-brand">not our features.</span>
              </span>
            }
            subtitle="Tell us what's broken in your current stack. We'll tell you honestly what we're building, where it would help, and whether this is the right moment for you — including when the answer is no."
          />
        </Reveal>
      </Container>
    </Section>
  );
}
