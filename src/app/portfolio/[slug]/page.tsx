import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { mdxComponents } from "@/components/mdx";
import { Cta } from "@/components/sections/Cta";
import { BeforeAfterSlider } from "@/components/sections/case-study/BeforeAfterSlider";
import {
  CoverImage,
  ProjectPagination,
  QuickFacts,
  ResultsStats,
} from "@/components/sections/case-study/CaseStudyParts";
import { Gallery } from "@/components/sections/case-study/Gallery";
import { ProjectGrid } from "@/components/sections/portfolio/ProjectGrid";
import { ServiceTestimonial, TechList } from "@/components/sections/service-detail/ServiceDetailSections";
import { EstimateButton, PageEstimateType } from "@/components/shared/Actions";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import { getAdjacentCaseStudies, getCaseStudies, getCaseStudy, getRelatedCaseStudies } from "@/lib/case-studies";
import {
  getCaseStudies as getWork,
  getCaseStudyPageCopy,
  getFinalCta,
  getServicesBySlugs,
  getSiteConfig,
  getTechByIds,
} from "@/lib/content";
import { fill } from "@/lib/format";
import { toCaseStudy } from "@/lib/portfolio";
import { creativeWorkSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCaseStudies()).map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [cs, site, copy] = await Promise.all([getCaseStudy(slug), getSiteConfig(), getCaseStudyPageCopy()]);
  if (!cs) return {};
  const client = cs.meta.confidential ? copy.confidentialClient : cs.meta.client;
  return buildMetadata({
    title: fill(copy.seoTitle, { client }),
    description: cs.meta.summary,
    path: `/portfolio/${slug}`,
    site,
    type: "article",
    image: null,
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();
  const { meta, content } = cs;

  const [site, copy, work, tech, services, adjacent, related, cta] = await Promise.all([
    getSiteConfig(),
    getCaseStudyPageCopy(),
    getWork(),
    getTechByIds(meta.tech),
    getServicesBySlugs(meta.services),
    getAdjacentCaseStudies(slug),
    getRelatedCaseStudies(meta, 3),
    getFinalCta(),
  ]);
  const study = toCaseStudy(meta);
  const estimateType = work.section.estimateFor[meta.category];
  const cardCopy = {
    locationPrefix: work.section.locationPrefix,
    open: work.section.openLabel,
    concept: copy.conceptLabel,
    terminalMock: work.section.terminalMock,
  };

  const facts = [
    { label: copy.facts.client, value: study.client },
    { label: copy.facts.location, value: meta.location },
    { label: copy.facts.industry, value: meta.industry },
    { label: copy.facts.services, value: services.map((s) => s.navLabel).join(", ") },
    ...(meta.duration ? [{ label: copy.facts.duration, value: meta.duration }] : []),
    ...(meta.teamSize ? [{ label: copy.facts.team, value: fill(copy.facts.teamSize, { count: meta.teamSize }) }] : []),
    ...(meta.platforms.length ? [{ label: copy.facts.platforms, value: meta.platforms.join(", ") }] : []),
    { label: copy.facts.year, value: new Date(meta.date).getFullYear() },
  ];

  const externalLinks = [
    { href: meta.liveUrl, label: copy.live },
    { href: meta.appStoreUrl, label: copy.appStore },
    { href: meta.playStoreUrl, label: copy.playStore },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href));

  // Sections with no data are left out; the rest alternate between plain and tinted bands.
  const sections: { key: string; render: (tint: boolean) => ReactNode }[] = [
    ...(meta.results.length
      ? [
          {
            key: "results",
            render: (tint: boolean) => (
              <PageSection id="results" title={copy.results.title} intro={copy.results.intro} tint={tint}>
                <ResultsStats results={meta.results} />
              </PageSection>
            ),
          },
        ]
      : []),
    {
      key: "story",
      render: (tint) => (
        <section className={tint ? "section tint" : "section"} id="story" aria-label={copy.storyLabel}>
          <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="max-w-[720px] min-w-0">
              <MDXRemote source={content} components={mdxComponents} />
            </div>
            <div>
              <QuickFacts title={copy.facts.title} facts={facts} />
            </div>
          </div>
        </section>
      ),
    },
    ...(meta.gallery.length
      ? [
          {
            key: "gallery",
            render: (tint: boolean) => (
              <PageSection id="gallery" title={copy.gallery.title} intro={copy.gallery.intro} tint={tint}>
                <Gallery images={meta.gallery} copy={copy.gallery} />
              </PageSection>
            ),
          },
        ]
      : []),
    ...(meta.beforeAfter
      ? [
          {
            key: "before-after",
            render: (tint: boolean) => (
              <PageSection id="before-after" title={copy.beforeAfter.title} intro={copy.beforeAfter.intro} tint={tint}>
                <BeforeAfterSlider {...meta.beforeAfter!} portrait={meta.mock === "phone"} copy={copy.beforeAfter} />
              </PageSection>
            ),
          },
        ]
      : []),
    {
      key: "tech",
      render: (tint) => (
        <PageSection id="tech" title={copy.tech.title} intro={copy.tech.intro} tint={tint}>
          <TechList tech={tech} label={copy.tech.label} />
        </PageSection>
      ),
    },
    ...(meta.testimonial
      ? [
          {
            key: "testimonial",
            render: (tint: boolean) => (
              <PageSection id="testimonial" title={copy.testimonial.title} intro={copy.testimonial.intro} tint={tint}>
                <ServiceTestimonial
                  t={{
                    name: meta.testimonial!.name,
                    role: `${meta.testimonial!.role}, ${study.client}`,
                    quote: meta.testimonial!.quote,
                    color: meta.colors.primary,
                  }}
                  starsLabel={copy.testimonial.starsLabel}
                />
              </PageSection>
            ),
          },
        ]
      : []),
    {
      key: "more",
      render: (tint) => (
        <PageSection
          id="more-work"
          title={copy.related.title}
          intro={copy.related.intro}
          tint={tint}
          aside={
            <Link href="/portfolio" className="btn btn-outline">
              {copy.related.all}
            </Link>
          }
        >
          <div className="grid gap-10">
            <ProjectGrid projects={related.map(toCaseStudy)} copy={cardCopy} />
            <ProjectPagination
              prev={adjacent.prev && toCaseStudy(adjacent.prev)}
              next={adjacent.next && toCaseStudy(adjacent.next)}
              copy={copy.pagination}
            />
          </div>
        </PageSection>
      ),
    },
  ];

  return (
    <>
      <PageEstimateType type={estimateType} />
      <PageHero
        title={meta.title}
        intro={meta.summary}
        crumbs={[
          { label: copy.breadcrumbHome, href: "/" },
          { label: copy.breadcrumbPortfolio, href: "/portfolio" },
          { label: study.client },
        ]}
        crumbsLabel={copy.breadcrumbLabel}
        site={site}
        meta={
          <div className="case-meta mt-5">
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>{study.client}</strong>
            <span>{`${work.section.locationPrefix} ${meta.location}`}</span>
            {services.map((s) => (
              <span className="badge" key={s.slug}>
                {s.navLabel}
              </span>
            ))}
            {meta.concept && <span className="badge">{copy.conceptNote}</span>}
          </div>
        }
        actions={
          <>
            <EstimateButton className="btn btn-primary btn-lg" type={estimateType}>
              {copy.primary}
            </EstimateButton>
            {externalLinks.map((l) => (
              <a
                key={l.href}
                className="btn btn-outline btn-lg"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            ))}
          </>
        }
        aside={<CoverImage src={meta.cover} alt="" />}
      />

      {sections.map((s, i) => (
        <Fragment key={s.key}>{s.render(i % 2 === 0)}</Fragment>
      ))}

      <Cta content={{ ...cta, title: copy.cta.title, text: copy.cta.text }} />

      <JsonLd data={creativeWorkSchema(site, meta)} />
    </>
  );
}
