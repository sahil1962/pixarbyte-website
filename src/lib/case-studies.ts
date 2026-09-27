import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { techCatalog } from "@/data/tech";
import { caseStudySchema, type CaseStudyMeta } from "./validation/case-study";

/**
 * Case studies live as MDX files in content/case-studies: frontmatter for the structured
 * data, the body for the long-form story. Files starting with `_` (the template) are skipped.
 * `server-only` keeps this file, which reads the file system, out of client bundles.
 */
const DIR = path.join(process.cwd(), "content/case-studies");
const techIds = new Set(techCatalog.map((t) => t.id));

function parse(file: string, raw: string) {
  const { data, content } = matter(raw);
  const parsed = caseStudySchema.safeParse(data);
  if (!parsed.success) throw new Error(`Invalid frontmatter in ${file}:\n${parsed.error.message}`);
  const meta = parsed.data;
  if (`${meta.slug}.mdx` !== file) throw new Error(`${file}: slug "${meta.slug}" must match the file name`);
  for (const id of meta.tech)
    if (!techIds.has(id)) throw new Error(`${file}: unknown tech id "${id}"; add it to src/data/tech.ts`);
  return { meta, content };
}

async function readAll() {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));
  return Promise.all(files.map(async (file) => parse(file, await fs.readFile(path.join(DIR, file), "utf8"))));
}

/** Every case study, in display order (then newest first). Throws on invalid frontmatter. */
export const getCaseStudies = cache(async (): Promise<CaseStudyMeta[]> => {
  const items = (await readAll()).map((i) => i.meta);
  const seen = new Set<number>();
  for (const m of items) {
    if (seen.has(m.order)) throw new Error(`Two case studies share order ${m.order}`);
    seen.add(m.order);
  }
  return items.sort((a, b) => a.order - b.order || +new Date(b.date) - +new Date(a.date));
});

/** One case study with its MDX body, or null if there is no such file. */
export const getCaseStudy = cache(async (slug: string) => {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = `${slug}.mdx`;
  const raw = await fs.readFile(path.join(DIR, file), "utf8").catch(() => null);
  return raw === null ? null : parse(file, raw);
});

export async function getFeaturedCaseStudies(limit = 4) {
  return (await getCaseStudies()).filter((c) => c.featured).slice(0, limit);
}

/** The case studies either side of this one, for previous/next links. */
export async function getAdjacentCaseStudies(slug: string) {
  const all = await getCaseStudies();
  const i = all.findIndex((c) => c.slug === slug);
  return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 ? (all[i + 1] ?? null) : null };
}

/** Other projects, those sharing the most services with this one first. */
export async function getRelatedCaseStudies(meta: CaseStudyMeta, limit = 3) {
  const shared = (c: CaseStudyMeta) => c.services.filter((s) => meta.services.includes(s)).length;
  return (await getCaseStudies())
    .filter((c) => c.slug !== meta.slug)
    .sort((a, b) => shared(b) - shared(a) || a.order - b.order)
    .slice(0, limit);
}
