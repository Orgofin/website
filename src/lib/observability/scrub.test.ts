import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";

import { scrubEvent } from "./scrub";

/**
 * These tests exist because /privacy publishes a specific promise —
 * "If a submission fails, we record the technical error, never the contents"
 * — and this module is the only thing enforcing it. A regression here would
 * make a legal page false, silently, in a system nobody reads until an
 * incident is already underway.
 *
 * The realistic case to defend against is the waitlist POST: it carries a
 * name, a work email and a company, which is the exact payload a 500 would
 * otherwise hand to a third party.
 */
function waitlistErrorEvent(): ErrorEvent {
  return {
    type: undefined,
    request: {
      url: "https://orgofin.com/api/waitlist?utm_source=linkedin&email=leaked%40acme.com",
      method: "POST",
      data: {
        fullName: "Priya Raman",
        workEmail: "priya@acme.com",
        companyName: "Acme Manufacturing",
      },
      query_string: "utm_source=linkedin&email=leaked%40acme.com",
      cookies: { _ga: "GA1.1.1234567890.1699999999" },
      headers: {
        "content-type": "application/json",
        cookie: "_ga=GA1.1.1234567890.1699999999",
        authorization: "Bearer super-secret-token",
        "x-forwarded-for": "203.0.113.42",
        "user-agent": "Mozilla/5.0",
      },
    },
    user: { ip_address: "203.0.113.42", email: "priya@acme.com" },
  } as unknown as ErrorEvent;
}

describe("scrubEvent", () => {
  it("drops the submitted form contents entirely", () => {
    const scrubbed = scrubEvent(waitlistErrorEvent());

    expect(scrubbed.request?.data).toBeUndefined();

    // Belt and braces: no field value should survive anywhere in the payload.
    const serialized = JSON.stringify(scrubbed);
    expect(serialized).not.toContain("Priya Raman");
    expect(serialized).not.toContain("priya@acme.com");
    expect(serialized).not.toContain("Acme Manufacturing");
  });

  it("removes the user object, including the inferred IP address", () => {
    const scrubbed = scrubEvent(waitlistErrorEvent());

    expect(scrubbed.user).toBeUndefined();
    expect(JSON.stringify(scrubbed)).not.toContain("203.0.113.42");
  });

  it("strips the query string from both the URL and the dedicated field", () => {
    const scrubbed = scrubEvent(waitlistErrorEvent());

    expect(scrubbed.request?.url).toBe("https://orgofin.com/api/waitlist");
    expect(scrubbed.request?.query_string).toBeUndefined();
    // A query string is a common accidental PII carrier — see the seeded
    // `email=` param above, which must not survive in any form.
    expect(JSON.stringify(scrubbed)).not.toContain("leaked");
  });

  it("drops cookies and authorization headers but keeps diagnostic ones", () => {
    const scrubbed = scrubEvent(waitlistErrorEvent());
    const headers = scrubbed.request?.headers ?? {};

    expect(headers.cookie).toBeUndefined();
    expect(headers.authorization).toBeUndefined();
    expect(headers["x-forwarded-for"]).toBeUndefined();
    expect(scrubbed.request?.cookies).toBeUndefined();

    expect(headers["content-type"]).toBe("application/json");
    expect(headers["user-agent"]).toBe("Mozilla/5.0");
  });

  it("allowlists headers, so an unknown future header is dropped by default", () => {
    const event = waitlistErrorEvent();
    event.request!.headers = {
      ...event.request!.headers,
      "x-vercel-forwarded-for": "203.0.113.42",
      "x-real-ip": "203.0.113.42",
    };

    const headers = scrubEvent(event).request?.headers ?? {};

    expect(headers["x-vercel-forwarded-for"]).toBeUndefined();
    expect(headers["x-real-ip"]).toBeUndefined();
  });

  it("matches header names case-insensitively", () => {
    const event = waitlistErrorEvent();
    event.request!.headers = { Cookie: "_ga=1", "Content-Type": "text/plain" };

    const headers = scrubEvent(event).request?.headers ?? {};

    expect(headers.Cookie).toBeUndefined();
    expect(headers["Content-Type"]).toBe("text/plain");
  });

  it("keeps the technical error — the part /privacy says we do record", () => {
    const event = waitlistErrorEvent();
    event.exception = {
      values: [{ type: "TypeError", value: "supabase insert failed" }],
    };

    const scrubbed = scrubEvent(event);

    expect(scrubbed.exception?.values?.[0]?.value).toBe(
      "supabase insert failed",
    );
    expect(scrubbed.request?.method).toBe("POST");
    expect(scrubbed.request?.url).toContain("/api/waitlist");
  });

  it("handles events with no request or user without throwing", () => {
    const bare = { type: undefined } as unknown as ErrorEvent;

    expect(() => scrubEvent(bare)).not.toThrow();
    expect(scrubEvent(bare)).toBeDefined();
  });

  it("handles a URL that has no query string", () => {
    const event = waitlistErrorEvent();
    event.request!.url = "https://orgofin.com/api/waitlist";

    expect(scrubEvent(event).request?.url).toBe(
      "https://orgofin.com/api/waitlist",
    );
  });
});
