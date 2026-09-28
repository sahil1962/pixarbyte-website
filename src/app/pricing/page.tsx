import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { CostEstimator } from "@/components/sections/pricing-page/CostEstimator";
import { EngagementModels } from "@/components/sections/pricing-page/EngagementModels";
import { AlwaysIncluded, CostFactors, PaymentTerms } from "@/components/sections/pricing-page/InfoSections";
import { PackageTabs } from "@/components/sections/pricing-page/PackageTabs";
import { BookCallButton, EstimateButton } from "@/components/shared/Actions";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import { getEstimator, getFaqs, getFinalCta, getPricingPage, getSiteConfig } from "@/lib/content";
import { faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, site] = await Promise.all([getPricingPage(), getSiteConfig()]);
  return buildMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/pricing",
    site,
    image: null,
  });
}

export default async function PricingPage() {
  const [site, { page, models, groups }, estimator, faq, cta] = await Promise.all([
    getSiteConfig(),
    getPricingPage(),
    getEstimator(),
    getFaqs(),
    getFinalCta(),
  ]);

  return (
    <>
      <PageHero
        title={page.hero.title}
        intro={page.hero.intro}
        crumbs={[{ label: page.breadcrumbHome, href: "/" }, { label: page.breadcrumbPricing }]}
        crumbsLabel={page.breadcrumbLabel}
        site={site}
        actions={
          <>
            <EstimateButton className="btn btn-primary btn-lg">{page.hero.primary}</EstimateButton>
            <BookCallButton className="btn btn-outline btn-lg">{page.hero.secondary}</BookCallButton>
          </>
        }
      />

      <PageSection id="models" title={page.models.title} intro={page.models.intro} tint>
        <EngagementModels models={models} copy={page.models} />
      </PageSection>

      <PageSection id="packages" title={page.packages.title} intro={page.packages.intro}>
        <PackageTabs groups={groups} copy={page.packages} />
      </PageSection>

      <PageSection id="factors" title={page.factors.title} intro={page.factors.intro} tint>
        <CostFactors items={page.factors.items} />
      </PageSection>

      <PageSection id="estimator" title={page.estimator.title} intro={page.estimator.intro}>
        <CostEstimator model={estimator.model} projects={estimator.projects} copy={page.estimator} />
      </PageSection>

      <PageSection id="included" title={page.included.title} intro={page.included.intro} tint>
        <AlwaysIncluded items={page.included.items} />
      </PageSection>

      <PageSection id="payment" title={page.payment.title} intro={page.payment.intro}>
        <PaymentTerms copy={page.payment} />
      </PageSection>

      <Faq
        section={{ ...faq.section, title: page.faq.title, intro: page.faq.intro }}
        faqs={page.faq.items}
        site={site}
      />

      <Cta content={{ ...cta, title: page.cta.title, text: page.cta.text }} />

      <JsonLd data={faqSchema(page.faq.items)} />
    </>
  );
}
