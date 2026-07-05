# SEO Strategy

> **Purpose:** The SEO rules Claude must follow on every page — what's non-negotiable and why. For Next.js implementation mechanics (which API, which file), see [`frontend.md`](./frontend.md) §6.
> **Applies to:** anyone (human or Claude) adding a page, blog post, or route.

---

## Responsibilities

Owns the SEO _policy_ — what must be true of every page. `frontend.md` §6 owns the _implementation_ (which Next.js APIs deliver it). `information-architecture.md` owns the actual route/sitemap inventory these rules apply to.

## Non-Negotiable Rules

1. **Every page has a unique title and meta description** — sourced from [`docs/product/copy.md`](../../docs/product/copy.md), which already has these drafted per page. Never ship a page with a default/generic title.
2. **One `<h1>` per page**, matching the page's primary intent — heading levels reflect document structure, never visual size (use design tokens for size, per `design-system.md` §1).
3. **No duplicate content without a canonical.** The known risk case: Home's Chapter 9 (Vision teaser) vs. the full `/vision` page — `/vision` is canonical, Home's version must be unique summary copy, not a repeated block (see `information-architecture.md` §7).
4. **Gated pages are excluded from indexing.** `/investors/data-room` ships `noindex, nofollow` — it's a lead-gated page, not public content.
5. **Structured data is mandatory, not optional,** for: `Organization` (site-wide), `Article` (every blog post), `BreadcrumbList` (Blog, Products), `JobPosting` (Careers, once real roles exist).
6. **Everything SEO-relevant is server-rendered/statically generated.** No content that matters for ranking lives only inside a client-only interactive component — see the Company Brain graph's accessible/crawlable fallback requirement in `accessibility.md`.
7. **The blog is the SEO growth engine, not an afterthought.** Category taxonomy (Compliance Guides, Product & Engineering, Vision, Company News — per `docs/product/copy.md` §12) exists from the first post, not retrofitted at post #40.

## Current Status

Policy defined. No pages exist yet to audit against these rules.

## Future Improvements

Once the site is live, add a recurring SEO audit cadence here (e.g., quarterly Lighthouse/Search Console review) — not meaningful to schedule before there's anything indexed.

## TODO

- [ ] Confirm the canonical domain (apex vs. `www`) before the sitemap/robots files are generated.
- [ ] Decide whether blog posts get a dedicated author schema once real authors exist.

## References

- [`frontend.md`](./frontend.md) §6
- [`information-architecture.md`](./information-architecture.md) §7
- [`docs/product/copy.md`](../../docs/product/copy.md) — per-page SEO titles/descriptions already drafted

## Related Documents

- [`accessibility.md`](./accessibility.md)
- [`information-architecture.md`](./information-architecture.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
