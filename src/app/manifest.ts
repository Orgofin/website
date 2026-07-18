import { type MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

/**
 * Web app manifest (served at /manifest.webmanifest, auto-linked by Next).
 * Enables install-to-home-screen and provides the maskable app icons. Icons
 * live in `public/` and are generated from the Eclipse mark (see
 * docs/brand/brand-assets.md). `theme_color` is the brand indigo; keep it in
 * sync with the palette decision and the `<meta name="theme-color">` in the
 * root layout if the brand colour changes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAFBFD",
    theme_color: "#4F46E5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
