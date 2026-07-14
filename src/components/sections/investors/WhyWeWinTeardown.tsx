import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import {
  CompetitorTeardownTable,
  type CompetitorRow,
} from "@/components/sections/CompetitorTeardownTable";

/**
 * The full eight-competitor teardown from `docs/product/prd.md` §3.5 — Home
 * Ch.7.5 shows the condensed four rows and links here for the complete
 * picture, so this page must show more than the teaser did.
 */
const TEARDOWN: readonly CompetitorRow[] = [
  {
    competitor: "Zoho",
    gap: "45+ tools, no unified data graph, no real agent layer, weak compliance.",
  },
  {
    competitor: "Salesforce",
    gap: "$150–300 per user, poor India SMB fit, AI is CRM-only.",
  },
  {
    competitor: "SAP / Oracle",
    gap: "₹50L+ implementations, monolithic, SMB-hostile.",
  },
  {
    competitor: "Microsoft 365 + Copilot",
    gap: "Collaboration-only; Copilot is document-centric, not process-aware.",
  },
  {
    competitor: "Freshworks",
    gap: "Not truly unified — no Company Brain, no Finance or compliance.",
  },
  {
    competitor: "Darwinbox / Keka",
    gap: "HRMS-only — no agent layer, no Company Brain.",
  },
  {
    competitor: "Rippling",
    gap: "US-only, expensive, no India compliance.",
  },
  {
    competitor: "HubSpot",
    gap: "CRM-only, no unified brain, no India compliance.",
  },
];

/**
 * Why We Win — the full competitive teardown. Headline verbatim from
 * `docs/product/copy.md` §6; rows from the complete PRD §3.5 table rather than
 * the §6 condensed four (the condensed set is what Home Ch.7.5 already shows —
 * its "full competitive picture" link lands here, per IA §5). Mounts the
 * shared `CompetitorTeardownTable` in `variant="full"` (E6.2.3). Signature
 * motion: the section's single reveal (the table itself is motion-free).
 */
export function WhyWeWinTeardown() {
  return (
    <Section spacing="lg" aria-labelledby="why-we-win-title">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title={
              <span id="why-we-win-title">
                Every competitor connects tools. We started with the brain.
              </span>
            }
          />
          <CompetitorTeardownTable
            variant="full"
            rows={TEARDOWN}
            caption="Full competitive teardown"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
