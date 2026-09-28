/**
 * Content loaders. Pages and layout components read content only through these functions,
 * so moving to a CMS later means changing this file and nothing else.
 */
import { aboutContent, certifications } from "@/data/about";
import { builder } from "@/data/builder";
import { workSection } from "@/data/case-studies";
import { commandMenu } from "@/data/commands";
import { faqs, faqSection } from "@/data/faqs";
import { footer } from "@/data/footer";
import { hero } from "@/data/hero";
import { caseStudyPage, portfolioPage } from "@/data/portfolio";
import { messages } from "@/data/messages";
import { audienceSection, finalCta } from "@/data/home";
import {
  engagementModels,
  estimateContent,
  estimateModel,
  packageGroups,
  pricingPage,
  pricingPlans,
  pricingSection,
} from "@/data/pricing";
import { processSection, processSteps } from "@/data/process";
import {
  bundles,
  finderOptions,
  homeBento,
  serviceDetail,
  services as rawServices,
  servicesPage,
  servicesSection,
} from "@/data/services";
import { header, mobileMenu, notFound, siteConfig } from "@/data/site";
import { comparison, stats, whySection } from "@/data/stats";
import { techCatalog, techRowIds, techSection } from "@/data/tech";
import { team } from "@/data/team";
import { reviewsSection, testimonials } from "@/data/testimonials";
import type { ServiceCard, ServiceSlug, Tech } from "@/types/content";
import type { Service } from "@/types/service";
import { getCaseStudies as loadCaseStudies } from "@/lib/case-studies";
import { icons } from "@/lib/icons";
import { toCaseStudy } from "@/lib/portfolio";
import { servicesSchema } from "@/lib/validation/service";

/* Validate content once at module load, so bad data fails `next build` instead of a page. */
const services: Service[] = servicesSchema.parse(rawServices);
const techById = new Map(techCatalog.map((t) => [t.id, t]));
for (const s of services) {
  for (const id of s.techStack) if (!techById.has(id)) throw new Error(`Unknown tech id "${id}" in service ${s.slug}`);
  for (const name of [s.icon, ...s.offerings.map((o) => o.icon), ...s.benefits.map((b) => b.icon)])
    if (!icons[name]) throw new Error(`Unknown icon "${name}" in service ${s.slug}; add it to src/lib/icons.tsx`);
}

function techByIds(ids: string[]): Tech[] {
  return ids.map((id) => {
    const t = techById.get(id);
    if (!t) throw new Error(`Unknown tech id "${id}"`);
    return t;
  });
}

export async function getSiteConfig() {
  return siteConfig;
}

export async function getHeader() {
  return header;
}

export async function getMobileMenu() {
  return mobileMenu;
}

export async function getFooter() {
  return footer;
}

export async function getHero() {
  return hero;
}

export async function getBuilder() {
  return builder;
}

/** All services, in display order. */
export async function getServices() {
  return [...services].sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getServicesBySlugs(slugs: ServiceSlug[]) {
  return slugs.map((slug) => services.find((s) => s.slug === slug)).filter((s): s is Service => !!s);
}

/** Card view of a service, as shown on the home bento and in related-service grids. */
function toCard(s: Service, layout: ServiceCard["layout"] = { span: 2 }): ServiceCard {
  return {
    slug: s.slug,
    title: s.navLabel,
    shortDescription: s.shortDescription,
    fromPrice: s.pricingHint.from,
    estimate: s.estimate,
    layout,
    visual: s.visual,
  };
}

export async function getServiceCards(slugs?: ServiceSlug[]) {
  const list = slugs ? await getServicesBySlugs(slugs) : await getServices();
  return list.map((s) => toCard(s));
}

/** The home page "Everything you need to ship" bento. */
export async function getHomeServices() {
  const cards = homeBento.map((b) => {
    const s = services.find((x) => x.slug === b.slug);
    if (!s) throw new Error(`Home bento references unknown service ${b.slug}`);
    return toCard(s, { span: b.span, tall: b.tall });
  });
  return { section: servicesSection, services: cards };
}

export async function getServicesPage() {
  return servicesPage;
}

export async function getServiceDetailCopy() {
  return serviceDetail;
}

export async function getServiceFinder() {
  return finderOptions;
}

/** Bundles, each priced from the sum of its services' starting prices. */
export async function getBundles() {
  return bundles.map((b) => ({
    ...b,
    price: b.services.reduce((sum, slug) => sum + (services.find((s) => s.slug === slug)?.pricingHint.from ?? 0), 0),
    serviceNames: b.services.map((slug) => services.find((s) => s.slug === slug)?.navLabel ?? slug),
  }));
}

export async function getTechByIds(ids: string[]) {
  return techByIds(ids);
}

export async function getCaseStudiesByService(slug: ServiceSlug, limit = 3) {
  return (await loadCaseStudies())
    .filter((c) => c.services.includes(slug))
    .slice(0, limit)
    .map(toCaseStudy);
}

export async function getTestimonialForService(slug: ServiceSlug) {
  return testimonials.find((t) => t.services?.includes(slug)) ?? null;
}

export async function getAudiences() {
  return audienceSection;
}

/** Card copy plus every case study (from the MDX files), for the home page and service pages. */
export async function getCaseStudies() {
  return { section: workSection, caseStudies: (await loadCaseStudies()).map(toCaseStudy) };
}

export async function getPortfolioPage() {
  return portfolioPage;
}

export async function getCaseStudyPageCopy() {
  return caseStudyPage;
}

export async function getProcess() {
  return { section: processSection, steps: processSteps };
}

export async function getWhyUs() {
  return { section: whySection, stats, comparison };
}

export async function getTechStack() {
  return { section: techSection, rows: [techByIds(techRowIds[0]), techByIds(techRowIds[1])] as [Tech[], Tech[]] };
}

export async function getTestimonials() {
  return { section: reviewsSection, testimonials };
}

export async function getPricing() {
  return { section: pricingSection, plans: pricingPlans };
}

export async function getFaqs() {
  return { section: faqSection, faqs };
}

export async function getFinalCta() {
  return finalCta;
}

export async function getEstimator() {
  return { content: estimateContent, model: estimateModel, projects: builder.projects };
}

export async function getCommandMenu() {
  return commandMenu;
}

export async function getMessages() {
  return messages;
}

export async function getNotFound() {
  return notFound;
}

/** The review marked `featured`, for pages that quote one client. */
export async function getFeaturedTestimonial() {
  return testimonials.find((t) => t.featured) ?? testimonials[0];
}

export async function getPricingPage() {
  return { page: pricingPage, models: engagementModels, groups: packageGroups };
}

/** Where a service's packages sit on /pricing, e.g. `/pricing#websites`. */
export async function getPricingHref(slug: ServiceSlug) {
  const group = packageGroups.find((g) => g.service === slug);
  return group ? `/pricing#${group.id}` : "/pricing";
}

export async function getAbout() {
  return aboutContent;
}

/** The team in display order, split into leaders and everyone else. */
export async function getTeam() {
  const sorted = [...team].sort((a, b) => a.order - b.order);
  return { leaders: sorted.filter((m) => m.leadership), members: sorted.filter((m) => !m.leadership), all: sorted };
}

export async function getCertifications() {
  return certifications;
}
