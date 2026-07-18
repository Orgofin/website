import { describe, expect, it } from "vitest";

import {
  HONEYPOT_FIELD_NAME,
  isHoneypotTriggered,
} from "@/lib/security/bot-protection";

describe("isHoneypotTriggered", () => {
  it("is false for a real submission (honeypot absent or empty)", () => {
    expect(isHoneypotTriggered({ email: "a@b.com" })).toBe(false);
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD_NAME]: "" })).toBe(false);
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD_NAME]: "   " })).toBe(false);
  });

  it("is true when a bot fills the honeypot", () => {
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD_NAME]: "http://spam" })).toBe(
      true,
    );
  });

  it("is false for non-object bodies", () => {
    expect(isHoneypotTriggered(null)).toBe(false);
    expect(isHoneypotTriggered("string")).toBe(false);
    expect(isHoneypotTriggered(undefined)).toBe(false);
  });
});
