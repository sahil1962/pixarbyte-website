import type { MetadataRoute } from "next";
import { getServices, getSiteConfig } from "@/lib/content";

// Only routes that exist are listed; add new pages here as they are built.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ url }, services] = await Promise.all([getSiteConfig(), getServices()]);
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
  ];
}
