import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

type UnitEconomicsRow = {
  metric: string;
  year1: string;
  year3: string;
  year5: string;
};

/** The projected trajectory from prd.md §3.4, published as-is. */
const ROWS: readonly UnitEconomicsRow[] = [
  { metric: "ACV", year1: "$4,800", year3: "$12,000", year5: "$36,000" },
  { metric: "Gross margin", year1: "65%", year3: "72%", year5: "78%" },
  { metric: "Payback period", year1: "18mo", year3: "12mo", year5: "8mo" },
  { metric: "NRR", year1: "105%", year3: "115%", year5: "125%" },
  {
    metric: "CAC (blended)",
    year1: "$1,200",
    year3: "$2,400",
    year5: "$3,600",
  },
  {
    metric: "LTV (5-yr)",
    year1: "$22,000",
    year3: "$64,000",
    year5: "$180,000",
  },
  { metric: "LTV:CAC", year1: "18x", year3: "27x", year5: "50x" },
];

const YEAR_COLUMNS = ["Year 1", "Year 3", "Year 5"] as const;

/**
 * Unit Economics — the projected trajectory table from `docs/product/prd.md`
 * §3.4 (the PRD's recommended Investors-page centerpiece; figures published
 * as-is, founder-approved 2026-07-14). Headline + subtitle are synthesized —
 * copy.md §6 has no unit-economics copy — and recorded back in copy.md §6
 * flagged as such. Table styling mirrors `CompetitorTeardownTable`'s `full`
 * variant: a real `<table>`, mono numerals, horizontally scrollable inside its
 * own container. Closes with the page CTA from copy.md §6 — the data-room
 * route ships with E11.1.3 (the same forward-link pattern `/vision` used for
 * this page before it existed). Signature motion: the section's single reveal.
 */
export function UnitEconomics() {
  return (
    <Section spacing="lg" aria-labelledby="unit-economics-title">
      <Container size="content" className="flex flex-col gap-8">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading
            title={
              <span id="unit-economics-title">
                Unit economics built to compound.
              </span>
            }
            subtitle="The projected trajectory from wedge to platform. Forward-looking targets, not audited results."
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-md border-collapse text-left">
              <caption className="sr-only">
                Projected unit economics by year
              </caption>
              <thead>
                <tr className="border-border border-b">
                  <th
                    scope="col"
                    className="text-caption text-fg-muted py-4 pr-6 font-medium uppercase"
                  >
                    Metric
                  </th>
                  {YEAR_COLUMNS.map((year) => (
                    <th
                      key={year}
                      scope="col"
                      className="text-caption text-fg-muted py-4 pr-6 text-right font-medium uppercase last:pr-0"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.metric} className="border-border border-b">
                    <th
                      scope="row"
                      className="text-heading-sm text-fg py-4 pr-6 font-semibold whitespace-nowrap"
                    >
                      {row.metric}
                    </th>
                    {[row.year1, row.year3, row.year5].map((value, index) => (
                      <td
                        key={YEAR_COLUMNS[index]}
                        className="text-mono-md text-fg-muted py-4 pr-6 text-right font-mono tabular-nums last:pr-0"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button variant="link" size="md" asChild>
            <Link href="/investors/data-room">
              Access the Investor Data Room →
            </Link>
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
