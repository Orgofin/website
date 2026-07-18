"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Caption } from "@/components/ui/Caption";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = NavLink & {
  /** Present for dropdown clusters — the architecture supports nesting today
      even though the real menu is populated in a later phase. */
  items?: NavLink[];
};

export type NavbarProps = {
  items?: NavItem[];
  cta?: NavLink;
  /** Brand mark; defaults to a text wordmark placeholder. */
  logo?: React.ReactNode;
};

/**
 * Nav items per information-architecture.md §2, wired to real routes as each
 * page ships — `#` entries are placeholders for pages that don't exist yet
 * (dropdown clusters, flat links, active state, sticky behaviour, mobile menu
 * are all already proven).
 */
const DEFAULT_ITEMS: NavItem[] = [
  { label: "Platform", href: "#", items: [{ label: "Overview", href: "#" }] },
  { label: "Vision", href: "/vision" },
  { label: "Investors", href: "/investors" },
  { label: "Company", href: "#", items: [{ label: "About", href: "#" }] },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "#" || href === "") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Site navigation bar. Responsive, sticky, keyboard-accessible, with dropdown
 * and mobile-menu architecture in place. Content is intentionally placeholder.
 */
export function Navbar({ items = DEFAULT_ITEMS, cta, logo }: NavbarProps) {
  const pathname = usePathname();
  const { y } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = y > 4;

  return (
    <header
      className={cn(
        "ease-standard sticky top-0 z-40 w-full border-b transition-colors duration-[var(--motion-base)]",
        scrolled ? "glass-surface border-border" : "bg-page border-transparent",
      )}
    >
      <Container>
        <nav
          className="flex h-16 items-center justify-between gap-4"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label="Orgofin home"
          >
            {logo ?? <Logo />}
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-1 lg:flex">
            {items.map((item) =>
              item.items && item.items.length > 0 ? (
                <li key={item.label}>
                  <NavDropdown item={item} pathname={pathname} />
                </li>
              ) : (
                <li key={item.label}>
                  <NavBarLink
                    link={item}
                    active={isActivePath(pathname, item.href)}
                  />
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-2">
            {cta && (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
            <ThemeToggle />

            {/* Mobile menu */}
            <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu size={20} aria-hidden="true" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="glass-surface data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed top-0 right-0 z-50 flex h-full w-80 max-w-[80vw] flex-col gap-1 p-6">
                  <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Site navigation links
                  </Dialog.Description>
                  <div className="flex flex-col gap-1 overflow-y-auto pt-8">
                    {items.map((item) => (
                      <MobileNavGroup
                        key={item.label}
                        item={item}
                        pathname={pathname}
                      />
                    ))}
                  </div>
                  {cta && (
                    <Dialog.Close asChild>
                      <Button asChild className="mt-4 w-full">
                        <Link href={cta.href}>{cta.label}</Link>
                      </Button>
                    </Dialog.Close>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </nav>
      </Container>
    </header>
  );
}

function NavBarLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-heading-sm ease-standard hover:bg-surface rounded-sm px-3 py-2 transition-colors duration-[var(--motion-fast)]",
        active ? "text-fg" : "text-fg-muted hover:text-fg",
      )}
    >
      {link.label}
    </Link>
  );
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        className="text-fg-muted hover:text-fg text-heading-sm ease-standard hover:bg-surface inline-flex items-center gap-1 rounded-sm px-3 py-2 transition-colors duration-[var(--motion-fast)]"
      >
        {item.label}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={cn(
            "ease-standard transition-transform duration-[var(--motion-fast)]",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="glass-surface shadow-elevation-3 absolute top-full left-0 mt-1 min-w-48 rounded-md p-1">
          <ul>
            {item.items?.map((sub) => (
              <li key={sub.label}>
                <Link
                  href={sub.href}
                  aria-current={
                    isActivePath(pathname, sub.href) ? "page" : undefined
                  }
                  className="text-fg-muted hover:text-fg hover:bg-surface text-body-sm block rounded-sm px-3 py-2 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  if (!item.items || item.items.length === 0) {
    return (
      <Dialog.Close asChild>
        <Link
          href={item.href}
          aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
          className="text-fg hover:bg-surface text-heading-sm rounded-sm px-3 py-2.5"
        >
          {item.label}
        </Link>
      </Dialog.Close>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 py-1">
      <Caption as="p" className="px-3 pt-2 uppercase">
        {item.label}
      </Caption>
      {item.items.map((sub) => (
        <Dialog.Close asChild key={sub.label}>
          <Link
            href={sub.href}
            aria-current={isActivePath(pathname, sub.href) ? "page" : undefined}
            className="text-fg-muted hover:text-fg hover:bg-surface text-body-md rounded-sm px-3 py-2"
          >
            {sub.label}
          </Link>
        </Dialog.Close>
      ))}
    </div>
  );
}
