import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders its children inside a real <button>", () => {
    render(<Button>Join waitlist</Button>);

    expect(
      screen.getByRole("button", { name: "Join waitlist" }),
    ).toBeInTheDocument();
  });

  it("calls onClick when activated", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Click me" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled and non-interactive while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Submitting
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Submitting" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/waitlist">Join</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Join" })).toHaveAttribute(
      "href",
      "/waitlist",
    );
  });
});
