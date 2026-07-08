import { env } from "@/env";

/**
 * Centralized site metadata — the single source for name, description, canonical
 * origin, and social defaults. Everything SEO-related (metadata builder,
 * sitemap, robots, structured data) reads from here so nothing is hardcoded in
 * two places.
 *
 * Canonical origin decided 2026-07-08: the apex `orgofin.com` (www redirects to
 * it). See docs/deployment/custom-domain-setup.md. `NEXT_PUBLIC_SITE_URL` is set
 * to this in Vercel Production; the fallback below keeps metadata correct in
 * builds where the var is unset. Attaching the DNS is still pending (E13.1.3).
 * TODO: confirm the real social handle; `@orgofin` is a placeholder, not a
 * verified account (never assert an unverified business fact).
 */
const FALLBACK_URL = "https://orgofin.com";

export const siteConfig = {
  name: "Orgofin",
  url: env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL,
  title: {
    default: "Orgofin — The Operating System for Every Company",
    template: "%s — Orgofin",
  },
  description:
    "Orgofin is the unified Company Brain and Agent-as-a-Service platform that replaces the fragmented SaaS stack with a single intelligence layer.",
  locale: "en_US",
  /** Default social share image (a static asset until the dynamic OG route exists). */
  ogImage: "/og/default.png",
  twitterHandle: "@orgofin",
  keywords: [
    "Orgofin",
    "Enterprise OS",
    "Company Brain",
    "AI agents",
    "AGaaS",
    "HRMS",
    "India payroll",
  ],
} as const;

/** Join a path onto the canonical origin, producing an absolute URL. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}
