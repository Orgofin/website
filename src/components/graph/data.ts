/**
 * The Company Brain entity graph data. The eight nodes are exactly the entity
 * types named in `.claude/knowledge/company-brain.md` (Organisational Entity
 * Graph): Employee, Customer, Vendor, Project, Document, Invoice, Policy,
 * Role. The first three edges are the canonical cross-entity example from the
 * same source — "Employee approved Invoice for Project, billed to Customer" —
 * mirroring the static chain in `CompanyBrainVisual`; the rest are
 * illustrative relationships consistent with it (concept illustration, not
 * business facts).
 */

export type EntityNode = {
  id: string;
  label: string;
};

export type EntityEdge = {
  source: string;
  target: string;
  /** Relationship verb rendered along the edge. */
  verb: string;
};

export const BRAIN_NODES: readonly EntityNode[] = [
  { id: "employee", label: "Employee" },
  { id: "invoice", label: "Invoice" },
  { id: "project", label: "Project" },
  { id: "customer", label: "Customer" },
  { id: "vendor", label: "Vendor" },
  { id: "document", label: "Document" },
  { id: "policy", label: "Policy" },
  { id: "role", label: "Role" },
];

export const BRAIN_EDGES: readonly EntityEdge[] = [
  { source: "employee", target: "invoice", verb: "approved" },
  { source: "invoice", target: "project", verb: "for" },
  { source: "project", target: "customer", verb: "billed to" },
  { source: "employee", target: "project", verb: "assigned to" },
  { source: "vendor", target: "project", verb: "supplies" },
  { source: "customer", target: "document", verb: "signed" },
  { source: "document", target: "vendor", verb: "binds" },
  { source: "policy", target: "employee", verb: "applies to" },
  { source: "employee", target: "role", verb: "holds" },
];
