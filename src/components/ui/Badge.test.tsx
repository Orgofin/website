import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders its label text (the primary, colour-independent signal)", () => {
    render(<Badge variant="available">Available now</Badge>);
    expect(screen.getByText("Available now")).toBeInTheDocument();
  });

  it("applies the variant styling", () => {
    render(<Badge variant="accent">Accent</Badge>);
    expect(screen.getByText("Accent").closest("span")).toHaveClass(
      "text-accent",
    );
  });

  it("renders a decorative status dot by default", () => {
    const { container } = render(<Badge variant="available">Available</Badge>);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("bg-success");
  });

  it("replaces the dot with a provided icon", () => {
    render(
      <Badge icon={<svg data-testid="icon" />} variant="roadmap">
        On the roadmap
      </Badge>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    // The success dot from the default path should not be present.
    expect(document.querySelector(".bg-success")).not.toBeInTheDocument();
  });

  it("can hide the dot entirely", () => {
    const { container } = render(
      <Badge dot={false} variant="neutral">
        Plain
      </Badge>,
    );
    expect(
      container.querySelector('[aria-hidden="true"]'),
    ).not.toBeInTheDocument();
  });
});
