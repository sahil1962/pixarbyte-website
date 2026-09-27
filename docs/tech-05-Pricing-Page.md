# Pricing Page: Technical Specification

**Route:** `/pricing` → `src/app/pricing/page.tsx`
**Rendering:** Static page with client islands for currency toggle, package tabs, and cost estimator.
**Data:** `data/pricing.ts`, `data/estimator.ts`.

---

## 1. Data Models

Prices are stored once in a base currency (USD) and converted for display. This avoids maintaining two price lists that drift apart.

```ts
// src/types/pricing.ts
export type Currency = "USD" | "PKR";

export interface EngagementModel {
  id: "fixed" | "hourly" | "dedicated" | "maintenance";
  title: string;
  bestFor: string;
  howItWorks: string;
  priceFrom?: number;          // USD
  priceUnit?: "hour" | "month" | "project";
  pros: string[];
  cta: { label: string; href: string };
}

export interface PackageFeature { label: string; tooltip?: string }

export interface PackageTier {
  id: string;                  // "starter"
  name: string;
  priceFrom: number;           // USD; 0 = "Custom quote"
  idealFor: string;
  highlighted?: boolean;       // "Most Popular"
  deliveryTime: string;
  supportPeriod: string;
  features: Record<string, boolean | string>; // key → ✓/✗ or text like "Up to 5"
  cta: { label: string; href: string };
}

export interface PackageGroup {
  id: string;                  // matches service slug where relevant, used as #anchor
  label: string;               // "Websites"
  featureRows: PackageFeature & { key: string }[];
  tiers: PackageTier[];
}
```

```ts
// src/data/pricing.ts
export const exchangeRates: Record<Currency, number> = { USD: 1, PKR: 280 }; // update periodically

export const engagementModels: EngagementModel[] = [
  { id: "fixed", title: "Fixed-Price Project", bestFor: "Clearly defined projects with a set scope.",
    howItWorks: "We agree on scope, timeline, and cost upfront. Payment in milestones.",
    pros: ["Predictable budget", "Clear deliverables"],
    cta: { label: "Get a Fixed Quote", href: "/contact?model=fixed" } },
  { id: "hourly", title: "Hourly", priceFrom: 20, priceUnit: "hour", /* … */ cta: { label: "Hire Hourly", href: "/contact?model=hourly" } },
  { id: "dedicated", title: "Dedicated Developer", priceFrom: 2000, priceUnit: "month", /* … */ },
  { id: "maintenance", title: "Maintenance & Support", priceFrom: 150, priceUnit: "month", /* … */ },
];

export const packageGroups: PackageGroup[] = [
  {
    id: "websites", label: "Websites",
    featureRows: [
      { key: "pages", label: "Pages" },
      { key: "responsive", label: "Responsive design" },
      { key: "cms", label: "CMS (edit content yourself)", tooltip: "Update text and images without a developer" },
      { key: "blog", label: "Blog" },
      { key: "ecommerce", label: "E-commerce / payments" },
      // …
    ],
    tiers: [
      { id: "starter", name: "Starter", priceFrom: 300, idealFor: "Personal brands, portfolios",
        deliveryTime: "1–2 weeks", supportPeriod: "2 weeks",
        features: { pages: "Up to 5", responsive: true, cms: false, blog: false, ecommerce: false },
        cta: { label: "Get Started", href: "/contact?package=websites-starter" } },
      { id: "business", name: "Business", priceFrom: 800, highlighted: true, /* … */ },
      { id: "advanced", name: "Advanced", priceFrom: 0, /* 0 → "Custom quote" */ },
    ],
  },
  // mobile-apps, no-code, cloud …
];
```
All numbers above are placeholders; set your real prices.

### Currency formatting (`src/lib/currency.ts`)
```ts
import { exchangeRates, type Currency } from "@/data/pricing";

export function formatPrice(usd: number, currency: Currency) {
  const value = usd * exchangeRates[currency];
  const rounded = currency === "PKR" ? Math.round(value / 1000) * 1000 : value; // clean PKR numbers
  return new Intl.NumberFormat(currency === "PKR" ? "en-PK" : "en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(rounded);
}
```

---

## 2. Page Composition

```tsx
// src/app/pricing/page.tsx
export const metadata = buildMetadata({
  title: "Pricing | Website, App & Cloud Development Costs",
  description: "Transparent pricing for web development, mobile apps, no-code, and cloud services. Fixed-price, hourly, and dedicated team options.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <CurrencyProvider>
      <PageHero title="Simple, Transparent Pricing" subtitle="Flexible options for individuals, startups, and enterprises. No hidden fees."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        actions={<CurrencyToggle />} />
      <EngagementModels models={engagementModels} />
      <PackagesSection groups={packageGroups} />
      <CostFactors />
      <CostEstimator config={estimatorConfig} />
      <AlwaysIncluded />
      <PaymentTerms />
      <FAQSection faqs={pricingFaqs} />
      <CTABanner title="Not sure which option fits you?" text="Tell us about your project and we'll recommend the best approach, free of charge."
        primary={{ label: "Get a Free Quote", href: "/contact" }} />
      <JsonLd data={faqSchema(pricingFaqs)} />
    </CurrencyProvider>
  );
}
```

`CurrencyProvider` is a client component, but Server Components can still be passed as its children. Only the price text nodes read context.

---

## 3. Component Specifications

### 3.1 Currency system (Client)

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Currency } from "@/types/pricing";

const Ctx = createContext<{ currency: Currency; setCurrency: (c: Currency) => void }>({ currency: "USD", setCurrency: () => {} });

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pb-currency") as Currency | null;
      if (saved === "USD" || saved === "PKR") setCurrency(saved);
    } catch {}
  }, []);
  const update = (c: Currency) => { setCurrency(c); try { localStorage.setItem("pb-currency", c); } catch {} };
  return <Ctx.Provider value={{ currency, setCurrency: update }}>{children}</Ctx.Provider>;
}
export const useCurrency = () => useContext(Ctx);

export function Price({ usd, unit }: { usd: number; unit?: string }) {
  const { currency } = useCurrency();
  if (usd === 0) return <span>Custom quote</span>;
  return <span>{formatPrice(usd, currency)}{unit && <span className="text-sm font-normal">/{unit}</span>}</span>;
}
```

**SSR note:** Server HTML renders USD (the default), so crawlers always see USD prices. The saved preference applies after hydration.

**Optional auto-detect:** Read Vercel's `x-vercel-ip-country` header in a Server Component to default Pakistani visitors to PKR. This makes the page dynamic, so only do it if the benefit outweighs losing full static rendering.

`CurrencyToggle`: segmented control, two buttons with `aria-pressed`, fires `sendGAEvent('event','pricing_toggle_currency',{ currency })`.

### 3.2 `EngagementModels` (Server with `<Price>` islands)
`grid md:grid-cols-2 xl:grid-cols-4`, equal-height cards (`flex flex-col`, CTA pushed down with `mt-auto`).

### 3.3 `PackagesSection` (Client tabs)
- shadcn `Tabs` with one tab per `PackageGroup`. Tab `value` = group `id`.
- Deep linking: on mount, read `window.location.hash` (e.g., `#mobile-apps`) and activate that tab; service pages link to `/pricing#<id>`.
- **Desktop:** 3 tier cards side by side, highlighted tier gets `ring-2 ring-brand-500 scale-[1.02]` + "Most Popular" badge.
- **Mobile:** Cards stacked, highlighted tier first (`order-first` on small screens).
- Feature rows: render ✓ (`Check` icon, `aria-label="Included"`), ✗ (`Minus`, `aria-label="Not included"`), or text. Tooltip via shadcn `Tooltip` for rows with `tooltip`.
- Also provide an optional full comparison `<table>` behind a "Compare all features" disclosure for detail-oriented visitors.

### 3.4 `CostFactors` (Server)
6 icon cards from a constant array. No interactivity.

### 3.5 `CostEstimator` (Client) – the key interactive feature

**Config (`data/estimator.ts`):**
```ts
export const estimatorConfig = {
  projectTypes: [
    { id: "website", label: "Website", base: 300 },
    { id: "webapp", label: "Web Application", base: 1500 },
    { id: "mobile", label: "Mobile App", base: 2500 },
    { id: "nocode", label: "No-Code Solution", base: 400 },
  ],
  sizes: [
    { id: "small", label: "Small (≤5 pages/screens)", multiplier: 1 },
    { id: "medium", label: "Medium (6–15)", multiplier: 1.8 },
    { id: "large", label: "Large (15+)", multiplier: 3 },
  ],
  features: [
    { id: "auth", label: "User login & accounts", cost: 300 },
    { id: "payments", label: "Online payments", cost: 400 },
    { id: "admin", label: "Admin dashboard", cost: 600 },
    { id: "cms", label: "Content management", cost: 250 },
    { id: "chat", label: "Real-time chat", cost: 500 },
    { id: "maps", label: "Maps & location", cost: 250 },
    { id: "notifications", label: "Push notifications", cost: 200, only: ["mobile"] },
    { id: "multilang", label: "Multiple languages", cost: 300 },
  ],
  design: [
    { id: "template", label: "Template-based", multiplier: 1 },
    { id: "custom", label: "Fully custom design", multiplier: 1.35 },
  ],
  platforms: [ // mobile only
    { id: "one", label: "iOS or Android", multiplier: 1 },
    { id: "both", label: "Both (cross-platform)", multiplier: 1.3 },
  ],
  rangeSpread: 0.25, // show ±25% range
};
```

**Calculation (`lib/estimator.ts`)** as a pure function so it's unit-testable:
```ts
export function estimate(input: EstimatorInput, cfg = estimatorConfig) {
  const type = cfg.projectTypes.find(t => t.id === input.type)!;
  const size = cfg.sizes.find(s => s.id === input.size)!;
  const design = cfg.design.find(d => d.id === input.design)!;
  const features = cfg.features.filter(f => input.features.includes(f.id))
    .reduce((sum, f) => sum + f.cost, 0);
  const platform = input.type === "mobile"
    ? cfg.platforms.find(p => p.id === input.platform)?.multiplier ?? 1 : 1;
  const mid = (type.base * size.multiplier + features) * design.multiplier * platform;
  return {
    low: Math.round((mid * (1 - cfg.rangeSpread)) / 50) * 50,
    high: Math.round((mid * (1 + cfg.rangeSpread)) / 50) * 50,
  };
}
```

**UI:**
- Multi-step (4 steps) with progress bar, or single panel with live-updating result on desktop (form left, sticky result card right).
- Controls: shadcn `RadioGroup` (type, size, design, platform), `Checkbox` list (features; filter by `only`).
- Result card: "Estimated range: $1,800 – $3,000" using `<Price>`, with `aria-live="polite"`.
- Disclaimer text: "This is a rough estimate. Final pricing depends on detailed requirements."
- CTA: "Get an exact quote" → `/contact?estimate=<encoded>` where the selections are serialized into the query string. The contact page reads it and pre-fills the description (see `tech-06`).
- Analytics: `estimator_complete` event with type and range.

### 3.6 `AlwaysIncluded`, `PaymentTerms` (Server)
Checklist and a 3-segment milestone bar (30/40/30) drawn with flex widths (`basis-[30%]` etc.). Payment method logos in a row.

### 3.7 `FAQSection` (Shared)
Native `<details>` implementation from `tech-02`, fed with `pricingFaqs`.

---

## 4. SEO Notes

- Prices are in the static HTML (USD) so Google can index them.
- Don't use `Offer`/`Product` schema with fake precision for "starting from" prices; `FAQPage` schema is the safer, useful markup here.
- Each package group has an `id` anchor for deep links from service pages.

---

## 5. Testing

- **Unit:** `estimate()` for each project type, feature combos, mobile platform multiplier, and rounding.
- **Unit:** `formatPrice(300, "PKR")` → "Rs 84,000" style output; `0` → "Custom quote".
- **E2E:** Toggle to PKR → prices change → reload → PKR persists.
- **E2E:** Visit `/pricing#mobile-apps` → Mobile tab active.
- **E2E:** Complete estimator → click CTA → contact form description pre-filled.

## 6. Acceptance Criteria

- Page is statically generated; JS only loads for toggle, tabs, tooltips, estimator.
- No layout shift when currency changes (price containers use `tabular-nums` and min-width).
- All prices come from one data file; no hard-coded numbers in components.
- Exchange rate update process documented (monthly check).
