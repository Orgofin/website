"use client";

import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useConsent } from "@/hooks/useConsent";

/**
 * Analytics-consent banner. Copy is `docs/product/copy.md` §18 verbatim
 * ("We use cookies to understand how people experience Orgofin — nothing
 * more." · Accept · Only Essential · Read our Privacy Policy) — drafted there
 * long before this shipped.
 *
 * Renders only when the visitor has not decided, and only after mount: the
 * server cannot know a decision stored in `localStorage`, so rendering it
 * server-side would flash the banner at every returning visitor who had
 * already dismissed it.
 *
 * **Accessibility — a `region` landmark, not a `dialog`.** It does not trap
 * focus, does not block the page, and deliberately does not steal focus on
 * load: a visitor reading the page should not have the caret yanked out from
 * under them, and the site is fully usable without deciding. A `role="dialog"`
 * would assert a modality that isn't there, and autofocusing it would fail the
 * "no unexpected focus change" expectation in `accessibility.md`. As a named
 * landmark it is reachable by rotor/landmark navigation and by Tab, and it sits
 * last in the layout so Tab order matches its visual position.
 *
 * Declining is exactly as easy as accepting — same size, same weight, adjacent.
 * The privacy page's §10 promise that the site "works exactly as before" is
 * literally true: nothing here gates content.
 */
export function ConsentBanner() {
  const { consent, mounted, accept, reject } = useConsent();

  if (!mounted || consent !== "unset") return null;

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in-0 fixed inset-x-0 bottom-0 z-40 motion-safe:duration-[var(--motion-base)]"
    >
      <Container className="pb-4">
        <div className="glass-surface border-border shadow-elevation-2 flex flex-col gap-4 rounded-md border p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <Text size="body-sm" tone="muted" className="text-pretty">
            We use cookies to understand how people experience Orgofin — nothing
            more.{" "}
            <Link
              href="/privacy"
              className="text-accent hover:text-accent-hover underline underline-offset-4"
            >
              Read our Privacy Policy
            </Link>
          </Text>
          <div className="flex shrink-0 gap-3">
            <Button size="sm" variant="secondary" onClick={reject}>
              Only Essential
            </Button>
            <Button size="sm" variant="primary" onClick={accept}>
              Accept
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
