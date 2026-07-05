import { type MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

/**
 * Robots policy. API routes and the gated investor data room are disallowed
 * (seo.md rule 4). Extend `disallow` as further gated routes are added.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/investors/data-room"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
