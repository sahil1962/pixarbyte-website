import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Process } from "@/components/sections/Process";
import { Bundles } from "@/components/sections/services-page/Bundles";
import { ServiceFinder } from "@/components/sections/services-page/ServiceFinder";
import { ServiceRows } from "@/components/sections/services-page/ServiceRows";
import { ServiceCardView } from "@/components/sections/services/ServiceCardView";
import { BookCallButton, EstimateButton } from "@/components/shared/Actions";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import {
  getBundles,
  getFinalCta,
  getProcess,
  getServiceCards,
  getServiceDetailCopy,
  getServiceFinder,
  getServices,
  getServicesPage,
  getSiteConfig,
  getTechByIds,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { serviceListSchema } from "@/lib/schema";
import type { ServiceSlug } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getServicesPage(), getSiteConfig()]);
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/services", site });
}

export default async function ServicesPage() {
  const [site, page, labels, services, cards, finder, bundles, process, cta] = await Promise.all([
    getSiteConfig(),
    getServicesPage(),
    getServiceDetailCopy(),
    getServices(),
    getServiceCards(),
    getServiceFinder(),
    getBundles(),
    getProcess(),
    getFinalCta(),
  ]);
  const tech = Object.fromEntries(
    await Promise.all(services.map(async (s) => [s.slug, await getTechByIds(s.techStack)])),
  );
  const finderCards = Object.fromEntries(
    cards.map((c) => [c.slug, <ServiceCardView key={c.slug} card={c} fromLabel={page.list.fromLabel} />]),
  ) as Record<ServiceSlug, React.ReactNode>;

  return (
    <>
      <PageHero
        title={page.hero.title}
        intro={page.hero.intro}
        crumbs={[{ label: labels.breadcrumbHome, href: "/" }, { label: labels.breadcrumbServices }]}
        crumbsLabel={labels.breadcrumbLabel}
        site={site}
        actions={
          <>
            <EstimateButton className="btn btn-primary btn-lg">{page.hero.primary}</EstimateButton>
            <BookCallButton className="btn btn-outline btn-lg">{page.hero.secondary}</BookCallButton>
          </>
        }
      />

      <PageSection id="all-services" title={page.list.title} intro={page.list.intro} tint>
        <ServiceRows services={services} tech={tech} copy={page.list} />
      </PageSection>

      <PageSection id="finder" title={page.finder.title} intro={page.finder.intro}>
        <ServiceFinder options={finder} cards={finderCards} copy={page.finder} />
      </PageSection>

      <PageSection id="bundles" title={page.bundles.title} intro={page.bundles.intro} tint>
        <Bundles bundles={bundles} copy={page.bundles} />
      </PageSection>

      <Process section={page.process} steps={process.steps} />

      <Cta content={{ ...cta, title: page.cta.title, text: page.cta.text }} />

      <JsonLd data={serviceListSchema(site, services)} />
    </>
  );
}
