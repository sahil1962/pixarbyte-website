import { getSiteConfig } from "@/lib/content";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "PixarByte";
export const size = ogSize;
export const contentType = "image/png";

/** Default share image. */
export default async function Image() {
  const site = await getSiteConfig();
  return renderOgImage({ wordmark: site.wordmark, title: site.description });
}
