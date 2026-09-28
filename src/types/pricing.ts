import type { FAQ, ProjectType, ServiceSlug } from "./content";

/** Ways to work with us. Prices are GBP excluding VAT. */
export interface EngagementModel {
  id: "fixed" | "hourly" | "dedicated" | "maintenance";
  title: string;
  icon: string;
  bestFor: string;
  howItWorks: string;
  /** Omitted for fixed-price work, which is quoted per project. */
  priceFrom?: number;
  priceUnit?: "hour" | "month" | "project";
  pros: string[];
  cta: { label: string; type?: ProjectType };
  highlighted?: boolean;
}

export interface PackageFeature {
  key: string;
  label: string;
  tooltip?: string;
}

export interface PackageTier {
  id: string;
  name: string;
  /** GBP excluding VAT; 0 means "Custom quote". */
  priceFrom: number;
  idealFor: string;
  highlighted?: boolean;
  deliveryTime: string;
  supportPeriod: string;
  /** Feature key → included (true), not included (false) or a short value ("Up to 5"). */
  features: Record<string, boolean | string>;
  cta: { label: string; type: ProjectType };
}

export interface PackageGroup {
  /** URL hash for deep links, e.g. /pricing#websites. */
  id: string;
  label: string;
  /** The service these packages price; its "from" price is the first tier's price. */
  service: ServiceSlug;
  intro: string;
  featureRows: PackageFeature[];
  tiers: PackageTier[];
}

export interface IconCard {
  icon: string;
  title: string;
  description: string;
}

export interface PaymentStage {
  percent: number;
  label: string;
  when: string;
}

export interface PricingPageContent {
  seo: { title: string; description: string };
  breadcrumbLabel: string;
  breadcrumbHome: string;
  breadcrumbPricing: string;
  hero: { title: string; intro: string; primary: string; secondary: string };
  models: {
    title: string;
    intro: string;
    fromLabel: string;
    quoted: string;
    units: Record<string, string>;
    bestFor: string;
  };
  packages: {
    title: string;
    intro: string;
    tablistLabel: string;
    fromLabel: string;
    customQuote: string;
    popular: string;
    delivery: string;
    support: string;
    included: string;
    notIncluded: string;
    compare: string;
    compareCaption: string;
    serviceLink: string;
  };
  factors: { title: string; intro: string; items: IconCard[] };
  estimator: {
    title: string;
    intro: string;
    typeLabel: string;
    sizeLabel: string;
    sizes: { id: "s" | "m" | "l"; label: string; hint: string }[];
    featuresLabel: string;
    resultLabel: string;
    timelineLabel: string;
    /** `{min}` and `{max}` are replaced with week counts. */
    timeline: string;
    summaryLabel: string;
    disclaimer: string;
    cta: string;
    vat: string;
  };
  included: { title: string; intro: string; items: string[] };
  payment: {
    title: string;
    intro: string;
    stages: PaymentStage[];
    methodsLabel: string;
    methods: string[];
    notes: string[];
  };
  faq: { title: string; intro: string; items: FAQ[] };
  cta: { title: string; text: string };
}
