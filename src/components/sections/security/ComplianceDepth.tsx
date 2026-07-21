import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

type ComplianceItem = {
  title: string;
  body: string;
};

/**
 * The India compliance surface Orgofin has engineered. This is *not* copy from
 * the deck — every item is a documented business fact from
 * `docs/product/company.md` (moat #3, "India Compliance Depth") corroborated by
 * `.claude/knowledge/hrms.md`'s hire-to-retire compliance table. It is
 * deliberately the regulatory *depth* story (what the product does for the
 * customer's compliance), distinct from §4's three pillars above (how Orgofin
 * handles the customer's data). No security certifications (SOC 2, ISO 27001)
 * are claimed here — none exist in the source material, and inventing one would
 * be a worse defect than any documentation gap (`CLAUDE.md` non-negotiable #1).
 */
const COMPLIANCE_SURFACE: readonly ComplianceItem[] = [
  {
    title: "GST e-invoicing",
    body: "Direct IRP e-invoicing API integration — invoices reported to the government portal, not exported and re-keyed.",
  },
  {
    title: "PF & ESI",
    body: "Provident Fund and ESI challans generated from payroll, with Form 11 and ESI registration handled at onboarding.",
  },
  {
    title: "TDS & Form 16",
    body: "Automated TDS on payroll, with Form 16 and 24Q generation built in — not a year-end scramble.",
  },
  {
    title: "Aadhaar e-KYC",
    body: "Digital onboarding with Aadhaar e-KYC, so identity verification is part of hire, not a separate manual step.",
  },
  {
    title: "DPDP consent",
    body: "Consent management and audit trails designed for the Digital Personal Data Protection Act from the start.",
  },
];

/**
 * Compliance depth — the moat framed as a trust signal. Signature motion: the
 * surface staggers in.
 */
export function ComplianceDepth() {
  return (
    <Section spacing="lg" aria-labelledby="compliance-depth-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="The compliance surface"
          title={
            <span id="compliance-depth-title">
              India compliance, engineered in — not bolted on.
            </span>
          }
          subtitle="The specific, painful regulatory work most software leaves to you. Months of regulatory engineering, so compliance is a property of the system rather than a quarterly fire drill."
        />
        <Stagger className="grid gap-4 md:grid-cols-2">
          {COMPLIANCE_SURFACE.map((item) => (
            <StaggerItem key={item.title}>
              <Card variant="standard" padding="lg" className="h-full">
                <CardHeader className="gap-2">
                  <CardTitle>{item.title}</CardTitle>
                  <Text size="body-md" tone="muted">
                    {item.body}
                  </Text>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
