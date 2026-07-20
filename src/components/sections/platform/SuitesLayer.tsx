import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

type Suite = {
  /** Functional area, e.g. "HR & People". */
  area: string;
  /** Product name, e.g. "Orgofin HRMS". */
  product: string;
  description: string;
  /** Status label. Carries the meaning on its own — never colour alone. */
  status: string;
  available: boolean;
};

/**
 * The eight suites, verbatim from `docs/product/copy.md` §3, including the
 * per-suite Available/Roadmap status that resolves the MVP-vs-roadmap conflict
 * in `docs/product/prd.md` §19.4. Two suites are partially available and say so
 * explicitly rather than rounding up to "Available now".
 */
const SUITES: readonly Suite[] = [
  {
    area: "HR & People",
    product: "Orgofin HRMS",
    description:
      "Hire to retire, fully automated — India compliance from day one.",
    status: "Available now",
    available: true,
  },
  {
    area: "Finance & Operations",
    product: "Orgofin Books",
    description:
      "GST-native accounting that never needs a manual reconciliation again.",
    status: "Available now",
    available: true,
  },
  {
    area: "Sales & Revenue",
    product: "Orgofin CRM",
    description:
      "WhatsApp-native CRM that already knows the customer’s billing history.",
    status: "Roadmap",
    available: false,
  },
  {
    area: "Support & CX",
    product: "Orgofin CX",
    description:
      "Support that sees the invoice, the contract, and the ticket — together.",
    status: "Roadmap",
    available: false,
  },
  {
    area: "Collaboration",
    product: "Orgofin Workspace",
    description:
      "Mail and chat that already understand your business, not just your inbox.",
    status: "Available now: Mail, Chat",
    available: true,
  },
  {
    area: "IT & Security",
    product: "Orgofin IT Ops",
    description:
      "Identity, device, and access management with India data residency.",
    status: "Roadmap",
    available: false,
  },
  {
    area: "Data, AI & Automation",
    product: "Orgofin Intelligence",
    description:
      "Analytics and automation that read the same brain as everything else.",
    status: "Roadmap",
    available: false,
  },
  {
    area: "Compliance & Admin",
    product: "Orgofin Governance",
    description:
      "GST e-invoicing, audit trails, and DPDP-ready consent management.",
    status: "Available now: e-Invoicing/GST Suite, Sign",
    available: true,
  },
];

/**
 * Layer 3 — the suites. Copy verbatim from `docs/product/copy.md` §3; this is
 * the overview cut (suite one-liners + status). The per-module breakdown across
 * all 40+ modules belongs on `/products` when that page ships, and this section
 * links to it then. Signature motion: the grid staggers in.
 */
export function SuitesLayer() {
  return (
    <Section spacing="lg" aria-labelledby="platform-suites-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Layer three — the surface"
          title={
            <span id="platform-suites-title">
              One subscription. Every function your company needs.
            </span>
          }
          subtitle="Not 40 separate products. One brain, expressed as 40+ modules across eight suites — each one smarter because of everything around it."
        />
        <Stagger className="grid gap-4 md:grid-cols-2">
          {SUITES.map((suite) => (
            <StaggerItem key={suite.product}>
              <Card variant="standard" padding="lg" className="h-full">
                <CardHeader className="gap-3">
                  <Text size="body-sm" tone="muted">
                    {suite.area}
                  </Text>
                  <CardTitle>{suite.product}</CardTitle>
                  <Text size="body-md" tone="muted">
                    {suite.description}
                  </Text>
                  <div>
                    <Badge variant={suite.available ? "available" : "roadmap"}>
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
