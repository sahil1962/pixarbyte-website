# About Page: Technical Specification

**Route:** `/about` → `src/app/about/page.tsx`
**Rendering:** Static (SSG).
**Data:** `data/about.ts`, `data/team.ts`, `data/certifications.ts`, `data/stats.ts`.

---

## 1. Data Models

```ts
// src/types/about.ts
export interface Milestone { year: string; title: string; description?: string }
export interface Value { icon: string; title: string; description: string }

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  photo: string;             // 800×800, consistent background
  bio: string;               // one line
  leadership: boolean;       // founders/leads shown larger
  order: number;
  socials?: { linkedin?: string; github?: string; x?: string };
}

export interface Certification {
  name: string;              // "AWS Certified Solutions Architect"
  issuer: string;
  logo: string;
  url?: string;              // verification link
  type: "certification" | "platform" | "partner" | "registration" | "award";
}
```

```ts
// src/data/about.ts
export const aboutContent = {
  hero: {
    title: "About PixarByte",
    tagline: "We're a team of developers, designers, and problem-solvers who turn ideas into working software.",
    image: "/images/about/team.jpg",
  },
  story: ["PixarByte started in [year] with a simple belief…", "…", "…"],
  milestones: [
    { year: "2022", title: "PixarByte founded" },
    { year: "2023", title: "First 10 clients" },
    // …
  ] satisfies Milestone[],
  mission: "To help individuals and businesses succeed by building reliable, modern, and affordable software solutions.",
  vision: "To become a trusted global technology partner known for quality, honesty, and innovation.",
  values: [ /* 6 Value objects */ ],
  founderMessage: {
    name: "…", role: "Founder & CEO", photo: "/images/team/founder.jpg",
    message: ["…", "…"], signature: "/images/about/signature.svg",
  },
  whyWorkWithUs: [ /* strings */ ],
  culturePhotos: [ { src: "/images/about/culture-1.jpg", alt: "Team celebrating a project launch" } ],
};
```

Replace every `[year]` placeholder with real data before launch; add a Vitest check that fails if any string in `aboutContent` contains `[` placeholders.

---

## 2. Page Composition

```tsx
// src/app/about/page.tsx
export const metadata = buildMetadata({
  title: "About Us | Our Story, Team & Values",
  description: "Meet the team behind PixarByte, a software company building web, mobile, and cloud solutions for individuals and businesses.",
  path: "/about",
});

export default async function AboutPage() {
  const [team, certs, stats] = await Promise.all([getTeam(), getCertifications(), getStats()]);
  const leaders = team.filter(m => m.leadership);
  const members = team.filter(m => !m.leadership);

  return (
    <>
      <PageHero title={aboutContent.hero.title} subtitle={aboutContent.hero.tagline} image={aboutContent.hero.image}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <StorySection paragraphs={aboutContent.story} />
      <MilestonesTimeline items={aboutContent.milestones} />
      <MissionVision mission={aboutContent.mission} vision={aboutContent.vision} />
      <ValuesGrid values={aboutContent.values} />
      <TeamSection leaders={leaders} members={members} />
      {aboutContent.founderMessage && <FounderMessage {...aboutContent.founderMessage} />}
      <WhyWorkWithUs items={aboutContent.whyWorkWithUs} />
      <StatsSection stats={stats} />
      {certs.length > 0 && <CertificationsSection items={certs} />}
      {aboutContent.culturePhotos.length > 0 && <CultureGallery photos={aboutContent.culturePhotos} />}
      <CTABanner title="Let's build something great together." text="Tell us about your idea."
        primary={{ label: "Start a Project", href: "/contact" }}
        secondary={{ label: "Book a Call", href: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "/contact" }} />
      <JsonLd data={aboutPageSchema(leaders)} />
    </>
  );
}
```

---

## 3. Component Specifications

| Component | Type | Implementation |
|---|---|---|
| `PageHero` (image variant) | Server | Wide team photo below heading, `next/image` `priority`, `aspect-[21/9]` on desktop, `aspect-[4/3]` mobile, `object-cover` |
| `StorySection` | Server | Two-column: prose left (`max-w-prose`), supporting image or pull-quote right |
| `MilestonesTimeline` | Server + `Reveal` | `<ol>` with `<time>` elements. Desktop: horizontal scroll-snap row (`overflow-x-auto snap-x`). Mobile: vertical with left border line. Each item fades in via `Reveal`. |
| `MissionVision` | Server | Two cards, `md:grid-cols-2`, distinct icons (Target, Eye) |
| `ValuesGrid` | Server | `grid sm:grid-cols-2 lg:grid-cols-3`, uses `Icon` resolver |
| `TeamSection` | Server | Leaders: `md:grid-cols-2` large cards. Members: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. See below. |
| `FounderMessage` | Server | Photo + quote block using `<blockquote>` + `<figcaption>`; signature SVG with `alt="Signature of [name]"` |
| `WhyWorkWithUs` | Server | Checklist with lucide `CheckCircle2` |
| `StatsSection` | Shared | Reused from home |
| `CertificationsSection` | Server | Grouped by `type`; logos link to verification URL with `rel="noopener noreferrer" target="_blank"` |
| `CultureGallery` | Server | Masonry-style using CSS columns (`columns-2 md:columns-3 gap-4`, items `break-inside-avoid`); no JS required |

### `TeamMemberCard`
```tsx
export function TeamMemberCard({ m, size = "sm" }: { m: TeamMember; size?: "sm" | "lg" }) {
  return (
    <article className="group text-center">
      <div className={cn("relative mx-auto overflow-hidden rounded-2xl", size === "lg" ? "aspect-[4/5] max-w-sm" : "aspect-square")}>
        <Image src={m.photo} alt={`Portrait of ${m.name}`} fill
          sizes={size === "lg" ? "(min-width:768px) 384px, 100vw" : "(min-width:1024px) 25vw, 50vw"}
          className="object-cover transition group-hover:scale-105" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
      <p className="text-brand-600 text-sm">{m.role}</p>
      <p className="mt-1 text-sm">{m.bio}</p>
      <SocialLinks links={m.socials} label={m.name} />
    </article>
  );
}
```
`SocialLinks` renders icon links with `aria-label={`${label} on LinkedIn`}` so screen readers know whose profile each icon opens.

**Small team handling:** If `members.length === 0`, TeamSection shows leaders only plus the message: "A focused team means you work directly with the people building your product."

---

## 4. Structured Data

```ts
export function aboutPageSchema(leaders: TeamMember[]) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${siteConfig.url}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "PixarByte",
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      foundingDate: "2022",
      founder: leaders.map(l => ({
        "@type": "Person", name: l.name, jobTitle: l.role,
        image: `${siteConfig.url}${l.photo}`,
        sameAs: Object.values(l.socials ?? {}).filter(Boolean),
      })),
      numberOfEmployees: { "@type": "QuantitativeValue", value: /* team.length */ 0 },
    },
  };
}
```

---

## 5. Image Requirements

| Asset | Size | Notes |
|---|---|---|
| Hero team photo | 2400×1030 | Real photo strongly preferred over stock |
| Team portraits | 800×800 (members), 800×1000 (leaders) | Same background, lighting, and crop across all |
| Culture photos | Any, ≤ 2000px long edge | Mixed aspect ratios suit the masonry layout |
| Certification logos | SVG | Monochrome versions optional |

Get written consent from each team member before publishing their photo.

---

## 6. Future Enhancement: Individual Team Pages

If you later want `/about/team/[slug]` pages (good for personal SEO of senior staff), the `slug` field is already in the model. Add `generateStaticParams` over `getTeam()` and a `Person` schema per page.

---

## 7. Testing & Acceptance Criteria

- **Unit:** No placeholder strings (`[year]`, `…`) remain in `data/about.ts`.
- **Unit:** Team sorted by `order`, leaders separated correctly.
- **E2E:** Page renders H1, team cards have images with alt text, social links open in new tab.
- **A11y:** axe-core via `@axe-core/playwright` reports zero violations.
- Timeline scrolls horizontally on desktop with keyboard (focusable container with `tabIndex={0}` and `aria-label="Company milestones"`).
- Lighthouse mobile ≥ 90 despite being image-heavy (verify all non-hero images are lazy, which is `next/image` default).
