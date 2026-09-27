import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/thank-you", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
