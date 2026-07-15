import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CompanyBrainGraph } from "@/components/graph/CompanyBrainGraph";
import { BRAIN_EDGES, BRAIN_NODES } from "@/components/graph/data";

// Force the reduced-motion path: the simulation settles synchronously inside
// the layout effect, so tests assert the rendered graph without waiting on
// animation-frame ticks.
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => true,
}));

describe("CompanyBrainGraph", () => {
  it("renders every entity as a focusable node with its relationships described", () => {
    render(<CompanyBrainGraph />);

    const nodes = screen.getAllByRole("button");
    expect(nodes).toHaveLength(BRAIN_NODES.length);

    for (const node of BRAIN_NODES) {
      expect(screen.getByText(node.label)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", {
        name: /^Employee\. Employee approved Invoice/,
      }),
    ).toBeInTheDocument();
  });

  it("renders every relationship verb as an edge label", () => {
    render(<CompanyBrainGraph />);
    for (const edge of BRAIN_EDGES) {
      expect(screen.getAllByText(edge.verb).length).toBeGreaterThan(0);
    }
  });

  it("pins a node on click and releases it on a second click", () => {
    render(<CompanyBrainGraph />);
    const employee = screen.getByRole("button", { name: /^Employee\./ });

    expect(employee).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(employee);
    expect(employee).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(employee);
    expect(employee).toHaveAttribute("aria-pressed", "false");
  });

  it("clears a pinned node on Escape", () => {
    render(<CompanyBrainGraph />);
    const employee = screen.getByRole("button", { name: /^Employee\./ });

    fireEvent.click(employee);
    expect(employee).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(employee, { key: "Escape" });
    expect(employee).toHaveAttribute("aria-pressed", "false");
  });
});
