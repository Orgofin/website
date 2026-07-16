import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BRAIN_EDGES } from "@/components/graph/data";
import { GraphTextAlternative } from "@/components/graph/GraphTextAlternative";

describe("GraphTextAlternative", () => {
  it("renders the table collapsed but present in the DOM (crawlable)", () => {
    render(<GraphTextAlternative />);

    const toggle = screen.getByRole("button", { name: "View as text" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // hidden, so not exposed via roles — but server-rendered into the DOM.
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      document.getElementById("company-brain-text-alternative"),
    ).toHaveAttribute("hidden");
  });

  it("reveals all nine relationships on toggle and collapses again", () => {
    render(<GraphTextAlternative />);

    fireEvent.click(screen.getByRole("button", { name: "View as text" }));

    const toggle = screen.getByRole("button", { name: "Hide text view" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute(
      "aria-controls",
      "company-brain-text-alternative",
    );

    expect(screen.getAllByRole("row")).toHaveLength(BRAIN_EDGES.length + 1);
    for (const edge of BRAIN_EDGES) {
      expect(screen.getAllByText(edge.verb).length).toBeGreaterThan(0);
    }

    fireEvent.click(toggle);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
