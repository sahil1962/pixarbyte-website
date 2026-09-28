import type { AudienceSectionContent, CtaContent } from "@/types/content";
import { siteConfig } from "./site";

/** "Two ways to work with us" section. */
export const audienceSection: AudienceSectionContent = {
  title: "Two ways to work with us.",
  intro: "Whether you're testing an idea or running a team of fifty, the process adapts to you.",
  matchBadge: "Matches your pick",
  cards: [
    {
      id: "founder",
      label: "For founders and startups",
      title: "From idea to paying customers, without the guesswork.",
      text: "You don't need to be technical. We translate your idea into a plan, a price and a product.",
      points: [
        "MVPs launched in 6 to 10 weeks",
        "Fixed price agreed before we start",
        "Investor-ready code you fully own",
        "Plain-English updates every Friday",
      ],
      cta: { label: "Start your project", variant: "primary" },
    },
    {
      id: "business",
      label: "For established businesses",
      title: "A senior team that plugs into yours.",
      text: "Extra capacity, new products or modernising what you have, with the paperwork your procurement team needs.",
      points: [
        "Dedicated developers on a monthly retainer",
        "NDAs, UK contracts and invoices in GBP",
        "UK GDPR-aware builds, UK data hosting",
        "Support SLAs after launch",
      ],
      cta: { label: "Talk to our team", variant: "outline" },
    },
  ],
};

/** Closing call to action. */
export const finalCta: CtaContent = {
  title: "Let's build something your customers will love.",
  text: "Tell us what you're planning. You'll get a clear estimate and a plan within one working day, free and with no obligation.",
  primary: "Get a quick estimate",
  secondary: "Book a 30-minute call",
  contacts: [
    {
      icon: "mail",
      title: siteConfig.email,
      detail: "Replies within 2 working hours",
      href: `mailto:${siteConfig.email}`,
    },
    { icon: "phone", title: siteConfig.phone.display, detail: "Mon to Fri, 9am to 6pm", href: siteConfig.phone.href },
    { icon: "pin", title: siteConfig.location, detail: "Meetings by appointment" },
  ],
};
