import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

vi.mock("next/navigation", () => ({ usePathname: () => "/platform" }));

// The nav mounts `ThemeToggle`, which requires the theme context.
const renderNavbar = () =>
  render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>,
  );

/**
 * The material assertions below look like trivial class checks, but they are
 * the cheap half of a real production defect (design-system.md §2, 2026-08-01):
 * the header and the dropdown were built from `glass-surface`, a decorative
 * tint that cannot occlude, so page content read straight through both. The
 * CSS-level half of the guard lives in `src/app/globals.test.ts`.
 */
describe("Navbar", () => {
  it("gives the header an occluding material at every scroll position", () => {
    renderNavbar();
    const header = screen.getByRole("banner");

    expect(header).toHaveClass("glass-chrome");
    // Decorative glass is far too transparent for chrome — it is what broke.
    expect(header).not.toHaveClass("glass-surface");
    // Unconditional, so the header is never transparent at the top of a page
    // and the blur never snaps on partway through the scroll transition.
    expect(header.className).not.toMatch(/bg-page/);
  });

  it("renders the dropdown panel on a near-opaque overlay material", async () => {
    const user = userEvent.setup();
    renderNavbar();

    const trigger = screen.getByRole("button", { name: /Platform/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Hover, not click: the cluster opens on pointer-enter, so a click on a
    // pointer device would open then immediately toggle it back shut.
    await user.hover(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const panel = screen
      .getByRole("link", { name: "Company Brain" })
      .closest("ul");
    expect(panel).toHaveClass("glass-overlay");
    expect(panel).not.toHaveClass("glass-surface");
  });

  it("names a rung on the layering ladder instead of a bare z-index", () => {
    renderNavbar();
    // A bare number can only be picked by guessing what else exists.
    expect(screen.getByRole("banner").className).toContain(
      "z-[var(--z-header)]",
    );
  });
});
