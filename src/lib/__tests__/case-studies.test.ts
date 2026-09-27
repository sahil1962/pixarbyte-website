import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import { getAdjacentCaseStudies, getCaseStudies, getCaseStudy, getRelatedCaseStudies } from "@/lib/case-studies";
import { getCaseStudies as getWork, getCaseStudiesByService } from "@/lib/content";
import { filterProjects, readFilter, resultToStat, toCaseStudy } from "@/lib/portfolio";
import { caseStudySchema } from "@/lib/validation/case-study";

const DIR = path.join(process.cwd(), "content/case-studies");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));

describe("case study MDX files", () => {
  it.each(files)("%s has valid frontmatter", (file) => {
    const { data } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
    expect(() => caseStudySchema.parse(data)).not.toThrow();
  });

  it("every referenced image exists in public/", async () => {
    for (const m of await getCaseStudies()) {
      const srcs = [m.cover, m.thumbnail, ...m.gallery.map((g) => g.src)];
      if (m.beforeAfter) srcs.push(m.beforeAfter.before, m.beforeAfter.after);
      for (const src of srcs) expect(fs.existsSync(path.join("public", src)), src).toBe(true);
    }
  });

  it("loads the five launch case studies in order, skipping the template", async () => {
    const all = await getCaseStudies();
    expect(all.map((c) => c.client)).toEqual([
      "FoodGo",
      "Meridian Health",
      "Northwind Retail",
      "Stackly",
      "Qubit Labs",
    ]);
  });

  it("returns a case study with its MDX body, or null", async () => {
    const cs = await getCaseStudy("foodgo-ordering-app");
    expect(cs?.meta.client).toBe("FoodGo");
    expect(cs?.content).toContain("## The challenge");
    expect(await getCaseStudy("nope")).toBeNull();
    expect(await getCaseStudy("../package")).toBeNull();
  });

  it("rejects bad frontmatter with a clear error", () => {
    const bad = caseStudySchema.safeParse({ title: "x", slug: "Bad Slug" });
    expect(bad.success).toBe(false);
  });

  it("finds neighbours and related projects", async () => {
    const all = await getCaseStudies();
    const first = await getAdjacentCaseStudies(all[0].slug);
    expect(first.prev).toBeNull();
    expect(first.next?.slug).toBe(all[1].slug);
    const last = await getAdjacentCaseStudies(all.at(-1)!.slug);
    expect(last.next).toBeNull();

    const related = await getRelatedCaseStudies(all[1], 3);
    expect(related).toHaveLength(3);
    expect(related.map((r) => r.slug)).not.toContain(all[1].slug);
    // FoodGo (backend) and Stackly (full-stack) each share a service with Meridian, so they
    // come before Northwind and Qubit, which share none.
    expect(related.slice(0, 2).map((r) => r.client)).toEqual(["FoodGo", "Stackly"]);
  });
});

describe("one source of truth", () => {
  it("feeds the home Work section and service pages from the MDX files", async () => {
    const { caseStudies } = await getWork();
    expect(caseStudies.map((c) => c.slug)).toEqual((await getCaseStudies()).map((c) => c.slug));
    expect(caseStudies[0]).toMatchObject({
      client: "FoodGo",
      filter: "mobile",
      href: "/portfolio/foodgo-ordering-app",
      quote: { cite: "Ali Raza, Founder, FoodGo" },
    });
    const cloud = await getCaseStudiesByService("cloud-services");
    expect(cloud.map((c) => c.client)).toEqual(["Northwind Retail"]);
  });

  it("hides a confidential client's name", async () => {
    const meta = { ...(await getCaseStudies())[0], confidential: true };
    const card = toCaseStudy(meta);
    expect(card.client).toBe("Confidential client");
    expect(card.quote?.cite).not.toContain("FoodGo");
  });
});

describe("portfolio filters", () => {
  const p = (services: string[], industry: string) => ({ services, industry }) as never;
  const projects = [
    p(["mobile-app-development", "backend-development"], "Food"),
    p(["full-stack-development"], "Health"),
    p(["cloud-services"], "Retail"),
    p(["full-stack-development", "frontend-development"], "Software"),
  ];

  it("returns everything for all/all", () => {
    expect(filterProjects(projects, "all", "all")).toHaveLength(4);
  });
  it("filters by service", () => {
    expect(filterProjects(projects, "full-stack-development", "all")).toEqual([projects[1], projects[3]]);
  });
  it("filters by industry", () => {
    expect(filterProjects(projects, "all", "Retail")).toEqual([projects[2]]);
  });
  it("combines service and industry", () => {
    expect(filterProjects(projects, "full-stack-development", "Health")).toEqual([projects[1]]);
    expect(filterProjects(projects, "cloud-services", "Health")).toEqual([]);
  });
  it("ignores unknown values from the URL", () => {
    expect(readFilter("cloud-services", ["cloud-services"])).toBe("cloud-services");
    expect(readFilter("<script>", ["cloud-services"])).toBe("all");
    expect(readFilter(null, ["cloud-services"])).toBe("all");
  });
});

describe("resultToStat", () => {
  it.each([
    ["+65%", { value: 65, prefix: "+", suffix: "%", decimals: 0 }],
    ["−30%", { value: 30, prefix: "−", suffix: "%" }],
    ["4.8★", { value: 4.8, decimals: 1, suffix: "★" }],
    ["2,000+", { value: 2000, group: true, suffix: "+" }],
    ["99.99%", { value: 99.99, decimals: 2 }],
    ["£0", { value: 0, prefix: "£" }],
    ["12 wks", { value: 12, suffix: " wks" }],
  ])("parses %s", (value, expected) => {
    expect(resultToStat(value, "label")).toMatchObject(expected);
  });
  it("leaves values without a single number alone", () => {
    expect(resultToStat("24/7", "support")).toBeNull();
    expect(resultToStat("Launched", "status")).toBeNull();
  });
});
