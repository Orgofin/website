import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CalloutBox } from "@/components/molecules/CalloutBox";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Chapter 7.5 — Why We Win. Copy verbatim from `docs/product/copy.md` §1 Ch.7.5;
 * the "fundamental difference" beat is the spotlight `CalloutBox`. Links to
 * `/investors` for the full competitive teardown (IA §5 internal-linking rule).
 *
 * NOTE: the shared `CompetitorTeardownTable` / `SixMoatsList` organisms this
 * chapter will eventually mount in `variant="teaser"` (backlog E9.3.5) are not
 * built yet (E6.2.x); this renders the chapter copy directly for now.
 */
export function WhyWeWin() {
  return (
    <Section spacing="lg">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title="Everyone else connects tools. We started with the brain."
            subtitle="Zoho has 45+ products and no shared graph. Salesforce costs $150–300 a user and only sees your CRM. SAP takes ₹50L and a year to implement. Orgofin was never built that way."
          />
          <CalloutBox
            variant="spotlight"
            label="The fundamental difference"
            aria-label="The fundamental difference"
          >
            Every competitor builds products, then tries to connect them.
            Orgofin builds the brain first — the products emerge from it.
          </CalloutBox>
          <Button variant="link" size="md" asChild>
            <Link href="/investors">See the full competitive picture →</Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
