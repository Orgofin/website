import { CTABand } from "@/components/sections/CTABand";
import {
  ComplianceDepth,
  SecurityHero,
  TrustPillars,
} from "@/components/sections/security";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Security & Compliance — Data Residency, DPDP, and GDPR-Ready",
  description:
    "Orgofin is built for India-first compliance — DPDP Act, GST e-invoicing, and data residency in India, UK, and US — with the same rigor we sell, applied to how we handle your data.",
  path: "/security",
});

/**
 * Security & Compliance (`docs/product/copy.md` §4, IA §3) — the canonical home
 * of the compliance-rigor narrative and the highest-leverage page for the
 * CFO/HR-Head persona. Three trust pillars (how we handle your data) plus the
 * documented India compliance surface (the moat, framed as trust). The single
 * `<h1>` lives in `SecurityHero`; the page closes on the shared waitlist
 * `CTABand`.
 *
 * The copy deck's §4 CTAs — "Read our Privacy Policy" and "Talk to our team" —
 * are intentionally not rendered: `/privacy` and `/contact` don't exist yet,
 * and the never-link-a-404 rule (IA §4) applies to body links too. Both wire up
 * when those pages ship; tracked in information-architecture.md's TODO.
 */
export default function SecurityPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <SecurityHero />
      <TrustPillars />
      <ComplianceDepth />
      <CTABand source="security-waitlist" />
    </main>
  );
}
