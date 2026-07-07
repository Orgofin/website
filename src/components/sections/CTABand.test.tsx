import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// CTABand mounts WaitlistForm, which uses the router; stub it.
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import { CTABand } from "@/components/sections/CTABand";

describe("CTABand", () => {
  it("renders the default waitlist copy and the signup form", () => {
    render(<CTABand />);

    expect(
      screen.getByRole("heading", { name: "Be early to the Company Brain." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Join the Waitlist" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
  });

  it("exposes the anchor id the nav CTA links to", () => {
    const { container } = render(<CTABand />);
    expect(container.querySelector("#waitlist")).toBeInTheDocument();
  });

  it("allows overriding the copy per page", () => {
    render(<CTABand title="Ready to see it?" />);
    expect(
      screen.getByRole("heading", { name: "Ready to see it?" }),
    ).toBeInTheDocument();
  });
});
