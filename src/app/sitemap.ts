import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";

// Only routes that exist are listed. Add /services, /portfolio, /about, /pricing, /contact
// and /blog (plus their [slug] pages) here as those pages are built.
const routes = [""];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = await getSiteConfig();
  return routes.map((path) => ({
    url: `${url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
