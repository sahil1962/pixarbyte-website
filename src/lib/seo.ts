import type { Metadata } from "next";
import type { SiteConfig } from "@/types/content";

const DEFAULT_OG_IMAGE = "/opengraph-image";

/**
 * Page metadata with a canonical URL and full Open Graph/Twitter fields. Page-level
 * `openGraph` replaces the layout's rather than merging with it, so site name, locale and
 * type are repeated here. Images come from the nearest `opengraph-image` file unless given.
 */
export function buildMetadata({
  title,
  description,
  path,
  site,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  site: SiteConfig;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      url: path,
      // Page-level openGraph drops the inherited default image, so name it. A route's own
      // opengraph-image file still takes priority over this.
      images: [image ?? DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [image ?? DEFAULT_OG_IMAGE] },
  };
}
