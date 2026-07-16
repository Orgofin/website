"use client";

import { useState } from "react";

import { BRAIN_EDGES, BRAIN_NODES } from "@/components/graph/data";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TABLE_ID = "company-brain-text-alternative";

const nodeLabel = (id: string) =>
  BRAIN_NODES.find((node) => node.id === id)?.label ?? id;

/**
 * The graph's full text equivalent (E9.3.3): a visible "View as text"
 * disclosure revealing a structured table of all nine `BRAIN_EDGES`
 * relationships — the static chain in `CompanyBrainVisual` covers only the
 * canonical four. The table is server-rendered and collapsed with the `hidden`
 * attribute, so the relationships exist in the static HTML for crawlers while
 * staying out of the reading order until the user asks for them. No reveal
 * animation: the section's one signature motion is the graph's assembly.
 */
export function GraphTextAlternative({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={open}
        aria-controls={TABLE_ID}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide text view" : "View as text"}
      </Button>

      <div id={TABLE_ID} hidden={!open} className="w-full">
        <table className="border-border w-full border-collapse rounded-lg border">
          <caption className="sr-only">
            Every relationship drawn in the Company Brain graph
          </caption>
          <thead>
            <tr className="border-border border-b">
              <th
                scope="col"
                className="text-caption text-fg-muted px-4 py-2.5 text-left font-medium uppercase"
              >
                Entity
              </th>
              <th
                scope="col"
                className="text-caption text-fg-muted px-4 py-2.5 text-left font-medium uppercase"
              >
                Relationship
              </th>
              <th
                scope="col"
                className="text-caption text-fg-muted px-4 py-2.5 text-left font-medium uppercase"
              >
                Connected entity
              </th>
            </tr>
          </thead>
          <tbody>
            {BRAIN_EDGES.map((edge) => (
              <tr
                key={`${edge.source}-${edge.verb}-${edge.target}`}
                className="border-border border-b last:border-b-0"
              >
                <td className="text-body-sm text-fg px-4 py-2.5">
                  {nodeLabel(edge.source)}
                </td>
                <td className="text-body-sm text-fg-muted px-4 py-2.5">
                  {edge.verb}
                </td>
                <td className="text-body-sm text-fg px-4 py-2.5">
                  {nodeLabel(edge.target)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
