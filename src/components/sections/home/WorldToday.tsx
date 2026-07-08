import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Text } from "@/components/ui/Text";

/**
 * Chapter 1 — The World Today. The Home hero and the page's single `<h1>`.
 * Copy verbatim from `docs/product/copy.md` §1 Ch.1. Signature motion: a single
 * upward reveal of the whole block (opacity-only under reduced motion via the
 * shared `Reveal` primitive).
 */
export function WorldToday() {
  return (
    <Section spacing="lg" aria-labelledby="world-today-title">
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
              <span id="world-today-title">
                Your company runs on twenty tools that have never met each
                other.
              </span>
            }
            subtitle={
              "Payroll doesn’t talk to accounting. Support doesn’t talk to sales. And no one — not even your AI copilot — sees the whole picture."
            }
          />
          <Text size="body-sm" tone="subtle" className="uppercase">
            Scroll to see the cost.
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
