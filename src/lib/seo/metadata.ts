import { type Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/seo/site";

export type CreateMetadataInput = {
  /** Page title WITHOUT the site suffix — the template adds "— Orgofin". */
  title?: string;
  description?: string;
  /** Canonical path for this page, e.g. "/vision". Defaults to "/". */
  path?: string;
  /** Absolute URL or root-relative path to the share image. */
  image?: string;
  /** Exclude from search indexing (e.g. gated pages). */
  noindex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
};

/**
 * Builds a complete Next.js `Metadata` object with consistent Open Graph,
 * Twitter Card, canonical, and robots configuration. Per-page code supplies
 * only what differs; defaults come from `siteConfig` (seo.md rule 1: every page
 * has a unique title + description; frontend.md §6).
 */
export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  noindex = false,
  keywords,
  type = "website",
}: CreateMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const resolvedTitle = title
    ? `${title} — ${siteConfig.name}`
    : siteConfig.title.default;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: title ?? siteConfig.title.default,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: { canonical: url },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
    openGraph: {
      type,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: resolvedTitle,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: resolvedTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
      creator: siteConfig.twitterHandle,
    },
  };
}
