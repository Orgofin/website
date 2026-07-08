import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

/**
 * Chapter 9 — Vision teaser. Copy verbatim from `docs/product/copy.md` §1 Ch.9.
 * This is a *summary* teaser that deep-links to `/vision`, which is canonical for
 * the vision narrative — it must not duplicate the full `/vision` copy or it
 * splits the ranking signal (IA §5/§7, `seo.md`). Signature motion: a reveal
 * befitting the closing thesis.
 */
export function VisionTeaser() {
  return (
    <Section id="vision" spacing="lg" className="scroll-mt-16">
      <Container
        size="readable"
        className="flex flex-col items-center gap-8 text-center"
      >
        <Reveal className="flex flex-col items-center gap-6">
          <SectionHeading
            align="center"
            title="The Operating System for Every Company."
            titleClassName="text-gradient-brand"
            subtitle="Windows became the OS for the PC. iOS became the OS for mobile. Orgofin is becoming the OS for the company itself."
          />
          <Text size="body-lg" tone="default" balance className="max-w-prose">
            We are not building another SaaS tool. We are building the last
            platform a company will ever need.
          </Text>
          <Button variant="link" size="md" asChild>
            <Link href="/vision">Read the full vision →</Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
