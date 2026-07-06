import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "@/components/molecules/FormField";

describe("FormField", () => {
  it("associates the label with the control via htmlFor/id", () => {
    render(
      <FormField label="Work email" htmlFor="email">
        {(control) => <input type="email" {...control} />}
      </FormField>,
    );

    const input = screen.getByLabelText("Work email");
    expect(input).toHaveAttribute("id", "email");
  });

  it("links a hint to the control through aria-describedby", () => {
    render(
      <FormField label="Work email" htmlFor="email" hint="We never share it.">
        {(control) => <input {...control} />}
      </FormField>,
    );

    const hint = screen.getByText("We never share it.");
    expect(screen.getByLabelText("Work email")).toHaveAttribute(
      "aria-describedby",
      hint.id,
    );
    expect(hint.id).toBeTruthy();
  });

  it("marks the field invalid and announces the error next to it", () => {
    render(
      <FormField label="Work email" htmlFor="email" error="Enter a valid email">
        {(control) => <input {...control} />}
      </FormField>,
    );

    const input = screen.getByLabelText("Work email");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Enter a valid email");
    expect(input.getAttribute("aria-describedby")).toContain(error.id);
  });

  it("describes the control by both hint and error when both are present", () => {
    render(
      <FormField
        label="Work email"
        htmlFor="email"
        hint="We never share it."
        error="Required"
      >
        {(control) => <input {...control} />}
      </FormField>,
    );

    const describedBy =
      screen.getByLabelText("Work email").getAttribute("aria-describedby") ??
      "";
    expect(describedBy).toContain("email-hint");
    expect(describedBy).toContain("email-error");
  });

  it("stays valid with no error", () => {
    render(
      <FormField label="Work email" htmlFor="email">
        {(control) => <input {...control} />}
      </FormField>,
    );

    expect(screen.getByLabelText("Work email")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
