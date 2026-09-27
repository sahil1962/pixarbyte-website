# Portfolio & Case Studies: Technical Specification

**Routes:**
- `/portfolio` → `src/app/portfolio/page.tsx` (listing with filters)
- `/portfolio/[slug]` → `src/app/portfolio/[slug]/page.tsx` (case study)

**Content source:** MDX files in `content/case-studies/`.
**Rendering:** Static. Listing page server-renders all projects; filtering happens client-side.

---

## 1. Content Model

Each case study is one MDX file. Frontmatter holds structured data; the MDX body holds the long-form story.

### File: `content/case-studies/foodgo-delivery-app.mdx`
```mdx
---
title: "FoodGo Delivery App"
slug: "foodgo-delivery-app"
client: "FoodGo"
confidential: false
summary: "A food delivery app serving 5,000+ daily orders in Lahore."
date: "2026-03-15"
featured: true
order: 1
services: ["mobile-app-development", "backend-development", "cloud-services"]
industry: "Restaurants & Food"
duration: "12 weeks"
teamSize: 4
platforms: ["iOS", "Android", "Web Admin"]
tech: ["flutter", "nodejs", "postgresql", "aws"]
cover: "/images/projects/foodgo/cover.png"
thumbnail: "/images/projects/foodgo/thumb.png"
liveUrl: "https://foodgo.example.com"
appStoreUrl: ""
playStoreUrl: ""
results:
  - { value: "65%", label: "Increase in online orders" }
  - { value: "1.2s", label: "Average screen load" }
  - { value: "4.8★", label: "Play Store rating" }
gallery:
  - { src: "/images/projects/foodgo/menu.png", alt: "Restaurant menu screen", device: "mobile" }
  - { src: "/images/projects/foodgo/admin.png", alt: "Admin order dashboard", device: "desktop" }
beforeAfter:
  before: "/images/projects/foodgo/before.png"
  after: "/images/projects/foodgo/after.png"
testimonial:
  quote: "PixarByte delivered on time and the app just works."
  name: "Ali Raza"
  role: "Founder"
  avatar: "/images/testimonials/ali.jpg"
---

## The Client
…

## The Challenge
…

## Our Solution
<FeatureHighlight title="Real-time order tracking" image="/images/projects/foodgo/tracking.png">
Customers see their rider on a live map…
</FeatureHighlight>

## Technology Choices
…
```

### Zod schema (`src/lib/validation/case-study.ts`)
```ts
import { z } from "zod";

export const caseStudySchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: z.string(),
  confidential: z.boolean().default(false),
  summary: z.string().max(160),
  date: z.string(),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  services: z.array(z.string()).min(1),
  industry: z.string(),
  duration: z.string().optional(),
  teamSize: z.number().optional(),
  platforms: z.array(z.string()).default([]),
  tech: z.array(z.string()).default([]),
  cover: z.string(),
  thumbnail: z.string(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  appStoreUrl: z.string().optional(),
  playStoreUrl: z.string().optional(),
  concept: z.boolean().default(false), // label for non-client/internal projects
  results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  gallery: z.array(z.object({ src: z.string(), alt: z.string(), device: z.enum(["mobile", "desktop", "tablet"]) })).default([]),
  beforeAfter: z.object({ before: z.string(), after: z.string() }).optional(),
  testimonial: z.object({ quote: z.string(), name: z.string(), role: z.string(), avatar: z.string().optional() }).optional(),
});

export type CaseStudyMeta = z.infer<typeof caseStudySchema>;
```

### Loader (`src/lib/case-studies.ts`)
```ts
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { caseStudySchema, type CaseStudyMeta } from "./validation/case-study";

const DIR = path.join(process.cwd(), "content/case-studies");

export const getCaseStudies = cache(async (): Promise<CaseStudyMeta[]> => {
  const files = (await fs.readdir(DIR)).filter(f => f.endsWith(".mdx"));
  const items = await Promise.all(files.map(async file => {
    const raw = await fs.readFile(path.join(DIR, file), "utf8");
    const { data } = matter(raw);
    const parsed = caseStudySchema.safeParse(data);
    if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}: ${parsed.error.message}`);
    return parsed.data;
  }));
  return items.sort((a, b) => a.order - b.order || +new Date(b.date) - +new Date(a.date));
});

export async function getCaseStudy(slug: string) {
  const raw = await fs.readFile(path.join(DIR, `${slug}.mdx`), "utf8").catch(() => null);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return { meta: caseStudySchema.parse(data), content };
}

export async function getFeaturedCaseStudies(limit = 4) {
  return (await getCaseStudies()).filter(c => c.featured).slice(0, limit);
}

export async function getAdjacentCaseStudies(slug: string) {
  const all = await getCaseStudies();
  const i = all.findIndex(c => c.slug === slug);
  return { prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}
```
`server-only` guarantees this file (which uses `fs`) is never bundled into client code.

---

## 2. Portfolio Listing Page (`/portfolio`)

```tsx
// src/app/portfolio/page.tsx
export const metadata = buildMetadata({
  title: "Portfolio | Web & Mobile App Projects",
  description: "Explore websites, mobile apps, and cloud solutions PixarByte has designed and built for clients worldwide.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [projects, services] = await Promise.all([getCaseStudies(), getServices()]);
  const industries = [...new Set(projects.map(p => p.industry))].sort();

  return (
    <>
      <PageHero title="Our Work" subtitle="A selection of projects we've designed, built, and launched."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]} />
      <Suspense fallback={<ProjectGrid projects={projects} />}>
        <PortfolioExplorer projects={projects}
          serviceFilters={services.map(s => ({ value: s.slug, label: s.navLabel }))}
          industryFilters={industries} />
      </Suspense>
      <ClientLogos />
      <SingleTestimonial t={featuredTestimonial} />
      <CTABanner title="Want results like these?" text="Let's discuss your project." primary={{ label: "Get a Free Quote", href: "/contact" }} />
    </>
  );
}
```
The `Suspense` wrapper is required because `PortfolioExplorer` uses `useSearchParams`. Its fallback renders the unfiltered grid, so the static HTML still contains every project for SEO.

### `PortfolioExplorer` (Client)

**Responsibilities:** filter state, URL sync, animated grid.

```tsx
"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

export function PortfolioExplorer({ projects, serviceFilters, industryFilters }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const service = params.get("service") ?? "all";
  const industry = params.get("industry") ?? "all";

  const filtered = useMemo(() => projects.filter(p =>
    (service === "all" || p.services.includes(service)) &&
    (industry === "all" || p.industry === industry)
  ), [projects, service, industry]);

  function setFilter(key: "service" | "industry", value: string) {
    const next = new URLSearchParams(params);
    value === "all" ? next.delete(key) : next.set(key, value);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  }

  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">Projects</h2>
      <FilterBar label="Service" value={service} options={[{ value: "all", label: "All" }, ...serviceFilters]}
        onChange={v => setFilter("service", v)} />
      <FilterSelect label="Industry" value={industry} options={industryFilters} onChange={v => setFilter("industry", v)} />
      <p aria-live="polite" className="sr-only">{filtered.length} projects shown</p>

      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map(p => (
            <motion.li key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
              <ProjectCard project={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {filtered.length === 0 && <EmptyState onReset={() => router.replace(pathname, { scroll: false })} />}
    </section>
  );
}
```

**Why URL params:** Filter state is shareable ("see our mobile apps" link → `/portfolio?service=mobile-app-development`) and survives back/forward navigation. Service detail pages can link directly to filtered views.

**FilterBar:** Row of buttons with `aria-pressed`, horizontally scrollable on mobile (`overflow-x-auto snap-x`). **FilterSelect:** shadcn `Select` for industries (can be many).

### `ProjectCard` (Shared, Server-compatible)

| Element | Implementation |
|---|---|
| Thumbnail | `next/image` `fill` inside `aspect-[4/3]` container, `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`, `group-hover:scale-105 transition` |
| Title | H3 with stretched link to `/portfolio/${slug}` |
| Tags | `Badge` per service `navLabel` (max 2 + "+n") |
| Summary | 1 line, `line-clamp-2` |
| Result | First `results[0]` shown as highlight |
| Concept label | Badge "Concept" if `concept: true` |
| Overlay | "View Case Study →" appears on hover/focus (`group-focus-within:opacity-100` for keyboard users) |

---

## 3. Case Study Page (`/portfolio/[slug]`)

```tsx
// src/app/portfolio/[slug]/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCaseStudies()).map(c => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return {};
  return buildMetadata({
    title: `${cs.meta.title} Case Study`,
    description: cs.meta.summary,
    path: `/portfolio/${slug}`,
    image: cs.meta.cover,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();
  const { meta, content } = cs;
  const [tech, { prev, next }, related] = await Promise.all([
    getTechByIds(meta.tech), getAdjacentCaseStudies(slug), getRelatedCaseStudies(meta, 3),
  ]);

  return (
    <article>
      <CaseStudyHero meta={meta} />
      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
        <QuickFacts meta={meta} />   {/* sticky sidebar on desktop */}
      </div>
      <TechUsed tech={tech} />
      {meta.gallery.length > 0 && <Gallery images={meta.gallery} />}
      {meta.beforeAfter && <BeforeAfterSlider {...meta.beforeAfter} />}
      {meta.results.length > 0 && <ResultsStats results={meta.results} />}
      {meta.testimonial && <SingleTestimonial t={meta.testimonial} />}
      <ProjectPagination prev={prev} next={next} />
      <RelatedProjects projects={related} />
      <CTABanner title="Have a similar project?" text="Let's talk about what we can build for you."
        primary={{ label: "Get a Free Quote", href: "/contact" }} />
      <JsonLd data={creativeWorkSchema(meta)} />
    </article>
  );
}
```

Install `@tailwindcss/typography` for the `prose` classes and register it in `globals.css` with `@plugin "@tailwindcss/typography";`.

### Section Components

| Component | Type | Details |
|---|---|---|
| `CaseStudyHero` | Server | H1 title, client (or "Confidential Client"), summary, cover image `priority`, service badges, live/store buttons if URLs exist |
| `QuickFacts` | Server | `<dl>` definition list: Client, Industry, Services, Duration, Team, Platforms. `lg:sticky lg:top-28` |
| `TechUsed` | Server | Logo row with names |
| `Gallery` | Client | Grid of screenshots in device frames; click opens shadcn `Dialog` lightbox with keyboard arrows, `Esc` to close, focus trapped |
| `BeforeAfterSlider` | Client | Two stacked images, top clipped with `clip-path: inset(0 X% 0 0)`. Control is `<input type="range">` (keyboard accessible for free) visually styled as a handle |
| `ResultsStats` | Server + `Counter` | Large stat blocks. Values are strings ("65%", "4.8★"), so only animate if numeric; else render static |
| `ProjectPagination` | Server | Prev/next links with titles and thumbnails |
| `RelatedProjects` | Server | Same-service projects excluding current |

### MDX components (`src/components/mdx/index.tsx`)
```tsx
import Image from "next/image";
export const mdxComponents = {
  img: (p: any) => <Image {...p} width={1200} height={750} className="rounded-xl" sizes="(min-width:1024px) 800px, 100vw" />,
  FeatureHighlight,   // title + image + text block
  Callout,            // highlighted note
  StatInline,         // inline big number
};
```
Case study MDX is written by your team only, so it's trusted content. Never render MDX from user submissions.

### Schema
```ts
export function creativeWorkSchema(m: CaseStudyMeta) {
  return {
    "@context": "https://schema.org", "@type": "CreativeWork",
    name: m.title, description: m.summary, image: `${siteConfig.url}${m.cover}`,
    dateCreated: m.date, creator: { "@type": "Organization", name: "PixarByte" },
    about: m.industry, keywords: m.tech.join(", "),
    url: `${siteConfig.url}/portfolio/${m.slug}`,
  };
}
```
Add `opengraph-image.tsx` in `portfolio/[slug]/` that renders the cover image with title overlay.

---

## 4. Image Guidelines

- Store originals at 2× display size; `next/image` handles resizing and AVIF/WebP.
- Thumbnails: 1200×900 (4:3). Covers: 2400×1350 (16:9). Gallery: native screen size.
- Every gallery item requires `alt` (enforced by Zod schema).
- Keep `public/images/projects/<slug>/` folder per project.
- Confidential projects: blur or replace sensitive data in screenshots before committing.

---

## 5. Adding a New Project (workflow)

1. Create `public/images/projects/<slug>/` and add images.
2. Copy `content/case-studies/_template.mdx` → `<slug>.mdx`, fill frontmatter.
3. Run `npm run dev`; the Zod schema will throw a clear error if a field is missing.
4. Commit and open a PR; review on the Vercel preview URL.
5. Merge → sitemap, portfolio grid, related projects, and service pages update automatically.

---

## 6. Testing

- **Unit:** Every MDX file passes `caseStudySchema` (a test that loads all files).
- **Unit:** Filter logic returns correct subsets for service/industry combos.
- **E2E:** Click "Mobile Apps" filter → URL contains `?service=mobile-app-development` → only matching cards visible → reload keeps filter.
- **E2E:** Case study lightbox opens, closes with Escape, focus returns to trigger.
- **E2E:** Before/after slider moves with arrow keys.

## 7. Acceptance Criteria

- All projects present in static HTML of `/portfolio` (view-source check).
- Filtering is instant (< 100ms) with no full page reload.
- Case study pages have unique metadata and OG images.
- No CLS from images; all have reserved aspect ratios.
