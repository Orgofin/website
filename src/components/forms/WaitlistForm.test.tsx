import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ trackEvent }));

import { WaitlistForm } from "@/components/forms/WaitlistForm";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("WaitlistForm", () => {
  it("shows an inline error and does not submit for an invalid email", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText("Work email"), "not-an-email");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the Waitlist" }),
    );

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("submits a valid email through the API and redirects on success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);

    render(<WaitlistForm source="home-hero" />);
    await userEvent.type(
      screen.getByLabelText("Work email"),
      "founder@orgofin.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Join the Waitlist" }),
    );

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/waitlist/thank-you"),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/waitlist",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "founder@orgofin.com",
          source: "home-hero",
        }),
      }),
    );
    // Conversion event carries attribution + outcome, never the email (PRD §10).
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith({
      name: "waitlist_submit",
      params: { source: "home-hero", status: "success" },
    });
  });

  it("announces a server error and stays on the page", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "We couldn't add you to the waitlist." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText("Work email"), "a@b.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the Waitlist" }),
    );

    expect(
      await screen.findByText("We couldn't add you to the waitlist."),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith({
      name: "waitlist_submit",
      params: { source: "unspecified", status: "error" },
    });
  });

  it("announces a network error when the request throws", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network"));
    vi.stubGlobal("fetch", fetchMock);

    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText("Work email"), "a@b.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the Waitlist" }),
    );

    expect(await screen.findByText(/couldn't reach the server/i)).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });
});
