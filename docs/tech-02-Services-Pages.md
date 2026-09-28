# Services Pages: Technical Specification

**Routes:**
- `/services` → `src/app/services/page.tsx` (overview)
- `/services/[slug]` → `src/app/services/[slug]/page.tsx` (6 detail pages)

**Rendering:** Fully static. Detail pages pre-rendered with `generateStaticParams`; unknown slugs return 404.

---

## 1. Data Model

All six service pages share one template, so content is structured data, not six hand-built pages.

```ts
// src/types/service.ts
import type { FAQ, ServiceSlug } from "./content";

export interface SubService { title: string; description: string; icon: string }
export interface Benefit    { title: string; description: string; icon: string }
export interface ProcessStep { title: string; text: string }

export interface Service {
  slug: ServiceSlug;
  order: number;
  name: string;               // "Mobile App Development"
  navLabel: string;           // "Mobile Apps"
  icon: string;               // lucide icon name, e.g. "Smartphone"
  shortDescription: string;   // card text (≤ 120 chars)
  seo: { title: string; description: string; keywords?: string[] };
  hero: { heading: string; subheading: string; image: string };
  overview: string[];         // paragraphs
  offerings: SubService[];    // 6–8
  benefits: Benefit[];        // 4
  techStack: string[];        // tech ids referencing data/tech.ts
  process: ProcessStep[];
  useCases: string[];
  pricingHint: { from: number; currency: "USD"; unit?: string; note?: string };
  faqs: FAQ[];                // 5–8
  relatedServices: ServiceSlug[];
  comparison?: { headers: string[]; rows: string[][] }; // e.g. No-code vs custom
}
```

### Data file (`src/data/services.ts`) – example entry
```ts
import type { Service } from "@/types/service";

export const services: Service[] = [
  {
    slug: "mobile-app-development",
    order: 5,
    name: "Mobile App Development",
    navLabel: "Mobile Apps",
    icon: "Smartphone",
    shortDescription: "Native and cross-platform iOS and Android apps with Flutter and React Native.",
    seo: {
      title: "Mobile App Development Company | iOS & Android",
      description: "PixarByte builds cross-platform and native mobile apps for iOS and Android, from MVP to App Store launch.",
    },
    hero: {
      heading: "Mobile App Development for iOS & Android",
      subheading: "Apps that users download, love, and keep using.",
      image: "/images/services/mobile-hero.png",
    },
    overview: ["…", "…"],
    offerings: [
      { title: "Cross-Platform Apps", description: "One codebase for iOS and Android.", icon: "Layers" },
      // …
    ],
    benefits: [ /* … */ ],
    techStack: ["flutter", "react-native", "swift", "kotlin", "firebase", "supabase"],
    process: [ /* service-specific steps */ ],
    useCases: ["Food delivery apps", "Booking apps", "Fitness trackers", "E-commerce apps"],
    pricingHint: { from: 3000, currency: "USD", note: "MVP apps" },
    faqs: [
      { question: "Should I choose native or cross-platform?", answer: "…" },
      // …
    ],
    relatedServices: ["backend-development", "cloud-services"],
  },
  // …5 more
];
```

Validate this file at build time with a Zod schema (`lib/validation/service.ts`) in a small test or `lib/content.ts` so a missing field fails the build instead of breaking a page silently.

### Loader (`src/lib/content.ts`)
```ts
export async function getServices() {
  return [...services].sort((a, b) => a.order - b.order);
}
export async function getServiceBySlug(slug: string) {
  return services.find(s => s.slug === slug) ?? null;
}
export async function getCaseStudiesByService(slug: ServiceSlug, limit = 3) { /* filter MDX frontmatter `services` array */ }
export async function getTestimonialForService(slug: ServiceSlug) { /* first match or null */ }
```

### Icon resolution (`src/lib/icons.ts`)
Storing icon names as strings keeps data serializable. Map only the icons you use (importing all of lucide bloats the bundle):
```ts
import { Smartphone, Layers, Cloud, Code2, Server, Blocks, type LucideIcon } from "lucide-react";
export const icons: Record<string, LucideIcon> = { Smartphone, Layers, Cloud, Code2, Server, Blocks /* … */ };
export function Icon({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) {
  const C = icons[name] ?? Code2;
  return <C aria-hidden="true" {...props} />;
}
```

---

## 2. Services Overview Page (`/services`)

```tsx
// src/app/services/page.tsx
import { buildMetadata } from "@/lib/seo";
import { getServices } from "@/lib/content";

export const metadata = buildMetadata({
  title: "Software Development Services",
  description: "Frontend, backend, full-stack, no-code, mobile app, and cloud services for individuals and businesses.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero title="Our Services" subtitle="Whether you need a simple website or a complex cloud platform, PixarByte has the expertise to build it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]} />
      <ServiceDetailCards services={services} />
      <ServiceFinder />
      <BundlesSection bundles={bundles} />
      <ProcessSection />
      <CTABanner title="Not sure what you need?" text="Book a free consultation and we'll recommend the right approach." primary={{ label: "Get a Free Quote", href: "/contact" }} />
      <JsonLd data={itemListSchema(services)} />
    </>
  );
}
```

### Components

| Component | Type | Details |
|---|---|---|
| `PageHero` | Server (shared) | H1, subtitle, `Breadcrumbs` (with BreadcrumbList JSON-LD), optional CTA |
| `ServiceDetailCards` | Server | Alternating left/right layout (`lg:grid-cols-2`, reverse on odd index). Shows icon, name, description, first 5 offerings as checklist, 5 tech logos, button to detail page. |
| `ServiceFinder` | Client | "Which service do I need?" interactive helper (below) |
| `BundlesSection` | Server | 3 cards from `data/bundles.ts` |

### `ServiceFinder` (Client)
```ts
// data/service-finder.ts
export const finderOptions = [
  { need: "A website to present my business", recommend: ["frontend-development", "no-code-development"] },
  { need: "A web app with user accounts and data", recommend: ["full-stack-development"] },
  { need: "An app on phones", recommend: ["mobile-app-development"] },
  { need: "Launch fast on a small budget", recommend: ["no-code-development"] },
  { need: "Hosting, speed, or scaling problems", recommend: ["cloud-services"] },
  { need: "APIs or a database for my existing frontend", recommend: ["backend-development"] },
] as const;
```
UI: shadcn `RadioGroup` (or pill buttons with `role="radio"`) → shows recommended service cards below with `aria-live="polite"` so screen readers announce the result. Fire `sendGAEvent('event','service_finder', { need })`.

### Schema
`ItemList` of services with `url` for each detail page.

---

## 3. Service Detail Page (`/services/[slug]`)

```tsx
// src/app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map(s => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({ title: service.seo.title, description: service.seo.description, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [projects, testimonial, tech, related] = await Promise.all([
    getCaseStudiesByService(service.slug, 3),
    getTestimonialForService(service.slug),
    getTechByIds(service.techStack),
    getServicesBySlugs(service.relatedServices),
  ]);

  return (
    <>
      <ServiceHero service={service} />
      <ServiceOverview paragraphs={service.overview} />
      <OfferingsGrid items={service.offerings} />
      <BenefitsSection items={service.benefits} />
      {service.comparison && <ComparisonTable {...service.comparison} />}
      <TechStackSection tech={tech} showTabs={false} />
      <ProcessSection steps={service.process} />
      {projects.length > 0 && <RelatedProjects projects={projects} />}
      <UseCases items={service.useCases} />
      <PricingHint hint={service.pricingHint} />
      <FAQSection faqs={service.faqs} />
      {testimonial && <SingleTestimonial t={testimonial} />}
      <RelatedServices services={related} />
      <CTABanner title={`Ready to start your ${service.name.toLowerCase()} project?`} text="Get a free estimate within 24 hours."
        primary={{ label: "Get a Free Quote", href: `/contact?service=${service.slug}` }} />
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqSchema(service.faqs)} />
    </>
  );
}
```

`params` is a Promise in current Next.js versions and must be awaited.

### Section Components

| Component | Notes |
|---|---|
| `ServiceHero` | Same layout as home hero but H1 = `service.hero.heading`. Breadcrumbs Home > Services > {name}. Image with `priority`. |
| `ServiceOverview` | Prose block, `max-w-3xl`, paragraphs mapped from data. |
| `OfferingsGrid` | `grid sm:grid-cols-2 lg:grid-cols-4`, icon + H3 + text. |
| `BenefitsSection` | 2×2 grid with large icons, or split layout with image. |
| `ComparisonTable` | Semantic `<table>` with `<caption>`, `scope="col"` headers; wrapped in `overflow-x-auto` div for mobile. Used on No-Code page. |
| `RelatedProjects` | 3 `ProjectCard`s. Hidden if none. |
| `UseCases` | Pill/badge list. |
| `PricingHint` | "Projects start from $3,000" + link to `/pricing#${slug}`. Formats via `Intl.NumberFormat`. |
| `FAQSection` | Shared. shadcn `Accordion type="single" collapsible`. Answers are in the DOM (Radix keeps content mounted when using `forceMount` or renders on open; ensure answers are server-rendered for SEO by using `<details>/<summary>` fallback or `forceMount` + hidden styling). |
| `RelatedServices` | 2–3 `ServiceCard`s for internal linking. |

**FAQ SEO note:** The simplest SEO-safe approach is native `<details><summary>`, which needs no JavaScript and keeps answers in the HTML. Style with Tailwind (`group-open:rotate-180` on the chevron).

### Service-specific OG image
`src/app/services/[slug]/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { getServiceBySlug } from "@/lib/content";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getServiceBySlug(slug);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: 80, background: "linear-gradient(135deg,#0b1020,#3b54e6)", color: "white" }}>
      <div style={{ fontSize: 32, opacity: 0.8 }}>PixarByte</div>
      <div style={{ fontSize: 72, fontWeight: 700 }}>{s?.name ?? "Services"}</div>
    </div>, size);
}
```

### Schema helpers
```ts
export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org", "@type": "Service",
    name: s.name, description: s.seo.description, serviceType: s.name,
    provider: { "@type": "Organization", name: "PixarByte", url: siteConfig.url },
    areaServed: "Worldwide",
    url: `${siteConfig.url}/services/${s.slug}`,
  };
}
export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
```

---

## 4. Header Integration

The Services dropdown in `DesktopNav` and the footer column both read from `getServices()`, so adding a seventh service later only requires a new entry in `data/services.ts`.

---

## 5. Testing

- **Unit:** Zod schema validates every entry in `services.ts` (fails CI if content is incomplete).
- **Unit:** `serviceSchema` and `faqSchema` produce valid shapes.
- **E2E:** Loop through all slugs, assert H1 visible, FAQ expands, CTA link contains `?service=<slug>`.
- **E2E:** `/services/unknown` returns 404.
- **SEO:** Validate JSON-LD with Google Rich Results Test before launch.

## 6. Acceptance Criteria

- All 6 detail pages generated at build (`next build` output lists them as ● SSG).
- Each page has a unique title, description, canonical URL, and OG image.
- Sections with no data (projects, testimonial, comparison) are hidden, not empty.
- Service CTA pre-selects the service on the contact form.
