import { describe, expect, it } from "vitest";

import { BRAIN_EDGES, BRAIN_NODES } from "@/components/graph/data";

describe("Company Brain graph data", () => {
  it("contains exactly the eight entity types from company-brain.md", () => {
    expect(BRAIN_NODES.map((node) => node.label).sort()).toEqual([
      "Customer",
      "Document",
      "Employee",
      "Invoice",
      "Policy",
      "Project",
      "Role",
      "Vendor",
    ]);
  });

  it("has unique node ids", () => {
    const ids = BRAIN_NODES.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only connects nodes that exist, and leaves none isolated", () => {
    const ids = new Set(BRAIN_NODES.map((node) => node.id));
    const connected = new Set<string>();
    for (const edge of BRAIN_EDGES) {
      expect(ids).toContain(edge.source);
      expect(ids).toContain(edge.target);
      expect(edge.verb).not.toBe("");
      connected.add(edge.source);
      connected.add(edge.target);
    }
    expect(connected.size).toBe(ids.size);
  });

  it("opens with the canonical cross-entity example from company-brain.md", () => {
    expect(BRAIN_EDGES.slice(0, 3)).toEqual([
      { source: "employee", target: "invoice", verb: "approved" },
      { source: "invoice", target: "project", verb: "for" },
      { source: "project", target: "customer", verb: "billed to" },
    ]);
  });
});
