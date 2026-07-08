import { type Metadata, type Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics";
import { LazyMotionProvider } from "@/components/motion/LazyMotionProvider";
import { StructuredData } from "@/components/seo/StructuredData";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { siteConfig } from "@/lib/seo/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title.default,
    template: siteConfig.title.template,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title.default,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title.default,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title.default,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  robots: { index: true, follow: true },
};

// themeColor values mirror the `--page` background token in each theme (raw hex
// is required here — this is browser-chrome config, not UI styling).
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBFD" },
    { media: "(prefers-color-scheme: dark)", color: "#080A11" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Applies the persisted theme before first paint — must be first. */}
        <ThemeScript />
        <a
          href="#main-content"
          className="bg-surface-raised text-fg sr-only z-50 rounded-sm px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <LazyMotionProvider>{children}</LazyMotionProvider>
        </ThemeProvider>
        <StructuredData data={[organizationSchema(), websiteSchema()]} />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
