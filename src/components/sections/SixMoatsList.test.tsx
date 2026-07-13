import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SixMoatsList } from "@/components/sections/SixMoatsList";

const MOATS: readonly string[] = [
  "Organisational memory that compounds with every customer.",
  "Data network effects across thousands of Indian SMBs.",
  "India compliance depth competitors won't easily replicate.",
];

describe("SixMoatsList", () => {
  it("renders an ordered, labelled list of moats", () => {
    render(
      <SixMoatsList variant="full" moats={MOATS} aria-label="The six moats" />,
    );

    const list = screen.getByRole("list", { name: "The six moats" });
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(
      within(list).getByText(
        "Organisational memory that compounds with every customer.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the moat's position as a visible numeral in both variants", () => {
    render(<SixMoatsList variant="teaser" moats={MOATS} aria-label="Moats" />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });
});
