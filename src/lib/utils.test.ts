import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind utilities so the last one wins", () => {
    // This is the reason cn() wraps tailwind-merge and not just clsx.
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps custom type-scale sizes alongside text colors", () => {
    // Regression: untaught, tailwind-merge classifies custom sizes as colors
    // and drops one of the pair (design-system.md type scale).
    expect(cn("text-caption", "text-fg-muted")).toBe(
      "text-caption text-fg-muted",
    );
    expect(cn("text-fg", "text-heading-sm")).toBe("text-fg text-heading-sm");
    expect(cn("text-display-xl", "text-gradient-brand")).toBe(
      "text-display-xl text-gradient-brand",
    );
  });

  it("still resolves conflicts within the type scale, last one wins", () => {
    expect(cn("text-body-md", "text-body-lg")).toBe("text-body-lg");
    expect(cn("text-display-xl", "text-heading-sm")).toBe("text-heading-sm");
  });
});
