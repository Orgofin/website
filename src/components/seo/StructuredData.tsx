import { type JsonLd } from "@/lib/seo/structured-data";

export type StructuredDataProps = {
  data: JsonLd | JsonLd[];
};

/**
 * Renders JSON-LD structured data. `<` is escaped so a malicious string in the
 * data can't break out of the script tag. Server component — the markup is
 * present in the initial HTML for crawlers.
 */
export function StructuredData({ data }: StructuredDataProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
