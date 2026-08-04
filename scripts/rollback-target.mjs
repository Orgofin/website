#!/usr/bin/env node
/**
 * Prints the current production commit and the one to roll back to.
 *
 * This exists because the answer used to be written down. It was wrong twice
 * — a recorded SHA goes stale on *every* promotion, not just the launch
 * deploy, and correcting it by hand cost a full four-PR promotion cycle on
 * 2026-07-30 (#156) and again on 2026-08-01 (#165). A value that has to be
 * re-verified every cycle to stay true is a procedure wearing a value's
 * clothing, so it is now derived at the moment it is needed.
 *
 * ⚠️ Git is the *cross-check*, not the authority. Vercel's Production
 * deployment list is authoritative, because it contains only deployments that
 * actually built and can actually be promoted. `main` can in principle carry a
 * commit whose deploy failed. Use this to confirm the identity of what you are
 * about to promote — not to choose it blind.
 *
 * Usage: npm run rollback-target
 */

import { execFileSync } from "node:child_process";

const RESET = "[0m";
const BOLD = "[1m";
const DIM = "[2m";
const YELLOW = "[33m";

/**
 * Never throws — a rollback tool that crashes at 3am is worse than useless —
 * but it does not swallow the reason either. A silent `catch` here cost real
 * debugging time while this script was being written: it reported "could not
 * read git history" for a failure that had nothing to do with git history.
 */
const gitErrors = [];
function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    gitErrors.push(
      `git ${args.join(" ")} → ${String(error.message).split("\n")[0]}`,
    );
    return null;
  }
}

function main() {
  // Prefer the remote ref: a stale local `main` is exactly the trap this tool
  // exists to avoid, and someone reaching for it is probably not on `main`.
  const fetched = git(["fetch", "origin", "main", "--quiet"]) !== null;
  const ref = git(["rev-parse", "--verify", "origin/main"])
    ? "origin/main"
    : "main";

  if (!fetched) {
    console.log(
      `${YELLOW}! could not reach origin — reading local ${ref}, which may be behind${RESET}\n`,
    );
  }

  const log = git([
    "log",
    ref,
    "-3",
    "--first-parent",
    "--date=short",
    "--pretty=%h%x09%ad%x09%s",
  ]);

  if (!log) {
    console.error(
      "Could not read git history. Fall back to Vercel → Deployments → " +
        "filter Production; the entry directly below Current is the target.\n",
    );
    for (const e of gitErrors) console.error(`  ${e}`);
    process.exitCode = 1;
    return;
  }

  const rows = log.split("\n").map((line) => {
    const [sha, date, subject] = line.split("	");
    return { sha, date, subject };
  });

  const [current, previous] = rows;

  console.log(`${BOLD}Currently in production${RESET}`);
  console.log(`  ${current.sha}  ${current.date}  ${current.subject}\n`);

  if (!previous) {
    console.log(
      `${YELLOW}No predecessor on ${ref} — nothing to roll back to.${RESET}`,
    );
    return;
  }

  console.log(`${BOLD}Roll back to${RESET}`);
  console.log(
    `  ${BOLD}${previous.sha}${RESET}  ${previous.date}  ${previous.subject}\n`,
  );

  if (rows[2]) {
    console.log(
      `${DIM}  (one further back: ${rows[2].sha}  ${rows[2].subject})${RESET}\n`,
    );
  }

  console.log(`${BOLD}How to actually roll back${RESET}`);
  console.log(
    "  1. Vercel → Deployments → filter Production. The entry below Current",
  );
  console.log(
    `     should be ${previous.sha}. ${BOLD}Vercel's list is authoritative${RESET} — if it`,
  );
  console.log("     disagrees with the above, trust Vercel and promote that.");
  console.log("  2. Use 'Promote to Production' — do not revert and redeploy;");
  console.log(
    "     promoting an existing build is faster and already verified.",
  );
  console.log(
    "  3. Re-run the production sweep afterwards (docs/launch/launch-playbook.md).",
  );
}

main();
