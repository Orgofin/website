import { type MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

/**
 * Web app manifest (served at /manifest.webmanifest, auto-linked by Next).
 * Enables install-to-home-screen and provides the maskable app icons. Icons
 * live in `public/` and are generated from the Eclipse mark (see
 * docs/brand/brand-assets.md). `theme_color` is the Cobalt Prime accent; keep
 * it in sync with the brand colour if it changes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAFBFD",
    theme_color: "#1e63f0",
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
