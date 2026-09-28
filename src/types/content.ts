/* Shared content types. Every string a visitor can see lives in src/data and is typed here. */

export type ServiceSlug =
  | "frontend-development"
  | "backend-development"
  | "full-stack-development"
  | "no-code-development"
  | "mobile-app-development"
  | "cloud-services";

/** Names of the icons in the design's SVG sprite (see components/shared/IconSprite). */
export type IconName =
  | "search"
  | "sun"
  | "moon"
  | "x"
  | "check"
  | "lock"
  | "web"
  | "phone"
  | "grid"
  | "flow"
  | "cloud"
  | "calc"
  | "cal"
  | "file"
  | "bell"
  | "play"
  | "refresh"
  | "zap"
  | "mail"
  | "pin"
  | "menu"
  | "hand";

/** The five kinds of project the builder previews and the estimator prices. */
export type ProjectType = "website" | "mobile" | "webapp" | "nocode" | "cloud";

export type Audience = "founder" | "business";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Link {
  label: string;
  href: string;
}

/**
 * A link whose destination doesn't exist yet. `demo` shows the "Demo link" toast,
 * `book` shows the booking toast (the Calendly/Cal.com page isn't wired up yet).
 */
export type FooterLink = Link | { label: string; action: "demo" | "book" };

export interface Person {
  name: string;
  role: string;
  /** Avatar background colour. */
  color: string;
}

export interface Testimonial extends Person {
  quote: string;
  featured?: boolean;
  /** Services this client used; the first match is quoted on that service's page. */
  services?: ServiceSlug[];
}

export interface SectionCopy {
  title: string;
  intro: string;
}

/* ---------- Site ---------- */

export interface SiteConfig {
  name: string;
  legalName: string;
  url: string;
  title: string;
  description: string;
  locale: string;
  email: string;
  phone: { display: string; href: string };
  location: string;
  companyNumber: string;
  brandAriaLabel: string;
  skipLink: string;
}

export interface HeaderContent {
  nav: Link[];
  navLabel: string;
  /** First entry in the Services menu. */
  allServicesLabel: string;
  search: { label: string; ariaLabel: string; shortcut: { mac: string; other: string } };
  themeAriaLabel: string;
  primaryCta: string;
  menuAriaLabel: string;
}

export interface MobileMenuContent {
  ariaLabel: string;
  navLabel: string;
  closeAriaLabel: string;
  links: Link[];
  primaryCta: string;
  secondaryCta: string;
}

/* ---------- Hero ---------- */

export interface AudienceCopy {
  headline: string;
  lead: string;
  cta: string;
}

export interface ClientLogo {
  name: string;
  style?: "serif" | "mono";
}

export interface ActivityItem {
  initials: string;
  color: string;
  title: string;
  time: string;
}

export interface HeroContent {
  audienceLabel: string;
  audienceOptions: { id: Audience; label: string }[];
  defaultAudience: Audience;
  copy: Record<Audience, AudienceCopy>;
  secondaryCta: Link;
  proof: { rating: string; detail: string; reviewAriaPrefix: string; reviews: (Person & { quote: string })[] };
  clients: { label: string; logos: ClientLogo[] };
  replyChip: { title: string; detail: string };
  activity: ActivityItem[];
}

/* ---------- Builder ---------- */

export interface BuilderProject {
  key: ProjectType;
  label: string;
  icon: IconName;
  timeline: string;
  stack: string[];
  cta: string;
}

export type TermTone = "p" | "ok" | "hl" | "dim" | "err" | "warn";
/** One terminal line: plain text and coloured spans. `{version}` and `{seconds}` are filled in at run time. */
export type TermLine = (string | { tone: TermTone; text: string })[];

export interface WebappRange {
  id: 7 | 30 | 90;
  label: string;
  kpis: [number, number, number];
  deltas: [string, string, string];
  /** Chart y-values in a 300×80 viewBox (lower is higher on screen). */
  points: number[];
}

export interface BuilderContent {
  title: string;
  subtitle: string;
  switchHint: string;
  switchKeys: [string, string];
  tablistLabel: string;
  timelineLabel: string;
  stackLabel: string;
  projects: BuilderProject[];
  website: {
    url: string;
    inspectHint: string;
    components: { navbar: string; heroCopy: string; button: string; heroImage: string; featureGrid: string };
    scores: number[];
    scoreTitle: string;
    scoreDetail: string;
  };
  mobile: {
    phoneAriaLabel: string;
    greeting: string;
    title: string;
    etaLabel: string;
    eta: string;
    items: { color: string; qty: string; maxWidth?: string }[];
    pushes: { title: string; body: string }[];
    tapHint: string;
    platformLabel: string;
    platforms: { id: "ios" | "android"; label: string }[];
  };
  webapp: {
    url: string;
    nav: string[];
    heading: string;
    rangeLabel: string;
    ranges: WebappRange[];
    kpiLabels: [string, string, string];
    currency: string;
    weekDays: string[];
    dayPrefix: string;
    rows: { name: string; status: "ok" | "pend"; statusLabel: string; amount: string }[];
  };
  nocode: {
    nodes: { tag: string; letter: string; color: string; title: string; text: string }[];
    dragHint: string;
    runLabel: string;
    runsToday: number;
    runsSuffix: string;
  };
  cloud: {
    title: string;
    deployLabel: string;
    regionsTitle: string;
    outageLabel: string;
    regions: { name: string; ms: number }[];
    latencyUnit: string;
    prompt: string;
    uptimeTitle: string;
    uptimeFrom: string;
    uptimeValue: string;
    /** Index of the day drawn in amber on the 30-day uptime bar. */
    uptimeWarningDay: number;
    versionPrefix: string;
    deploy: TermLine[];
    outage: {
      failIndex: number;
      failoverIndex: number;
      failoverMs: number;
      downLabel: string;
      failed: TermLine;
      rerouting: TermLine;
      failoverDone: TermLine;
      replacing: TermLine;
      recovered: TermLine;
    };
  };
}

/* ---------- Services ---------- */

export type ServiceVisual =
  | { kind: "stack"; layers: [string, string, string]; badge: string }
  | {
      kind: "swipe";
      ariaLabel: string;
      hint: string;
      cards: { label: string; title: string; from: string; to: string }[];
    }
  | { kind: "layout"; labels: [string, string] }
  | { kind: "requests"; requests: { method: "GET" | "POST" | "PUT"; path: string; ms: number }[] }
  | { kind: "automations"; items: { letter: string; color: string; title: string; detail: string; on: boolean }[] }
  | {
      kind: "regions";
      paths: string[];
      regions: { name: string; detail: string; x: number; y: number; primary?: boolean }[];
    };

export interface ServiceCard {
  slug: ServiceSlug;
  title: string;
  shortDescription: string;
  fromPrice: number;
  estimate: { type: ProjectType; label: string };
  layout: { span: 2 | 3 | 4; tall?: boolean };
  visual: ServiceVisual;
}

export interface ServicesSectionContent extends SectionCopy {
  cta: string;
  fromLabel: string;
}

/* ---------- Who we help ---------- */

export interface AudienceCard {
  id: Audience;
  label: string;
  title: string;
  text: string;
  points: string[];
  cta: { label: string; variant: "primary" | "outline" };
}

export interface AudienceSectionContent extends SectionCopy {
  matchBadge: string;
  cards: AudienceCard[];
}

/* ---------- Work ---------- */

export type WorkFilter = "all" | "web" | "mobile" | "cloud" | "nocode";

/**
 * A case study as the cards and the home dialog need it: serialisable, built from the MDX
 * frontmatter in content/case-studies by `toCaseStudy` (src/lib/portfolio.ts).
 */
export interface CaseStudy {
  slug: string;
  href: string;
  filter: Exclude<WorkFilter, "all">;
  /** Services involved, used for filters and "Related work" on service pages. */
  services: ServiceSlug[];
  industry: string;
  client: string;
  location: string;
  title: string;
  summary: string;
  tags: string[];
  concept: boolean;
  colors: { c1: string; c2: string };
  mock: "phone" | "browser" | "term";
  stats: { value: string; label: string }[];
  challenge: string;
  solution: string;
  quote?: { text: string; cite: string };
}

export interface WorkSectionContent extends SectionCopy {
  filterLabel: string;
  filters: { id: WorkFilter; label: string }[];
  locationPrefix: string;
  openLabel: string;
  openAriaPrefix: string;
  terminalMock: string[];
  ctaCard: { title: string; text: string; button: string };
  dialog: {
    challenge: string;
    solution: string;
    cta: string;
    more: string;
    close: string;
    closeAriaLabel: string;
  };
  /** Which estimator tab "Start a similar project" opens for each filter. */
  estimateFor: Record<CaseStudy["filter"], ProjectType>;
}

/* ---------- Process ---------- */

export interface ProcessStep {
  title: string;
  time: string;
  you: string;
  text: string;
  gets: string[];
}

export interface ProcessSectionContent extends SectionCopy {
  tablistLabel: string;
  lengthLabel: string;
  yourTimeLabel: string;
  getsTitle: string;
}

/* ---------- Why us ---------- */

export interface Stat {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Group thousands with commas (2,000). */
  group?: boolean;
  label: string;
}

export type ComparisonCell = { kind: "yes" | "no" | "meh" | "strong"; text: string };

export interface Comparison {
  columns: [string, string, string];
  rows: { label: string; cells: [ComparisonCell, ComparisonCell, ComparisonCell] }[];
}

/* ---------- Tech ---------- */

export interface Tech {
  /** Stable id used by services (`techStack`) and case studies. */
  id: string;
  name: string;
  category: string;
  color: string;
}

export interface TechSectionContent extends SectionCopy {
  ariaLabel: string;
}

/* ---------- Reviews ---------- */

export interface ReviewsSectionContent extends SectionCopy {
  rating: string;
  ratingCaption: string;
  starsAriaLabel: string;
}

/* ---------- Pricing ---------- */

export interface PricingPlan {
  name: string;
  price: number;
  unit?: string;
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
  cta: { label: string; type: ProjectType };
}

export interface PricingSectionContent extends SectionCopy {
  fromLabel: string;
  note: string;
}

/* ---------- FAQ ---------- */

export interface FaqSectionContent extends SectionCopy {
  phonePrefix: string;
}

/* ---------- Final CTA ---------- */

export interface CtaContent {
  title: string;
  text: string;
  primary: string;
  secondary: string;
  contacts: { icon: IconName; title: string; detail: string; href?: string }[];
}

/* ---------- Footer ---------- */

export interface FooterContent {
  blurb: string;
  newsletter: { label: string; placeholder: string; button: string };
  socials: { label: string; ariaLabel: string; href?: string }[];
  columns: { title: string; links: FooterLink[] }[];
  /** `{year}` is replaced with the current year. */
  legal: string;
  legalNavLabel: string;
  legalLinks: FooterLink[];
}

/* ---------- Estimate ---------- */

export type ProjectSize = "s" | "m" | "l";

export interface EstimateFeature {
  id: string;
  label: string;
  price: number;
}

export interface EstimateModel {
  base: Record<ProjectType, number>;
  sizeMultiplier: Record<ProjectSize, number>;
  weeks: Record<ProjectType, [number, number]>;
  features: Record<ProjectType, EstimateFeature[]>;
  /** The range shown is the midpoint scaled by these factors. */
  spread: { low: number; high: number };
}

export interface EstimateContent {
  title: string;
  intro: string;
  closeAriaLabel: string;
  typeLabel: string;
  sizeLabel: string;
  sizes: { id: ProjectSize; label: string }[];
  defaultSize: ProjectSize;
  featuresLabel: string;
  rangeLabel: string;
  timelineLabel: string;
  /** `{min}` and `{max}` are replaced with week counts. */
  timeline: string;
  disclaimer: string;
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  sending: string;
  emailError: string;
  /** Shown when the server couldn't send the estimate. */
  sendError: string;
  /** Link to /contact, prefilled with this estimate. */
  exactQuote: { lead: string; link: string };
  honeypotLabel: string;
  success: {
    title: string;
    /** `{type}`, `{range}` and `{email}` are filled in. */
    text: string;
    done: string;
  };
}

/* ---------- Command menu ---------- */

export type CommandAction =
  | { type: "preview"; project: ProjectType }
  | { type: "estimate" }
  | { type: "book" }
  | { type: "theme" }
  | { type: "jump"; target: string }
  | { type: "go"; href: string };

export interface Command {
  group: string;
  label: string;
  icon: IconName;
  action: CommandAction;
  /** Key used with ⌘/Ctrl, shown on the right. */
  shortcut?: string;
}

export interface CommandMenuContent {
  ariaLabel: string;
  placeholder: string;
  empty: string;
  hints: { navigate: string; select: string; close: string };
  keys: { up: string; down: string; enter: string; escape: string };
  /** Shown before a command's shortcut key. */
  modifier: { mac: string; other: string };
  commands: Command[];
}

/* ---------- Toasts ---------- */

export interface ToastMessage {
  title: string;
  body?: string;
}
