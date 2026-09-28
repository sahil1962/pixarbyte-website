import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Process } from "@/components/sections/Process";
import {
  BenefitsGrid,
  ComparisonTable,
  OfferingsGrid,
  ServiceHeroCard,
  ServiceOverview,
  ServiceTestimonial,
  TechList,
  UseCasesAndPrice,
} from "@/components/sections/service-detail/ServiceDetailSections";
import { ServiceCardView } from "@/components/sections/services/ServiceCardView";
import { CaseGrid } from "@/components/sections/work/WorkShowcase";
import { BookCallButton, PageEstimateType } from "@/components/shared/Actions";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import {
  getCaseStudies,
  getCaseStudiesByService,
  getFaqs,
  getFinalCta,
  getPricingHref,
  getProcess,
  getServiceBySlug,
  getServiceCards,
  getServiceDetailCopy,
  getServices,
  getSiteConfig,
  getTechByIds,
  getTestimonialForService,
} from "@/lib/content";
import { fill } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, serviceSchema } from "@/lib/schema";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [service, site] = await Promise.all([getServiceBySlug(slug), getSiteConfig()]);
  if (!service) return {};
  return {
    ...buildMetadata({
      title: service.seo.title,
      description: service.seo.description,
      path: `/services/${slug}`,
      site,
      image: null,
    }),
    keywords: service.seo.keywords,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [site, copy, tech, projects, work, testimonial, related, faq, cta, process] = await Promise.all([
    getSiteConfig(),
    getServiceDetailCopy(),
    getTechByIds(service.techStack),
    getCaseStudiesByService(service.slug, 3),
    getCaseStudies(),
    getTestimonialForService(service.slug),
    getServiceCards(service.relatedServices),
    getFaqs(),
    getFinalCta(),
    getProcess(),
  ]);
  const pricingHref = await getPricingHref(service.slug);
  const name = service.name.toLowerCase();

  // Sections with no data are left out; the rest alternate between plain and tinted bands.
  const sections: { key: string; render: (tint: boolean) => ReactNode }[] = [
    {
      key: "overview",
      render: (tint) => (
        <ServiceOverview id="overview" title={copy.overviewTitle} paragraphs={service.overview} tint={tint} />
      ),
    },
    {
      key: "offerings",
      render: (tint) => (
        <PageSection id="offerings" title={copy.offeringsTitle} intro={copy.offeringsIntro} tint={tint}>
          <OfferingsGrid items={service.offerings} />
        </PageSection>
      ),
    },
    {
      key: "benefits",
      render: (tint) => (
        <PageSection id="benefits" title={copy.benefitsTitle} intro={copy.benefitsIntro} tint={tint}>
          <BenefitsGrid items={service.benefits} />
        </PageSection>
      ),
    },
    ...(service.comparison
      ? [
          {
            key: "comparison",
            render: (tint: boolean) => (
              <PageSection id="comparison" title={copy.comparisonTitle} intro={copy.comparisonIntro} tint={tint}>
                <ComparisonTable {...service.comparison!} />
              </PageSection>
            ),
          },
        ]
      : []),
    {
      key: "tech",
      render: (tint) => (
        <PageSection id="tech" title={copy.techTitle} intro={copy.techIntro} tint={tint}>
          <TechList tech={tech} label={fill(copy.techLabel, { name })} />
        </PageSection>
      ),
    },
    {
      key: "process",
      render: (tint) => (
        <Process
          section={{ ...process.section, title: copy.processTitle, intro: copy.processIntro }}
          steps={service.process}
          tint={tint}
        />
      ),
    },
    ...(projects.length
      ? [
          {
            key: "work",
            render: (tint: boolean) => (
              <PageSection
                id="work"
                title={copy.projectsTitle}
                intro={fill(copy.projectsIntro, { name })}
                tint={tint}
                aside={
                  <Link href={`/portfolio?service=${service.slug}`} className="btn btn-outline">
                    {copy.projectsAll}
                  </Link>
                }
              >
                <CaseGrid section={work.section} caseStudies={projects} />
              </PageSection>
            ),
          },
        ]
      : []),
    {
      key: "pricing",
      render: (tint) => (
        <PageSection id="pricing" title={copy.pricingSectionTitle} intro={copy.pricingSectionIntro} tint={tint}>
          <UseCasesAndPrice service={service} copy={{ ...copy, pricingHref }} />
        </PageSection>
      ),
    },
    {
      key: "faq",
      render: (tint) => (
        <Faq
          section={{ title: copy.faqTitle, intro: copy.faqIntro, phonePrefix: faq.section.phonePrefix }}
          faqs={service.faqs}
          site={site}
          tint={tint}
        />
      ),
    },
    ...(testimonial
      ? [
          {
            key: "testimonial",
            render: (tint: boolean) => (
              <section className={tint ? "section tint" : "section"} aria-label={copy.testimonialLabel}>
                <div className="container">
                  <ServiceTestimonial t={testimonial} starsLabel={copy.testimonialStarsLabel} />
                </div>
              </section>
            ),
          },
        ]
      : []),
    {
      key: "related",
      render: (tint) => (
        <PageSection id="related" title={copy.relatedTitle} intro={fill(copy.relatedIntro, { name })} tint={tint}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <ServiceCardView key={c.slug} card={c} fromLabel={copy.fromLabel} />
            ))}
          </div>
        </PageSection>
      ),
    },
  ];

  return (
    <>
      <PageEstimateType type={service.estimate.type} />
      <PageHero
        title={service.hero.heading}
        intro={service.hero.subheading}
        crumbs={[
          { label: copy.breadcrumbHome, href: "/" },
          { label: copy.breadcrumbServices, href: "/services" },
          { label: service.name },
        ]}
        crumbsLabel={copy.breadcrumbLabel}
        site={site}
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href={`/contact?service=${service.slug}`}>
              {copy.heroPrimary}
            </Link>
            <BookCallButton className="btn btn-outline btn-lg">{copy.heroSecondary}</BookCallButton>
          </>
        }
        aside={<ServiceHeroCard service={service} fromLabel={copy.fromLabel} />}
      />

      {sections.map((s, i) => (
        <Fragment key={s.key}>{s.render(i % 2 === 1)}</Fragment>
      ))}

      <Cta content={{ ...cta, title: fill(copy.ctaTitle, { name }), text: copy.ctaText }} />

      <JsonLd data={serviceSchema(site, service)} />
      <JsonLd data={faqSchema(service.faqs)} />
    </>
  );
}
