/** Copy for /portfolio and the case study pages. The projects themselves are in content/case-studies. */

export const portfolioPage = {
  seo: {
    title: "Portfolio: web, mobile and cloud projects",
    description:
      "Websites, mobile apps, SaaS products and cloud platforms PixarByte has designed and built for London businesses, and the results they delivered.",
  },
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbPortfolio: "Portfolio",
  hero: {
    title: "Work we're proud of.",
    intro:
      "Websites, apps and platforms we've designed and built for London businesses, and what changed for them afterwards.",
    primary: "Get a quick estimate",
    secondary: "Book a 30-minute call",
  },
  explorer: {
    title: "All projects.",
    intro: "Filter by service or industry. Every card opens the full story.",
    serviceLabel: "Service",
    industryLabel: "Industry",
    all: "All",
    allIndustries: "All industries",
    /** `{count}` is replaced with the number of projects. */
    countOne: "1 project",
    countMany: "{count} projects",
    emptyTitle: "No projects match those filters yet.",
    emptyText: "Try another service or industry, or tell us about your project.",
    reset: "Clear filters",
  },
  card: { open: "Read the case study", concept: "Concept" },
  testimonial: {
    title: "What clients say.",
    intro: "Every project ends with a review. Here's one we're especially proud of.",
    starsLabel: "Rated 5 out of 5",
  },
  cta: {
    title: "Want results like these?",
    text: "Tell us what you're planning. You'll get a clear estimate and a plan within one working day, free and with no obligation.",
  },
};

export const caseStudyPage = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbHome: "Home",
  breadcrumbPortfolio: "Portfolio",
  /** `{client}` is replaced with the client's name. */
  seoTitle: "{client} case study",
  primary: "Start a similar project",
  live: "Visit the live site",
  appStore: "App Store",
  playStore: "Google Play",
  confidentialClient: "Confidential client",
  conceptLabel: "Concept",
  conceptNote: "Concept project: designed and built in-house, not for a paying client.",
  storyLabel: "The story",
  facts: {
    title: "Quick facts",
    client: "Client",
    location: "Location",
    industry: "Industry",
    services: "Services",
    duration: "Duration",
    team: "Team",
    /** `{count}` is replaced with the team size. */
    teamSize: "{count} people",
    platforms: "Platforms",
    year: "Launched",
  },
  results: { title: "The results.", intro: "Measured after launch and shared with the client's permission." },
  tech: {
    title: "Technology used.",
    intro: "The stack behind the project. The story above explains why we chose it.",
    label: "Technology used on this project",
  },
  gallery: {
    title: "Screens.",
    intro: "Select any screen to see it larger.",
    open: "View larger: ",
    dialogLabel: "Screenshot viewer",
    prev: "Previous screen",
    next: "Next screen",
    close: "Close",
    /** `{index}` and `{count}` are replaced. */
    counter: "{index} of {count}",
  },
  beforeAfter: {
    title: "Before and after.",
    intro: "Drag the handle, or focus it and use the arrow keys, to compare.",
    sliderLabel: "Compare before and after",
    before: "Before",
    after: "After",
  },
  testimonial: {
    title: "In their words.",
    intro: "What the client said once the project was live.",
    starsLabel: "Rated 5 out of 5",
  },
  pagination: { label: "More case studies", prev: "Previous project", next: "Next project" },
  related: { title: "More of our work.", intro: "Projects with a similar mix of services.", all: "View all projects" },
  cta: {
    title: "Have a similar project?",
    text: "Let's talk about what we can build for you. You'll get a clear estimate within one working day.",
  },
};
