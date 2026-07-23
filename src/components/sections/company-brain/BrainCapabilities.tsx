import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";

type Capability = {
  eyebrow: string;
  headline: string;
  body: string;
};

/**
 * The Brain's three capability blocks, verbatim from `docs/product/copy.md` §2
 * ("Real-time, not batch", "Context Engine", "Decision Intelligence"). These
 * are the deep-dive sections `/platform` deliberately omits (copy §2.0 lists
 * the Context Engine and Decision Intelligence cuts as "deliberately omitted"
 * there), so this page is their canonical home. Rendered as roomy stacked
 * blocks — the same full-density treatment as `/security`'s `TrustPillars`.
 *
 * The Context Engine body carries the worked example IA §7 calls for ("why did
 * our Bangalore payroll cost increase 12% last month?"), so no separate example
 * section is needed.
 */
const CAPABILITIES: readonly Capability[] = [
  {
    eyebrow: "Real-time, not batch",
    headline: "A data warehouse tells you what happened last night.",
    body: "Company Brain updates the instant anything happens — a hire, an invoice, a support ticket — so every answer is current, not stale.",
  },
  {
    eyebrow: "Context Engine",
    headline: "Ask a real question. Get a real answer.",
    body: "“Why did our Bangalore payroll cost increase 12% last month?” No spreadsheets. No exports. The Context Engine pulls the exact subgraph, recent events, and history it needs — and answers it.",
  },
  {
    eyebrow: "Decision Intelligence",
    headline: "It gets smarter the longer you use it.",
    body: "Company Brain learns your approval thresholds, your reporting preferences, your seasonal patterns. The longer you stay, the more it understands.",
  },
];

export function BrainCapabilities() {
  return (
    <Section spacing="lg" aria-label="How Company Brain works">
      <Container size="content" className="flex flex-col gap-16 md:gap-24">
        <Stagger className="flex flex-col gap-16 md:gap-24">
          {CAPABILITIES.map((capability) => (
            <StaggerItem key={capability.eyebrow}>
              <SectionHeading
                eyebrow={capability.eyebrow}
                title={capability.headline}
                subtitle={capability.body}
              />
            </StaggerItem>
          ))}
        </Stagger>
        {/* Copy §2's "See how agents use the Brain" cross-link. `/agents`
            doesn't exist yet, so it points at Home Ch.6 (the `AgentsVignette`,
            `#agents`) — the never-link-a-404 rule (IA §4). The waitlist half of
            the §2 CTA is the shared `CTABand` that closes the page. */}
        <div>
          <Button asChild variant="secondary">
            <Link href="/#agents">See how agents use the Brain</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
