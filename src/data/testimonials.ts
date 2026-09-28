import type { ReviewsSectionContent, Testimonial } from "@/types/content";

export const reviewsSection: ReviewsSectionContent = {
  title: "What clients say.",
  intro: "Every review below is from a client we've worked with in the last two years.",
  rating: "4.9",
  ratingCaption: "Average from 50+ reviews",
  starsAriaLabel: "5 out of 5 stars",
};

export const testimonials: Testimonial[] = [
  {
    featured: true,
    quote:
      "We'd been burned by two agencies before. PixarByte gave us a fixed price, demoed every Friday and delivered the migration a week early. Our cloud bill dropped by almost half and the site got faster at the same time.",
    name: "James Porter",
    role: "CTO, Northwind Retail",
    color: "#f97316",
    services: ["cloud-services"],
  },
  {
    quote: "Every decision was explained in plain English. As a non-technical founder, that mattered most.",
    name: "Sara Malik",
    role: "Founder, Stackly",
    color: "#8b5cf6",
    services: ["full-stack-development"],
  },
  {
    quote: "They rebuilt our ordering in twelve weeks and it simply works.",
    name: "Ali Raza",
    role: "Founder, FoodGo",
    color: "#0ea5e9",
    services: ["mobile-app-development"],
  },
  {
    quote: "Deadlines met, weekly demos and zero surprises on the invoice.",
    name: "Hina Khan",
    role: "Operations Lead, Meridian Health",
    color: "#10b981",
    services: ["backend-development"],
  },
  {
    quote:
      "Our new site loads in a second and enquiries went up within a month. The team understood what a law firm needs from a website.",
    name: "Tom Whitaker",
    role: "Director, Halden & Co",
    color: "#64748b",
    services: ["frontend-development"],
  },
  {
    quote:
      "We went from chasing paperwork to onboarding a client in ten minutes. And we can edit everything ourselves.",
    name: "Priya Shah",
    role: "COO, Qubit Labs",
    color: "#e11d48",
    services: ["no-code-development"],
  },
  {
    quote: "Felt like an extension of our own team. They joined our stand-ups and just got on with it.",
    name: "Oliver Bennett",
    role: "Head of Product, parcel.io",
    color: "#2563eb",
  },
];
