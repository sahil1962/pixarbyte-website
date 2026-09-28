import type { EstimateContent, EstimateModel, PricingPlan, PricingSectionContent, ServiceSlug } from "@/types/content";
import type { EngagementModel, PackageGroup, PricingPageContent } from "@/types/pricing";

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
  sending: "Sending…",
  emailError: "Enter a valid email address, like you@company.com.",
  sendError: "We couldn't send your estimate. Please try again, or email hello@pixarbyte.co.uk.",
  exactQuote: { lead: "Want a fixed price?", link: "Get an exact quote" },
  honeypotLabel: "Leave this field empty",
  success: {
    title: "Estimate sent",
    text: "We sent a {type} estimate of {range} to {email}. We'll follow up within 24 hours.",
    done: "Done",
  },
};

/* ---------------------------------------------------------------------------
 * /pricing. Every amount below either reads the tables above or is defined here,
 * so the home page, the service pages, the estimate dialog and /pricing agree.
 * ------------------------------------------------------------------------- */

/** Hourly rate for small changes and ad hoc work. */
export const hourlyRate = 65;

/** Monthly maintenance and support, entry level. */
export const maintenanceMonthlyPrice = 250;

export const engagementModels: EngagementModel[] = [
  {
    id: "fixed",
    title: "Fixed-price project",
    icon: "Receipt",
    bestFor: "A clear goal and a budget to match.",
    howItWorks:
      "We agree scope, timeline and price up front. You pay in three milestones and the price doesn't move unless the scope does.",
    priceFrom: Math.min(...Object.values(servicePrices)),
    priceUnit: "project",
    pros: ["Budget agreed before we start", "Clear deliverables and dates", "Weekly demos"],
    cta: { label: "Get a fixed quote" },
    highlighted: true,
  },
  {
    id: "hourly",
    title: "Hourly",
    icon: "Timer",
    bestFor: "Small changes, fixes and advice.",
    howItWorks: "Book blocks of time for smaller jobs. You see every hour logged against a task, invoiced monthly.",
    priceFrom: hourlyRate,
    priceUnit: "hour",
    pros: ["No minimum commitment", "Senior developers only", "Time logged per task"],
    cta: { label: "Book some hours", type: "website" },
  },
  {
    id: "dedicated",
    title: "Dedicated developer",
    icon: "Users",
    bestFor: "Ongoing product work with your own team.",
    howItWorks: "A full-time senior developer joins your Slack and stand-ups on a rolling monthly plan.",
    priceFrom: partnerMonthlyPrice,
    priceUnit: "month",
    pros: ["Scale up or down each month", "30 days' notice, no lock-in", "UK working hours"],
    cta: { label: "Talk about a team", type: "webapp" },
  },
  {
    id: "maintenance",
    title: "Maintenance and support",
    icon: "Wrench",
    bestFor: "Keeping a live site or app healthy.",
    howItWorks: "Updates, security patches, monitoring and a set number of support hours each month.",
    priceFrom: maintenanceMonthlyPrice,
    priceUnit: "month",
    pros: ["Security updates applied", "Uptime monitoring", "Reply within two working hours"],
    cta: { label: "Ask about support", type: "cloud" },
  },
];

export const packageGroups: PackageGroup[] = [
  {
    id: "websites",
    label: "Websites",
    service: "frontend-development",
    intro: "Marketing sites and landing pages, designed and built to load fast and rank well.",
    featureRows: [
      { key: "pages", label: "Pages" },
      { key: "design", label: "Custom design" },
      { key: "cms", label: "CMS", tooltip: "Edit text and images yourself, without a developer." },
      { key: "blog", label: "Blog" },
      { key: "seo", label: "SEO set-up" },
      { key: "shop", label: "Online store" },
      { key: "languages", label: "Multiple languages" },
    ],
    tiers: [
      {
        id: "starter",
        name: "Starter",
        priceFrom: servicePrices["frontend-development"],
        idealFor: "A first site or a campaign landing page.",
        deliveryTime: "2 to 4 weeks",
        supportPeriod: "30 days",
        features: {
          pages: "Up to 5",
          design: true,
          cms: true,
          blog: false,
          seo: "Technical",
          shop: false,
          languages: false,
        },
        cta: { label: "Get a quote", type: "website" },
      },
      {
        id: "business",
        name: "Business",
        priceFrom: 7500,
        idealFor: "Growing businesses that publish regularly.",
        highlighted: true,
        deliveryTime: "4 to 6 weeks",
        supportPeriod: "60 days",
        features: {
          pages: "Up to 15",
          design: true,
          cms: true,
          blog: true,
          seo: "Technical and content",
          shop: false,
          languages: false,
        },
        cta: { label: "Get a quote", type: "website" },
      },
      {
        id: "advanced",
        name: "Advanced",
        priceFrom: 0,
        idealFor: "Large sites, online shops and multilingual brands.",
        deliveryTime: "6 weeks or more",
        supportPeriod: "90 days",
        features: {
          pages: "Unlimited",
          design: true,
          cms: true,
          blog: true,
          seo: "Technical and content",
          shop: true,
          languages: true,
        },
        cta: { label: "Get a quote", type: "website" },
      },
    ],
  },
  {
    id: "web-apps",
    label: "Web apps",
    service: "full-stack-development",
    intro: "SaaS products, portals and internal tools, from the first design to launch.",
    featureRows: [
      { key: "design", label: "Product design and prototype" },
      { key: "accounts", label: "User accounts and roles" },
      { key: "admin", label: "Admin dashboard" },
      { key: "payments", label: "Payments or subscriptions" },
      { key: "integrations", label: "Third-party integrations" },
      { key: "tests", label: "Automated tests" },
    ],
    tiers: [
      {
        id: "mvp",
        name: "MVP",
        priceFrom: servicePrices["full-stack-development"],
        idealFor: "Founders testing an idea with real users.",
        deliveryTime: "6 to 10 weeks",
        supportPeriod: "30 days",
        features: {
          design: true,
          accounts: true,
          admin: "Basic",
          payments: true,
          integrations: "Up to 2",
          tests: true,
        },
        cta: { label: "Get a quote", type: "webapp" },
      },
      {
        id: "growth",
        name: "Growth",
        priceFrom: 30000,
        idealFor: "Products with paying customers and a roadmap.",
        highlighted: true,
        deliveryTime: "10 to 16 weeks",
        supportPeriod: "60 days",
        features: { design: true, accounts: true, admin: "Full", payments: true, integrations: "Up to 5", tests: true },
        cta: { label: "Get a quote", type: "webapp" },
      },
      {
        id: "scale",
        name: "Scale",
        priceFrom: 0,
        idealFor: "Complex platforms, multi-tenant SaaS and regulated data.",
        deliveryTime: "16 weeks or more",
        supportPeriod: "90 days",
        features: {
          design: true,
          accounts: true,
          admin: "Full",
          payments: true,
          integrations: "Unlimited",
          tests: true,
        },
        cta: { label: "Get a quote", type: "webapp" },
      },
    ],
  },
  {
    id: "mobile-apps",
    label: "Mobile apps",
    service: "mobile-app-development",
    intro: "iOS and Android apps from one codebase, published to both stores.",
    featureRows: [
      { key: "platforms", label: "iOS and Android" },
      { key: "accounts", label: "User accounts" },
      { key: "push", label: "Push notifications" },
      { key: "payments", label: "In-app payments" },
      { key: "maps", label: "Maps and live tracking" },
      { key: "admin", label: "Admin dashboard" },
      { key: "stores", label: "App Store and Google Play submission" },
    ],
    tiers: [
      {
        id: "launch",
        name: "Launch",
        priceFrom: servicePrices["mobile-app-development"],
        idealFor: "A focused first version of your app.",
        deliveryTime: "8 to 14 weeks",
        supportPeriod: "30 days",
        features: {
          platforms: true,
          accounts: true,
          push: true,
          payments: false,
          maps: false,
          admin: "Basic",
          stores: true,
        },
        cta: { label: "Get a quote", type: "mobile" },
      },
      {
        id: "growth",
        name: "Growth",
        priceFrom: 35000,
        idealFor: "Apps with payments, tracking and a busy back office.",
        highlighted: true,
        deliveryTime: "14 to 20 weeks",
        supportPeriod: "60 days",
        features: {
          platforms: true,
          accounts: true,
          push: true,
          payments: true,
          maps: true,
          admin: "Full",
          stores: true,
        },
        cta: { label: "Get a quote", type: "mobile" },
      },
      {
        id: "custom",
        name: "Custom",
        priceFrom: 0,
        idealFor: "Offline-first, hardware or high-traffic apps.",
        deliveryTime: "20 weeks or more",
        supportPeriod: "90 days",
        features: {
          platforms: true,
          accounts: true,
          push: true,
          payments: true,
          maps: true,
          admin: "Full",
          stores: true,
        },
        cta: { label: "Get a quote", type: "mobile" },
      },
    ],
  },
  {
    id: "no-code",
    label: "No-code",
    service: "no-code-development",
    intro: "Portals, internal tools and automations your team can change without a developer.",
    featureRows: [
      { key: "app", label: "App or portal" },
      { key: "automations", label: "Automations", tooltip: "Flows between your tools, such as Zapier or Make." },
      { key: "logins", label: "Member logins" },
      { key: "payments", label: "Payments" },
      { key: "training", label: "Team training" },
    ],
    tiers: [
      {
        id: "starter",
        name: "Starter",
        priceFrom: servicePrices["no-code-development"],
        idealFor: "One workflow or a simple portal.",
        deliveryTime: "1 to 3 weeks",
        supportPeriod: "30 days",
        features: { app: true, automations: "Up to 3", logins: false, payments: false, training: "1 session" },
        cta: { label: "Get a quote", type: "nocode" },
      },
      {
        id: "growth",
        name: "Growth",
        priceFrom: 6000,
        idealFor: "Client portals and connected back-office tools.",
        highlighted: true,
        deliveryTime: "3 to 5 weeks",
        supportPeriod: "60 days",
        features: { app: true, automations: "Up to 10", logins: true, payments: true, training: "2 sessions" },
        cta: { label: "Get a quote", type: "nocode" },
      },
      {
        id: "advanced",
        name: "Advanced",
        priceFrom: 0,
        idealFor: "Several connected apps and complex data.",
        deliveryTime: "5 weeks or more",
        supportPeriod: "90 days",
        features: { app: true, automations: "Unlimited", logins: true, payments: true, training: "Ongoing" },
        cta: { label: "Get a quote", type: "nocode" },
      },
    ],
  },
  {
    id: "apis",
    label: "APIs and backend",
    service: "backend-development",
    intro: "APIs, databases and integrations that your apps and partners can rely on.",
    featureRows: [
      { key: "api", label: "REST or GraphQL API" },
      { key: "database", label: "Database design" },
      { key: "auth", label: "Authentication" },
      { key: "integrations", label: "Third-party integrations" },
      { key: "docs", label: "API documentation" },
      { key: "monitoring", label: "Monitoring and alerts" },
    ],
    tiers: [
      {
        id: "starter",
        name: "Starter",
        priceFrom: servicePrices["backend-development"],
        idealFor: "A focused API for one app.",
        deliveryTime: "3 to 6 weeks",
        supportPeriod: "30 days",
        features: { api: true, database: true, auth: true, integrations: "Up to 2", docs: true, monitoring: false },
        cta: { label: "Get a quote", type: "webapp" },
      },
      {
        id: "growth",
        name: "Growth",
        priceFrom: 14000,
        idealFor: "Several apps or partners on one platform.",
        highlighted: true,
        deliveryTime: "6 to 10 weeks",
        supportPeriod: "60 days",
        features: { api: true, database: true, auth: true, integrations: "Up to 6", docs: true, monitoring: true },
        cta: { label: "Get a quote", type: "webapp" },
      },
      {
        id: "enterprise",
        name: "Enterprise",
        priceFrom: 0,
        idealFor: "Legacy systems, high volumes and strict compliance.",
        deliveryTime: "10 weeks or more",
        supportPeriod: "90 days",
        features: { api: true, database: true, auth: true, integrations: "Unlimited", docs: true, monitoring: true },
        cta: { label: "Get a quote", type: "webapp" },
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud and DevOps",
    service: "cloud-services",
    intro: "Hosting, deploys and monitoring set up properly, usually on AWS in London.",
    featureRows: [
      { key: "setup", label: "Cloud account set-up" },
      { key: "ci", label: "CI/CD pipeline" },
      { key: "iac", label: "Infrastructure as code" },
      { key: "migration", label: "Migration from your current host" },
      { key: "monitoring", label: "Monitoring and alerts" },
      { key: "review", label: "Cost review" },
    ],
    tiers: [
      {
        id: "setup",
        name: "Set-up",
        priceFrom: servicePrices["cloud-services"],
        idealFor: "A new app that needs a solid home.",
        deliveryTime: "1 to 3 weeks",
        supportPeriod: "30 days",
        features: { setup: true, ci: true, iac: false, migration: false, monitoring: true, review: false },
        cta: { label: "Get a quote", type: "cloud" },
      },
      {
        id: "migration",
        name: "Migration",
        priceFrom: 9000,
        idealFor: "Moving a live platform with zero downtime.",
        highlighted: true,
        deliveryTime: "3 to 8 weeks",
        supportPeriod: "60 days",
        features: { setup: true, ci: true, iac: true, migration: true, monitoring: true, review: true },
        cta: { label: "Get a quote", type: "cloud" },
      },
      {
        id: "managed",
        name: "Managed",
        priceFrom: 0,
        idealFor: "Multi-region, compliance and 24/7 cover.",
        deliveryTime: "Ongoing",
        supportPeriod: "Included",
        features: { setup: true, ci: true, iac: true, migration: true, monitoring: true, review: true },
        cta: { label: "Get a quote", type: "cloud" },
      },
    ],
  },
];

export const pricingPage: PricingPageContent = {
  seo: {
    title: "Pricing: website, app and cloud development costs",
    description:
      "Clear GBP prices for websites, web apps, mobile apps, no-code and cloud work in London. Fixed-price, hourly and dedicated developer options, with a cost estimator.",
  },
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbPricing: "Pricing",
  hero: {
    title: "Clear prices, agreed before we start.",
    intro:
      "Starting prices for every service, the ways you can work with us, and an estimator for a ballpark figure. All prices are in GBP and exclude VAT.",
    primary: "Get a quick estimate",
    secondary: "Book a 30-minute call",
  },
  models: {
    title: "Ways to work with us.",
    intro: "Pick the model that fits the work. Most clients start with a fixed-price project.",
    fromLabel: "from",
    quoted: "Quoted per project",
    units: { hour: "/ hour", month: "/ month", project: "" },
    bestFor: "Best for",
  },
  packages: {
    title: "Packages.",
    intro: "Typical starting points for each service. Your quote is fixed once scope is agreed.",
    tablistLabel: "Package type",
    fromLabel: "from",
    customQuote: "Custom quote",
    popular: "Most chosen",
    delivery: "Delivery",
    support: "Support after launch",
    included: "Included",
    notIncluded: "Not included",
    compare: "Compare all features",
    compareCaption: "{label} packages compared",
    serviceLink: "More about {label}",
  },
  factors: {
    title: "What affects the price.",
    intro: "Six things move a quote more than anything else.",
    items: [
      {
        icon: "Layers",
        title: "Size and complexity",
        description: "The number of pages, screens and user journeys, and how much logic sits behind them.",
      },
      {
        icon: "Palette",
        title: "Design",
        description: "A refined version of your brand costs less than a full design system built from scratch.",
      },
      {
        icon: "Plug",
        title: "Integrations",
        description: "Payments, CRMs, booking and accounting tools each add set-up and testing time.",
      },
      {
        icon: "MonitorSmartphone",
        title: "Platforms",
        description: "Web, iOS, Android or all three. One codebase keeps the extra cost modest.",
      },
      {
        icon: "Database",
        title: "Content and data",
        description: "Migrating old content or data, and writing new copy, takes real time.",
      },
      {
        icon: "Timer",
        title: "Timeline",
        description: "A fixed launch date can mean a bigger team for a shorter time.",
      },
    ],
  },
  estimator: {
    title: "Cost estimator.",
    intro: "Three questions for a ballpark range. It uses the same prices as our quick estimate.",
    typeLabel: "What are you building?",
    sizeLabel: "How big is it?",
    sizes: [
      { id: "s", label: "Small", hint: "Up to 5 pages or screens" },
      { id: "m", label: "Medium", hint: "6 to 15 pages or screens" },
      { id: "l", label: "Large", hint: "More than 15" },
    ],
    featuresLabel: "What does it need?",
    resultLabel: "Estimated range",
    timelineLabel: "Timeline",
    timeline: "{min} to {max} weeks",
    summaryLabel: "Your selections",
    disclaimer: "A rough guide. Your final quote depends on detailed requirements.",
    cta: "Get an exact quote",
    vat: "GBP, excluding VAT",
  },
  included: {
    title: "Always included.",
    intro: "Whatever you choose, these come as standard.",
    items: [
      "A fixed quote before any work starts",
      "Senior developers on every project",
      "Weekly demos on a private staging link",
      "Accessible, responsive design",
      "Security basics and UK GDPR compliance",
      "Analytics and search set-up",
      "You own the code, designs and accounts",
      "Support after launch at no extra cost",
    ],
  },
  payment: {
    title: "How payment works.",
    intro: "Fixed-price projects are paid in three milestones, so you're never paying far ahead of the work.",
    stages: [
      { percent: 30, label: "To start", when: "When the plan and quote are signed" },
      { percent: 40, label: "Midway", when: "When the main build is on staging" },
      { percent: 30, label: "On launch", when: "When you sign off and we go live" },
    ],
    methodsLabel: "Ways to pay",
    methods: ["Bank transfer (BACS or Faster Payments)", "Debit or credit card", "Direct Debit for monthly plans"],
    notes: [
      "Invoices are in GBP. VAT is added at the standard rate.",
      "Payment terms are 14 days from the invoice date.",
      "Monthly plans are billed in advance and can be stopped with 30 days' notice.",
    ],
  },
  faq: {
    title: "Pricing questions.",
    intro: "Anything else about cost, just ask. We reply within two working hours.",
    items: [
      {
        question: "Are your prices fixed?",
        answer:
          "Yes, once we've agreed the scope. The starting prices on this page are guides; after a free call we send a fixed quote, and that's what you pay unless you ask for changes.",
      },
      {
        question: "Do prices include VAT?",
        answer: "No. All prices exclude VAT, which is added at the standard rate on each invoice.",
      },
      {
        question: "What happens if we want to change the scope?",
        answer:
          "We'll tell you the cost and time impact in writing before doing anything. Small changes often fit within the plan; bigger ones get a short change quote you can accept or decline.",
      },
      {
        question: "Why is there a range rather than one price?",
        answer:
          "Two projects of the same type can differ a lot in detail. The range covers most projects we see; your fixed quote narrows it to one number.",
      },
      {
        question: "Can we spread the cost?",
        answer:
          "Fixed-price projects are already split into three payments. For larger builds we can agree more milestones, or phase the work so you launch sooner and add features later.",
      },
      {
        question: "What does support after launch cover?",
        answer:
          "Fixing anything that doesn't work as agreed, at no cost, for the support period in your package. After that, you can move to a monthly maintenance plan or book hours as needed.",
      },
    ],
  },
  cta: {
    title: "Not sure which option fits?",
    text: "Tell us about your project and we'll recommend the best approach, with a fixed quote within one working day.",
  },
};
