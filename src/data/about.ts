import type { AboutContent, Certification } from "@/types/about";

/*
 * PLACEHOLDERS: text in [square brackets] (founding year, names, registration numbers,
 * certifications) must be replaced with real details before launch.
 * `npm run check:placeholders` lists every one that remains.
 */

export const aboutContent: AboutContent = {
  seo: {
    title: "About us: our story, team and values",
    description:
      "Meet PixarByte, a London software studio of senior developers and designers building websites, apps and cloud platforms for UK businesses.",
  },
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  hero: {
    title: "A small senior team, building software that lasts.",
    intro:
      "We're developers and designers in London who turn ideas into working software, explain every decision in plain English and stay around after launch.",
    primary: "Start a project",
    secondary: "Book a 30-minute call",
  },
  story: {
    title: "Our story.",
    intro: "Why we started PixarByte, and how we work today.",
    paragraphs: [
      "PixarByte started in [year] with a simple idea: small and growing businesses deserve the same quality of software as big companies, without the big-agency markup or the risk of a lone freelancer disappearing mid-project.",
      "We began building websites for local firms, then apps and platforms as those clients grew. Today we design, build and run websites, web apps, mobile apps and cloud platforms for founders and businesses across London and the UK.",
      "We've stayed deliberately small. Every project is led by senior people, you speak to the developers doing the work, and you see progress every week on a private staging link.",
    ],
    quote: {
      text: "We'd rather ship one thing that works than promise ten that might.",
      cite: "[Founder name], Founder",
    },
  },
  milestones: {
    title: "Milestones.",
    intro: "A few moments that shaped the studio.",
    label: "Company milestones",
    items: [
      {
        year: "[Year]",
        title: "PixarByte founded in London",
        description: "Two developers, one desk and a first client.",
      },
      {
        year: "[Year]",
        title: "First ten clients",
        description: "Mostly local businesses, most of whom are still with us.",
      },
      {
        year: "[Year]",
        title: "First no-code practice",
        description: "Portals and automations for teams without developers.",
      },
      {
        year: "2025",
        title: "First zero-downtime AWS migration",
        description: "Northwind Retail moved to AWS London with no downtime.",
      },
      {
        year: "2026",
        title: "FoodGo app launches",
        description: "Ordering and live tracking for 14 London restaurants.",
      },
      { year: "Today", title: "120+ projects shipped", description: "For founders and businesses in 12 countries." },
    ],
  },
  missionVision: {
    title: "Mission and vision.",
    intro: "What we do every day, and where we're heading.",
    missionLabel: "Our mission",
    visionLabel: "Our vision",
    mission:
      "To help founders and businesses succeed with reliable, modern software, built by senior people and priced clearly before we start.",
    vision:
      "To be the technology partner London businesses recommend first: known for quality, honesty and software that keeps working.",
  },
  values: {
    title: "What we value.",
    intro: "Six habits you'll notice from the first call.",
    items: [
      {
        icon: "MessageSquare",
        title: "Plain English",
        description: "No jargon. Every decision explained so you can make it with us.",
      },
      {
        icon: "Receipt",
        title: "Clear prices",
        description: "A fixed quote before we start, and no surprises on the invoice.",
      },
      {
        icon: "BadgeCheck",
        title: "Senior by default",
        description: "Experienced developers on every project, not just the pitch.",
      },
      {
        icon: "Rocket",
        title: "Ship often",
        description: "Working software every week, on a staging link you can click.",
      },
      {
        icon: "Accessibility",
        title: "Built for everyone",
        description: "Accessible, fast and responsive as standard, not as extras.",
      },
      {
        icon: "Handshake",
        title: "In it for the long run",
        description: "Support after launch and a team that stays when you grow.",
      },
    ],
  },
  team: {
    title: "The team.",
    intro: "The people who'll build your project. You'll speak to them directly.",
    leadersLabel: "Leadership",
    membersLabel: "Developers and designers",
    smallTeamNote: "A focused team means you work directly with the people building your product.",
    photoAlt: "Portrait of {name}",
    socialLabels: { linkedin: "{name} on LinkedIn", github: "{name} on GitHub", x: "{name} on X" },
  },
  founderMessage: {
    title: "A note from our founder.",
    name: "[Founder name]",
    role: "Founder and Managing Director",
    photo: "/images/team/placeholder-portrait.svg",
    message: [
      "I started PixarByte because I kept meeting business owners who'd been let down: projects that ran months late, invoices that doubled, or a developer who stopped replying.",
      "We do things differently. We agree a fixed price, show you working software every week and stay around after launch. If that sounds like the kind of team you want, I'd love to hear what you're planning.",
    ],
  },
  whyWorkWithUs: {
    title: "Why work with us.",
    intro: "What clients tell us made the difference.",
    items: [
      "Senior developers on every project",
      "A fixed quote before any work starts",
      "Weekly demos you can click through",
      "Based in London, working UK hours",
      "You own the code, designs and accounts",
      "Support after launch at no extra cost",
    ],
  },
  stats: { title: "In numbers.", intro: "Where we are today." },
  certifications: {
    title: "Registrations and certifications.",
    intro: "The details you'd want to check before working with a supplier.",
    groupLabels: {
      registration: "Registrations",
      certification: "Certifications",
      platform: "Platforms",
      partner: "Partners",
      award: "Awards",
    },
    verify: "Verify",
  },
  culture: { title: "Life at PixarByte.", intro: "A few photos from the studio.", photos: [] },
  cta: {
    title: "Let's build something great together.",
    text: "Tell us about your idea. You'll get a clear estimate and a plan within one working day.",
  },
  foundingDate: "[Year]",
};

export const certifications: Certification[] = [
  {
    name: "Registered in England and Wales",
    issuer: "Companies House",
    detail: "Company number 00000000 [replace]",
    url: "https://find-and-update.company-information.service.gov.uk/",
    type: "registration",
  },
  {
    name: "Registered with the Information Commissioner's Office",
    issuer: "ICO",
    detail: "Registration number [ICO number]",
    url: "https://ico.org.uk/ESDWebPages/Search",
    type: "registration",
  },
  { name: "[Certification name, e.g. Cyber Essentials]", issuer: "[Issuer]", type: "certification" },
  { name: "[Certification name, e.g. AWS Certified Solutions Architect]", issuer: "[Issuer]", type: "certification" },
];
