# Home Page: Technical Specification

**Route:** `/` → `src/app/page.tsx`
**Rendering:** Static (SSG). No request-time data.
**Depends on:** `tech-00-Architecture.md` (layout, shared components, data layer).

---

## 1. Page Composition

The page file only fetches data and composes sections.

```tsx
// src/app/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getServices, getFeaturedCaseStudies, getTestimonials, getTechStack, getStats } from "@/lib/content";
import { getLatestPosts } from "@/lib/blog";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { AudienceSplit } from "@/components/sections/home/AudienceSplit";
import { WhyChooseUs } from "@/components/sections/home/WhyChooseUs";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LatestPosts } from "@/components/sections/home/LatestPosts";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "PixarByte | Web, Mobile & Cloud Software Development Company",
    description: "PixarByte builds websites, mobile apps, no-code solutions, and cloud systems for individuals and businesses. Get a free quote today.",
    path: "/",
  }),
  title: { absolute: "PixarByte | Web, Mobile & Cloud Software Development Company" },
};

export default async function HomePage() {
  const [services, projects, testimonials, tech, stats, posts] = await Promise.all([
    getServices(), getFeaturedCaseStudies(4), getTestimonials(), getTechStack(), getStats(), getLatestPosts(3),
  ]);

  return (
    <>
      <HomeHero />
      <ClientLogos />
      <ServicesGrid services={services} />
      <AudienceSplit />
      <WhyChooseUs />
      <FeaturedProjects projects={projects} />
      <ProcessSection />
      <TechStackSection tech={tech} />
      <StatsSection stats={stats} />
      <TestimonialsSection testimonials={testimonials} />
      {posts.length > 0 && <LatestPosts posts={posts} />}
      <CTABanner
        title="Have a Project in Mind?"
        text="Tell us about your idea and get a free consultation and estimate within 24 hours."
        primary={{ label: "Get a Free Quote", href: "/contact" }}
        secondary={{ label: "Book a Call", href: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "/contact" }}
      />
    </>
  );
}
```

`title.absolute` prevents the root template from appending "| PixarByte" twice.

---

## 2. Component Specifications

### 2.1 `HomeHero` (Server, with one client child)

**File:** `components/sections/home/HomeHero.tsx`

| Element | Implementation |
|---|---|
| H1 | Static text, `text-4xl md:text-6xl font-bold`. Only H1 on the page. |
| Subheadline | `<p className="text-lg md:text-xl max-w-2xl">` |
| CTAs | `<Button asChild><Link href="/contact">Get a Free Quote</Link></Button>` + outline variant to `/portfolio` |
| Trust line | Rating stars (lucide `Star`) + text from `data/stats.ts` |
| Visual | `next/image` of device mockup, `priority`, `sizes="(min-width: 1024px) 50vw, 100vw"` |

**Layout:** `grid lg:grid-cols-2 items-center gap-12 min-h-[calc(100svh-80px)]`.

**Performance:** The hero image is the LCP element, so it's the only image on the page with `priority`. Don't use a video background; if you want motion, use a lightweight CSS gradient animation or a small Lottie loaded with `next/dynamic` after hydration.

**Analytics:** CTA buttons wrapped in a tiny client `TrackedLink` component that fires `sendGAEvent('event', 'cta_click', { location: 'hero' })`.

```tsx
"use client";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
export function TrackedLink({ event, params, ...props }:
  React.ComponentProps<typeof Link> & { event: string; params?: Record<string, string> }) {
  return <Link {...props} onClick={(e) => { sendGAEvent("event", event, params ?? {}); props.onClick?.(e); }} />;
}
```

### 2.2 `ClientLogos` (Server + CSS animation)

**Data:** `data/clients.ts` → `{ name: string; logo: string; url?: string }[]`

**Implementation:** Pure CSS infinite marquee (no JS). Duplicate the list once and translate by -50%.
```css
@keyframes marquee { to { transform: translateX(-50%); } }
.marquee { animation: marquee 30s linear infinite; }
@media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
```
Logos: `next/image`, `className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition"`. Duplicated set gets `aria-hidden="true"` so screen readers don't read logos twice.

**Fallback:** If fewer than 5 client logos exist, render platform badges array instead (same component, different data).

### 2.3 `ServicesGrid` (Server)

**Props:** `services: Service[]` (see `tech-02-Services`).
**Layout:** `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
**Card:** `ServiceCard` shared component: icon (lucide component resolved from `service.icon` string via a map), title, `service.shortDescription`, link `/services/${slug}`.

Make the entire card clickable accessibly: put the `<Link>` on the title and use the "stretched link" pattern (`after:absolute after:inset-0` on the link, `relative` on the card) rather than wrapping the whole card in `<a>`.

Hover: `transition hover:-translate-y-1 hover:shadow-lg hover:border-brand-500`.

### 2.4 `AudienceSplit` (Server)

**Data:** Inline constant in the component (content rarely changes) or `data/home.ts`.
```ts
const audiences = [
  { title: "Have an idea? Let's bring it to life.", tag: "For Individuals & Startups",
    points: ["MVP development for founders", "Personal & portfolio websites", "Affordable no-code launches", "Guidance for non-technical founders"],
    cta: { label: "Start Your Project", href: "/contact?type=individual" } },
  { title: "Scale your operations with reliable tech.", tag: "For Businesses & Enterprises",
    points: ["Custom business software", "Dedicated development teams", "Cloud migration & DevOps", "Long-term support, NDA & IP protection"],
    cta: { label: "Talk to Our Team", href: "/contact?type=business" } },
];
```
The `?type=` query param pre-selects the "I am a…" radio on the contact form (see `tech-06`).

### 2.5 `WhyChooseUs` (Server)

6 items from `data/home.ts` (`{ icon, title, text }`). Grid `sm:grid-cols-2 lg:grid-cols-3`. Wrap each item in `<Reveal delay={i * 0.05}>` for staggered entrance.

### 2.6 `FeaturedProjects` (Server)

**Data:** `getFeaturedCaseStudies(4)` returns case studies where frontmatter `featured: true`, sorted by `order`.
**Card:** shared `ProjectCard` (spec in `tech-03-Portfolio`).
**Footer:** Link button "View All Projects" → `/portfolio`.

### 2.7 `ProcessSection` (Shared, Server)

**Props:** `steps?: { title: string; text: string }[]` defaulting to the 5 general steps from `data/process.ts`. Service pages pass their own steps.
**Layout:** `<ol>` (semantic ordered list). Desktop: horizontal with connecting line (`before:` pseudo-element). Mobile: vertical timeline.

### 2.8 `TechStackSection` (Shared, Client for tabs)

**Props:** `tech: Tech[]`, optional `categories` filter.
**Implementation:** shadcn `Tabs`. Tab triggers from unique categories; each panel is a grid of logos with `title` tooltip and visible name on hover. Only the tabs wrapper is client; logo grid is passed as children rendered on server where possible.

### 2.9 `StatsSection` (Shared) + `Counter` (Client)

**Data:** `data/stats.ts` → `{ label: string; value: number; suffix?: string }[]`
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.6, ease: "easeOut", onUpdate: v => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return <span ref={ref} aria-label={`${value}${suffix}`}>{display}{suffix}</span>;
}
```
Server-render the final value in the `aria-label` so crawlers and screen readers get the real number.

### 2.10 `TestimonialsSection` (Shared, Client carousel)

**Library:** `embla-carousel-react` (lightweight, used by shadcn `Carousel`). Add with `npx shadcn@latest add carousel`.
**Behavior:** Autoplay (pause on hover/focus), prev/next buttons with `aria-label`, dots.
**Fallback:** If ≤ 3 testimonials, render a static grid instead of a carousel.
**Schema:** Don't add `Review`/`AggregateRating` schema for your own business on your own site; Google ignores self-serving reviews.

### 2.11 `LatestPosts` (Server)

**Data:** `getLatestPosts(3)` from MDX blog frontmatter: `{ slug, title, excerpt, date, cover, readingTime }`. Render conditionally so the section disappears if the blog is empty.

### 2.12 `CTABanner` (Shared, Server)

**Props:** `title`, `text`, `primary`, `secondary?`, `variant?: "brand" | "dark"`. Full-width, `bg-brand-600 text-white`, rounded container.

---

## 3. Data Files for This Page

| File | Shape |
|---|---|
| `data/clients.ts` | `Client[]` |
| `data/home.ts` | `audiences`, `whyChooseUs` |
| `data/process.ts` | `ProcessStep[]` |
| `data/tech.ts` | `Tech[]` |
| `data/stats.ts` | `Stat[]` |
| `data/testimonials.ts` | `Testimonial[]` |

---

## 4. SEO & Structured Data

- Metadata as shown in section 1.
- `Organization` schema is already injected by root layout.
- Add `WebSite` schema on the home page only:
```ts
{ "@context": "https://schema.org", "@type": "WebSite", name: "PixarByte", url: siteConfig.url }
```
- Heading structure: 1 × H1 (hero), H2 per section, H3 for cards.

---

## 5. Responsive Behavior

| Breakpoint | Hero | Services grid | Process |
|---|---|---|---|
| < 640px | Stacked, image below text | 1 col | Vertical timeline |
| 640–1023px | Stacked | 2 cols | Vertical |
| ≥ 1024px | 2-col split | 3 cols | Horizontal |

---

## 6. Testing

**Unit (Vitest):** `Counter` renders final value with reduced motion; `ServicesGrid` renders 6 cards with correct hrefs.

**E2E (Playwright):**
```ts
test("home page core flows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Get a Free Quote" }).first().click();
  await expect(page).toHaveURL(/\/contact/);
});
```

**Acceptance criteria**
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
- No layout shift from fonts or images (CLS < 0.1).
- All sections render with empty optional data (no blog posts, few logos) without errors.
- Page works with JavaScript disabled except carousel/counters/tabs, which degrade to static content.
