import type { HeroContent } from "@/types/content";

export const hero: HeroContent = {
  audienceLabel: "I'm",
  audienceOptions: [
    { id: "founder", label: "a founder with an idea" },
    { id: "business", label: "running a business" },
  ],
  defaultAudience: "business",
  copy: {
    founder: {
      headline: "Turn your idea into a product people pay for.",
      lead: "We help first-time founders design, build, and launch MVPs, websites, and apps, with plain-language guidance at every step and a price agreed upfront.",
      cta: "Start your project",
    },
    business: {
      headline: "We build the software your business runs on.",
      lead: "Custom platforms, mobile apps, and cloud infrastructure for growing companies. Dedicated developers, NDAs as standard, and support long after launch.",
      cta: "Talk to our team",
    },
  },
  secondaryCta: { label: "See our work", href: "#work" },
  proof: {
    rating: "4.9 out of 5",
    detail: "from 50+ clients in 12 countries",
    reviewAriaPrefix: "Read review from",
    reviews: [
      {
        quote: "They rebuilt our ordering app in twelve weeks and it simply works.",
        name: "Ali Raza",
        role: "Founder, FoodGo",
        color: "#0ea5e9",
      },
      {
        quote: "Every decision was explained in plain language. As a non-technical founder, that mattered most.",
        name: "Sara Malik",
        role: "Founder, Stackly",
        color: "#8b5cf6",
      },
      {
        quote: "Our cloud bill dropped by almost half and the site got faster at the same time.",
        name: "James Porter",
        role: "CTO, Northwind Retail",
        color: "#f97316",
      },
      {
        quote: "Deadlines met, weekly demos, zero surprises on the invoice.",
        name: "Hina Khan",
        role: "Operations Lead, Meridian",
        color: "#10b981",
      },
    ],
  },
  clients: {
    label: "Recent clients",
    logos: [
      { name: "FoodGo" },
      { name: "Meridian", style: "serif" },
      { name: "northwind_", style: "mono" },
      { name: "stackly" },
      { name: "Halden & Co", style: "serif" },
      { name: "Qubit Labs" },
      { name: "parcel.io", style: "mono" },
    ],
  },
  replyChip: { title: "Replies in under 2 hours", detail: "Mon to Fri, 9am to 6pm UK time" },
  activity: [
    { initials: "AR", color: "#0ea5e9", title: "Ali approved the FoodGo design", time: "just now" },
    { initials: "SM", color: "#8b5cf6", title: "Stackly MVP went live", time: "12 min ago" },
    { initials: "JP", color: "#f97316", title: "Northwind deployed v2.4.1", time: "34 min ago" },
    { initials: "HK", color: "#10b981", title: "Meridian sprint 4 demo shared", time: "1 hour ago" },
  ],
};
