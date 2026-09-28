import { getContactPage, getSiteConfig } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Contact PixarByte";
export const size = ogSize;
export const contentType = "image/png";

/** Share image for /contact. */
export default async function Image() {
  const [{ page }, site] = await Promise.all([getContactPage(), getSiteConfig()]);
  return renderOgImage({
    brand: site.name,
    eyebrow: "Contact",
    title: page.hero.title,
    detail: "Free quote within one working day",
  });
}
