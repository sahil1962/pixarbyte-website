import type { ServiceCard, ServicesSectionContent } from "@/types/content";

export const servicesSection: ServicesSectionContent = {
  title: "Everything you need to ship, under one roof.",
  intro: "Six services, one senior team. Most clients start with one and stay for three.",
  cta: "Get a quick estimate",
  fromLabel: "From",
};

/** Home page bento. Order and `layout` follow the approved design. Prices are GBP, excluding VAT. */
export const services: ServiceCard[] = [
  {
    slug: "full-stack-development",
    title: "Full-stack development",
    shortDescription:
      "Complete web applications, SaaS products and internal tools, from database to interface, built and owned by one team.",
    fromPrice: 15000,
    estimate: { type: "webapp", label: "Estimate a web app" },
    layout: { span: 4 },
    visual: { kind: "stack", layers: ["PostgreSQL", "API", "Interface"], badge: "Hover or tap" },
  },
  {
    slug: "mobile-app-development",
    title: "Mobile apps",
    shortDescription: "iOS and Android apps people keep opening, from first design to App Store launch.",
    fromPrice: 18000,
    estimate: { type: "mobile", label: "Estimate an app" },
    layout: { span: 2, tall: true },
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
  },
  {
    slug: "frontend-development",
    title: "Frontend",
    shortDescription: "Fast, accessible interfaces that score in the high 90s on Lighthouse.",
    fromPrice: 3500,
    estimate: { type: "website", label: "Estimate a site" },
    layout: { span: 2 },
    visual: { kind: "layout", labels: ["Desktop", "Tablet"] },
  },
  {
    slug: "backend-development",
    title: "Backend and APIs",
    shortDescription: "Secure APIs, payments and integrations that stay fast under real traffic.",
    fromPrice: 6000,
    estimate: { type: "webapp", label: "Estimate an API" },
    layout: { span: 2 },
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
  },
  {
    slug: "no-code-development",
    title: "No-code and automation",
    shortDescription:
      "Launch in days with Webflow, Bubble and Zapier, and hand your team tools they can edit themselves.",
    fromPrice: 2500,
    estimate: { type: "nocode", label: "Estimate a build" },
    layout: { span: 3 },
    visual: {
      kind: "automations",
      items: [
        { letter: "W", color: "#8b5cf6", title: "Send welcome email", detail: "When a customer signs up", on: true },
        { letter: "A", color: "#0ea5e9", title: "Add lead to CRM", detail: "When the contact form is sent", on: true },
        { letter: "S", color: "#16a34a", title: "Post to Slack", detail: "When an order is over £500", on: false },
      ],
    },
  },
  {
    slug: "cloud-services",
    title: "Cloud and DevOps",
    shortDescription: "UK-hosted infrastructure on AWS, Azure or Google Cloud, with automated deploys and monitoring.",
    fromPrice: 4000,
    estimate: { type: "cloud", label: "Estimate cloud work" },
    layout: { span: 3 },
    visual: {
      kind: "regions",
      paths: ["M 22 38 C 40 20, 60 20, 78 36", "M 22 38 C 30 60, 44 72, 56 74"],
      regions: [
        { name: "London", detail: "eu-west-2", x: 22, y: 38, primary: true },
        { name: "Frankfurt", detail: "14 ms", x: 78, y: 36 },
        { name: "Dublin", detail: "9 ms", x: 56, y: 74 },
      ],
    },
  },
];
