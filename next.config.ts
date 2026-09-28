import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy. Pages are statically generated, so this uses 'unsafe-inline'
 * for scripts rather than per-request nonces (which would make every page dynamic).
 * Third parties allowed, and why:
 * - challenges.cloudflare.com: Turnstile on the quote form and quick estimate
 * - assets.calendly.com / calendly.com: the "Book a call" popup
 * - googletagmanager.com / google-analytics.com: GA4, only when NEXT_PUBLIC_GA_ID is set
 * - vercel.com / *.blob.vercel-storage.com: attachment uploads to Vercel Blob
 * - vercel.live: the Vercel preview toolbar
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://assets.calendly.com https://www.googletagmanager.com https://vercel.live`,
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.googletagmanager.com https://*.google-analytics.com https://vercel.live https://vercel.com",
  "font-src 'self' data: https://vercel.live",
  "connect-src 'self' https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://vercel.com https://*.blob.vercel-storage.com https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://challenges.cloudflare.com https://calendly.com https://vercel.live",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // add remotePatterns here if you later load images from a CMS
  },
  async redirects() {
    return [{ source: "/get-a-quote", destination: "/contact", permanent: true }];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
