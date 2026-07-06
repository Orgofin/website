import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCallout } from "@/components/molecules/StatCallout";

describe("StatCallout", () => {
  it("renders the value and label", () => {
    render(
      <StatCallout value="$52K–$220K" label="wasted per year on tool sprawl" />,
    );

    expect(screen.getByText("$52K–$220K")).toBeInTheDocument();
    expect(
      screen.getByText("wasted per year on tool sprawl"),
    ).toBeInTheDocument();
  });

  it("renders the figure in tabular monospace for aligned digits", () => {
    render(<StatCallout value="$1.73B" label="serviceable market" />);

    expect(screen.getByText("$1.73B")).toHaveClass("font-mono", "tabular-nums");
  });

  it("applies the brand gradient to the figure only when requested", () => {
    const { rerender } = render(
      <StatCallout value="42" label="plain" gradient />,
    );
    expect(screen.getByText("42")).toHaveClass("text-gradient-brand");

    rerender(<StatCallout value="42" label="plain" />);
    expect(screen.getByText("42")).not.toHaveClass("text-gradient-brand");
  });

  it("renders the optional description", () => {
    render(
      <StatCallout
        value="200"
        label="person company"
        description="the size where fragmentation starts to bite"
      />,
    );

    expect(
      screen.getByText("the size where fragmentation starts to bite"),
    ).toBeInTheDocument();
  });
});
