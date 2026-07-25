import { describe, expect, it } from "vitest";

import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY_DEFINED,
  LEGAL_ENTITY_NAME,
} from "@/lib/legal/constants";
import { CONTACT_EMAIL } from "@/lib/site/contact";

describe("legal constants", () => {
  /**
   * Regression: both policies shipped to production on 2026-07-24 reading
   * `Orgofin(“we”, “us”, “our”)` — JSX dropped the space when the phrase was
   * assembled as `{LEGAL_ENTITY_NAME} (&ldquo;we&rdquo;…)`. An explicit `{" "}`
   * fixed it but Prettier removed that again on the next reformat, so the
   * phrase is now one string. This test is what stops it regressing a third
   * time, since neither a formatter nor a careless edit can silently reopen it.
   */
  it("keeps the defined-terms phrase spaced correctly", () => {
    expect(LEGAL_ENTITY_DEFINED).toBe(
      `${LEGAL_ENTITY_NAME} (“we”, “us”, “our”)`,
    );
    expect(LEGAL_ENTITY_DEFINED).toContain(`${LEGAL_ENTITY_NAME} (`);
    expect(LEGAL_ENTITY_DEFINED).not.toMatch(/\w\(/); // no `Orgofin(`
    expect(LEGAL_ENTITY_DEFINED).not.toMatch(/\(\s/); // no `( “we”`
    expect(LEGAL_ENTITY_DEFINED).not.toMatch(/\s\)/); // no `“our” )`
  });

  /**
   * The published policy and `/contact` must never name different addresses —
   * that is the drift that makes a privacy policy unenforceable, so the legal
   * constant re-exports the site-wide one rather than repeating the literal.
   */
  it("routes data-principal requests to the same address /contact publishes", () => {
    expect(LEGAL_CONTACT_EMAIL).toBe(CONTACT_EMAIL);
  });
});
