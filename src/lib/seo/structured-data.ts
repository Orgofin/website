import { absoluteUrl, siteConfig } from "@/lib/seo/site";

/** A JSON-LD node. Loosely typed — schema.org has no official TS types. */
export type JsonLd = Record<string, unknown>;

/** schema.org `Organization` — belongs in the root layout, site-wide. */
export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl("/logo.png"),
  };
}

/** schema.org `WebSite` — enables the sitelinks search box eligibility. */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export type BreadcrumbItem = { name: string; path: string };

/** schema.org `BreadcrumbList` — for Blog/Products hierarchies. */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
};

/** schema.org `Article` — for every blog post. */
export function articleSchema(input: ArticleSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Organization",
      name: input.authorName ?? siteConfig.name,
    },
    publisher: { "@type": "Organization", name: siteConfig.name },
    image: input.image
      ? input.image.startsWith("http")
        ? input.image
        : absoluteUrl(input.image)
      : absoluteUrl(siteConfig.ogImage),
  };
}
