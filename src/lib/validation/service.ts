import { z } from "zod";
import type { Service } from "@/types/service";

export const serviceSlugs = [
  "frontend-development",
  "backend-development",
  "full-stack-development",
  "no-code-development",
  "mobile-app-development",
  "cloud-services",
] as const;

const slug = z.enum(serviceSlugs);
const projectType = z.enum(["website", "mobile", "webapp", "nocode", "cloud"]);
const text = z.string().trim().min(1);
const iconItem = z.object({ title: text, description: text, icon: text });

const visual = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("stack"), layers: z.tuple([text, text, text]), badge: text }),
  z.object({
    kind: z.literal("swipe"),
    ariaLabel: text,
    hint: text,
    cards: z.array(z.object({ label: text, title: text, from: text, to: text })).min(1),
  }),
  z.object({ kind: z.literal("layout"), labels: z.tuple([text, text]) }),
  z.object({
    kind: z.literal("requests"),
    requests: z
      .array(z.object({ method: z.enum(["GET", "POST", "PUT"]), path: text, ms: z.number().positive() }))
      .min(4),
  }),
  z.object({
    kind: z.literal("automations"),
    items: z.array(z.object({ letter: text, color: text, title: text, detail: text, on: z.boolean() })).min(1),
  }),
  z.object({
    kind: z.literal("regions"),
    paths: z.array(text).min(1),
    regions: z
      .array(z.object({ name: text, detail: text, x: z.number(), y: z.number(), primary: z.boolean().optional() }))
      .min(1),
  }),
]);

export const serviceSchema = z.object({
  slug,
  order: z.number().int().positive(),
  name: text,
  navLabel: text,
  icon: text,
  shortDescription: text.max(120),
  seo: z.object({ title: text, description: text.max(170), keywords: z.array(text).optional() }),
  hero: z.object({ heading: text, subheading: text }),
  visual,
  estimate: z.object({ type: projectType, label: text }),
  overview: z.array(text).min(1),
  offerings: z.array(iconItem).min(6).max(8),
  benefits: z.array(iconItem).length(4),
  techStack: z.array(text).min(3),
  process: z.array(z.object({ title: text, time: text, you: text, text, gets: z.array(text).min(1) })).length(5),
  useCases: z.array(text).min(3),
  pricingHint: z.object({
    from: z.number().positive(),
    currency: z.literal("GBP"),
    unit: text.optional(),
    note: text.optional(),
  }),
  faqs: z
    .array(z.object({ question: text, answer: text }))
    .min(5)
    .max(8),
  relatedServices: z.array(slug).min(2).max(3),
  comparison: z
    .object({ caption: text, headers: z.array(z.string()).min(2), rows: z.array(z.array(text)).min(1) })
    .optional(),
}) satisfies z.ZodType<Service>;

/**
 * Validates the whole list, plus the rules a schema can't express on one entry:
 * unique slugs and orders, and links that point at services that exist.
 */
export const servicesSchema = z
  .array(serviceSchema)
  .length(serviceSlugs.length)
  .superRefine((list, ctx) => {
    const slugs = new Set(list.map((s) => s.slug));
    if (slugs.size !== list.length) ctx.addIssue({ code: "custom", message: "Service slugs must be unique" });
    if (new Set(list.map((s) => s.order)).size !== list.length)
      ctx.addIssue({ code: "custom", message: "Service order values must be unique" });
    list.forEach((s, i) => {
      s.relatedServices.forEach((r) => {
        if (r === s.slug)
          ctx.addIssue({ code: "custom", path: [i, "relatedServices"], message: `${s.slug} links to itself` });
      });
      s.comparison?.rows.forEach((row, j) => {
        if (row.length !== s.comparison!.headers.length)
          ctx.addIssue({
            code: "custom",
            path: [i, "comparison", "rows", j],
            message: "Row length must match headers",
          });
      });
    });
  });
