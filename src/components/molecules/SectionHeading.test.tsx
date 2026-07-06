import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "@/components/molecules/SectionHeading";

describe("SectionHeading", () => {
  it("renders the title at the requested semantic level", () => {
    render(<SectionHeading level={2} title="Meet the Company Brain" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Meet the Company Brain" }),
    ).toBeInTheDocument();
  });

  it("decouples semantic level from visual size", () => {
    render(<SectionHeading level={3} size="display-lg" title="Roadmap" />);

    const heading = screen.getByRole("heading", { level: 3, name: "Roadmap" });
    expect(heading).toHaveClass("text-display-lg");
  });

  it("renders the optional eyebrow and subtitle when provided", () => {
    render(
      <SectionHeading
        eyebrow="Chapter 4"
        title="Meet the Company Brain"
        subtitle="One living map of your company."
      />,
    );

    expect(screen.getByText("Chapter 4")).toBeInTheDocument();
    expect(
      screen.getByText("One living map of your company."),
    ).toBeInTheDocument();
  });

  it("omits the eyebrow and subtitle when not provided", () => {
    render(<SectionHeading title="Just a title" />);

    expect(screen.queryByText("Chapter 4")).not.toBeInTheDocument();
    // Only the heading should be present — no stray subtitle paragraph.
    expect(screen.getByRole("heading", { name: "Just a title" })).toBeVisible();
  });
});
