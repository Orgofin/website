import {
  BrainCapabilities,
  CompanyBrainHero,
  WhatItKnows,
} from "@/components/sections/company-brain";
import { CTABand } from "@/components/sections/CTABand";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Company Brain — The Unified Intelligence Layer for Your Business",
  description:
    "Company Brain is Orgofin’s real-time knowledge graph connecting every employee, customer, invoice, and decision in your business — the foundation for AI agents that actually understand your company.",
  path: "/company-brain",
});

/**
 * Company Brain (`docs/product/copy.md` §2, IA §7) — the canonical deep-dive for
 * the foundational data-layer narrative. Plain-English hero → what the Brain
 * knows → the three capabilities (real-time, Context Engine with the worked
 * "Bangalore payroll" example, Decision Intelligence). The single `<h1>` lives
 * in `CompanyBrainHero`; the page closes on the shared waitlist `CTABand`.
 *
 * `/platform`'s `CompanyBrainLayer` is the teaser that deep-links here (IA §7,
 * same teaser→canonical pattern as `SecurityLayer` → `/security`). The
 * interactive entity graph stays canonical to Home Ch.5 (`CompanyBrainVisual`)
 * rather than being re-mounted here — this page is the conceptual deep-dive, not
 * a second home for the visualization (CLAUDE.md non-negotiable #4).
 */
export default function CompanyBrainPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <CompanyBrainHero />
      <WhatItKnows />
      <BrainCapabilities />
      <CTABand source="company-brain-waitlist" />
    </main>
  );
}
