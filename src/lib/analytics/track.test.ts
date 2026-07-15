import { afterEach, describe, expect, it, vi } from "vitest";

const { sendGAEvent } = vi.hoisted(() => ({ sendGAEvent: vi.fn() }));
vi.mock("@next/third-parties/google", () => ({ sendGAEvent }));

/** Loads a fresh trackEvent with the GA measurement id set or absent. */
async function loadTrackEvent(gaId: string | undefined) {
  vi.resetModules();
  vi.doMock("@/env", () => ({
    env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: gaId },
  }));
  const mod = await import("@/lib/analytics/track");
  return mod.trackEvent;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("trackEvent", () => {
  it("forwards the event name and params to GA when a measurement id is set", async () => {
    const trackEvent = await loadTrackEvent("G-TEST123");

    trackEvent({ name: "theme_change", params: { theme: "dark" } });

    expect(sendGAEvent).toHaveBeenCalledExactlyOnceWith(
      "event",
      "theme_change",
      { theme: "dark" },
    );
  });

  it("sends conversion events with their attribution params", async () => {
    const trackEvent = await loadTrackEvent("G-TEST123");

    trackEvent({
      name: "waitlist_submit",
      params: { source: "home-waitlist", status: "success" },
    });

    expect(sendGAEvent).toHaveBeenCalledExactlyOnceWith(
      "event",
      "waitlist_submit",
      { source: "home-waitlist", status: "success" },
    );
  });

  it("no-ops when the measurement id is unset (CI, local, previews)", async () => {
    const trackEvent = await loadTrackEvent(undefined);

    trackEvent({ name: "theme_change", params: { theme: "light" } });

    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("never throws, even when the GA integration does", async () => {
    const trackEvent = await loadTrackEvent("G-TEST123");
    sendGAEvent.mockImplementationOnce(() => {
      throw new Error("gtag exploded");
    });

    expect(() =>
      trackEvent({ name: "theme_change", params: { theme: "system" } }),
    ).not.toThrow();
  });
});
