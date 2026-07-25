import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { CONSENT_STORAGE_KEY } from "@/lib/consent/config";
import { getConsent, resetConsentCache } from "@/lib/consent/store";

beforeEach(() => {
  localStorage.clear();
  resetConsentCache();
});

const banner = () =>
  screen.queryByRole("region", { name: "Analytics consent" });

describe("ConsentBanner", () => {
  it("asks a first-time visitor, offering both choices and the policy", () => {
    render(<ConsentBanner />);

    const region = banner();
    expect(region).toBeInTheDocument();
    expect(
      within(region!).getByRole("button", { name: "Accept" }),
    ).toBeInTheDocument();
    expect(
      within(region!).getByRole("button", { name: "Only Essential" }),
    ).toBeInTheDocument();
    expect(
      within(region!).getByRole("link", { name: "Read our Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy");
  });

  it("records a granted decision and dismisses itself", async () => {
    const user = userEvent.setup();
    render(<ConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Accept" }));

    expect(getConsent()).toBe("granted");
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
    expect(banner()).not.toBeInTheDocument();
  });

  it("records a declined decision and dismisses itself", async () => {
    const user = userEvent.setup();
    render(<ConsentBanner />);

    await user.click(screen.getByRole("button", { name: "Only Essential" }));

    expect(getConsent()).toBe("denied");
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
    expect(banner()).not.toBeInTheDocument();
  });

  it("does not ask again once a visitor has accepted", () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    resetConsentCache();

    render(<ConsentBanner />);

    expect(banner()).not.toBeInTheDocument();
  });

  it("does not ask again once a visitor has declined", () => {
    // The case a naive implementation gets wrong: `denied` is a decision, not
    // an absence of one, so the banner must stay gone.
    localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    resetConsentCache();

    render(<ConsentBanner />);

    expect(banner()).not.toBeInTheDocument();
  });

  it("does not steal focus when it appears", () => {
    render(<ConsentBanner />);

    // Declining must never be harder than accepting, and neither button may
    // grab focus from someone already reading the page.
    expect(document.body).toHaveFocus();
  });
});
