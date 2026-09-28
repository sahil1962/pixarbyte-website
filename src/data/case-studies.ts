import type { WorkSectionContent } from "@/types/content";

/*
 * Copy for the case study cards and dialog. The case studies themselves are MDX files in
 * content/case-studies, read by src/lib/case-studies.ts: one source for the home page,
 * /portfolio, the case study pages and "Related work" on service pages.
 */

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
    more: "Read the full case study",
    close: "Close",
    closeAriaLabel: "Close",
  },
  estimateFor: { mobile: "mobile", web: "webapp", cloud: "cloud", nocode: "nocode" },
};
