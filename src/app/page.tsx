import type { Metadata } from "next";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { WhyUs } from "@/components/sections/WhyUs";
import { Work } from "@/components/sections/Work";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  getAudiences,
  getBuilder,
  getCaseStudies,
  getFaqs,
  getFinalCta,
  getHero,
  getPricing,
  getProcess,
  getHomeServices,
  getSiteConfig,
  getTechStack,
  getTestimonials,
  getWhyUs,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { websiteSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    ...buildMetadata({ title: site.title, description: site.description, path: "/", site }),
    title: { absolute: site.title },
  };
}

export default async function HomePage() {
  const [site, hero, builder, services, audiences, work, process, why, tech, reviews, pricing, faq, cta] =
    await Promise.all([
      getSiteConfig(),
      getHero(),
      getBuilder(),
      getHomeServices(),
      getAudiences(),
      getCaseStudies(),
      getProcess(),
      getWhyUs(),
      getTechStack(),
      getTestimonials(),
      getPricing(),
      getFaqs(),
      getFinalCta(),
    ]);

  return (
    <>
      <Hero content={hero} builder={builder} />
      <Services section={services.section} services={services.services} />
      <WhoWeHelp section={audiences} />
      <Work section={work.section} caseStudies={work.caseStudies} />
      <Process section={process.section} steps={process.steps} />
      <WhyUs section={why.section} stats={why.stats} comparison={why.comparison} />
      <TechMarquee section={tech.section} rows={tech.rows} />
      <Reviews section={reviews.section} testimonials={reviews.testimonials} />
      <Pricing section={pricing.section} plans={pricing.plans} />
      <Faq section={faq.section} faqs={faq.faqs} site={site} />
      <Cta content={cta} />
      <JsonLd data={websiteSchema(site)} />
    </>
  );
}
