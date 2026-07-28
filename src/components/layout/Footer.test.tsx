import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LEGAL_ENTITY_NAME } from "@/lib/legal/constants";

/** The footer embeds `ThemeToggle`, which requires the theme context. */
function renderFooter() {
  return render(
    <ThemeProvider>
      <Footer />
    </ThemeProvider>,
  );
}

describe("Footer", () => {
  it("names the legal entity from the shared constant, not a literal", () => {
    renderFooter();

    // Asserting against the constant rather than "Orgofin" is the point: when
    // the registered entity name lands in `lib/legal/constants.ts`, the footer
    // and the legal pages must move together. A hardcoded expectation here
    // would keep passing while the © line drifted from `/privacy`.
    expect(
      screen.getByText(new RegExp(`\\d{4} ${LEGAL_ENTITY_NAME}\\.`)),
    ).toBeInTheDocument();
  });

  it("keeps the space between the year and the entity name", () => {
    // Regression guard. The same JSX-whitespace collapse shipped to production
    // on 2026-07-24 as `Orgofin(“we”…)` on both legal pages, so the © line is
    // built as one template literal (see the comment in `Footer.tsx`). This
    // fails if anyone reflows it back into interpolated JSX text.
    renderFooter();

    const year = new Date().getFullYear();
    expect(
      screen.getByText(
        `© ${year} ${LEGAL_ENTITY_NAME}. All rights reserved. · India → UK → USA`,
      ),
    ).toBeInTheDocument();
  });

  it("does not link a route that does not exist yet", () => {
    renderFooter();

    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toBe("#");
    }
  });
});
