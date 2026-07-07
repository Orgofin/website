import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Caption } from "@/components/ui/Caption";
import { Text } from "@/components/ui/Text";
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
 * Site footer — structure only. Real link columns are populated in a later
 * phase (information-architecture.md §4); these are placeholders proving the
 * layout: brand block, link columns, and a bottom utility bar.
 */
const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "Placeholder", href: "#" },
      { label: "Placeholder", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Placeholder", href: "#" },
      { label: "Placeholder", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Placeholder", href: "#" },
      { label: "Placeholder", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Placeholder", href: "#" },
      { label: "Placeholder", href: "#" },
    ],
  },
];

export function Footer({ columns = DEFAULT_COLUMNS, className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-border mt-auto border-t", className)}>
      <Container>
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-3 lg:col-span-2">
            <span className="text-heading-md text-fg font-semibold">
              Orgofin
            </span>
            <Text size="body-sm" tone="muted" className="max-w-xs">
              The Operating System for Every Company. (Placeholder mission —
              final copy per docs/product/copy.md.)
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
          <Caption>© {year} Orgofin · India → UK → USA</Caption>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
}
