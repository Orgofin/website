import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalloutBox } from "@/components/molecules/CalloutBox";

describe("CalloutBox", () => {
  it("renders as a complementary landmark with its label and content", () => {
    render(
      <CalloutBox label="THE CORE INSIGHT">
        Every question has an answer, instantly.
      </CalloutBox>,
    );

    const aside = screen.getByRole("complementary");
    expect(aside).toBeInTheDocument();
    expect(screen.getByText("THE CORE INSIGHT")).toBeInTheDocument();
    expect(
      screen.getByText("Every question has an answer, instantly."),
    ).toBeInTheDocument();
  });

  it("defaults to the insight variant and switches with the variant prop", () => {
    const { rerender } = render(<CalloutBox>body</CalloutBox>);
    expect(screen.getByRole("complementary")).toHaveClass("bg-accent-subtle");

    rerender(<CalloutBox variant="spotlight">body</CalloutBox>);
    expect(screen.getByRole("complementary")).toHaveClass("glass-surface");
  });

  it("exposes an accessible name when aria-label is passed", () => {
    render(
      <CalloutBox aria-label="Core insight" label="THE CORE INSIGHT">
        content
      </CalloutBox>,
    );

    expect(
      screen.getByRole("complementary", { name: "Core insight" }),
    ).toBeInTheDocument();
  });
});
