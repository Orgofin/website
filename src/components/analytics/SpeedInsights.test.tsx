import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { useConsentMock, vercelSpeedInsightsMock } = vi.hoisted(() => ({
  useConsentMock: vi.fn(),
  vercelSpeedInsightsMock: vi.fn(),
}));

vi.mock("@/hooks/useConsent", () => ({ useConsent: useConsentMock }));
vi.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => {
    vercelSpeedInsightsMock();
    return <div data-testid="vercel-speed-insights" />;
  },
}));

import { SpeedInsights } from "@/components/analytics/SpeedInsights";

function withConsent(consent: string, mounted = true) {
  useConsentMock.mockReturnValue({
    consent,
    mounted,
    accept: vi.fn(),
    reject: vi.fn(),
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

/**
 * This gate backs a published promise in /privacy — "choose essential only and
 * no analytics script runs". Speed Insights needs no consent legally (no
 * cookies, no personal data), so nothing except this component stops it
 * loading for everyone. If it regresses, a counsel-pending legal page silently
 * becomes false, which is why it is tested rather than trusted.
 */
describe("SpeedInsights consent gate", () => {
  it("loads only when consent is explicitly granted", () => {
    withConsent("granted");
    render(<SpeedInsights />);
    expect(vercelSpeedInsightsMock).toHaveBeenCalledOnce();
  });

  it.each(["denied", "unset"])(
    "renders nothing when consent is %s",
    (state) => {
      withConsent(state);
      const { container } = render(<SpeedInsights />);
      expect(vercelSpeedInsightsMock).not.toHaveBeenCalled();
      expect(container).toBeEmptyDOMElement();
    },
  );

  it("renders nothing before mount, even with consent granted", () => {
    // Pre-hydration the stored decision cannot be read yet. Mounting here would
    // put the script in the very first response — the exact leak the gate
    // exists to prevent.
    withConsent("granted", false);
    const { container } = render(<SpeedInsights />);
    expect(vercelSpeedInsightsMock).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();
  });
});
