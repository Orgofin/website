import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

type Suite = {
  /** Anchor id for per-suite deep-links (IA §3). */
  id: string;
  area: string;
  product: string;
  description: string;
  /** Suite-level status label — carries the meaning on its own, never colour alone. */
  status: string;
  /** True for the one suite in active development today (HRMS); the rest are roadmap. */
  building: boolean;
};

/**
 * The eight functional suites, framed as the future product ecosystem the
 * Company Brain unlocks — NOT as shipping products.
 *
 * Corrected 2026-07-22 (founder statement): Orgofin has **no publicly available
 * products**, and the first product — HRMS — is in active development. This
 * supersedes the earlier "Available Now" badges (`docs/product/copy.md` §3 /
 * `docs/product/prd.md` §19.4, now annotated with the correction): asserting a
 * product is available when it is not is a business-fact violation
 * (`CLAUDE.md` non-negotiable #1). Only HRMS is marked **In development**; every
 * other suite is **On the roadmap**. Descriptions stay written in the product's
 * intended present tense (the designed behaviour), while the status badge — the
 * load-bearing availability signal — tells the honest truth.
 *
 * This is the *canonical* home of the suite grid; `/platform`'s `SuitesLayer`
 * shows a teaser and links here (IA §7).
 */
const SUITES: readonly Suite[] = [
  {
    id: "hrms",
    area: "HR & People",
    product: "Orgofin HRMS",
    description:
      "Hire to retire, fully automated — India compliance from day one.",
    status: "In development",
    building: true,
  },
  {
    id: "books",
    area: "Finance & Operations",
    product: "Orgofin Books",
    description:
      "GST-native accounting that never needs a manual reconciliation again.",
    status: "On the roadmap",
    building: false,
  },
  {
    id: "crm",
    area: "Sales & Revenue",
    product: "Orgofin CRM",
    description:
      "WhatsApp-native CRM that already knows the customer’s billing history.",
    status: "On the roadmap",
    building: false,
  },
  {
    id: "cx",
    area: "Support & CX",
    product: "Orgofin CX",
    description:
      "Support that sees the invoice, the contract, and the ticket — together.",
    status: "On the roadmap",
    building: false,
  },
  {
    id: "workspace",
    area: "Collaboration",
    product: "Orgofin Workspace",
    description:
      "Mail and chat that already understand your business, not just your inbox.",
    status: "On the roadmap",
    building: false,
  },
  {
    id: "it-ops",
    area: "IT & Security",
    product: "Orgofin IT Ops",
    description:
      "Identity, device, and access management with India data residency.",
    status: "On the roadmap",
    building: false,
  },
  {
    id: "intelligence",
    area: "Data, AI & Automation",
    product: "Orgofin Intelligence",
    description:
      "Analytics and automation that read the same brain as everything else.",
    status: "On the roadmap",
    building: false,
  },
  {
    id: "governance",
    area: "Compliance & Admin",
    product: "Orgofin Governance",
    description:
      "GST e-invoicing, audit trails, and DPDP-ready consent management.",
    status: "On the roadmap",
    building: false,
  },
];

/**
 * The future product ecosystem — the eight suites the single Company Brain is
 * designed to become. Signature motion: the grid staggers in. Each card carries
 * an anchor id so other pages (and the future per-suite pages) can deep-link to
 * a specific suite. Availability is honest per card: HRMS is in development, the
 * rest are on the roadmap.
 */
export function SuiteGrid() {
  return (
    <Section spacing="lg" aria-labelledby="suite-grid-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="The future product ecosystem"
          title={
            <span id="suite-grid-title">
              One brain today. Eight suites as it grows.
            </span>
          }
          subtitle="Each suite is a different surface on the same Company Brain — so one day the CRM will already know the invoice, and payroll will already know the org chart. We're building that brain first; the suites follow it out."
        />
        <Stagger className="grid gap-4 md:grid-cols-2">
          {SUITES.map((suite) => (
            <StaggerItem key={suite.id}>
              <Card
                id={suite.id}
                variant="standard"
                padding="lg"
                className="h-full scroll-mt-24"
              >
                <CardHeader className="gap-3">
                  <Text size="body-sm" tone="muted">
                    {suite.area}
                  </Text>
                  <CardTitle>{suite.product}</CardTitle>
                  <Text size="body-md" tone="muted">
                    {suite.description}
                  </Text>
                  <div>
                    <Badge variant={suite.building ? "accent" : "roadmap"}>
                      {suite.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
