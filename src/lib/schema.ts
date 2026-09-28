import type { FAQ, SiteConfig } from "@/types/content";
import type { Service } from "@/types/service";

export function organizationSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
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
