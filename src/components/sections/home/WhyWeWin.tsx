import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CalloutBox } from "@/components/molecules/CalloutBox";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import {
  CompetitorTeardownTable,
  type CompetitorRow,
} from "@/components/sections/CompetitorTeardownTable";
import { SixMoatsList } from "@/components/sections/SixMoatsList";
import { Button } from "@/components/ui/Button";

/** Condensed teardown from copy.md §6 (Why We Win). */
const TEARDOWN: readonly CompetitorRow[] = [
  { competitor: "Zoho", gap: "No unified graph, no real agent layer." },
  { competitor: "Salesforce", gap: "10x the cost, CRM-only AI." },
  { competitor: "SAP / Oracle", gap: "₹50L+ implementations, SMB-hostile." },
  { competitor: "Rippling", gap: "No India compliance, US-only." },
];

/** The six moats from copy.md §6. */
const SIX_MOATS: readonly string[] = [
  "Organisational memory that compounds with every customer.",
  "Data network effects across thousands of Indian SMBs.",
  "India compliance depth competitors won't easily replicate.",
  "Lock-in earned through value, not contracts.",
  "Agents that learn from every task they execute.",
  "A 350,000-strong Chartered Accountant network as a distribution channel.",
];

/**
 * Chapter 7.5 — Why We Win. Copy verbatim from `docs/product/copy.md` §1 Ch.7.5
 * (heading + the "fundamental difference" spotlight `CalloutBox`) with the
 * condensed teardown + six moats from §6, mounted via the shared
 * `CompetitorTeardownTable` / `SixMoatsList` organisms in `variant="teaser"`
 * (E9.3.5) — the Investors page mounts the same organisms in `variant="full"`.
 * Links to `/investors` for the full competitive picture (IA §5). Signature
 * motion: the chapter's single `Reveal` (the shared organisms are motion-free).
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
          <CompetitorTeardownTable
            variant="teaser"
            rows={TEARDOWN}
            caption="Competitive teardown"
          />
          <CalloutBox
            variant="spotlight"
            label="The fundamental difference"
            aria-label="The fundamental difference"
          >
            Every competitor builds products, then tries to connect them.
            Orgofin builds the brain first — the products emerge from it.
          </CalloutBox>
          <SixMoatsList
            variant="teaser"
            moats={SIX_MOATS}
            aria-label="The six moats"
          />
          <Button variant="link" size="md" asChild>
            <Link href="/investors">See the full competitive picture →</Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
