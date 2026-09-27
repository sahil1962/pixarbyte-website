/**
 * Content loaders. Pages and layout components read content only through these functions,
 * so moving to a CMS later means changing this file and nothing else.
 */
import { builder } from "@/data/builder";
import { caseStudies, workSection } from "@/data/case-studies";
import { commandMenu } from "@/data/commands";
import { faqs, faqSection } from "@/data/faqs";
import { footer } from "@/data/footer";
import { hero } from "@/data/hero";
import { messages } from "@/data/messages";
import { audienceSection, finalCta } from "@/data/home";
import { estimateContent, estimateModel, pricingPlans, pricingSection } from "@/data/pricing";
import { processSection, processSteps } from "@/data/process";
import { services, servicesSection } from "@/data/services";
import { header, mobileMenu, notFound, siteConfig } from "@/data/site";
import { comparison, stats, whySection } from "@/data/stats";
import { techRows, techSection } from "@/data/tech";
import { reviewsSection, testimonials } from "@/data/testimonials";

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

export async function getServices() {
  return { section: servicesSection, services };
}

export async function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getAudiences() {
  return audienceSection;
}

export async function getCaseStudies() {
  return { section: workSection, caseStudies };
}

export async function getProcess() {
  return { section: processSection, steps: processSteps };
}

export async function getWhyUs() {
  return { section: whySection, stats, comparison };
}

export async function getTechStack() {
  return { section: techSection, rows: techRows };
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
