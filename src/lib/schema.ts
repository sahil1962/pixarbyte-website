import type { SiteConfig } from "@/types/content";

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
