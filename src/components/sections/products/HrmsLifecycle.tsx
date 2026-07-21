import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

type Phase = {
  phase: string;
  module: string;
  detail: string;
  /** India compliance handled at this phase; empty where the source lists none. */
  compliance: readonly string[];
};

/**
 * The hire-to-retire lifecycle, verbatim from `.claude/knowledge/hrms.md` (the
 * source PDF's HRMS section). This is the one suite with a documented
 * per-module breakdown, which is why `/products` can show HRMS in depth while
 * the other seven stay at suite level in `SuiteGrid` — the module lists for
 * those suites are not in any source, and inventing them would violate
 * `CLAUDE.md` non-negotiable #1.
 *
 * Presented as the product's designed **scope** across the lifecycle, NOT a
 * per-module availability claim: `hrms.md` flags the functional status of the
 * individual "MVP" modules as unconfirmed pending founder input, so no phase
 * carries an Available/Roadmap badge. The suite-level status lives on the HRMS
 * card in `SuiteGrid`, which is the copy deck's approved call.
 */
const LIFECYCLE: readonly Phase[] = [
  {
    phase: "Attract",
    module: "Recruit (ATS)",
    detail: "AI resume scoring, interview scheduling, and JD generation.",
    compliance: [],
  },
  {
    phase: "Hire",
    module: "HRMS Core + Sign",
    detail: "Offer letter generation, Aadhaar e-KYC, and digital onboarding.",
    compliance: ["Form 11 (PF)", "ESI registration"],
  },
  {
    phase: "Manage",
    module: "Attendance + Shifts",
    detail:
      "Biometric/geo-fence check-in, shift auto-scheduling, and anomaly detection.",
    compliance: ["Factory Act", "Shops Act"],
  },
  {
    phase: "Pay",
    module: "Payroll",
    detail: "Auto salary calc, TDS, PF/ESI challan, and Form 16 generation.",
    compliance: ["PF", "ESI", "PT", "LWF", "TDS"],
  },
  {
    phase: "Develop",
    module: "Performance + LMS",
    detail:
      "AI goal suggestions, continuous feedback, and course recommendations.",
    compliance: [],
  },
  {
    phase: "Retain",
    module: "Analytics Dashboard",
    detail:
      "Attrition prediction, compensation benchmarking, and sentiment analysis.",
    compliance: [],
  },
  {
    phase: "Exit",
    module: "HRMS Core",
    detail:
      "Clearance workflows, full-and-final calculation, and experience letter auto-generation.",
    compliance: ["PF withdrawal", "Gratuity calc"],
  },
];

/**
 * HRMS in depth — the V1 wedge shown across its full hire-to-retire lifecycle.
 * Signature motion: the phases stagger in, reading as the progression from
 * hire to exit.
 */
export function HrmsLifecycle() {
  return (
    <Section spacing="lg" aria-labelledby="hrms-lifecycle-title">
      <Container size="content" className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Start here — Orgofin HRMS"
          title={
            <span id="hrms-lifecycle-title">
              Hire to retire, with India compliance built into every step.
            </span>
          }
          subtitle="Our V1 wedge, shown in full. This is the scope the HRMS suite is built to cover across the employee lifecycle — the specific, painful compliance work most HR software leaves to you."
        />
        <Stagger className="grid gap-4 md:grid-cols-2">
          {LIFECYCLE.map((item) => (
            <StaggerItem key={item.phase}>
              <Card variant="standard" padding="lg" className="h-full">
                <CardHeader className="gap-3">
                  <p className="text-micro text-accent uppercase">
                    {item.phase}
                  </p>
                  <CardTitle>{item.module}</CardTitle>
                  <Text size="body-md" tone="muted">
                    {item.detail}
                  </Text>
                  {item.compliance.length > 0 ? (
                    <ul
                      className="flex flex-wrap gap-2 pt-1"
                      aria-label={`${item.phase} compliance`}
                    >
                      {item.compliance.map((tag) => (
                        <li key={tag}>
                          <Badge variant="neutral" dot={false}>
                            {tag}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
