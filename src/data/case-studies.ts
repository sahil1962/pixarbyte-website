import type { CaseStudy, WorkSectionContent } from "@/types/content";

export const workSection: WorkSectionContent = {
  title: "Recent work.",
  intro: "A few projects for London businesses. Open any card for the full story.",
  filterLabel: "Filter projects",
  filters: [
    { id: "all", label: "All" },
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "cloud", label: "Cloud" },
    { id: "nocode", label: "No-code" },
  ],
  locationPrefix: "in",
  openLabel: "Read the case study",
  openAriaPrefix: "Open case study: ",
  terminalMock: ["build api:v3.1.0", "tests 214 of 214", "deploy eu-west-2", "health checks green"],
  ctaCard: {
    title: "Your project could be next.",
    text: "Tell us what you're planning and get a fixed estimate within one working day.",
    button: "Get a quick estimate",
  },
  dialog: {
    challenge: "The challenge",
    solution: "What we built",
    cta: "Start a similar project",
    close: "Close",
    closeAriaLabel: "Close",
  },
  estimateFor: { mobile: "mobile", web: "webapp", cloud: "cloud", nocode: "nocode" },
};

export const caseStudies: CaseStudy[] = [
  {
    id: "foodgo",
    filter: "mobile",
    client: "FoodGo",
    location: "Southwark, London",
    title: "Ordering and live rider tracking for 14 London restaurants",
    tags: ["Mobile app", "Backend"],
    colors: { c1: "#1d4ed8", c2: "#60a5fa" },
    mock: "phone",
    stats: [
      { value: "+65%", label: "online orders" },
      { value: "4.8★", label: "App Store rating" },
      { value: "12 wks", label: "to launch" },
    ],
    challenge:
      "Orders came in by phone and three different delivery apps, each taking up to 30% commission and none sharing customer data.",
    solution:
      "A branded iOS and Android app with live rider tracking, a kitchen dashboard and Stripe payments, backed by a Node.js API on AWS London.",
    quote: {
      text: "They rebuilt our ordering in twelve weeks and it simply works. Customers noticed the difference in the first week.",
      cite: "Ali Raza, Founder, FoodGo",
    },
  },
  {
    id: "meridian",
    filter: "web",
    client: "Meridian Health",
    location: "Marylebone, London",
    title: "Online booking for a private clinic group",
    tags: ["Web app", "Integrations"],
    colors: { c1: "#047857", c2: "#34d399" },
    mock: "browser",
    stats: [
      { value: "−30%", label: "missed appointments" },
      { value: "2,000+", label: "bookings a week" },
      { value: "1.2s", label: "page load" },
    ],
    challenge: "Patients could only book by phone during opening hours, and one in five appointments was missed.",
    solution:
      "A patient booking portal connected to their practice system, with SMS reminders, deposits and a staff calendar view.",
    quote: {
      text: "Deadlines met, weekly demos and zero surprises on the invoice. Our front desk finally has time for patients.",
      cite: "Hina Khan, Operations Lead, Meridian Health",
    },
  },
  {
    id: "northwind",
    filter: "cloud",
    client: "Northwind Retail",
    location: "Canary Wharf, London",
    title: "Moving a busy e-commerce platform to AWS London",
    tags: ["Cloud", "DevOps"],
    colors: { c1: "#18181b", c2: "#6366f1" },
    mock: "term",
    stats: [
      { value: "−40%", label: "hosting costs" },
      { value: "99.99%", label: "uptime since" },
      { value: "0 min", label: "downtime to migrate" },
    ],
    challenge:
      "An ageing dedicated server couldn't cope with sale-day traffic, and every deploy meant an evening of downtime.",
    solution:
      "Containerised the platform, moved it to AWS eu-west-2 with auto-scaling, and set up one-click deploys with automatic rollbacks.",
    quote: {
      text: "Our cloud bill dropped by almost half and the site got faster at the same time.",
      cite: "James Porter, CTO, Northwind Retail",
    },
  },
  {
    id: "stackly",
    filter: "web",
    client: "Stackly",
    location: "Shoreditch, London",
    title: "A SaaS MVP from idea to first paying teams",
    tags: ["Full-stack", "Product design"],
    colors: { c1: "#7c3aed", c2: "#f0abfc" },
    mock: "browser",
    stats: [
      { value: "9 wks", label: "to launch" },
      { value: "120", label: "paying teams by month 3" },
      { value: "£0", label: "rework after launch" },
    ],
    challenge: "A first-time founder with a clear idea, a fixed budget and an investor demo in ten weeks.",
    solution:
      "Designed and built a multi-tenant web app with Stripe subscriptions, team invites and an admin dashboard in Next.js and PostgreSQL.",
    quote: {
      text: "Every decision was explained in plain English. As a non-technical founder, that mattered most.",
      cite: "Sara Malik, Founder, Stackly",
    },
  },
  {
    id: "qubit",
    filter: "nocode",
    client: "Qubit Labs",
    location: "King's Cross, London",
    title: "Automated client onboarding with no-code tools",
    tags: ["No-code", "Automation"],
    colors: { c1: "#c2410c", c2: "#fdba74" },
    mock: "browser",
    stats: [
      { value: "12 days", label: "to launch" },
      { value: "11 hrs", label: "saved every week" },
      { value: "4", label: "tools connected" },
    ],
    challenge: "New clients were onboarded through a mess of emails, spreadsheets and copy-pasted contracts.",
    solution:
      "A Softr client portal on Airtable, with Zapier flows for contracts, invoices and Slack alerts. Their team edits it without a developer.",
    quote: {
      text: "We went from chasing paperwork to onboarding a client in ten minutes.",
      cite: "Priya Shah, COO, Qubit Labs",
    },
  },
];
