import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Heading } from "@/components/ui/Heading";

/**
 * Chapter 3 — There Must Be A Better Way. A single-line transition beat (no body
 * copy, per `docs/product/copy.md` §1 Ch.3). Signature motion: one slow reveal
 * that lets the question land on its own.
 */
export function BetterWay() {
  return (
    <Section spacing="lg">
      <Container size="readable" className="text-center">
        <Reveal>
          <Heading level={2} size="display-lg" balance>
            What if your company had one brain instead of twenty tools?
          </Heading>
        </Reveal>
      </Container>
    </Section>
  );
}
