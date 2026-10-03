import type { FAQ, SiteConfig } from "@/types/content";
import type { Service } from "@/types/service";
import type { TeamMember } from "@/types/about";
import type { CaseStudyMeta } from "./validation/case-study";

export function organizationSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/pixarbyte-mark-512.png`,
    email: site.email,
    telephone: site.phone.display,
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
  };
}

export function websiteSchema(site: SiteConfig) {
  return { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url };
}

export interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbSchema(site: SiteConfig, crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: new URL(c.href, site.url).toString() } : {}),
    })),
  };
}

export function serviceSchema(site: SiteConfig, s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.seo.description,
    serviceType: s.name,
    url: `${site.url}/services/${s.slug}`,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: s.pricingHint.currency,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: s.pricingHint.from,
        priceCurrency: s.pricingHint.currency,
        valueAddedTaxIncluded: false,
      },
    },
  };
}

export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceListSchema(site: SiteConfig, services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${site.url}/services/${s.slug}`,
    })),
  };
}

export function creativeWorkSchema(site: SiteConfig, m: CaseStudyMeta) {
  const url = `${site.url}/portfolio/${m.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: m.title,
    headline: m.title,
    description: m.summary,
    image: new URL(m.cover, site.url).toString(),
    dateCreated: m.date,
    creator: { "@type": "Organization", name: site.name, url: site.url },
    ...(m.confidential ? {} : { sourceOrganization: { "@type": "Organization", name: m.client } }),
    about: m.industry,
    keywords: m.tech.join(", "),
    inLanguage: "en-GB",
    url,
    mainEntityOfPage: url,
  };
}

export function aboutPageSchema(site: SiteConfig, leaders: TeamMember[], teamSize: number, foundingDate: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${site.url}/about`,
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/pixarbyte-mark-512.png`,
      // Left out until the real founding year replaces the placeholder.
      ...(/^\d{4}$/.test(foundingDate) ? { foundingDate } : {}),
      founder: leaders.map((l) => ({
        "@type": "Person",
        name: l.name,
        jobTitle: l.role,
        image: new URL(l.photo, site.url).toString(),
        sameAs: Object.values(l.socials ?? {}).filter(Boolean),
      })),
      numberOfEmployees: { "@type": "QuantitativeValue", value: teamSize },
      address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    },
  };
}

/** The studio as a local business in London, for search and maps. */
export function localBusinessSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone.display,
    image: `${site.url}/opengraph-image`,
    logo: `${site.url}/brand/pixarbyte-mark-512.png`,
    priceRange: "££",
    currenciesAccepted: "GBP",
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressRegion: "Greater London",
      addressCountry: "GB",
    },
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };
}
