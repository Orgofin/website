import { type MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

/**
 * Programmatic sitemap. Only the home route exists today; as pages ship, add
 * them here with the priority tiers from information-architecture.md §7 (Home
 * 1.0 → Products/Company Brain/Vision 0.8 → …). Keep this in lockstep with the
 * actual `app/` routes — a drifting sitemap is a documentation/SEO bug.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
