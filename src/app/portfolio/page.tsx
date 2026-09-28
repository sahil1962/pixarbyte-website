import type { Metadata } from "next";
import { Suspense } from "react";
import { Cta } from "@/components/sections/Cta";
import { PortfolioExplorer } from "@/components/sections/portfolio/PortfolioExplorer";
import { ProjectGrid } from "@/components/sections/portfolio/ProjectGrid";
import { ServiceTestimonial } from "@/components/sections/service-detail/ServiceDetailSections";
import { BookCallButton, EstimateButton } from "@/components/shared/Actions";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import {
  getCaseStudies,
  getFeaturedTestimonial,
  getFinalCta,
  getPortfolioPage,
  getServices,
  getSiteConfig,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPortfolioPage(), getSiteConfig()]);
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/portfolio",
    site,
    image: null,
  });
}

export default async function PortfolioPage() {
  const [site, page, work, services, testimonial, cta] = await Promise.all([
    getSiteConfig(),
    getPortfolioPage(),
    getCaseStudies(),
    getServices(),
    getFeaturedTestimonial(),
    getFinalCta(),
  ]);
  const projects = work.caseStudies;
  // Only offer filters that match at least one project.
  const serviceFilters = services
    .filter((s) => projects.some((p) => p.services.includes(s.slug)))
    .map((s) => ({ value: s.slug, label: s.navLabel }));
  const industries = [...new Set(projects.map((p) => p.industry))].sort();
  const cardCopy = {
    locationPrefix: work.section.locationPrefix,
    open: page.card.open,
    concept: page.card.concept,
    terminalMock: work.section.terminalMock,
  };

  return (
    <>
      <PageHero
        title={page.hero.title}
        intro={page.hero.intro}
        crumbs={[{ label: page.breadcrumbHome, href: "/" }, { label: page.breadcrumbPortfolio }]}
        crumbsLabel={page.breadcrumbLabel}
        site={site}
        actions={
          <>
            <EstimateButton className="btn btn-primary btn-lg">{page.hero.primary}</EstimateButton>
            <BookCallButton className="btn btn-outline btn-lg">{page.hero.secondary}</BookCallButton>
          </>
        }
      />

      <PageSection id="projects" title={page.explorer.title} intro={page.explorer.intro} tint>
        {/* The fallback is the full, unfiltered grid, so every project is in the static HTML. */}
        <Suspense fallback={<ProjectGrid projects={projects} copy={cardCopy} ctaCard={work.section.ctaCard} />}>
          <PortfolioExplorer
            projects={projects}
            services={serviceFilters}
            industries={industries}
            copy={page.explorer}
            cardCopy={cardCopy}
            ctaCard={work.section.ctaCard}
          />
        </Suspense>
      </PageSection>

      <PageSection id="testimonial" title={page.testimonial.title} intro={page.testimonial.intro}>
        <ServiceTestimonial t={testimonial} starsLabel={page.testimonial.starsLabel} />
      </PageSection>

      <Cta content={{ ...cta, title: page.cta.title, text: page.cta.text }} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: `${site.url}${p.href}`,
          })),
        }}
      />
    </>
  );
}
