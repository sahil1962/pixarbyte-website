import type { CaseStudy, Stat } from "@/types/content";
import type { CaseStudyMeta } from "./validation/case-study";

/** The card and dialog view of a case study's frontmatter. */
export function toCaseStudy(m: CaseStudyMeta): CaseStudy {
  const client = m.confidential ? "Confidential client" : m.client;
  return {
    slug: m.slug,
    href: `/portfolio/${m.slug}`,
    filter: m.category,
    services: m.services,
    industry: m.industry,
    client,
    location: m.location,
    title: m.title,
    summary: m.summary,
    tags: m.tags,
    concept: m.concept,
    colors: { c1: m.colors.primary, c2: m.colors.secondary },
    mock: m.mock,
    stats: m.results,
    challenge: m.challenge,
    solution: m.solution,
    quote: m.testimonial && {
      text: m.testimonial.quote,
      cite: `${m.testimonial.name}, ${m.testimonial.role}, ${client}`,
    },
  };
}

export const ALL = "all";

/** Projects matching a service and an industry filter; `all` matches everything. */
export function filterProjects<T extends Pick<CaseStudy, "services" | "industry">>(
  projects: T[],
  service: string,
  industry: string,
): T[] {
  return projects.filter(
    (p) =>
      (service === ALL || (p.services as string[]).includes(service)) && (industry === ALL || p.industry === industry),
  );
}

/** Reads a filter from the URL, falling back to `all` for missing or unknown values. */
export function readFilter(value: string | null, allowed: string[]): string {
  return value && allowed.includes(value) ? value : ALL;
}

/**
 * A result such as "+65%", "2,000+" or "4.8★" as a countable stat, or null when the value
 * has no single number to count (then it is shown as written).
 */
export function resultToStat(value: string, label: string): Stat | null {
  const m = /^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/.exec(value);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return {
    value: Number(num.replaceAll(",", "")),
    decimals,
    prefix: prefix || undefined,
    suffix: suffix || undefined,
    group: num.includes(",") || undefined,
    label,
  };
}
