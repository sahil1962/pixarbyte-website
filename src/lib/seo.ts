import type { Metadata } from "next";
import type { SiteConfig } from "@/types/content";

const DEFAULT_OG_IMAGE = "/opengraph-image";

/**
 * Page metadata with a canonical URL and full Open Graph/Twitter fields. Page-level
 * `openGraph` replaces the layout's rather than merging with it, so site name, locale and
 * type are repeated here. Without `image` the site default is named; pass `image: null` on routes
 * with their own `opengraph-image` file so that file is used instead.
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
  image?: string | null;
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
      // Page-level openGraph drops the inherited default image, so name it.
      ...(image === null ? {} : { images: [image ?? DEFAULT_OG_IMAGE] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image === null ? {} : { images: [image ?? DEFAULT_OG_IMAGE] }),
    },
  };
}
