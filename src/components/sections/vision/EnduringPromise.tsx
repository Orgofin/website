import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

/**
 * The closing "Our Enduring Promise" section. Copy verbatim from
 * `docs/product/copy.md` §5 (sourced from `enterprise-os.md`). Carries the
 * copy deck's secondary CTA to the investor overview; the primary waitlist CTA
 * is the shared `CTABand` that follows. Signature motion: one closing reveal.
 */
export function EnduringPromise() {
  return (
    <Section spacing="lg" aria-labelledby="enduring-promise-title">
      <Container
        size="readable"
        className="flex flex-col items-center gap-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            eyebrow="Our Enduring Promise"
            title={
              <span id="enduring-promise-title">
                We are not building another SaaS tool.
              </span>
            }
          />
          <Text size="body-lg" balance className="max-w-prose">
            We are building the last platform a company will ever need — a brain
            that grows smarter with every employee hired, every invoice raised,
            every customer served, every decision made. The fragmented SaaS era
            is ending. The Company Brain era is beginning.
          </Text>
          <Button variant="link" size="md" asChild>
            <Link href="/investors">Read our Investor Overview →</Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
