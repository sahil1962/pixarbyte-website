import type { ProcessSectionContent, ServicesSectionContent } from "@/types/content";
import type { Bundle, FinderOption, Service, ServiceBentoItem } from "@/types/service";
import { formatGBP } from "@/lib/format";
import { servicePrices } from "./pricing";

/* =========================================================================
   Home page: "Everything you need to ship" section
   ========================================================================= */

export const servicesSection: ServicesSectionContent = {
  title: "Everything you need to ship, under one roof.",
  intro: "Six services, one senior team. Most clients start with one and stay for three.",
  cta: "Get a quick estimate",
  fromLabel: "From",
};

/** Home bento layout, in the order the approved design shows the cards. */
export const homeBento: ServiceBentoItem[] = [
  { slug: "full-stack-development", span: 4 },
  { slug: "mobile-app-development", span: 2, tall: true },
  { slug: "frontend-development", span: 2 },
  { slug: "backend-development", span: 2 },
  { slug: "no-code-development", span: 3 },
  { slug: "cloud-services", span: 3 },
];

/* =========================================================================
   The six services
   ========================================================================= */

export const services: Service[] = [
  {
    slug: "frontend-development",
    order: 1,
    name: "Frontend development",
    navLabel: "Frontend",
    icon: "CodeXml",
    shortDescription: "Fast, accessible interfaces that score in the high 90s on Lighthouse.",
    seo: {
      title: "Frontend development in London",
      description:
        "Fast, accessible websites and interfaces in Next.js and React from a London studio. Fixed prices, weekly demos and code you own.",
      keywords: ["frontend development London", "Next.js agency", "React developers UK", "website development"],
    },
    hero: {
      heading: "Frontend development that's fast for every visitor.",
      subheading:
        "Marketing sites and product interfaces in Next.js and React, built to load in a second, score in the high 90s on Lighthouse and stay easy for your team to update.",
    },
    visual: { kind: "layout", labels: ["Desktop", "Tablet"] },
    estimate: { type: "website", label: "Estimate a site" },
    overview: [
      "Your website is often the first thing a customer sees. If it's slow, hard to read on a phone or buried on page three of Google, they leave before they find out what you do.",
      "We design and build interfaces that load quickly on any connection, work for people using screen readers and keyboards, and rank because they're built properly rather than stuffed with keywords. You get a CMS your team can edit without calling a developer.",
      "Everything is written in TypeScript and handed over in your own GitHub account, so you're never locked in to us.",
    ],
    offerings: [
      {
        title: "Marketing websites",
        description: "Custom-designed sites that explain what you do and turn visitors into enquiries.",
        icon: "LayoutTemplate",
      },
      {
        title: "Product interfaces",
        description: "Dashboards and app screens that feel quick, clear and consistent.",
        icon: "MonitorSmartphone",
      },
      {
        title: "Content management",
        description: "Sanity or Webflow CMS set up so your team can publish without a developer.",
        icon: "FileText",
      },
      {
        title: "Performance tuning",
        description: "Faster loading, better Core Web Vitals and fewer visitors giving up.",
        icon: "Gauge",
      },
      {
        title: "Accessibility",
        description: "WCAG 2.2 AA checks so everyone can use your site, including keyboard and screen reader users.",
        icon: "Accessibility",
      },
      {
        title: "Design systems",
        description: "Reusable components that keep every page on brand as you grow.",
        icon: "Palette",
      },
    ],
    benefits: [
      {
        title: "Found on Google",
        description: "Clean markup, structured data and fast pages give search engines what they reward.",
        icon: "Search",
      },
      {
        title: "Fast on any connection",
        description: "Pages load in around a second, even on a patchy 4G signal.",
        icon: "Zap",
      },
      {
        title: "Usable by everyone",
        description: "Accessible by design, which also means easier for every visitor.",
        icon: "BadgeCheck",
      },
      {
        title: "Easy to change",
        description: "Your team edits content; we hand over clean, documented code.",
        icon: "Wrench",
      },
    ],
    techStack: ["nextjs", "react", "typescript", "tailwind", "sanity", "vercel"],
    process: [
      {
        title: "Discovery",
        time: "2 to 3 days",
        you: "1 to 2 hours",
        text: "We agree who the site is for, what it needs to do and how we'll measure success. You get a fixed quote before we start.",
        gets: ["Sitemap and page list", "Fixed quote and timeline", "Content checklist"],
      },
      {
        title: "Design",
        time: "1 to 2 weeks",
        you: "One review a week",
        text: "Key pages designed in Figma, on brand and on mobile first, then turned into a clickable prototype.",
        gets: ["Homepage and key page designs", "Mobile layouts", "Clickable prototype"],
      },
      {
        title: "Build",
        time: "1 to 2 weeks",
        you: "30 minutes a week",
        text: "We build in Next.js with a staging link you can check any time and a demo every Friday.",
        gets: ["Private staging link", "CMS with your content", "Weekly demo"],
      },
      {
        title: "Test",
        time: "2 to 3 days",
        you: "Try it with your team",
        text: "Real phones and browsers, accessibility checks and a Lighthouse audit before launch.",
        gets: ["Cross-browser QA", "Accessibility report", "Lighthouse scores"],
      },
      {
        title: "Launch and support",
        time: "Ongoing",
        you: "As much as you like",
        text: "We move your domain, set up analytics and redirects, and stay on hand for 30 days after launch.",
        gets: ["Launch and redirects", "Analytics set up", "30 days of support"],
      },
    ],
    useCases: [
      "Company and marketing websites",
      "Landing pages for campaigns",
      "Rebuilding a slow WordPress site",
      "Customer portals and dashboards",
      "Multi-language sites",
      "Headless online stores",
    ],
    pricingHint: {
      from: servicePrices["frontend-development"],
      currency: "GBP",
      note: "Marketing sites and landing pages. Larger product interfaces are quoted after discovery.",
    },
    faqs: [
      {
        question: "Can we update the website ourselves?",
        answer:
          "Yes. We set up a CMS such as Sanity or Webflow so your team can edit text, images and pages, and we show you how in a short handover session.",
      },
      {
        question: "Will the site rank on Google?",
        answer:
          "We build everything search engines look for: fast pages, clean headings, structured data, sitemaps and sensible URLs. Ranking also depends on your content and competition, and we'll tell you honestly what to expect.",
      },
      {
        question: "Do you use templates?",
        answer:
          "No. Every site is designed for your brand and your customers, then built from reusable components so it's quick to extend later.",
      },
      {
        question: "Can you rebuild our existing WordPress site?",
        answer:
          "Yes. We move your content across, keep your URLs or set up redirects so you don't lose search traffic, and make the new site noticeably faster.",
      },
      {
        question: "Where is the site hosted?",
        answer:
          "Usually on Vercel, with your domain and account in your name. If you'd rather host it on AWS or Azure in the UK, we can do that too.",
      },
    ],
    relatedServices: ["no-code-development", "full-stack-development", "cloud-services"],
  },

  {
    slug: "backend-development",
    order: 2,
    name: "Backend and API development",
    navLabel: "Backend and APIs",
    icon: "Server",
    shortDescription: "Secure APIs, payments and integrations that stay fast under real traffic.",
    seo: {
      title: "Backend and API development in London",
      description:
        "Secure APIs, payments, integrations and databases built by a London team. Node.js, Python and PostgreSQL, documented and fixed-price.",
      keywords: ["API development London", "backend developers UK", "Node.js development", "payment integration"],
    },
    hero: {
      heading: "APIs and backends that stay fast under real traffic.",
      subheading:
        "Secure APIs, payments and integrations for your website, app or internal tools, documented properly and built to handle sale days without breaking a sweat.",
    },
    visual: {
      kind: "requests",
      requests: [
        { method: "GET", path: "/v1/orders", ms: 38 },
        { method: "POST", path: "/v1/checkout", ms: 112 },
        { method: "GET", path: "/v1/menu?site=soho", ms: 24 },
        { method: "PUT", path: "/v1/users/481", ms: 61 },
        { method: "POST", path: "/v1/webhooks/stripe", ms: 45 },
        { method: "GET", path: "/v1/bookings/today", ms: 31 },
      ],
    },
    estimate: { type: "webapp", label: "Estimate an API" },
    overview: [
      "Most of what makes software useful happens where customers can't see it: taking payments, syncing stock, sending reminders, keeping data safe. When that layer is slow or fragile, everything built on top of it suffers.",
      "We design and build backends that are secure by default, documented so any developer can pick them up, and tested against real traffic before launch. We connect the tools you already use, from Stripe and Xero to your booking or practice system.",
      "Data stays in UK or EU regions unless you tell us otherwise, and we sign a data processing agreement with every client.",
    ],
    offerings: [
      {
        title: "REST and GraphQL APIs",
        description: "Well-designed APIs for your website, apps and partners, with clear documentation.",
        icon: "Plug",
      },
      {
        title: "Payments",
        description: "Stripe checkouts, subscriptions, deposits and refunds that reconcile cleanly.",
        icon: "CreditCard",
      },
      {
        title: "Integrations",
        description: "Connect your CRM, accounting, booking or stock systems so data flows automatically.",
        icon: "ArrowRightLeft",
      },
      {
        title: "Databases",
        description: "PostgreSQL schemas designed for your data, with backups and migrations handled.",
        icon: "Database",
      },
      {
        title: "Authentication",
        description: "Secure sign-in, roles and permissions, including single sign-on for teams.",
        icon: "KeyRound",
      },
      {
        title: "Background jobs",
        description: "Emails, reports, reminders and imports that run reliably on a schedule.",
        icon: "Timer",
      },
    ],
    benefits: [
      {
        title: "Secure by default",
        description: "Encrypted data, least-privilege access and dependency checks on every release.",
        icon: "ShieldCheck",
      },
      {
        title: "Fast under load",
        description: "Load-tested before launch, with caching where it counts.",
        icon: "Gauge",
      },
      {
        title: "Properly documented",
        description: "Every endpoint documented, so your team or another agency can build on it.",
        icon: "FileText",
      },
      {
        title: "Easy to extend",
        description: "Clear structure and tests make new features quicker and safer to add.",
        icon: "Blocks",
      },
    ],
    techStack: ["nodejs", "typescript", "python", "laravel", "postgresql", "redis", "graphql", "stripe"],
    process: [
      {
        title: "Discovery",
        time: "3 to 5 days",
        you: "2 to 3 hours",
        text: "We map your data, the systems you need to connect and what happens when things go wrong. You get a fixed quote.",
        gets: ["Integration map", "Fixed quote and timeline", "Security and data plan"],
      },
      {
        title: "Design",
        time: "1 week",
        you: "One review",
        text: "API contracts and database design agreed up front, so frontend work can start in parallel.",
        gets: ["API specification", "Database design", "Error-handling plan"],
      },
      {
        title: "Build",
        time: "2 to 6 weeks",
        you: "30 minutes a week",
        text: "Two-week sprints with working endpoints on a staging server and a demo every Friday.",
        gets: ["Staging API", "Automated tests", "Weekly demo"],
      },
      {
        title: "Test",
        time: "1 week",
        you: "Test with real data",
        text: "Security review, load testing and end-to-end tests against your real integrations.",
        gets: ["Load test results", "Security review", "Test report"],
      },
      {
        title: "Launch and support",
        time: "Ongoing",
        you: "As much as you like",
        text: "Zero-downtime deployment, monitoring and alerts, with 30 days of support included.",
        gets: ["Production launch", "Monitoring and alerts", "API documentation"],
      },
    ],
    useCases: [
      "Online ordering and checkout",
      "Booking and appointment systems",
      "Syncing stock across channels",
      "APIs for mobile apps",
      "Connecting a practice or CRM system",
      "Automated reports and invoices",
    ],
    pricingHint: {
      from: servicePrices["backend-development"],
      currency: "GBP",
      note: "A focused API or integration. Larger platforms are quoted after discovery.",
    },
    faqs: [
      {
        question: "Can you work with our existing frontend or app?",
        answer:
          "Yes. We regularly build APIs for websites and mobile apps made by other teams, and agree the API contract with them first so nobody is waiting.",
      },
      {
        question: "Which payment providers do you support?",
        answer:
          "Mostly Stripe, which covers cards, Apple Pay, Google Pay, subscriptions and deposits. We've also integrated GoCardless, PayPal and Adyen.",
      },
      {
        question: "How do you keep data secure?",
        answer:
          "Encryption in transit and at rest, least-privilege access, audited dependencies and regular backups. We host personal data in UK or EU regions and sign a data processing agreement.",
      },
      {
        question: "Will we get documentation?",
        answer:
          "Yes. Every endpoint is documented with examples, and the code, database and infrastructure are handed over in your own accounts.",
      },
      {
        question: "Can you take over an API someone else built?",
        answer:
          "Yes. We start with a fixed-price audit so you know what you have, what needs fixing and what it will cost before we change anything.",
      },
    ],
    relatedServices: ["full-stack-development", "cloud-services", "mobile-app-development"],
  },

  {
    slug: "full-stack-development",
    order: 3,
    name: "Full-stack development",
    navLabel: "Full-stack development",
    icon: "Layers",
    shortDescription:
      "Complete web applications, SaaS products and internal tools, from database to interface, built and owned by one team.",
    seo: {
      title: "Full-stack web app development in London",
      description:
        "SaaS products, internal tools and web apps built end to end by one senior London team. Fixed prices, weekly demos and code you own from day one.",
      keywords: [
        "web app development London",
        "SaaS development agency",
        "full-stack developers UK",
        "MVP development",
      ],
    },
    hero: {
      heading: "Web apps built end to end by one senior team.",
      subheading:
        "SaaS products, customer portals and internal tools, from database to interface. One team, one fixed price and a live demo every Friday.",
    },
    visual: { kind: "stack", layers: ["PostgreSQL", "API", "Interface"], badge: "Hover or tap" },
    estimate: { type: "webapp", label: "Estimate a web app" },
    overview: [
      "Splitting a product between a design agency, a frontend freelancer and a backend contractor means three sets of meetings, three invoices and a lot of finger-pointing when something breaks.",
      "We build the whole thing with one senior team: product design, database, API, interface and deployment. You get one point of contact, one fixed price and a staging link you can try every week.",
      "Whether you're a first-time founder preparing for an investor demo or an established business replacing a spreadsheet that runs the company, we'll help you decide what to build first and what can wait.",
    ],
    offerings: [
      {
        title: "SaaS products",
        description: "Multi-tenant apps with sign-up, teams, billing and an admin area.",
        icon: "Rocket",
      },
      {
        title: "MVPs for founders",
        description: "The smallest product that proves your idea, launched in 6 to 10 weeks.",
        icon: "Sparkles",
      },
      {
        title: "Internal tools",
        description: "Replace the spreadsheets and email chains that slow your team down.",
        icon: "LayoutDashboard",
      },
      {
        title: "Customer portals",
        description: "Let customers book, pay, track orders and manage their account online.",
        icon: "Users",
      },
      {
        title: "Subscriptions and billing",
        description: "Stripe plans, trials, invoices and dunning handled properly.",
        icon: "Receipt",
      },
      {
        title: "Modernising legacy systems",
        description: "Rebuild an ageing system step by step without stopping the business.",
        icon: "RefreshCw",
      },
    ],
    benefits: [
      {
        title: "One team end to end",
        description: "Design, backend, frontend and hosting, with one person accountable.",
        icon: "Handshake",
      },
      {
        title: "Fixed price",
        description: "Agreed after discovery, so the budget doesn't creep sprint by sprint.",
        icon: "PiggyBank",
      },
      {
        title: "Investor-ready code",
        description: "Typed, tested and documented, and it survives technical due diligence.",
        icon: "BadgeCheck",
      },
      {
        title: "Built to grow",
        description: "Architecture that handles your first hundred customers and your first hundred thousand.",
        icon: "TrendingUp",
      },
    ],
    techStack: ["nextjs", "react", "typescript", "nodejs", "postgresql", "stripe", "vercel", "aws"],
    process: [
      {
        title: "Discovery",
        time: "1 week",
        you: "2 to 3 hours",
        text: "A workshop in London or on video to agree users, must-haves and what can wait. You leave with a fixed quote.",
        gets: ["Product brief", "Fixed quote and timeline", "Technical plan"],
      },
      {
        title: "Design",
        time: "1 to 3 weeks",
        you: "One review a week",
        text: "Key screens designed and turned into a clickable prototype you can test with real users.",
        gets: ["UI design", "Clickable prototype", "Design system"],
      },
      {
        title: "Build",
        time: "4 to 10 weeks",
        you: "30 minutes a week",
        text: "Two-week sprints with a live demo every Friday and a staging link that's always up to date.",
        gets: ["Working software every sprint", "Private staging link", "Weekly progress notes"],
      },
      {
        title: "Test",
        time: "1 to 2 weeks",
        you: "Try it with your team",
        text: "Automated tests, real devices, accessibility checks and load testing before launch.",
        gets: ["QA report", "Accessibility check", "Performance audit"],
      },
      {
        title: "Launch and support",
        time: "Ongoing",
        you: "As much as you like",
        text: "We launch, monitor and keep improving. The first 30 days of support are included.",
        gets: ["Production launch", "Monitoring and alerts", "Handover docs and all code"],
      },
    ],
    useCases: [
      "SaaS MVPs for founders",
      "Booking and scheduling platforms",
      "Marketplaces",
      "Replacing spreadsheet workflows",
      "Customer and partner portals",
      "Internal dashboards and reporting",
    ],
    pricingHint: {
      from: servicePrices["full-stack-development"],
      currency: "GBP",
      note: "A focused MVP or internal tool. Your fixed quote follows discovery.",
    },
    faqs: [
      {
        question: "How long does an MVP take?",
        answer:
          "Most MVPs launch in 6 to 10 weeks. We'll help you cut the first version down to what proves your idea, then plan what comes next.",
      },
      {
        question: "Do we own the code?",
        answer:
          "Yes, from day one. Our contract assigns all intellectual property to you, and the code lives in your own GitHub and cloud accounts.",
      },
      {
        question: "I'm not technical. Is that a problem?",
        answer:
          "Not at all. Many of our clients are first-time founders. We explain every decision in plain English and send a short written update every Friday.",
      },
      {
        question: "What happens if the scope changes?",
        answer:
          "Priorities change, and that's fine. We'll show you the impact on time and cost before anything changes, and you decide.",
      },
      {
        question: "Can you work alongside our in-house developers?",
        answer:
          "Yes. We can build the whole product or join your team for a specific part, following your code standards and tools.",
      },
      {
        question: "What does it cost to run after launch?",
        answer:
          "Hosting for a typical MVP is £30 to £150 a month. Ongoing maintenance plans start after the 30 days of support included with every project.",
      },
    ],
    relatedServices: ["backend-development", "mobile-app-development", "cloud-services"],
  },

  {
    slug: "no-code-development",
    order: 4,
    name: "No-code and automation",
    navLabel: "No-code and automation",
    icon: "Blocks",
    shortDescription:
      "Launch in days with Webflow, Bubble and Zapier, and hand your team tools they can edit themselves.",
    seo: {
      title: "No-code development and automation in London",
      description:
        "Webflow sites, Bubble apps and Zapier automations built by a London studio. Launch in days, on a smaller budget, and edit it yourself.",
      keywords: ["no-code agency London", "Webflow developer UK", "Bubble app development", "Zapier automation"],
    },
    hero: {
      heading: "Launch in days, not months, with no-code.",
      subheading:
        "Websites in Webflow, apps in Bubble and automations in Zapier and Make, set up so your own team can edit them without waiting for a developer.",
    },
    visual: {
      kind: "automations",
      items: [
        { letter: "W", color: "#8b5cf6", title: "Send welcome email", detail: "When a customer signs up", on: true },
        { letter: "A", color: "#0ea5e9", title: "Add lead to CRM", detail: "When the contact form is sent", on: true },
        { letter: "S", color: "#16a34a", title: "Post to Slack", detail: "When an order is over £500", on: false },
      ],
    },
    estimate: { type: "nocode", label: "Estimate a build" },
    overview: [
      "Not every idea needs custom code on day one. If you want to test demand, automate admin or give your team a better internal tool, no-code can get you there in days for a fraction of the cost.",
      "We choose the right tool for the job, set it up properly and train your team to run it. When you outgrow it, we'll tell you, and help you move to custom code without starting from scratch.",
    ],
    offerings: [
      {
        title: "Websites in Webflow",
        description: "Custom-designed sites your marketing team can edit and publish.",
        icon: "LayoutTemplate",
      },
      {
        title: "Web apps in Bubble",
        description: "Working apps with logins, data and payments, launched in weeks.",
        icon: "Boxes",
      },
      {
        title: "Client portals in Softr",
        description: "Portals on top of Airtable where clients see their projects and documents.",
        icon: "Users",
      },
      {
        title: "Workflow automation",
        description: "Zapier and Make flows that move data between the tools you already use.",
        icon: "Workflow",
      },
      {
        title: "Airtable databases",
        description: "A proper database behind your operations, not another spreadsheet.",
        icon: "Table2",
      },
      {
        title: "Handover and training",
        description: "Short videos and a session with your team so you can run it yourselves.",
        icon: "BadgeCheck",
      },
    ],
    benefits: [
      {
        title: "Live in days",
        description: "Most builds launch in 1 to 3 weeks, so you learn from real customers sooner.",
        icon: "Timer",
      },
      {
        title: "Your team can edit it",
        description: "Change content, forms and workflows yourselves, without a developer.",
        icon: "Wrench",
      },
      {
        title: "Lower upfront cost",
        description: "A fraction of a custom build, which makes it ideal for testing an idea.",
        icon: "PiggyBank",
      },
      {
        title: "A path to custom code",
        description: "When you outgrow it, we move you to custom code without losing your data.",
        icon: "ArrowRightLeft",
      },
    ],
    techStack: ["webflow", "bubble", "airtable", "softr", "zapier", "make"],
    process: [
      {
        title: "Discovery",
        time: "1 to 2 days",
        you: "1 hour",
        text: "We look at what you need and check no-code is genuinely the right choice. If it isn't, we'll say so.",
        gets: ["Tool recommendation", "Fixed quote", "Build plan"],
      },
      {
        title: "Design",
        time: "2 to 4 days",
        you: "One review",
        text: "Screens and workflows mapped out before we build, so there are no surprises.",
        gets: ["Screen designs", "Workflow map", "Data structure"],
      },
      {
        title: "Build",
        time: "1 to 2 weeks",
        you: "30 minutes a week",
        text: "We build in your own accounts, with a demo at the end of each week.",
        gets: ["Working build", "Automations set up", "Weekly demo"],
      },
      {
        title: "Test",
        time: "1 to 3 days",
        you: "Try it with your team",
        text: "Every workflow run end to end with test data, including what happens when something fails.",
        gets: ["Test runs", "Error alerts", "Fix list"],
      },
      {
        title: "Launch and support",
        time: "Ongoing",
        you: "As much as you like",
        text: "We launch, train your team and stay on hand for 30 days.",
        gets: ["Launch", "Training session and videos", "30 days of support"],
      },
    ],
    useCases: [
      "Testing a startup idea",
      "Client onboarding portals",
      "Automating quotes and invoices",
      "Internal request and approval tools",
      "Membership and course sites",
      "Syncing leads into your CRM",
    ],
    pricingHint: {
      from: servicePrices["no-code-development"],
      currency: "GBP",
      note: "A website or a focused automation. Platform subscriptions are billed to you directly.",
    },
    faqs: [
      {
        question: "Is no-code right for us?",
        answer:
          "It's ideal for testing ideas, marketing sites, internal tools and automating admin. For complex products, heavy traffic or unusual requirements, custom code is usually better. We'll give you an honest recommendation.",
      },
      {
        question: "What will the tools cost each month?",
        answer:
          "Typically £20 to £200 a month depending on the tools and your usage. We'll list every subscription in your quote, and they're billed to you directly.",
      },
      {
        question: "Can we edit it ourselves?",
        answer:
          "Yes, that's the point. We build in your accounts and train your team, with short videos to refer back to.",
      },
      {
        question: "What if we outgrow no-code?",
        answer:
          "We'll help you move to a custom build and bring your data with you. Because we do both, we've no reason to keep you on the wrong tool.",
      },
      {
        question: "Is our data safe in these tools?",
        answer:
          "The tools we use offer UK or EU data hosting and GDPR terms. We set up permissions so each person only sees what they need.",
      },
    ],
    relatedServices: ["frontend-development", "full-stack-development", "backend-development"],
    comparison: {
      caption: "No-code compared with custom code",
      headers: ["", "No-code", "Custom code"],
      rows: [
        ["Time to launch", "1 to 3 weeks", "6 to 12 weeks"],
        [
          "Starting price",
          `From ${formatGBP(servicePrices["no-code-development"])}`,
          `From ${formatGBP(servicePrices["full-stack-development"])}`,
        ],
        ["Who can edit it", "Your team, without a developer", "A developer, or your team via a CMS"],
        ["Monthly running costs", "Tool subscriptions, per user", "Hosting only"],
        ["Handles heavy traffic", "Up to a point", "Yes"],
        ["Best for", "Testing ideas, internal tools, automation", "Complex products and scale"],
      ],
    },
  },

  {
    slug: "mobile-app-development",
    order: 5,
    name: "Mobile app development",
    navLabel: "Mobile apps",
    icon: "Smartphone",
    shortDescription: "iOS and Android apps people keep opening, from first design to App Store launch.",
    seo: {
      title: "Mobile app development in London | iOS and Android",
      description:
        "iOS and Android apps designed, built and launched by a London studio. Flutter, React Native and native Swift and Kotlin, at a fixed price.",
      keywords: ["app developers London", "mobile app development UK", "Flutter agency", "iOS and Android apps"],
    },
    hero: {
      heading: "iOS and Android apps people keep opening.",
      subheading:
        "From first design to App Store launch, we build apps that feel fast and familiar on every phone, with the backend, payments and notifications they need.",
    },
    visual: {
      kind: "swipe",
      ariaLabel: "Swipe through app screens",
      hint: "Tap to swipe",
      cards: [
        { label: "Today", title: "Morning run, 5 km", from: "#3b82f6", to: "#1e40af" },
        { label: "Booked", title: "Table for two, 7pm", from: "#8b5cf6", to: "#5b21b6" },
        { label: "Delivered", title: "Order #1042", from: "#10b981", to: "#047857" },
      ],
    },
    estimate: { type: "mobile", label: "Estimate an app" },
    overview: [
      "People delete apps that are slow, confusing or crash on their phone. Getting an app right means thinking about real devices, patchy signal, notifications people actually want and App Store rules, not just the screens.",
      "We usually build with Flutter or React Native, so one codebase runs on both iOS and Android and you're not paying twice. When an app needs something only native code can do, we use Swift and Kotlin.",
      "We handle the parts people forget: the backend and admin dashboard, push notifications, analytics, App Store and Google Play submission, and updates after launch.",
    ],
    offerings: [
      {
        title: "Cross-platform apps",
        description: "One Flutter or React Native codebase for iOS and Android.",
        icon: "Layers",
      },
      {
        title: "Native iOS and Android",
        description: "Swift and Kotlin when your app needs the full power of the device.",
        icon: "Smartphone",
      },
      {
        title: "App Store launch",
        description: "Store listings, screenshots, review and release handled for you.",
        icon: "Rocket",
      },
      {
        title: "Push notifications",
        description: "Timely, useful notifications that bring people back rather than annoy them.",
        icon: "Bell",
      },
      {
        title: "Maps and live tracking",
        description: "Delivery tracking, store finders and location features that work on the move.",
        icon: "MapPin",
      },
      {
        title: "In-app payments",
        description: "Apple Pay, Google Pay, cards and subscriptions, set up to store rules.",
        icon: "CreditCard",
      },
      {
        title: "Admin dashboards",
        description: "A web dashboard for your team to manage users, orders and content.",
        icon: "LayoutDashboard",
      },
    ],
    benefits: [
      {
        title: "One codebase, two stores",
        description: "Cross-platform apps cost less to build and less to keep updated.",
        icon: "Layers",
      },
      {
        title: "Tested on real phones",
        description: "Checked on the iPhones and Android devices your customers actually use.",
        icon: "Smartphone",
      },
      {
        title: "Launch handled",
        description: "We deal with App Store and Google Play review so you don't have to.",
        icon: "Rocket",
      },
      {
        title: "Measured after launch",
        description: "Analytics and crash reporting show what people use and where they get stuck.",
        icon: "LineChart",
      },
    ],
    techStack: ["flutter", "react-native", "swift", "kotlin", "firebase", "nodejs", "stripe"],
    process: [
      {
        title: "Discovery",
        time: "1 week",
        you: "2 to 3 hours",
        text: "We agree who the app is for, the must-have features and which platforms to launch on. You get a fixed quote.",
        gets: ["Feature list", "Fixed quote and timeline", "Platform recommendation"],
      },
      {
        title: "Design",
        time: "2 to 3 weeks",
        you: "One review a week",
        text: "Screens designed for iOS and Android conventions, then a clickable prototype to test on your own phone.",
        gets: ["App screen designs", "Prototype on your phone", "Design system"],
      },
      {
        title: "Build",
        time: "6 to 10 weeks",
        you: "30 minutes a week",
        text: "Two-week sprints with test builds installed on your phone through TestFlight and Google Play testing.",
        gets: ["Test builds every sprint", "Admin dashboard", "Weekly demo"],
      },
      {
        title: "Test",
        time: "1 to 2 weeks",
        you: "Test with real users",
        text: "Real devices, patchy connections, accessibility and a beta with a group of your customers.",
        gets: ["Device test report", "Beta feedback", "Crash-free sign-off"],
      },
      {
        title: "Launch and support",
        time: "Ongoing",
        you: "As much as you like",
        text: "We submit to both stores, monitor crashes and reviews, and support you for 30 days after launch.",
        gets: ["App Store and Google Play launch", "Analytics and crash reporting", "30 days of support"],
      },
    ],
    useCases: [
      "Food ordering and delivery",
      "Bookings and appointments",
      "Loyalty and rewards",
      "Fitness and wellbeing",
      "Field service and staff apps",
      "Marketplaces",
    ],
    pricingHint: {
      from: servicePrices["mobile-app-development"],
      currency: "GBP",
      note: "A cross-platform app with its backend. Native builds are quoted after discovery.",
    },
    faqs: [
      {
        question: "Should we choose native or cross-platform?",
        answer:
          "For most apps, cross-platform (Flutter or React Native) is faster and cheaper, with one codebase for both stores. We recommend native Swift and Kotlin when you need heavy use of the camera, Bluetooth, AR or background processing.",
      },
      {
        question: "How long does it take to build an app?",
        answer:
          "Typically 8 to 14 weeks from discovery to launch, depending on features. We'll give you a fixed timeline with your quote.",
      },
      {
        question: "Do you handle App Store and Google Play submission?",
        answer:
          "Yes. We prepare the listings, screenshots and privacy details, submit the app and deal with any review feedback.",
      },
      {
        question: "Do we need a backend as well?",
        answer:
          "Almost every app does, for accounts, data, payments and notifications. It's included in our quotes, usually built with Node.js or Firebase.",
      },
      {
        question: "What does an app cost to maintain?",
        answer:
          "Plan for updates each year as iOS and Android change. Our maintenance plans cover OS updates, fixes and small improvements after the 30 days of support included.",
      },
    ],
    relatedServices: ["backend-development", "cloud-services", "full-stack-development"],
  },

  {
    slug: "cloud-services",
    order: 6,
    name: "Cloud and DevOps",
    navLabel: "Cloud and DevOps",
    icon: "Cloud",
    shortDescription: "UK-hosted infrastructure on AWS, Azure or Google Cloud, with automated deploys and monitoring.",
    seo: {
      title: "Cloud and DevOps services in London",
      description:
        "Cloud migration, CI/CD, monitoring and cost optimisation on AWS, Azure and Google Cloud, with UK data hosting. Fixed-price projects from a London team.",
      keywords: ["cloud migration London", "DevOps consultancy UK", "AWS London eu-west-2", "CI/CD pipelines"],
    },
    hero: {
      heading: "Cloud infrastructure that deploys itself and stays up.",
      subheading:
        "UK-hosted infrastructure on AWS, Azure or Google Cloud, with one-click deploys, monitoring that wakes the right person and bills that don't creep up every month.",
    },
    visual: {
      kind: "regions",
      paths: ["M 22 38 C 40 20, 60 20, 78 36", "M 22 38 C 30 60, 44 72, 56 74"],
      regions: [
        { name: "London", detail: "eu-west-2", x: 22, y: 38, primary: true },
        { name: "Frankfurt", detail: "14 ms", x: 78, y: 36 },
        { name: "Dublin", detail: "9 ms", x: 56, y: 74 },
      ],
    },
    estimate: { type: "cloud", label: "Estimate cloud work" },
    overview: [
      "If every deploy means an evening of downtime, or your hosting bill grows faster than your customers, your infrastructure is costing you more than money.",
      "We move applications to AWS, Azure or Google Cloud in UK regions, containerise them, and set up pipelines so releases happen with one click and roll back automatically if something goes wrong.",
      "Everything is written as code with Terraform, so your setup is documented, repeatable and yours.",
    ],
    offerings: [
      {
        title: "Cloud migration",
        description:
          "Move from ageing servers to AWS, Azure or Google Cloud with no lost data and little or no downtime.",
        icon: "ArrowRightLeft",
      },
      {
        title: "CI/CD pipelines",
        description: "Every change tested and deployed automatically, with one-click rollbacks.",
        icon: "GitBranch",
      },
      {
        title: "Infrastructure as code",
        description: "Terraform for everything, so your setup is documented and repeatable.",
        icon: "ServerCog",
      },
      {
        title: "Monitoring and alerts",
        description: "Dashboards and alerts that tell the right person before customers notice.",
        icon: "Activity",
      },
      {
        title: "Cost optimisation",
        description: "Right-sized resources and reserved capacity that cut your monthly bill.",
        icon: "PiggyBank",
      },
      {
        title: "Security and backups",
        description: "Least-privilege access, encrypted backups and tested disaster recovery.",
        icon: "Lock",
      },
    ],
    benefits: [
      {
        title: "UK data hosting",
        description: "London region by default, which keeps latency low and UK GDPR simple.",
        icon: "MapPin",
      },
      {
        title: "Deploys without drama",
        description: "Release in the working day, with automatic rollback if checks fail.",
        icon: "Rocket",
      },
      {
        title: "Lower monthly bills",
        description: "Most clients cut hosting costs by 20 to 40% after a review.",
        icon: "PiggyBank",
      },
      {
        title: "Stays up",
        description: "Health checks, auto-scaling and failover handle traffic spikes and outages.",
        icon: "ShieldCheck",
      },
    ],
    techStack: ["aws", "azure", "google-cloud", "docker", "terraform", "github-actions"],
    process: [
      {
        title: "Audit",
        time: "3 to 5 days",
        you: "1 to 2 hours",
        text: "We review your current setup, costs and risks, and give you a fixed quote for the work.",
        gets: ["Infrastructure audit", "Cost review", "Fixed quote"],
      },
      {
        title: "Plan",
        time: "2 to 3 days",
        you: "One review",
        text: "Target architecture and migration plan agreed, including how we avoid downtime.",
        gets: ["Architecture diagram", "Migration plan", "Rollback plan"],
      },
      {
        title: "Build",
        time: "1 to 3 weeks",
        you: "30 minutes a week",
        text: "Infrastructure written in Terraform, pipelines set up and a full copy of production running on staging.",
        gets: ["Terraform code", "CI/CD pipeline", "Staging environment"],
      },
      {
        title: "Test",
        time: "2 to 5 days",
        you: "Check staging",
        text: "Load tests, failover drills and a practice run of the migration before the real thing.",
        gets: ["Load test results", "Failover drill", "Go-live checklist"],
      },
      {
        title: "Launch and support",
        time: "Ongoing",
        you: "As much as you like",
        text: "We migrate at a quiet time, watch everything closely and support you for 30 days.",
        gets: ["Migration", "Monitoring and alerts", "Runbooks and handover"],
      },
    ],
    useCases: [
      "Moving off an ageing dedicated server",
      "Handling sale-day traffic",
      "Automating deployments",
      "Cutting a growing cloud bill",
      "UK data residency for compliance",
      "Disaster recovery planning",
    ],
    pricingHint: {
      from: servicePrices["cloud-services"],
      currency: "GBP",
      note: "A pipeline, review or focused migration. Larger migrations are quoted after the audit.",
    },
    faqs: [
      {
        question: "Will our site go down during the migration?",
        answer:
          "We plan for zero or near-zero downtime, rehearse the migration on staging first and move at a quiet time. You'll have a rollback plan agreed in advance.",
      },
      {
        question: "Which cloud provider should we use?",
        answer:
          "AWS is our default for most clients, with the London region for UK data. If you already use Microsoft 365 or Google Workspace, Azure or Google Cloud can make sense. We'll recommend one and explain why.",
      },
      {
        question: "Can you reduce our cloud bill?",
        answer:
          "Usually, yes. A cost review typically finds 20 to 40% of savings through right-sizing, reserved capacity and removing unused resources.",
      },
      {
        question: "Do we keep control of our accounts?",
        answer:
          "Always. Everything runs in your own cloud accounts, and all infrastructure is written as code in your repository.",
      },
      {
        question: "Do you offer ongoing monitoring?",
        answer:
          "Yes. After the 30 days of support included with every project, we offer monthly plans covering monitoring, patching, backups and on-call cover.",
      },
    ],
    relatedServices: ["backend-development", "full-stack-development", "frontend-development"],
  },
];

/* =========================================================================
   /services overview page
   ========================================================================= */

export const servicesPage = {
  seo: {
    title: "Software development services in London",
    description:
      "Frontend, backend, full-stack, no-code, mobile app and cloud services for London businesses and founders. Fixed prices, weekly demos and code you own.",
  },
  hero: {
    title: "Our services.",
    intro:
      "Whether you need a simple website or a complex cloud platform, one senior team designs, builds and supports it. Fixed prices, weekly demos and code you own.",
    primary: "Get a quick estimate",
    secondary: "Book a 30-minute call",
  },
  list: {
    title: "Six services, one team.",
    intro:
      "Most clients start with one and stay for three. Pick a service to see what's included, how it runs and what it costs.",
    fromLabel: "From",
    more: "View service",
    offeringsLabel: "What's included",
    stackLabel: "We usually use",
  },
  finder: {
    title: "Which service do I need?",
    intro: "Pick the one that sounds most like you and we'll point you in the right direction.",
    label: "What do you need?",
    prompt: "Choose an option above to see our recommendation.",
    resultLabel: "We'd recommend",
  },
  bundles: {
    title: "Popular combinations.",
    intro:
      "Services that clients often book together. Each starts from the sum of its services, and your quote is fixed once scope is agreed.",
    fromLabel: "from",
    includesLabel: "Includes",
    note: "Prices exclude VAT. Invoiced in GBP in milestones, usually 30% to start, 40% midway and 30% on launch.",
  },
  process: {
    title: "How a project runs.",
    intro: "The same five steps whichever service you choose, so you always know what happens next and what it costs.",
    tablistLabel: "Project steps",
    lengthLabel: "Typical length",
    yourTimeLabel: "Your time",
    getsTitle: "What you get",
  } satisfies ProcessSectionContent,
  cta: {
    title: "Not sure what you need?",
    text: "Book a free 30-minute call and we'll recommend the right approach, with a clear estimate within one working day.",
  },
};

/** Labels shared by every /services/[slug] page. `{name}` is replaced with the service name. */
export const serviceDetail = {
  breadcrumbHome: "Home",
  breadcrumbServices: "Services",
  breadcrumbLabel: "Breadcrumb",
  heroSecondary: "Book a 30-minute call",
  fromLabel: "From",
  overviewTitle: "Why it matters.",
  offeringsTitle: "What we do.",
  offeringsIntro: "Everything you need, from the first design to launch and beyond.",
  benefitsTitle: "What you get.",
  benefitsIntro: "The difference a senior team makes.",
  comparisonTitle: "No-code or custom code?",
  comparisonIntro: "An honest comparison, so you can choose the right starting point.",
  techTitle: "Tools we use.",
  techIntro: "Proven technology that will still be supported in five years.",
  techLabel: "Technologies for {name}",
  processTitle: "How it runs.",
  processIntro: "Five steps, a fixed price and a demo every week.",
  projectsTitle: "Related work.",
  projectsIntro: "Recent {name} projects for London businesses.",
  projectsAll: "View all projects",
  pricingSectionTitle: "Projects and pricing.",
  pricingSectionIntro: "What clients most often build with us, and where prices start.",
  useCasesTitle: "Typical projects",
  useCasesLead: "What clients most often ask us to build.",
  pricingTitle: "Starting price",
  pricingLink: "See all prices",
  faqTitle: "Questions, answered.",
  faqIntro: "Can't find what you need? We reply within two working hours.",
  testimonialLabel: "Client review",
  testimonialStarsLabel: "5 out of 5 stars",
  relatedTitle: "Related services.",
  relatedIntro: "Services clients often combine with {name}.",
  ctaTitle: "Ready to start your {name} project?",
  ctaText:
    "Tell us what you're planning. You'll get a clear estimate and a plan within one working day, free and with no obligation.",
};

/* =========================================================================
   "Which service do I need?"
   ========================================================================= */

export const finderOptions: FinderOption[] = [
  { need: "A website to present my business", recommend: ["frontend-development", "no-code-development"] },
  { need: "A web app with user accounts and data", recommend: ["full-stack-development"] },
  { need: "An app on phones", recommend: ["mobile-app-development"] },
  { need: "Launch fast on a small budget", recommend: ["no-code-development"] },
  { need: "Hosting, speed or scaling problems", recommend: ["cloud-services"] },
  { need: "APIs or a database for my existing frontend", recommend: ["backend-development"] },
];

/* =========================================================================
   Bundles. Each starts from the sum of its services' starting prices.
   ========================================================================= */

export const bundles: Bundle[] = [
  {
    name: "Business website",
    description: "A fast, custom website plus the automations that turn enquiries into customers.",
    services: ["frontend-development", "no-code-development"],
    features: [
      "Custom design and CMS",
      "Enquiries sent to your CRM",
      "Automatic follow-up emails",
      "Live in 3 to 5 weeks",
    ],
    cta: { label: "Estimate a website", type: "website" },
  },
  {
    name: "Product launch",
    description: "A web app, mobile app and the infrastructure to run them, built by one team.",
    services: ["full-stack-development", "mobile-app-development", "cloud-services"],
    features: [
      "Web app and admin area",
      "iOS and Android apps",
      "UK hosting and deploys",
      "30 days of support included",
    ],
    popular: true,
    badge: "Most chosen",
    cta: { label: "Estimate an app", type: "mobile" },
  },
  {
    name: "Modernise",
    description: "Replace an ageing system with modern APIs and dependable UK cloud hosting.",
    services: ["backend-development", "cloud-services"],
    features: [
      "Fixed-price audit first",
      "New APIs and integrations",
      "Migration with little or no downtime",
      "Monitoring and alerts",
    ],
    cta: { label: "Estimate cloud work", type: "cloud" },
  },
];
