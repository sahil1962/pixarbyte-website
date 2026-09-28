import type { EstimateContent, EstimateModel, PricingPlan, PricingSectionContent, ServiceSlug } from "@/types/content";

/**
 * Starting price for each service, in GBP excluding VAT. This is the one place these
 * numbers live: the home bento, the pricing plans and the service pages all read them.
 */
export const servicePrices: Record<ServiceSlug, number> = {
  "frontend-development": 3500,
  "backend-development": 6000,
  "full-stack-development": 15000,
  "no-code-development": 2500,
  "mobile-app-development": 18000,
  "cloud-services": 4000,
};

/** Monthly price of a dedicated developer (the Partner plan). */
export const partnerMonthlyPrice = 5500;

export const pricingSection: PricingSectionContent = {
  title: "Clear prices, agreed before we start.",
  intro: "Starting points for the three ways clients work with us. Your quote is fixed once scope is agreed.",
  fromLabel: "from",
  note: "Prices exclude VAT. Invoiced in GBP in milestones, usually 30% to start, 40% midway and 30% on launch.",
};

/** Starting prices in GBP, excluding VAT. */
export const pricingPlans: PricingPlan[] = [
  {
    name: "Launch",
    price: servicePrices["frontend-development"],
    description: "Marketing sites, landing pages and no-code builds.",
    features: [
      "Custom design, no templates",
      "CMS your team can edit",
      "SEO and analytics set up",
      "Live in 2 to 4 weeks",
    ],
    cta: { label: "Estimate a website", type: "website" },
  },
  {
    name: "Build",
    price: servicePrices["full-stack-development"],
    description: "Web apps, SaaS products and mobile apps.",
    features: [
      "Product design and prototyping",
      "Full-stack build with tests",
      "App Store and cloud deployment",
      "30 days of support included",
    ],
    badge: "Most chosen",
    popular: true,
    cta: { label: "Estimate an app", type: "webapp" },
  },
  {
    name: "Partner",
    price: partnerMonthlyPrice,
    unit: "/ month",
    description: "A dedicated developer or team on a rolling monthly plan.",
    features: [
      "Full-time senior developer",
      "Joins your Slack and stand-ups",
      "Scale up or down each month",
      "30 days' notice, no lock-in",
    ],
    cta: { label: "Talk about a team", type: "cloud" },
  },
];

/** The quick estimator's price model. All amounts are GBP. */
export const estimateModel: EstimateModel = {
  base: { website: 4100, mobile: 21200, webapp: 17650, nocode: 2950, cloud: 4700 },
  sizeMultiplier: { s: 1, m: 1.8, l: 3 },
  weeks: { website: [2, 4], mobile: [8, 14], webapp: [6, 12], nocode: [1, 3], cloud: [1, 4] },
  features: {
    website: [
      { id: "cms", label: "Edit content yourself", price: 1200 },
      { id: "blog", label: "Blog", price: 800 },
      { id: "shop", label: "Online store", price: 4500 },
      { id: "lang", label: "Multiple languages", price: 1500 },
    ],
    mobile: [
      { id: "auth", label: "User accounts", price: 2000 },
      { id: "pay", label: "In-app payments", price: 3000 },
      { id: "map", label: "Maps and tracking", price: 2500 },
      { id: "admin", label: "Admin dashboard", price: 4000 },
    ],
    webapp: [
      { id: "auth", label: "User accounts", price: 1500 },
      { id: "pay", label: "Subscriptions", price: 3500 },
      { id: "admin", label: "Admin dashboard", price: 4000 },
      { id: "api", label: "Third-party integrations", price: 2500 },
    ],
    nocode: [
      { id: "auto", label: "Automations", price: 800 },
      { id: "db", label: "Database setup", price: 900 },
      { id: "pay", label: "Payments", price: 700 },
      { id: "members", label: "Member logins", price: 1000 },
    ],
    cloud: [
      { id: "ci", label: "CI/CD pipeline", price: 1500 },
      { id: "mig", label: "Migration", price: 4000 },
      { id: "mon", label: "Monitoring and alerts", price: 1200 },
      { id: "iac", label: "Infrastructure as code", price: 2500 },
    ],
  },
  spread: { low: 0.85, high: 1.2 },
};

export const estimateContent: EstimateContent = {
  title: "Quick estimate",
  intro: "Answer three questions for a ballpark price. No sign-up needed.",
  closeAriaLabel: "Close",
  typeLabel: "What are you building?",
  sizeLabel: "How big is it?",
  sizes: [
    { id: "s", label: "Small" },
    { id: "m", label: "Medium" },
    { id: "l", label: "Large" },
  ],
  defaultSize: "s",
  featuresLabel: "What does it need?",
  rangeLabel: "Estimated range",
  timelineLabel: "Timeline",
  timeline: "{min} to {max} weeks",
  disclaimer: "A rough guide. Your final quote depends on detailed requirements.",
  emailLabel: "Get the full breakdown by email",
  emailPlaceholder: "you@company.com",
  submit: "Send estimate",
  emailError: "Enter a valid email address, like you@company.com.",
  success: {
    title: "Estimate sent",
    text: "We sent a {type} estimate of {range} to {email}. We'll follow up within 24 hours.",
    done: "Done",
  },
};
