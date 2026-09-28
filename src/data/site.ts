import type { HeaderContent, MobileMenuContent, SiteConfig } from "@/types/content";

/** Single source of truth for brand details reused by the header, footer, SEO and schema. */
export const siteConfig: SiteConfig = {
  name: "PixarByte",
  legalName: "PixarByte Ltd",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixarbyte.co.uk",
  title: "PixarByte | Web, App and Cloud Development in London",
  description:
    "PixarByte builds websites, web apps, mobile apps and cloud systems for London businesses. Fixed prices, weekly demos, and code you own.",
  locale: "en_GB",
  email: "hello@pixarbyte.co.uk",
  phone: { display: "+44 20 0000 0000", href: "tel:+442000000000" },
  location: "London, United Kingdom",
  companyNumber: "00000000",
  brandAriaLabel: "PixarByte home",
  skipLink: "Skip to content",
};

export const header: HeaderContent = {
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/portfolio" },
    { label: "Process", href: "/#process" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  navLabel: "Main",
  allServicesLabel: "All services",
  search: {
    label: "Search or jump to",
    ariaLabel: "Search and quick actions",
    shortcut: { mac: "⌘K", other: "Ctrl K" },
  },
  themeAriaLabel: "Toggle dark mode",
  primaryCta: "Start a project",
  menuAriaLabel: "Open menu",
};

export const mobileMenu: MobileMenuContent = {
  ariaLabel: "Menu",
  navLabel: "Mobile",
  closeAriaLabel: "Close menu",
  links: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Process", href: "/#process" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: "Get a quick estimate",
  secondaryCta: "Book a 30-minute call",
};

/** 404 page. */
export const notFound = {
  eyebrow: "Error 404",
  title: "We couldn't find that page.",
  text: "It may have moved, or the link might have a typo. Here are some good places to carry on.",
  cta: "Back to the home page",
  secondary: "Get a free quote",
  linksTitle: "Popular pages",
  links: [
    { label: "Our services", href: "/services", detail: "Websites, apps, no-code and cloud" },
    { label: "Our work", href: "/portfolio", detail: "Case studies from London clients" },
    { label: "Pricing", href: "/pricing", detail: "Fixed prices in GBP" },
    { label: "About us", href: "/about", detail: "Who we are and how we work" },
  ],
  searchHint: "Or press / to search the site.",
};
