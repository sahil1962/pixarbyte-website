import type { Tech, TechSectionContent } from "@/types/content";

export const techSection: TechSectionContent = {
  title: "Proven tools, picked for the long run.",
  intro: "We choose technology that will still be supported in five years, not whatever is trending this month.",
  ariaLabel: "Technologies we use",
};

/** Two marquee rows; the second scrolls the other way. */
export const techRows: [Tech[], Tech[]] = [
  [
    { name: "Next.js", category: "Frontend", color: "#18181b" },
    { name: "React", category: "Frontend", color: "#0ea5e9" },
    { name: "TypeScript", category: "Language", color: "#2563eb" },
    { name: "Tailwind CSS", category: "Styling", color: "#06b6d4" },
    { name: "Node.js", category: "Backend", color: "#16a34a" },
    { name: "Python", category: "Backend", color: "#eab308" },
    { name: "Laravel", category: "Backend", color: "#ef4444" },
    { name: "PostgreSQL", category: "Database", color: "#3b82f6" },
    { name: "Stripe", category: "Payments", color: "#6366f1" },
  ],
  [
    { name: "Flutter", category: "Mobile", color: "#0ea5e9" },
    { name: "React Native", category: "Mobile", color: "#06b6d4" },
    { name: "Swift", category: "iOS", color: "#f97316" },
    { name: "Kotlin", category: "Android", color: "#8b5cf6" },
    { name: "Webflow", category: "No-code", color: "#2563eb" },
    { name: "Bubble", category: "No-code", color: "#18181b" },
    { name: "Zapier", category: "Automation", color: "#f97316" },
    { name: "AWS", category: "Cloud", color: "#f59e0b" },
    { name: "Azure", category: "Cloud", color: "#0284c7" },
    { name: "Google Cloud", category: "Cloud", color: "#22c55e" },
    { name: "Docker", category: "DevOps", color: "#0ea5e9" },
    { name: "Terraform", category: "DevOps", color: "#7c3aed" },
  ],
];
