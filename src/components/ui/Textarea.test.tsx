import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Textarea } from "@/components/ui/Textarea";

describe("Textarea", () => {
  it("renders an accessible multiline textbox tied to a label", () => {
    render(
      <>
        <label htmlFor="message">Message</label>
        <Textarea id="message" name="message" />
      </>,
    );

    expect(screen.getByLabelText("Message")).toBe(screen.getByRole("textbox"));
  });

  it("accepts multi-line input", async () => {
    render(<Textarea aria-label="Message" />);
    await userEvent.type(screen.getByRole("textbox"), "line one");

    expect(screen.getByRole("textbox")).toHaveValue("line one");
  });

  it("reflects the invalid state via aria-invalid", () => {
    render(<Textarea aria-label="Message" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards a ref to the underlying textarea", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Message" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
