import type { FAQ, ProcessStep, ProjectType, ServiceSlug, ServiceVisual } from "./content";

/** A lucide-react icon name resolved by src/lib/icons.tsx (kept as a string so data stays serialisable). */
export type IconKey = string;

export interface SubService {
  title: string;
  description: string;
  icon: IconKey;
}

export interface Benefit {
  title: string;
  description: string;
  icon: IconKey;
}

export interface Service {
  slug: ServiceSlug;
  order: number;
  /** "Mobile app development" */
  name: string;
  /** Short label for menus and cards: "Mobile apps" */
  navLabel: string;
  icon: IconKey;
  /** Card text, 120 characters or fewer. */
  shortDescription: string;
  seo: { title: string; description: string; keywords?: string[] };
  /** The design uses live illustrations instead of photos, so the hero shows `visual`. */
  hero: { heading: string; subheading: string };
  /** Interactive illustration shared by the home bento, the services overview and the detail hero. */
  visual: ServiceVisual;
  /** Which tab the quick estimate opens on for this service. */
  estimate: { type: ProjectType; label: string };
  overview: string[];
  /** 6 to 8 */
  offerings: SubService[];
  /** Exactly 4 */
  benefits: Benefit[];
  /** Ids from src/data/tech.ts */
  techStack: string[];
  /** Five steps, same shape as the home page process. */
  process: ProcessStep[];
  useCases: string[];
  /** Starting price. The amount itself lives in src/data/pricing.ts. */
  pricingHint: { from: number; currency: "GBP"; unit?: string; note?: string };
  /** 5 to 8 */
  faqs: FAQ[];
  relatedServices: ServiceSlug[];
  comparison?: { caption: string; headers: string[]; rows: string[][] };
}

/** Home page bento placement for a service. */
export interface ServiceBentoItem {
  slug: ServiceSlug;
  span: 2 | 3 | 4;
  tall?: boolean;
}

export interface Bundle {
  name: string;
  description: string;
  services: ServiceSlug[];
  features: string[];
  popular?: boolean;
  badge?: string;
  cta: { label: string; type: ProjectType };
}

export interface FinderOption {
  need: string;
  recommend: ServiceSlug[];
}
