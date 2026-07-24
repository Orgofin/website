import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  LegalDocument,
  type LegalDocumentSection,
} from "@/components/sections/legal/LegalDocument";

const sections: LegalDocumentSection[] = [
  { id: "who-we-are", title: "Who we are", body: <p>The first clause.</p> },
  { id: "your-rights", title: "Your rights", body: <p>The second clause.</p> },
  { id: "contact", title: "Contact us", body: <p>The third clause.</p> },
];

function renderDocument() {
  return render(
    <LegalDocument
      title="Privacy Policy"
      intro="Here's exactly what we do with it."
      sections={sections}
    />,
  );
}

describe("LegalDocument", () => {
  it("renders the document title as the page's h1", () => {
    renderDocument();

    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
  });

  it("states an effective date", () => {
    renderDocument();

    expect(screen.getByText(/^Effective /)).toBeInTheDocument();
  });

  it("lists every section in the contents, in order, linked to its anchor", () => {
    renderDocument();

    const contents = screen.getByRole("navigation", { name: "Contents" });
    const links = within(contents).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Who we are",
      "Your rights",
      "Contact us",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#who-we-are",
      "#your-rights",
      "#contact",
    ]);
  });

  it("gives every section an anchor target matching its contents link", () => {
    const { container } = renderDocument();

    for (const section of sections) {
      expect(container.querySelector(`#${section.id}`)).toBeInTheDocument();
    }
  });

  it("renders each section as an h2 and renders its body", () => {
    renderDocument();

    for (const section of sections) {
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: new RegExp(section.title),
        }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText("The second clause.")).toBeInTheDocument();
  });

  it("numbers sections positionally so the contents and the body cannot disagree", () => {
    renderDocument();

    // The clause numbers are decorative (aria-hidden) but must still be right:
    // "3." belongs to the third section and nothing renumbers by hand.
    const contact = screen.getByRole("heading", {
      level: 2,
      name: /Contact us/,
    });
    expect(contact.textContent).toBe("3.Contact us");
  });

  it("names the contents nav without adding a heading to the document outline", () => {
    renderDocument();

    // Every h2 in the document is a real clause — the contents list is a
    // navigation landmark, not a section.
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(sections.length);
    expect(
      screen.queryByRole("heading", { name: "Contents" }),
    ).not.toBeInTheDocument();
  });
});
