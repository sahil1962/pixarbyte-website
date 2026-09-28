import type { Tech, TechSectionContent } from "@/types/content";

export const techSection: TechSectionContent = {
  title: "Proven tools, picked for the long run.",
  intro: "We choose technology that will still be supported in five years, not whatever is trending this month.",
  ariaLabel: "Technologies we use",
};

/** Every technology we reference. Services and case studies point at these by id. */
export const techCatalog: Tech[] = [
  { id: "nextjs", name: "Next.js", category: "Frontend", color: "#18181b" },
  { id: "react", name: "React", category: "Frontend", color: "#0ea5e9" },
  { id: "typescript", name: "TypeScript", category: "Language", color: "#2563eb" },
  { id: "tailwind", name: "Tailwind CSS", category: "Styling", color: "#06b6d4" },
  { id: "nodejs", name: "Node.js", category: "Backend", color: "#16a34a" },
  { id: "python", name: "Python", category: "Backend", color: "#eab308" },
  { id: "laravel", name: "Laravel", category: "Backend", color: "#ef4444" },
  { id: "postgresql", name: "PostgreSQL", category: "Database", color: "#3b82f6" },
  { id: "stripe", name: "Stripe", category: "Payments", color: "#6366f1" },
  { id: "flutter", name: "Flutter", category: "Mobile", color: "#0ea5e9" },
  { id: "react-native", name: "React Native", category: "Mobile", color: "#06b6d4" },
  { id: "swift", name: "Swift", category: "iOS", color: "#f97316" },
  { id: "kotlin", name: "Kotlin", category: "Android", color: "#8b5cf6" },
  { id: "webflow", name: "Webflow", category: "No-code", color: "#2563eb" },
  { id: "bubble", name: "Bubble", category: "No-code", color: "#18181b" },
  { id: "zapier", name: "Zapier", category: "Automation", color: "#f97316" },
  { id: "aws", name: "AWS", category: "Cloud", color: "#f59e0b" },
  { id: "azure", name: "Azure", category: "Cloud", color: "#0284c7" },
  { id: "google-cloud", name: "Google Cloud", category: "Cloud", color: "#22c55e" },
  { id: "docker", name: "Docker", category: "DevOps", color: "#0ea5e9" },
  { id: "terraform", name: "Terraform", category: "DevOps", color: "#7c3aed" },
  // Used on service pages, not in the home marquee.
  { id: "sanity", name: "Sanity CMS", category: "CMS", color: "#ef4444" },
  { id: "vercel", name: "Vercel", category: "Hosting", color: "#18181b" },
  { id: "firebase", name: "Firebase", category: "Backend", color: "#f59e0b" },
  { id: "redis", name: "Redis", category: "Database", color: "#dc2626" },
  { id: "graphql", name: "GraphQL", category: "APIs", color: "#e11d48" },
  { id: "airtable", name: "Airtable", category: "No-code", color: "#0ea5e9" },
  { id: "softr", name: "Softr", category: "No-code", color: "#8b5cf6" },
  { id: "make", name: "Make", category: "Automation", color: "#7c3aed" },
  { id: "github-actions", name: "GitHub Actions", category: "DevOps", color: "#2563eb" },
];

/** The home page marquee: two rows, the second scrolls the other way. */
export const techRowIds: [string[], string[]] = [
  ["nextjs", "react", "typescript", "tailwind", "nodejs", "python", "laravel", "postgresql", "stripe"],
  [
    "flutter",
    "react-native",
    "swift",
    "kotlin",
    "webflow",
    "bubble",
    "zapier",
    "aws",
    "azure",
    "google-cloud",
    "docker",
    "terraform",
  ],
];
