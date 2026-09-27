import { getCaseStudies, getCaseStudy } from "@/lib/case-studies";
import { getCaseStudyPageCopy, getSiteConfig } from "@/lib/content";
import { fill } from "@/lib/format";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "PixarByte case study";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

/** Share image for a case study: client, headline and the lead result, in the project's colours. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cs, site, copy] = await Promise.all([getCaseStudy(slug), getSiteConfig(), getCaseStudyPageCopy()]);
  if (!cs) return renderOgImage({ brand: site.name, title: site.description });
  const { meta } = cs;
  const lead = meta.results[0];
  return renderOgImage({
    brand: site.name,
    eyebrow: fill(copy.seoTitle, { client: meta.confidential ? copy.confidentialClient : meta.client }),
    title: meta.title,
    detail: lead && `${lead.value} ${lead.label}`,
    colors: [meta.colors.primary, meta.colors.secondary],
  });
}
