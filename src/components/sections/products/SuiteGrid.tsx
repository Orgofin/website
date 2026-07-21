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
  available: boolean;
};

/**
 * The eight suites, verbatim from `docs/product/copy.md` §3, including the
 * per-suite Available/Roadmap status that resolves the MVP-vs-roadmap conflict
 * in `docs/product/prd.md` §19.4. This is the *canonical* home of the suite
 * grid; `/platform`'s `SuitesLayer` shows a teaser and links here (IA §7).
 *
 * Status is deliberately declared at the **suite** level only — the copy deck's
 * approved call. Module-level "available now" claims are intentionally avoided:
 * `.claude/knowledge/hrms.md` flags the functional status of individual MVP
 * modules as unconfirmed pending founder input.
 */
const SUITES: readonly Suite[] = [
  {
    id: "hrms",
    area: "HR & People",
    product: "Orgofin HRMS",
    description:
      "Hire to retire, fully automated — India compliance from day one.",
    status: "Available now",
    available: true,
  },
  {
    id: "books",
    area: "Finance & Operations",
    product: "Orgofin Books",
    description:
      "GST-native accounting that never needs a manual reconciliation again.",
    status: "Available now",
    available: true,
  },
  {
    id: "crm",
    area: "Sales & Revenue",
    product: "Orgofin CRM",
    description:
      "WhatsApp-native CRM that already knows the customer’s billing history.",
    status: "Roadmap",
    available: false,
  },
  {
    id: "cx",
    area: "Support & CX",
    product: "Orgofin CX",
    description:
      "Support that sees the invoice, the contract, and the ticket — together.",
    status: "Roadmap",
    available: false,
  },
  {
    id: "workspace",
    area: "Collaboration",
    product: "Orgofin Workspace",
    description:
      "Mail and chat that already understand your business, not just your inbox.",
    status: "Available now: Mail, Chat",
    available: true,
  },
  {
    id: "it-ops",
    area: "IT & Security",
    product: "Orgofin IT Ops",
    description:
      "Identity, device, and access management with India data residency.",
    status: "Roadmap",
    available: false,
  },
  {
    id: "intelligence",
    area: "Data, AI & Automation",
    product: "Orgofin Intelligence",
    description:
      "Analytics and automation that read the same brain as everything else.",
    status: "Roadmap",
    available: false,
  },
  {
    id: "governance",
    area: "Compliance & Admin",
    product: "Orgofin Governance",
    description:
      "GST e-invoicing, audit trails, and DPDP-ready consent management.",
    status: "Available now: e-Invoicing/GST Suite, Sign",
    available: true,
  },
];

/**
 * The suite grid — the eight functional suites. Signature motion: the grid
 * staggers in. Each card carries an anchor id so other pages (and the future
 * per-suite pages) can deep-link to a specific suite.
 */
export function SuiteGrid() {
  return (
    <Section spacing="lg" aria-labelledby="suite-grid-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          title={
            <span id="suite-grid-title">
              Eight suites. One brain underneath all of them.
            </span>
          }
          subtitle="Each suite is a different surface on the same Company Brain — so the CRM already knows the invoice, and payroll already knows the org chart."
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
