import type { ProcessSectionContent, ProcessStep } from "@/types/content";

export const processSection: ProcessSectionContent = {
  title: "How a project runs.",
  intro: "The same five steps every time, so you always know what happens next and what it costs.",
  tablistLabel: "Project steps",
  lengthLabel: "Typical length",
  yourTimeLabel: "Your time",
  getsTitle: "What you get",
};

export const processSteps: ProcessStep[] = [
  {
    title: "Discovery",
    time: "1 week",
    you: "2 to 3 hours",
    text: "A workshop in London or on video to agree goals, users and must-haves. You leave with a fixed quote, not a guess.",
    gets: ["Written project brief", "Fixed quote and timeline", "Technical recommendation"],
  },
  {
    title: "Design",
    time: "1 to 3 weeks",
    you: "One review a week",
    text: "We design the key screens and turn them into a clickable prototype you can put in front of real users.",
    gets: ["Wireframes and UI design", "Clickable Figma prototype", "Reusable design system"],
  },
  {
    title: "Build",
    time: "2 to 10 weeks",
    you: "30 minutes a week",
    text: "Two-week sprints with a live demo every Friday. You always have a staging link to try the latest version.",
    gets: ["Working software every sprint", "Private staging link", "Weekly progress notes"],
  },
  {
    title: "Test",
    time: "1 to 2 weeks",
    you: "Try it with your team",
    text: "Real devices and browsers, accessibility checks and load tests before anything reaches your customers.",
    gets: ["QA report", "WCAG 2.2 AA accessibility check", "Performance audit"],
  },
  {
    title: "Launch and support",
    time: "Ongoing",
    you: "As much as you like",
    text: "We deploy, monitor and keep improving. The first 30 days of support are included in every project.",
    gets: ["Production launch", "Monitoring and alerts", "Handover docs and all code"],
  },
];
