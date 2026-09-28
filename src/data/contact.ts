import type {
  BudgetOption,
  ClientType,
  ProjectKind,
  ServiceOption,
  SourceOption,
  TimelineOption,
} from "@/lib/validation/quote";
import type { FAQ } from "@/types/content";
import { siteConfig } from "./site";

/** Labels for the quote form's options. Shared by the form and the emails. */
export const quoteOptions = {
  clientTypes: {
    individual: { label: "An individual", hint: "Founder, freelancer or side project" },
    startup: { label: "A start-up", hint: "Pre-seed to Series A" },
    business: { label: "A business", hint: "An established company or charity" },
    agency: { label: "An agency", hint: "White-label or overflow work" },
  } satisfies Record<ClientType, { label: string; hint: string }>,
  services: {
    "frontend-development": "Website or front end",
    "backend-development": "Back end and APIs",
    "full-stack-development": "Web app or SaaS",
    "no-code-development": "No-code build",
    "mobile-app-development": "Mobile app",
    "cloud-services": "Cloud and DevOps",
    "not-sure": "Not sure yet",
  } satisfies Record<ServiceOption, string>,
  budgets: {
    "under-5k": "Under £5,000",
    "5k-15k": "£5,000 to £15,000",
    "15k-30k": "£15,000 to £30,000",
    "30k-60k": "£30,000 to £60,000",
    "60k-plus": "More than £60,000",
    "not-sure": "Not sure yet",
  } satisfies Record<BudgetOption, string>,
  timelines: {
    asap: "As soon as possible",
    "1-3m": "In 1 to 3 months",
    "3-6m": "In 3 to 6 months",
    flexible: "I'm flexible",
  } satisfies Record<TimelineOption, string>,
  projectTypes: {
    new: "Something new",
    redesign: "A redesign or rebuild",
    features: "New features for an existing product",
    maintenance: "Maintenance and support",
    consultation: "Advice or a technical review",
  } satisfies Record<ProjectKind, string>,
  sources: {
    search: "Search engine",
    referral: "A recommendation",
    social: "LinkedIn or social media",
    portfolio: "I saw your work",
    other: "Somewhere else",
  } satisfies Record<SourceOption, string>,
  phoneCountries: {
    "+44": "UK +44",
    "+353": "IE +353",
    "+1": "US +1",
    "+61": "AU +61",
    "+49": "DE +49",
    "+33": "FR +33",
    "+971": "AE +971",
    "+91": "IN +91",
  } as Record<string, string>,
};

export const contactFaqs: FAQ[] = [
  {
    question: "How quickly will you reply?",
    answer:
      "Within one working day, usually much sooner. You'll get a reply from a senior developer, not a sales team, with questions or a first estimate.",
  },
  {
    question: "Is the quote really free?",
    answer:
      "Yes. The first call and the written quote are free and there's no obligation. We only invoice once you've signed the plan and fixed price.",
  },
  {
    question: "Can you sign an NDA first?",
    answer:
      "Of course. Tick the NDA box on the form, or email us, and we'll send our standard mutual NDA under English law before you share any details.",
  },
  {
    question: "What should I include in my message?",
    answer:
      "What you want to build, who it's for and any deadline. Links to sites you like, sketches or an existing brief help, and you can attach up to three files.",
  },
  {
    question: "Do you work with clients outside London?",
    answer:
      "Yes. Most of our clients are in London and the South East, but we work with businesses across the UK and Ireland, and meet in person where it helps.",
  },
];

export const contactPage = {
  seo: {
    title: "Contact us for a free project quote",
    description:
      "Tell us about your website, app or cloud project. A senior developer replies within one working day with ideas and a free, fixed quote in GBP.",
  },
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbContact: "Contact",
  hero: {
    title: "Let's build something together.",
    intro:
      "Tell us about your project. We'll reply within one working day with ideas, questions and a free, no-obligation quote.",
  },
  form: {
    title: "Tell us about your project.",
    intro: "Fields marked * are required. It takes about three minutes.",
    requiredMark: "*",
    groups: { you: "About you", project: "Your project", details: "Details" },
    name: { label: "Full name", placeholder: "Jane Smith" },
    email: { label: "Email address", placeholder: "you@company.co.uk" },
    phone: {
      label: "Phone number",
      countryLabel: "Country code",
      placeholder: "07700 900123",
      hint: "Optional. We'll only call if you'd like us to.",
    },
    company: { label: "Company", placeholder: "Optional" },
    clientType: { label: "I'm…" },
    services: { label: "What do you need?", hint: "Choose all that apply." },
    projectType: { label: "What kind of project is it?", placeholder: "Choose one (optional)" },
    budget: { label: "Budget", placeholder: "Choose a range", hint: "GBP, excluding VAT." },
    timeline: { label: "When do you want to start?", placeholder: "Choose one (optional)" },
    description: {
      label: "Project description",
      placeholder:
        "What are you building, who is it for, and is there a deadline? Links to sites or apps you like help too.",
      counter: "{count} / 5,000",
    },
    attachments: {
      label: "Attachments",
      hint: "Up to 3 files, 10 MB each: PDF, Word, PNG, JPG, WebP, text or ZIP.",
      button: "Choose files",
      drop: "or drag them here",
      uploading: "Uploading…",
      remove: "Remove {name}",
      tooMany: "You can attach up to 3 files.",
      tooBig: "{name} is larger than 10 MB.",
      badType: "{name} isn't a file type we accept.",
      failed: "{name} couldn't be uploaded. Please try again, or email it to us.",
      temporary: "Stored temporarily",
    },
    source: { label: "How did you hear about us?", placeholder: "Choose one (optional)" },
    wantsNda: { label: "I'd like you to sign an NDA before we talk." },
    // Link "privacy notice" to /privacy once that page exists (see the PR notes).
    consent: {
      label:
        "I agree to PixarByte storing these details to reply to my enquiry. We never share them or add you to a mailing list.",
    },
    honeypot: "Leave this field empty",
    submit: "Send my request",
    sending: "Sending…",
    errorSummary: "Please fix the highlighted fields.",
    genericError: `Something went wrong. Please try again, or email us at ${siteConfig.email}.`,
  },
  aside: {
    title: "Other ways to reach us",
    email: { label: "Email", detail: "Replies within 2 working hours" },
    phone: { label: "Phone", detail: "Mon to Fri, 9am to 6pm UK time" },
    whatsapp: { label: "WhatsApp", value: "Message us", text: "Hi PixarByte, I'd like to talk about a project." },
    book: { label: "Book a call", value: "Free 30-minute consultation" },
    office: { label: "Office", detail: "Meetings by appointment" },
    reassuranceTitle: "What to expect",
    reassurance: [
      "A reply from a senior developer within one working day",
      "A free call and a fixed quote, with no obligation",
      "A mutual NDA before you share details, if you'd like one",
      "UK contracts, invoices in GBP and UK GDPR-aware handling of your data",
    ],
  },
  nextSteps: {
    title: "What happens next.",
    intro: "From your message to a fixed quote, usually within a week.",
    steps: [
      { title: "We read your brief", text: "A senior developer reviews it and replies within one working day." },
      { title: "A free 30-minute call", text: "We ask questions, suggest options and flag any risks early." },
      { title: "Your fixed quote", text: "Scope, timeline and price in writing, usually within three days." },
      { title: "We start building", text: "Once you sign, we book a kick-off and you see a demo every week." },
    ],
  },
  faq: { title: "Before you get in touch.", intro: "Quick answers to what people ask us first." },
};

export const thankYouPage = {
  seo: {
    title: "Thank you",
    description: "We've received your project request and will reply within one working day.",
  },
  title: "Thanks{name}, we've got your request.",
  intro:
    "A senior developer will read it and reply within one working day. We've sent a copy to your inbox, so check your spam folder if it isn't there in a few minutes.",
  nextTitle: "Want to talk sooner?",
  bookCall: "Book a call now",
  work: "See our work",
  pricing: "How pricing works",
  home: "Back to the home page",
};

/** The placeholder shown by "Book a call" until a Calendly link is configured. */
export const bookingPlaceholder = {
  title: "Booking calendar coming soon",
  text: "Online booking isn't set up yet. Email or call us and we'll find a time that suits you, or send your project details and we'll suggest a slot.",
  closeAriaLabel: "Close",
  email: siteConfig.email,
  phone: siteConfig.phone,
  contactLink: "Send your project details",
  close: "Close",
};

export type ContactPageContent = typeof contactPage;
export type ThankYouContent = typeof thankYouPage;
export type BookingPlaceholderContent = typeof bookingPlaceholder;
