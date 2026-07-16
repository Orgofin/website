import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MobileBlockScreen } from "@/components/layout/MobileBlockScreen";

describe("MobileBlockScreen", () => {
  it("renders the lockout message as a dialog", () => {
    render(<MobileBlockScreen />);

    const dialog = screen.getByRole("dialog", { name: "Screen too small" });
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /wider view awaits/i }),
    ).toBeInTheDocument();
  });

  it("hides itself at and above the 320px breakpoint via CSS", () => {
    // Pure-CSS lockout: visible by default, hidden at >=320px. (Viewport-based
    // visibility is asserted end-to-end once Playwright lands — E15.1.2.)
    render(<MobileBlockScreen />);
    expect(screen.getByRole("dialog")).toHaveClass("mobile:hidden");
  });
});
