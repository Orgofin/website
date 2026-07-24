# Repository Structure & Conventions

> **Purpose:** Explains the top-level layout of this entire repository, why documentation is split between `docs/` and `.claude/`, and the naming/markdown/commit conventions that apply repo-wide.
> **Applies to:** anyone (human or Claude) adding a new file anywhere in this repository, especially a new documentation file.

---

## Responsibilities

Owns: top-level folder purpose, the human-vs-AI documentation split, markdown authoring standards, and commit message conventions. Does not own frontend-specific folder structure (`frontend.md` §1 owns `src/`) or git branching strategy (`workflows.md`).

## Top-Level Layout

```
/
├── CLAUDE.md              # the constitution — auto-loaded by Claude Code, start here
├── README.md              # human-facing quick start
├── docs/                  # human documentation (see below)
├── .claude/               # AI-context documentation (see below)
├── src/                   # application code (not yet implemented — see frontend.md)
├── public/                # static assets (not yet populated)
├── design/                # design source files (Figma exports, etc. — not yet populated)
└── .github/               # CI/CD workflows (not yet populated — see workflows.md)
```

## The `docs/` vs `.claude/` Split

This is the single most important organizing principle in the repository, and the one most likely to be violated by habit if it isn't understood. The distinction is **not** "what Claude is allowed to read" — Claude reads both, same as a human would. The distinction is **purpose and audience**:

|                       | `docs/`                                                                                                           | `.claude/`                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Primary audience**  | Humans — founders, future hires, investors reading a specific artifact                                            | Claude (and any engineer wanting the standing rule, not the artifact)                                      |
| **Nature of content** | Point-in-time artifacts and records: business facts, product requirements, architecture decisions, copy, runbooks | Living, standing instructions: conventions, philosophy, domain-concept reference consulted on _every_ task |
| **Changes when...**   | ...a business fact changes, a decision is made, a runbook step changes                                            | ...a coding/design/writing convention changes                                                              |
| **Example**           | `docs/product/company.md` (what Orgofin _is_, as a business fact)                                                 | `.claude/context/branding.md` (the _rule_ for how to write about it)                                       |

**Rule of thumb:** if you're about to write "here's what we decided" or "here's a fact about the business," it's `docs/`. If you're about to write "here's the rule to follow every time," it's `.claude/context/`. If you're capturing a recurring product _concept_ Claude needs to reference constantly when writing copy or features (Company Brain, HRMS, AGaaS), it's `.claude/knowledge/` — distinct from `docs/product/company.md`, which is the business overview, not the concept deep-dive.

## `docs/` Structure

```
docs/
├── product/            # PRD, business vision, website strategy, copy, source PDF
├── architecture/       # long-term full-platform architecture (not this repo's implementation)
├── adr/                # Architecture Decision Records — dated, point-in-time technical decisions
├── deployment/         # human runbooks (environment list, rollback steps, go-live procedures)
├── security/           # security audit, architecture, test suite, implemented-control records
├── legal/              # factual inputs for legal pages (data-processing inventory) — never legal text
├── launch/             # production-readiness review and launch playbook
├── operations/         # monitoring, analytics, and other run-the-site concerns
├── engineering/        # engineering-practice records that aren't standing conventions
├── brand/              # logo exploration rounds and brand asset records
└── internal/           # internal-only working artifacts
```

## `.claude/` Structure

```
.claude/
├── context/            # standing engineering/design/writing conventions — read before any task
├── knowledge/           # domain-concept reference (Company Brain, HRMS, Enterprise OS, AI Agents)
└── prompts/             # reusable prompt templates for common task types
```

## Naming Conventions

- **All markdown files:** kebab-case (`frontend-architecture.md`, not `FrontendArchitecture.md` or `frontend_architecture.md`). Two named exceptions by near-universal convention: `README.md` and `CLAUDE.md` at the repository root stay uppercase.
- **ADRs:** `docs/adr/NNNN-short-title.md`, zero-padded four-digit sequence, never renumbered or reused even if an ADR is later superseded (mark it superseded in the doc body; the number stays permanent).
- **Folders:** kebab-case, plural where they hold a collection (`prompts/`, `knowledge/`), singular where they hold a single concern's files (`product/` is the exception — treated as a collection of product artifacts).

## Markdown Standards

Every substantive document in this repository (not one-line stubs) follows the same shape, so any document can be scanned the same way regardless of topic:

1. **Title** (`# H1`)
2. **Purpose/Applies-to blockquote** — one or two lines, immediately under the title
3. **Responsibilities** — what this doc owns vs. what lives elsewhere (prevents duplication by construction)
4. **Main content** — topic-specific
5. **Design Decisions** — the calls most likely to be revisited, stated explicitly so they're changed on purpose, not by drift
6. **Current Status** — what's actually true today (planned vs. implemented)
7. **Future Improvements** — known, non-urgent next steps
8. **TODO** — a checklist of genuinely open items, not aspirational filler
9. **References** — links to source material this doc was derived from
10. **Related Documents** — sibling docs, for lateral navigation
11. **Footer** — `Last Updated` (date) and `Owner` (a person/team, or `TODO: assign a DRI` if genuinely unowned)

Internal links between markdown files use relative paths and must resolve — a broken relative link in a merged PR is treated as a documentation bug, not a nitpick.

## Commit Message Conventions

Conventional Commits format: `type(scope): summary`, imperative mood, no trailing period.

- **Types:** `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`, `perf`
- **Scope** is the area touched (`docs`, `frontend`, `waitlist`, `ci`) — omit only when a change is genuinely repo-wide.
- **Body** explains _why_, not _what_ — the diff already shows what changed.
- Examples: `docs(claude): add coding standards and repository conventions`, `feat(waitlist): add company-size field to signup form`.

## Current Status

This structure was established as part of the initial documentation foundation pass (2026-07-04) — see `docs/adr/` for the record of that decision if one is added.

## Future Improvements

As `docs/product/` accumulates more artifacts (case studies, press kit, meeting notes), consider whether it needs its own subfolder split — not urgent while the folder holds fewer than ~10 files.

## TODO

- [ ] Once `.github/` gets its first workflow file, confirm this document's top-level tree stays accurate in the same PR.

## References

- [`CLAUDE.md`](../../CLAUDE.md) — the constitution this document supports

## Related Documents

- [`workflows.md`](./workflows.md)
- [`coding-standards.md`](./coding-standards.md)

---

**Last Updated:** 2026-07-04
**Owner:** Orgofin Engineering (TODO: assign a DRI)
