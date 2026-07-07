/** Barrel export for SEO utilities. */
export { siteConfig, absoluteUrl } from "@/lib/seo/site";
export { createMetadata, type CreateMetadataInput } from "@/lib/seo/metadata";
export {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  articleSchema,
  type JsonLd,
  type BreadcrumbItem,
  type ArticleSchemaInput,
} from "@/lib/seo/structured-data";
export {
  StructuredData,
  type StructuredDataProps,
} from "@/components/seo/StructuredData";
