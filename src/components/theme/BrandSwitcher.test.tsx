import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BrandSwitcher } from "@/components/theme/BrandSwitcher";

describe("BrandSwitcher", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    delete document.documentElement.dataset.brand;
    window.localStorage.clear();
  });

  it("renders nothing unless the build enables it", () => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_SWITCHER", "");
    const { container } = render(<BrandSwitcher />);
    expect(container).toBeEmptyDOMElement();
  });

  it("applies and persists a brand, and clears back to Current", () => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_SWITCHER", "1");
    render(<BrandSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: "Aurum Ledger" }));
    expect(document.documentElement.dataset.brand).toBe("aurum");
    expect(window.localStorage.getItem("orgofin-brand-preview")).toBe("aurum");

    fireEvent.click(screen.getByRole("button", { name: "Current" }));
    expect(document.documentElement.dataset.brand).toBeUndefined();
    expect(window.localStorage.getItem("orgofin-brand-preview")).toBeNull();
  });

  it("restores the persisted brand on mount", () => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_SWITCHER", "1");
    window.localStorage.setItem("orgofin-brand-preview", "indigo");
    render(<BrandSwitcher />);

    expect(document.documentElement.dataset.brand).toBe("indigo");
    expect(
      screen.getByRole("button", { name: "Indigo Meridian" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
