import { getServicesPage, getSiteConfig } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "PixarByte services";
export const size = ogSize;
export const contentType = "image/png";

/** Share image for /services. */
export default async function Image() {
  const [page, site] = await Promise.all([getServicesPage(), getSiteConfig()]);
  return renderOgImage({
    wordmark: site.wordmark,
    eyebrow: "Services",
    title: page.hero.title,
    detail: "Websites, apps, no-code and cloud · London",
  });
}
