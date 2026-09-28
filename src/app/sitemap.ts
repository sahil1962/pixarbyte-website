import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/case-studies";
import { getServices, getSiteConfig } from "@/lib/content";

// Only routes that exist are listed; add new pages here as they are built.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ url }, services, caseStudies] = await Promise.all([getSiteConfig(), getServices(), getCaseStudies()]);
  const now = new Date();
  return [
    { url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...services.map((s) => ({
      url: `${url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${url}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${url}/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((c) => ({
      url: `${url}/portfolio/${c.slug}`,
      lastModified: new Date(c.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
