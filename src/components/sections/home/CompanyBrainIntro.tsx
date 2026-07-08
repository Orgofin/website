import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CalloutBox } from "@/components/molecules/CalloutBox";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Chapter 4 — Introducing Company Brain. Copy verbatim from
 * `docs/product/copy.md` §1 Ch.4; the "not a dashboard" beat is the core-insight
 * `CalloutBox`. Signature motion: an upward reveal of the block.
 */
export function CompanyBrainIntro() {
  return (
    <Section id="company-brain" spacing="lg" className="scroll-mt-16">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title="Meet the Company Brain."
            subtitle="One living map of your company — every employee, every invoice, every customer, every decision — connected, not siloed."
          />
          <CalloutBox variant="insight" label="The core insight">
            Not a dashboard. Not a data warehouse. A real-time graph that
            updates the moment anything happens in your business — so every
            question has an answer, instantly.
          </CalloutBox>
        </Reveal>
      </Container>
    </Section>
  );
}
