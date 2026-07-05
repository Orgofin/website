import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: replace with generateMetadata + per-page overrides once docs/product/copy.md's
// SEO titles/descriptions are wired up (see .claude/context/seo.md).
export const metadata: Metadata = {
  title: "Orgofin — The Operating System for Every Company",
  description:
    "Orgofin is the unified Company Brain and Agent-as-a-Service platform that replaces the fragmented SaaS stack with a single intelligence layer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
