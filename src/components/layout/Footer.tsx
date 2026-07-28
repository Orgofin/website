import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Caption } from "@/components/ui/Caption";
import { Text } from "@/components/ui/Text";
import { LEGAL_ENTITY_NAME } from "@/lib/legal/constants";
import { cn } from "@/lib/utils";

export type FooterColumn = {
  heading: string;
  links: { label: string; href: string }[];
};

export type FooterProps = {
  columns?: FooterColumn[];
  className?: string;
};

/**
 * Site footer. Column structure and labels come from `docs/product/copy.md`
 * §19 / `information-architecture.md` §4, filtered to routes that actually
 * exist — a column gains links as its pages ship (Platform/Legal render once
 * their first page does), so the footer never links a 404. Still pending
 * business facts from the founders (tracked in the backlog): social profile
 * URLs and the newsletter block. The © line's entity name is no longer one of
 * them structurally — it reads `LEGAL_ENTITY_NAME`, so confirming the
 * registered entity is a one-line change in `lib/legal/constants.ts`.
 */
const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "Overview", href: "/platform" },
      { label: "Company Brain", href: "/company-brain" },
      { label: "Products", href: "/products" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Vision", href: "/vision" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Investors",
    links: [
      { label: "Investors", href: "/investors" },
      { label: "Data Room", href: "/investors/data-room" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer({ columns = DEFAULT_COLUMNS, className }: FooterProps) {
  const year = new Date().getFullYear();

  /**
   * Assembled as ONE string rather than interpolated across JSX text, for the
   * same reason `LEGAL_ENTITY_DEFINED` is (see `lib/legal/constants.ts`): the
   * space between `{year}` and the entity name is JSX whitespace, and a
   * reformat that reflows this line can drop it silently — which is exactly
   * how both legal pages shipped reading `Orgofin(“we”…)` on 2026-07-24. A
   * template literal puts it beyond JSX whitespace handling entirely.
   */
  const copyright = `© ${year} ${LEGAL_ENTITY_NAME}. All rights reserved. · India → UK → USA`;

  return (
    <footer className={cn("border-border mt-auto border-t", className)}>
      <Container>
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-4 lg:col-span-2">
            <Logo />
            <Text size="body-sm" tone="muted" className="max-w-xs">
              The Operating System for Every Company.
            </Text>
          </div>

          {columns.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="flex flex-col gap-3"
            >
              <Caption as="p" className="uppercase">
                {column.heading}
              </Caption>
              <ul className="flex flex-col gap-2">
                {column.links.map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <Link
                      href={link.href}
                      className="text-fg-muted hover:text-fg text-body-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-border flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row">
          {/* Renders the trading name until the registered entity name is
              confirmed (business fact, founders to confirm — backlog
              Business-Fact Placeholders); it changes here by changing
              `LEGAL_ENTITY_NAME`, which the legal pages read too. */}
          <Caption>{copyright}</Caption>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
}
