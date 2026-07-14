import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  CompetitorTeardownTable,
  type CompetitorRow,
} from "@/components/sections/CompetitorTeardownTable";

const ROWS: readonly CompetitorRow[] = [
  { competitor: "Zoho", gap: "No unified graph, no real agent layer." },
  { competitor: "Salesforce", gap: "10x the cost, CRM-only AI." },
];

describe("CompetitorTeardownTable", () => {
  it("renders a real table with an accessible caption and column headers", () => {
    render(
      <CompetitorTeardownTable
        variant="teaser"
        rows={ROWS}
        caption="Competitive teardown"
      />,
    );

    const table = screen.getByRole("table", { name: "Competitive teardown" });
    const columnHeaders = within(table).getAllByRole("columnheader");
    expect(columnHeaders.map((th) => th.textContent)).toEqual([
      "Competitor",
      "The gap",
    ]);
  });

  it("renders each competitor as a row header with its gap", () => {
    render(
      <CompetitorTeardownTable variant="full" rows={ROWS} caption="Teardown" />,
    );

    expect(screen.getByRole("rowheader", { name: "Zoho" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "10x the cost, CRM-only AI." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 data rows
  });

  it("scrolls horizontally inside its own container", () => {
    const { container } = render(
      <CompetitorTeardownTable
        variant="teaser"
        rows={ROWS}
        caption="Teardown"
      />,
    );
    expect(container.firstElementChild).toHaveClass("overflow-x-auto");
  });
});
