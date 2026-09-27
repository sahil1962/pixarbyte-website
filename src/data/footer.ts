import type { FooterContent } from "@/types/content";
import { siteConfig } from "./site";

export const footer: FooterContent = {
  blurb: "A software studio building websites, apps and cloud systems for London businesses.",
  newsletter: { label: "Email address", placeholder: "Monthly tech notes, no spam", button: "Subscribe" },
  // No profile URLs yet: without an href these show the "Demo link" toast, as in the design.
  socials: [
    { label: "in", ariaLabel: "PixarByte on LinkedIn" },
    { label: "gh", ariaLabel: "PixarByte on GitHub" },
    { label: "x", ariaLabel: "PixarByte on X" },
  ],
  columns: [
    {
      title: "Services",
      links: [
        { label: "Web development", href: "/services/frontend-development" },
        { label: "Mobile apps", href: "/services/mobile-app-development" },
        { label: "Full-stack", href: "/services/full-stack-development" },
        { label: "No-code", href: "/services/no-code-development" },
        { label: "Cloud and DevOps", href: "/services/cloud-services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Work", href: "/portfolio" },
        { label: "Process", href: "/#process" },
        { label: "Pricing", href: "/#pricing" },
        { label: "FAQ", href: "/#faq" },
        { label: "Careers", action: "demo" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
        { label: siteConfig.phone.display, href: siteConfig.phone.href },
        { label: siteConfig.location, href: "/#contact" },
        { label: "Book a call", action: "book" },
      ],
    },
  ],
  legal: `© {year} ${siteConfig.legalName}. Registered in England and Wales, company no. ${siteConfig.companyNumber}.`,
  legalNavLabel: "Legal",
  legalLinks: [
    { label: "Privacy", action: "demo" },
    { label: "Terms", action: "demo" },
    { label: "Cookies", action: "demo" },
  ],
};
