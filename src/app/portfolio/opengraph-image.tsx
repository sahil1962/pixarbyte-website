import { getPortfolioPage, getSiteConfig } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "PixarByte portfolio";
export const size = ogSize;
export const contentType = "image/png";

/** Share image for /portfolio. */
export default async function Image() {
  const [page, site] = await Promise.all([getPortfolioPage(), getSiteConfig()]);
  return renderOgImage({
    brand: site.name,
    eyebrow: "Our work",
    title: page.hero.title,
    detail: "Case studies from London clients",
  });
}
