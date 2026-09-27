# PixarByte Website: Technical Architecture

This document defines the foundation every page builds on: the tech stack, folder structure, shared components, data layer, SEO system, and deployment. The page-specific docs (`tech-01` to `tech-06`) assume everything here is in place.

> **Version note:** Written for the Next.js **App Router** (Next.js 15/16). Check the official docs at nextjs.org/docs for the current stable version before starting, and pin exact versions in `package.json`.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | Server Components, static generation, built-in SEO metadata, image optimization |
| Language | **TypeScript** (strict mode) | Type safety across data, components, and forms |
| Styling | **Tailwind CSS v4** | Fast styling, CSS-first theme config, small production CSS |
| UI primitives | **shadcn/ui** (Radix-based) | Accessible accordion, tabs, dialog, select, dropdown menu |
| Icons | **lucide-react** | Consistent, tree-shakeable icons |
| Animation | **Motion** (formerly Framer Motion) | Scroll reveals, counters, filter animations |
| Content | **Typed TS data files** + **MDX** (case studies, blog) | No CMS cost at launch; easy to migrate later |
| Forms | **React Hook Form** + **Zod** + **Server Actions** | Client + server validation from one schema |
| Email | **Resend** + **React Email** | Lead notifications and auto-replies |
| Spam protection | **Cloudflare Turnstile** | Invisible, privacy-friendly CAPTCHA |
| Analytics | **Google Analytics 4** via `@next/third-parties`, or **Vercel Analytics** | Traffic + conversion tracking |
| Hosting | **Vercel** | Zero-config Next.js hosting, preview deploys, edge CDN |
| Lint/format | ESLint, Prettier, `prettier-plugin-tailwindcss` | Consistent code |
| Testing | **Vitest** + Testing Library (unit), **Playwright** (E2E) | Confidence before deploy |

**Optional later:** Headless CMS (Sanity, Payload, or Strapi) once non-developers need to edit content. The data layer below is designed so you can swap the source without touching components.

---

## 2. Project Setup

```bash
npx create-next-app@latest pixarbyte --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd pixarbyte

# UI
npx shadcn@latest init
npx shadcn@latest add button accordion tabs dialog select checkbox radio-group input textarea label sheet navigation-menu badge card

# Libraries
npm i motion lucide-react react-hook-form zod @hookform/resolvers resend @react-email/components \
      next-mdx-remote gray-matter reading-time @next/third-parties clsx tailwind-merge

# Dev
npm i -D prettier prettier-plugin-tailwindcss vitest @testing-library/react @playwright/test
```

---

## 3. Folder Structure

```
pixarbyte/
├── public/
│   ├── images/            # static images (team, projects, logos)
│   ├── logos/clients/     # client logos (SVG preferred)
│   └── og/                # fallback Open Graph images
├── content/
│   ├── case-studies/      # *.mdx case study files
│   └── blog/              # *.mdx blog posts
├── src/
│   ├── app/
│   │   ├── layout.tsx               # root layout (fonts, header, footer)
│   │   ├── page.tsx                 # Home
│   │   ├── globals.css
│   │   ├── not-found.tsx            # 404
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx      # default dynamic OG image
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── portfolio/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── actions.ts           # server action for quote form
│   │   ├── thank-you/page.tsx
│   │   ├── blog/…
│   │   └── (legal)/privacy/page.tsx, terms/page.tsx
│   ├── components/
│   │   ├── layout/        # Header, Footer, MobileNav, WhatsAppButton
│   │   ├── sections/      # reusable page sections (Hero, CTABanner, FAQ…)
│   │   ├── ui/            # shadcn components
│   │   └── shared/        # Container, SectionHeading, JsonLd, Reveal, Counter
│   ├── data/              # typed site content (services, team, pricing…)
│   ├── lib/               # utils, content loaders, seo helpers, validation schemas
│   ├── emails/            # React Email templates
│   └── types/             # shared TS types
├── .env.local
├── next.config.ts
└── package.json
```

**Rule:** `app/` files stay thin. They fetch data and compose sections from `components/sections/`. Business logic lives in `lib/`, content in `data/` and `content/`.

---

## 4. Configuration

### `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // add remotePatterns here if you later load images from a CMS
  },
  async redirects() {
    return [{ source: "/get-a-quote", destination: "/contact", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Environment variables (`.env.local`)
```
NEXT_PUBLIC_SITE_URL=https://pixarbyte.com
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
RESEND_API_KEY=...
LEAD_NOTIFY_EMAIL=hello@pixarbyte.com
NEXT_PUBLIC_WHATSAPP_NUMBER=92XXXXXXXXXX
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/pixarbyte/consultation
```
Never prefix secrets with `NEXT_PUBLIC_`; those are exposed to the browser.

### Site config (`src/data/site.ts`)
Single source of truth for brand info reused across header, footer, SEO, and schema.
```ts
export const siteConfig = {
  name: "PixarByte",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixarbyte.com",
  description:
    "PixarByte builds websites, mobile apps, no-code solutions, and cloud systems for individuals and businesses.",
  email: "hello@pixarbyte.com",
  phone: "+92 XXX XXXXXXX",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  address: "Office address, Rawalpindi, Pakistan",
  hours: "Mon–Sat, 10:00–19:00 PKT",
  socials: {
    linkedin: "https://linkedin.com/company/pixarbyte",
    github: "https://github.com/pixarbyte",
    instagram: "https://instagram.com/pixarbyte",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
```

---

## 5. Design System (Tailwind v4)

Tailwind v4 uses CSS-first configuration in `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-50:  #eef4ff;
  --color-brand-500: #4f6bff;   /* primary – replace with your brand color */
  --color-brand-600: #3b54e6;
  --color-accent-500: #14d4b4;
  --color-ink-900:   #0b1020;   /* headings */
  --color-ink-600:   #4a5170;   /* body text */

  --font-heading: var(--font-sora), ui-sans-serif, system-ui, sans-serif;
  --font-body:    var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  --radius-card: 1rem;
}

@layer base {
  body { @apply bg-white text-ink-600 font-body antialiased; }
  h1, h2, h3, h4 { @apply font-heading text-ink-900 tracking-tight; }
}
```

Then use classes like `bg-brand-500`, `text-ink-900`, `font-heading`, `rounded-card`.

### Fonts (`src/app/layout.tsx`)
```ts
import { Inter, Sora } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora  = Sora({ subsets: ["latin"], variable: "--font-sora",  display: "swap" });
```
`next/font` self-hosts fonts, eliminating layout shift and external requests.

---

## 6. Root Layout

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | Web, Mobile & Cloud Software Development`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { type: "website", siteName: siteConfig.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#4f6bff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <JsonLd data={organizationSchema()} />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
```

---

## 7. Shared Components

### Layout components (`components/layout/`)

| Component | Type | Responsibilities |
|---|---|---|
| `Header` | Server wrapper + client `HeaderShell` | Renders logo, nav, CTA. `HeaderShell` (client) listens to scroll to add shrink/shadow class. |
| `DesktopNav` | Client | shadcn `NavigationMenu`; Services dropdown built from `data/services.ts`. |
| `MobileNav` | Client | shadcn `Sheet` (slide-over), hamburger trigger, closes on route change via `usePathname`. |
| `Footer` | Server | 4 columns from `siteConfig` and `services`, newsletter form, legal links. |
| `WhatsAppButton` | Server | Fixed link to `https://wa.me/${number}?text=...` with `aria-label`. |

Header scroll logic:
```tsx
"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={cn("sticky top-0 z-40 transition-all bg-white/80 backdrop-blur",
      scrolled ? "py-2 shadow-sm" : "py-4")}>
      {children}
    </header>
  );
}
```

### Shared building blocks (`components/shared/`)

| Component | Purpose |
|---|---|
| `Container` | Max-width wrapper (`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`) |
| `Section` | Vertical padding + optional background variant + `id` for anchors |
| `SectionHeading` | Eyebrow text, H2, subtext; alignment prop |
| `Reveal` | Client wrapper using Motion `whileInView` for fade-up on scroll; respects `prefers-reduced-motion` |
| `Counter` | Client animated number (count-up once in view) |
| `JsonLd` | Renders `<script type="application/ld+json">` |
| `Breadcrumbs` | Visual breadcrumb + BreadcrumbList schema |

### Reusable sections (`components/sections/`)
Used across multiple pages, so build them once:
`PageHero`, `CTABanner`, `FAQSection`, `TestimonialsSection`, `StatsSection`, `ProcessSection`, `TechStackSection`, `ClientLogos`, `ProjectCard`, `ServiceCard`.

**Server vs client rule:** Everything is a Server Component by default. Only mark `"use client"` on the smallest interactive leaf (carousel, filter, counter, form). This keeps JavaScript bundles small.

---

## 8. Data Layer

### Types (`src/types/content.ts`)
```ts
export type ServiceSlug =
  | "frontend-development" | "backend-development" | "full-stack-development"
  | "no-code-development" | "mobile-app-development" | "cloud-services";

export interface FAQ { question: string; answer: string }

export interface Testimonial {
  quote: string; name: string; role: string; company?: string;
  avatar?: string; rating?: 1 | 2 | 3 | 4 | 5; service?: ServiceSlug;
}

export interface Tech { name: string; logo: string; category: "frontend" | "backend" | "mobile" | "nocode" | "cloud" | "database" }
```

### Loader functions (`src/lib/content.ts`)
Components never import raw data directly; they call loader functions. When you move to a CMS, only this file changes.
```ts
import { services } from "@/data/services";
export async function getServices() { return services; }
export async function getServiceBySlug(slug: string) { return services.find(s => s.slug === slug) ?? null; }
```

---

## 9. SEO System

### Per-page metadata
Every `page.tsx` exports `metadata` (static) or `generateMetadata` (dynamic). The root `title.template` appends "| PixarByte" automatically.

### Helper (`src/lib/seo.ts`)
```ts
import type { Metadata } from "next";
export function buildMetadata({ title, description, path, image }:
  { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: image ? [image] : undefined },
    twitter: { title, description, images: image ? [image] : undefined },
  };
}
```

### `src/app/sitemap.ts`
```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getServices } from "@/lib/content";
import { getCaseStudies } from "@/lib/case-studies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes = ["", "/services", "/portfolio", "/about", "/pricing", "/contact", "/blog"]
    .map(p => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 }));
  const services = (await getServices()).map(s => ({ url: `${base}/services/${s.slug}`, priority: 0.9 }));
  const cases = (await getCaseStudies()).map(c => ({ url: `${base}/portfolio/${c.slug}`, lastModified: new Date(c.date), priority: 0.7 }));
  return [...staticRoutes, ...services, ...cases];
}
```

### `src/app/robots.ts`
```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/thank-you", "/api/"] }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

### Structured data (`src/lib/schema.ts`)
Functions returning JSON-LD objects: `organizationSchema()`, `localBusinessSchema()`, `serviceSchema(service)`, `faqSchema(faqs)`, `breadcrumbSchema(items)`, `creativeWorkSchema(caseStudy)`, `personSchema(member)`.

```tsx
// components/shared/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```
Only pass objects you build yourself; never pass user input into this component.

### Open Graph images
Use `opengraph-image.tsx` (with `ImageResponse` from `next/og`) at the root and inside `services/[slug]` and `portfolio/[slug]` to auto-generate branded share images per page.

---

## 10. Rendering Strategy

| Route | Strategy |
|---|---|
| `/`, `/about`, `/pricing`, `/services` | Static (SSG) at build time |
| `/services/[slug]`, `/portfolio/[slug]`, `/blog/[slug]` | Static via `generateStaticParams`; `dynamicParams = false` so unknown slugs return 404 |
| `/contact` | Static page + Server Action for submission |
| `/thank-you` | Static, `robots: { index: false }` |

If you add a CMS later, use `export const revalidate = 3600` (ISR) or on-demand revalidation via `revalidateTag` from a CMS webhook.

---

## 11. Performance Checklist

- Use `next/image` for every image with explicit `width`/`height` or `fill` + `sizes`. Add `priority` only to the hero image (LCP element).
- Keep client components small; avoid `"use client"` at page level.
- Lazy load heavy below-the-fold client components with `next/dynamic`.
- Load third-party scripts (Calendly, chat widgets) with `next/script` strategy `lazyOnload`.
- Prefer SVG for logos and icons.
- Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse ≥ 90 on mobile.

## 12. Accessibility Checklist

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one H1 per page, logical heading order.
- All interactive elements keyboard reachable with visible focus ring (`focus-visible:ring-2`).
- Alt text for meaningful images, `alt=""` for decorative ones.
- Motion respects `prefers-reduced-motion` (Motion's `useReducedMotion`).
- Color contrast ≥ 4.5:1 for body text.
- Form fields have associated `<label>`s and error messages linked via `aria-describedby`.

## 13. Analytics & Conversion Events

Track these events (GA4 `sendGAEvent` from `@next/third-parties/google`):
`cta_click` (with `location` param), `quote_form_start`, `quote_form_submit`, `whatsapp_click`, `calendly_open`, `portfolio_filter`, `pricing_toggle_currency`.

## 14. Deployment (Vercel)

1. Push the repo to GitHub.
2. Import into Vercel, add environment variables for Production and Preview.
3. Connect `pixarbyte.com` domain; enable automatic HTTPS; redirect `www` → apex (or the reverse).
4. Every pull request gets a preview URL for review.
5. Verify the domain in Google Search Console and submit `sitemap.xml`.
6. Verify the sending domain in Resend (SPF/DKIM DNS records) so emails don't land in spam.

## 15. Quality Gates (CI)

GitHub Actions on each PR: `npm run lint` → `tsc --noEmit` → `vitest run` → `next build` → Playwright smoke tests (home loads, nav works, contact form validates). Optional: Lighthouse CI with budget thresholds.
