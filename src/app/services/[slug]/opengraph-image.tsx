import { getServiceBySlug, getServiceDetailCopy, getServices, getSiteConfig } from "@/lib/content";
import { formatGBP } from "@/lib/format";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "PixarByte service";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

/** Share image for a service page: name, headline and starting price. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, site, copy] = await Promise.all([getServiceBySlug(slug), getSiteConfig(), getServiceDetailCopy()]);
  if (!service) return renderOgImage({ brand: site.name, title: site.description });
  return renderOgImage({
    brand: site.name,
    eyebrow: service.name,
    title: service.hero.heading,
    detail: `${copy.fromLabel} ${formatGBP(service.pricingHint.from)}`,
  });
}
