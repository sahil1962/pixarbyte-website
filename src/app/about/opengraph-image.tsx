import { getAbout, getSiteConfig } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "About PixarByte";
export const size = ogSize;
export const contentType = "image/png";

/** Share image for /about. */
export default async function Image() {
  const [about, site] = await Promise.all([getAbout(), getSiteConfig()]);
  return renderOgImage({
    brand: site.name,
    eyebrow: "About us",
    title: about.hero.title,
    detail: "A London software studio",
  });
}
