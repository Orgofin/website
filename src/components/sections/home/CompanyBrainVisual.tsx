import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge } from "@/components/ui/Badge";

/**
 * The connection from copy.md §1 Ch.5's sub-headline, drawn as a static chain of
 * nodes. Each edge carries its relationship verb. This is the lightweight,
 * dependency-free interim for the chapter's visual — the full force-directed,
 * interactive `CompanyBrainGraph` is deferred (backlog E9.3.2, blocked on the
 * E9.3.1 library decision). Because it is plain DOM text, it doubles as the
 * accessible equivalent that graph will later need (E9.3.3).
 */
const CHAIN: ReadonlyArray<{ node: string; edge?: string }> = [
  { node: "Employee A" },
  { node: "Invoice B", edge: "approved" },
  { node: "Project C", edge: "for" },
  { node: "Customer D", edge: "billed to" },
];

/**
 * Chapter 5 — Visualize the Company Brain. Copy verbatim from
 * `docs/product/copy.md` §1 Ch.5. Signature motion: the chain assembles node by
 * node (reduced motion fades it in at once via the shared `Stagger` primitive).
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

        <Stagger
          className="glass-surface border-border flex flex-wrap items-center gap-x-2 gap-y-4 rounded-lg border p-6 sm:gap-x-3"
          aria-label="Employee A approved Invoice B for Project C, billed to Customer D"
        >
          {CHAIN.map((step) => (
            <StaggerItem
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
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
