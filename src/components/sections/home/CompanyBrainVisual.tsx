import { CompanyBrainGraphLazy } from "@/components/graph";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Badge } from "@/components/ui/Badge";

/**
 * The connection from copy.md §1 Ch.5's sub-headline, drawn as a static chain
 * of nodes. Deliberately motion-free: since the interactive graph landed
 * (E9.3.2), this chain is the crawlable/no-JS/screen-reader equivalent of the
 * same relationships (the E9.3.3 designation) — the section's one signature
 * motion is the graph's assembly, not a chain stagger.
 */
const CHAIN: ReadonlyArray<{ node: string; edge?: string }> = [
  { node: "Employee A" },
  { node: "Invoice B", edge: "approved" },
  { node: "Project C", edge: "for" },
  { node: "Customer D", edge: "billed to" },
];

/**
 * Chapter 5 — Visualize the Company Brain. Copy verbatim from
 * `docs/product/copy.md` §1 Ch.5. Signature motion: the `CompanyBrainGraph`
 * assembling itself once (d3-force physics, not Framer Motion — frontend.md
 * §10); the graph is client-only and lazy, the chain below stays static and
 * server-rendered as its text equivalent.
 */
export function CompanyBrainVisual() {
  return (
    <Section spacing="lg">
      <Container size="content" className="flex flex-col gap-10">
        <SectionHeading
          title="Everything connected. Nothing lost."
          subtitle={
            "“Employee A approved Invoice B for Project C, billed to Customer D.” One line most software can’t draw. Company Brain draws it automatically."
          }
        />

        <div className="flex flex-col gap-3">
          <CompanyBrainGraphLazy />
          <p className="text-caption text-fg-subtle text-center">
            Click a node to see how it connects.
          </p>
        </div>

        <div
          className="glass-surface border-border flex flex-wrap items-center gap-x-2 gap-y-4 rounded-lg border p-6 sm:gap-x-3"
          aria-label="Employee A approved Invoice B for Project C, billed to Customer D"
        >
          {CHAIN.map((step) => (
            <span
              key={step.node}
              className="flex items-center gap-x-2 sm:gap-x-3"
            >
              {step.edge ? (
                <span className="text-micro text-fg-subtle inline-flex items-center gap-x-2 sm:gap-x-3">
                  <span aria-hidden="true">→</span>
                  <span className="uppercase">{step.edge}</span>
                  <span aria-hidden="true">→</span>
                </span>
              ) : null}
              <Badge variant="accent" dot={false} className="text-body-sm">
                {step.node}
              </Badge>
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}
