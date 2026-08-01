import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guards the translucency contract in globals.css (design-system.md §2).
 *
 * These are source-text assertions rather than rendered-component assertions on
 * purpose: jsdom implements neither `backdrop-filter`, `@supports` nor
 * `prefers-reduced-transparency`, so a rendering test physically cannot observe
 * any of the invariants below. What actually broke in production was the shape
 * of the CSS itself, and that is what this file locks.
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

const MATERIALS = ["glass-surface", "glass-chrome", "glass-overlay"] as const;

function utilityBody(name: string): string {
  const start = css.indexOf(`@utility ${name} {`);
  expect(start, `@utility ${name} not found`).toBeGreaterThan(-1);
  // Walk braces to the matching close so nested @supports/@media come along.
  let depth = 0;
  let i = css.indexOf("{", start);
  const from = i;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) break;
  }
  return css.slice(from, i + 1);
}

describe("globals.css translucency contract", () => {
  it.each(MATERIALS)(
    "%s declares its opaque background before any translucent one",
    (name) => {
      const body = utilityBody(name);
      const firstDecl = body.indexOf("background-color:");
      const supports = body.indexOf("@supports");

      expect(firstDecl).toBeGreaterThan(-1);
      // The unconditional opaque value must come first — it is what a browser
      // without backdrop-filter is left with. Reversing these ships a
      // see-through navbar to every such browser.
      expect(body.slice(firstDecl, supports)).toMatch(/--\S+-opaque\)/);
      expect(supports).toBeGreaterThan(firstDecl);
    },
  );

  it.each(MATERIALS)("%s gates blur behind @supports", (name) => {
    const condition = utilityBody(name).match(/@supports([^{]*)\{/)?.[1];
    expect(condition, `${name}: no @supports guard`).toBeDefined();
    // Both spellings, or the guard is false on browsers that only ship one.
    expect(condition).toContain("(backdrop-filter:");
    expect(condition).toContain("(-webkit-backdrop-filter:");
    expect(condition).toContain(" or ");
  });

  it.each(MATERIALS)(
    "%s returns to opaque under prefers-reduced-transparency",
    (name) => {
      const body = utilityBody(name);
      const at = body.indexOf("prefers-reduced-transparency");
      expect(at).toBeGreaterThan(-1);
      const block = body.slice(at);
      expect(block).toMatch(/--\S+-opaque\)/);
      expect(block).toMatch(/backdrop-filter:\s*none/);
    },
  );

  it.each(MATERIALS)(
    "%s declares -webkit-backdrop-filter BEFORE the unprefixed property",
    (name) => {
      const body = utilityBody(name);
      // Load-bearing ordering. Lightning CSS collapses a prefixed/unprefixed
      // pair and keeps whichever came LAST, so the reverse order deletes
      // `backdrop-filter` from the build entirely. That shipped: production
      // emitted -webkit- only, and Firefox — which never supported that alias —
      // rendered the navbar with no blur at all over live scrolling content.
      // Strip `@supports (...)` conditions — they name both spellings too, in
      // the opposite order, and are not declarations.
      const decls = body.replace(/@supports[^{]*\{/g, "{");
      const decl = [
        ...decls.matchAll(/(-webkit-)?backdrop-filter:\s*([^;\n]+)/g),
      ].map((m) => ({
        prefixed: m[1] === "-webkit-",
        value: (m[2] ?? "").trim(),
      }));

      expect(decl.length).toBeGreaterThan(0);
      expect(decl.length % 2, `${name}: unpaired declaration`).toBe(0);
      for (let i = 0; i < decl.length; i += 2) {
        const webkit = decl[i];
        const plain = decl[i + 1];
        if (!webkit || !plain) {
          throw new Error(`${name}: unpaired backdrop-filter declaration`);
        }
        expect(webkit.prefixed, `${name}: prefixed must come first`).toBe(true);
        expect(plain.prefixed, `${name}: unprefixed must come last`).toBe(
          false,
        );
        // Both halves of a pair must carry the same value.
        expect(webkit.value).toBe(plain.value);
      }
    },
  );

  it("keeps decorative glass out of the border business", () => {
    // A `border` shorthand here silently overrode every consumer's own border
    // colour (the header asked for `border-border` and got the dark-mode blue
    // edge on all four sides). The edge is opt-in via `glass-edge`.
    for (const name of MATERIALS) {
      expect(utilityBody(name)).not.toMatch(/(^|[\s;{])border:/);
    }
    expect(utilityBody("glass-edge")).toMatch(/border:\s*1px solid/);
  });
});

describe("globals.css layering ladder", () => {
  const rungs = [...css.matchAll(/--z-([a-z-]+):\s*(\d+);/g)].map((m) => ({
    name: m[1],
    value: Number(m[2]),
  }));

  it("defines every rung the components consume", () => {
    expect(rungs.map((r) => r.name).sort()).toEqual([
      "banner",
      "blocker",
      "dropdown",
      "header",
      "modal",
      "overlay",
      "progress",
      "skip-link",
    ]);
  });

  it("assigns each rung a distinct value", () => {
    expect(new Set(rungs.map((r) => r.value)).size).toBe(rungs.length);
  });

  it("orders the ladder so chrome sits under its own menus and overlays", () => {
    const z = Object.fromEntries(rungs.map((r) => [r.name, r.value]));
    expect(z.header).toBeLessThan(z.dropdown);
    expect(z.dropdown).toBeLessThan(z.banner);
    expect(z.banner).toBeLessThan(z.overlay);
    expect(z.overlay).toBeLessThan(z.modal);
    expect(z.modal).toBeLessThan(z.blocker);
    // The skip link is unusable if anything can cover it.
    expect(z["skip-link"]).toBe(Math.max(...rungs.map((r) => r.value)));
  });
});
