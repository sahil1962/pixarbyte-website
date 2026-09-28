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
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  navLabel: "Main",
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
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
  primaryCta: "Get a quick estimate",
  secondaryCta: "Book a 30-minute call",
};

/** 404 page. */
export const notFound = {
  title: "Page not found.",
  text: "The page you're looking for doesn't exist or has moved.",
  cta: "Back to the home page",
};
