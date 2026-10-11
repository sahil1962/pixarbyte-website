import { getPricingPage, getSiteConfig } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "PixarByte pricing";
export const size = ogSize;
export const contentType = "image/png";

/** Share image for /pricing. */
export default async function Image() {
  const [{ page }, site] = await Promise.all([getPricingPage(), getSiteConfig()]);
  return renderOgImage({
    wordmark: site.wordmark,
    eyebrow: "Pricing",
    title: page.hero.title,
    detail: "Fixed prices in GBP, agreed before we start",
  });
}
