import type { NextConfig } from "next";

/**
 * HTTP security headers applied to every response.
 *
 * Rationale, per-header, lives in docs/security/security-headers-and-csp.md.
 * The short version:
 *  - We keep the site statically generated (Lighthouse 95+ is a hard target),
 *    so the CSP is a STATIC policy set here rather than a per-request nonce
 *    (a nonce forces dynamic rendering — see the doc's "Trade-offs").
 *  - `script-src` therefore allows `'unsafe-inline'`: the app ships two inline
 *    scripts we control (the pre-paint ThemeScript and the escaped JSON-LD
 *    blob) plus GA4's bootstrap via @next/third-parties. Nonce/hash-based
 *    tightening is the documented future improvement.
 *  - Every other directive is locked down to `'self'` + the exact third-party
 *    origins the app actually talks to (Supabase, Google Analytics).
 */
const CONTENT_SECURITY_POLICY = [
  // Deny-by-default: anything not explicitly allowed below is blocked.
  "default-src 'self'",
  // Scripts: our own bundle + inline theme/JSON-LD scripts + GA4 loader.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com",
  // Styles: Tailwind's stylesheet + inline styles set by Framer Motion and
  // React (style attributes are governed by style-src).
  "style-src 'self' 'unsafe-inline'",
  // Images: self, data/blob URIs (inline SVG/canvas), and GA's tracking pixel.
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  // Fonts: Geist is self-hosted by next/font — no external font origin needed.
  "font-src 'self' data:",
  // XHR/fetch/websocket: our API + Supabase (REST + storage) + GA collect.
  "connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com",
  // We embed no third-party frames.
  "frame-src 'none'",
  // Clickjacking: this site may never be framed by anyone.
  "frame-ancestors 'none'",
  // No <object>/<embed>/<applet>.
  "object-src 'none'",
  // Restrict <base href> so an injection can't repoint relative URLs.
  "base-uri 'self'",
  // Forms may only submit to our own origin.
  "form-action 'self'",
  // Force any accidental http:// subresource up to https.
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    // Force HTTPS for two years, cover subdomains, and allow preload-list
    // inclusion. Mitigates SSL-strip/downgrade and cookie-over-http leaks.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // The policy above. Defense-in-depth against XSS and data exfiltration.
    key: "Content-Security-Policy",
    value: CONTENT_SECURITY_POLICY,
  },
  {
    // Belt-and-suspenders with CSP frame-ancestors for older browsers.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Stop MIME-sniffing — a text/plain upload can't be executed as script.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Send origin (not full path/query) cross-site; full URL same-origin.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disable powerful features the marketing site never uses, and opt out of
    // FLoC/Topics advertising cohorts.
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
  },
  {
    // Isolate our browsing context group from cross-origin popup tampering.
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  // Never advertise the framework version in the response.
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Apply the baseline to every route.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
