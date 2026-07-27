import { type MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

/**
 * Web app manifest (served at /manifest.webmanifest, auto-linked by Next).
 * Enables install-to-home-screen and provides the maskable app icons. Icons
 * live in `public/brand/` with the rest of the brand assets, and are rasterised
 * from the delivered brand mark, which
 * carries its own opaque tile (see docs/brand/brand-assets.md) — that tile is
 * why they work on an unknown home-screen wallpaper. `theme_color` is the
 * Cobalt Prime accent, which deliberately differs from the mark's own blue; see
 * that doc's TODO on whether the two should converge.
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
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
