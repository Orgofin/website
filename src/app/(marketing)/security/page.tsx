import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CTABand } from "@/components/sections/CTABand";
import {
  ComplianceDepth,
  SecurityHero,
  TrustPillars,
} from "@/components/sections/security";
import { Text } from "@/components/ui/Text";
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
 * The copy deck's §4 CTAs — "Read our Privacy Policy" and "Talk to our team".
 * The first is now live (`/privacy` shipped); the second stays unrendered
 * because `/contact` still doesn't exist and the never-link-a-404 rule (IA §4)
 * applies to body links too. It wires up when that page ships; tracked in
 * information-architecture.md's TODO.
 *
 * The privacy line sits between the compliance surface and the waitlist band
 * rather than inside `CTABand`: that component is shared by every non-legal
 * page, and adding a secondary-link slot for a single caller would be an
 * abstraction serving one use case.
 */
export default function SecurityPage() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <SecurityHero />
      <TrustPillars />
      <ComplianceDepth />
      <Section spacing="sm">
        <Container size="readable" className="text-center">
          <Text size="body-md" tone="muted">
            This is how we build for your data. For what this website itself
            collects and how long we keep it, read our{" "}
            <Link
              href="/privacy"
              className="text-accent hover:text-accent-hover underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </Text>
        </Container>
      </Section>
      <CTABand source="security-waitlist" />
    </main>
  );
}
