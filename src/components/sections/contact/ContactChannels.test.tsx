import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactChannels } from "@/components/sections/contact/ContactChannels";
import { ContactDirect } from "@/components/sections/contact/ContactDirect";
import { CONTACT_EMAIL } from "@/lib/site/contact";

describe("Contact page sections", () => {
  it("routes every channel to a destination that exists", () => {
    render(<ContactChannels />);

    // `/partners` and `/team` are unbuilt (IA §1). A channel card must never
    // link to one — the whole point of the mailto routing is that a page we
    // haven't built can still receive enquiries (never-link-a-404, IA §4).
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    const builtRoutes = ["/investors", "/careers", "/privacy"];
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("/")) {
        expect(builtRoutes).toContain(href);
      } else {
        expect(href.startsWith(`mailto:${CONTACT_EMAIL}`)).toBe(true);
      }
    }
  });

  it("pre-fills a subject on every mailto so enquiries arrive sorted", () => {
    render(<ContactChannels />);

    const mailtos = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("mailto:"));

    expect(mailtos.length).toBeGreaterThan(0);
    for (const href of mailtos) {
      expect(href).toContain("?subject=");
    }
  });

  it("publishes the founder-supplied address, not an invented one", () => {
    render(<ContactDirect />);

    const link = screen.getByRole("link", { name: CONTACT_EMAIL });
    expect(link).toHaveAttribute("href", `mailto:${CONTACT_EMAIL}`);
  });

  it("promises no demo, since nothing is publicly available yet", () => {
    const { container } = render(<ContactChannels />);
    expect(container.textContent?.toLowerCase()).not.toContain("demo");
  });
});
