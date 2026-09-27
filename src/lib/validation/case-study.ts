import { z } from "zod";
import { serviceSlugs } from "./service";

const text = z.string().trim().min(1);
const colour = z.string().regex(/^#[0-9a-f]{6}$/i, "Use a 6-digit hex colour, e.g. #1d4ed8");
/** Site-relative path (`/images/...`) or an absolute URL. */
const src = z.string().regex(/^(\/|https?:\/\/)/, "Use a path starting with / or a full URL");

/**
 * Frontmatter of a case study MDX file in content/case-studies. The fields after
 * `testimonial` drive the illustrated cards and the short story used on the home page.
 */
export const caseStudySchema = z.object({
  title: text,
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: text,
  confidential: z.boolean().default(false),
  summary: text.max(160),
  date: z.iso.date(),
  featured: z.boolean().default(false),
  order: z.number().default(99),
  services: z.array(z.enum(serviceSlugs)).min(1),
  industry: text,
  duration: z.string().optional(),
  teamSize: z.number().int().positive().optional(),
  platforms: z.array(text).default([]),
  tech: z.array(text).default([]),
  cover: src,
  thumbnail: src,
  liveUrl: z.url().optional().or(z.literal("")),
  appStoreUrl: z.url().optional().or(z.literal("")),
  playStoreUrl: z.url().optional().or(z.literal("")),
  /** Label for non-client or internal projects. */
  concept: z.boolean().default(false),
  results: z.array(z.object({ value: text, label: text })).default([]),
  gallery: z.array(z.object({ src, alt: text, device: z.enum(["mobile", "desktop", "tablet"]) })).default([]),
  beforeAfter: z.object({ before: src, after: src, beforeAlt: text, afterAlt: text }).optional(),
  testimonial: z.object({ quote: text, name: text, role: text, avatar: src.optional() }).optional(),

  /** Home "Recent work" filter this project sits under. */
  category: z.enum(["web", "mobile", "cloud", "nocode"]),
  location: text,
  tags: z.array(text).min(1).max(3),
  colors: z.object({ primary: colour, secondary: colour }),
  /** Which illustrated device the cards show. */
  mock: z.enum(["phone", "browser", "term"]),
  challenge: text,
  solution: text,
});

export type CaseStudyMeta = z.infer<typeof caseStudySchema>;
