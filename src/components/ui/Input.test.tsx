import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders an accessible textbox associated with an external label", () => {
    render(
      <>
        <label htmlFor="email">Work email</label>
        <Input id="email" name="email" />
      </>,
    );

    expect(screen.getByLabelText("Work email")).toBe(
      screen.getByRole("textbox"),
    );
  });

  it("accepts typed input", async () => {
    render(<Input aria-label="Email" />);
    await userEvent.type(screen.getByRole("textbox"), "founder@orgofin.com");

    expect(screen.getByRole("textbox")).toHaveValue("founder@orgofin.com");
  });

  it("reflects the invalid state via aria-invalid", () => {
    render(<Input aria-label="Email" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("omits aria-invalid when valid", () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("forwards a ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
