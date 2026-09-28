import { describe, expect, it } from "vitest";
import { aboutContent, certifications } from "@/data/about";
import { builder } from "@/data/builder";
import {
  engagementModels,
  estimateModel,
  packageGroups,
  partnerMonthlyPrice,
  pricingPlans,
  servicePrices,
} from "@/data/pricing";
import { services } from "@/data/services";
import { getPricingHref, getTeam } from "@/lib/content";
import { estimate, roundEstimate } from "@/lib/estimator";
import { formatEstimate } from "@/lib/format";
import { findPlaceholders } from "@/lib/placeholders";
import type { ProjectType } from "@/types/content";

const types: ProjectType[] = ["website", "mobile", "webapp", "nocode", "cloud"];

describe("estimate()", () => {
  it("prices a small website with no extras", () => {
    // 4,100 × 1 = 4,100; ×0.85 = 3,485 → £3,500; ×1.2 = 4,920 → £4,900
    expect(estimate(estimateModel, { type: "website", size: "s", features: [] })).toEqual({
      mid: 4100,
      low: 3500,
      high: 4900,
      weeks: [2, 4],
    });
  });

  it("scales the base by size, then adds features at full price", () => {
    // no-code, large, automations + member logins: 2,950 × 3 + 800 + 1,000 = 10,650
    const r = estimate(estimateModel, { type: "nocode", size: "l", features: ["auto", "members"] });
    expect(r.mid).toBe(10650);
    expect(r.low).toBe(roundEstimate(10650 * 0.85)); // 9,052.5 → 9,100
    expect(r.low).toBe(9100);
    expect(r.high).toBe(12800); // 12,780 → 12,800
    expect(r.weeks).toEqual([3, 9]);
  });

  it("uses the medium multiplier and rounds the timeline", () => {
    const r = estimate(estimateModel, { type: "mobile", size: "m", features: ["pay"] });
    expect(r.mid).toBe(21200 * 1.8 + 3000);
    expect(r.weeks).toEqual([Math.round(8 * 1.8), Math.round(14 * 1.8)]);
  });

  it("ignores features that belong to another project type", () => {
    const withForeign = estimate(estimateModel, { type: "cloud", size: "s", features: ["shop", "ci"] });
    const clean = estimate(estimateModel, { type: "cloud", size: "s", features: ["ci"] });
    expect(withForeign).toEqual(clean);
  });

  it.each(types)("gives %s a low end below its high end, rounded to £100", (type) => {
    for (const size of ["s", "m", "l"] as const) {
      const all = estimateModel.features[type].map((f) => f.id);
      const r = estimate(estimateModel, { type, size, features: all });
      expect(r.low).toBeLessThan(r.high);
      expect(r.low % 100).toBe(0);
      expect(r.high % 100).toBe(0);
    }
  });

  it("matches the dialog's display rounding", () => {
    for (const type of types) {
      const r = estimate(estimateModel, { type, size: "m", features: [] });
      expect(formatEstimate(r.mid * estimateModel.spread.low)).toBe(formatEstimate(r.low));
      expect(formatEstimate(r.mid * estimateModel.spread.high)).toBe(formatEstimate(r.high));
    }
  });

  it("offers every builder project type", () => {
    expect(builder.projects.map((p) => p.key).sort()).toEqual([...types].sort());
  });
});

describe("prices are consistent everywhere", () => {
  it("starts each package group at its service's home page price", () => {
    for (const g of packageGroups) expect(g.tiers[0].priceFrom).toBe(servicePrices[g.service]);
  });

  it("covers every service with one package group and a working deep link", async () => {
    expect(packageGroups.map((g) => g.service).sort()).toEqual(services.map((s) => s.slug).sort());
    expect(new Set(packageGroups.map((g) => g.id)).size).toBe(packageGroups.length);
    expect(await getPricingHref("mobile-app-development")).toBe("/pricing#mobile-apps");
  });

  it("uses the service table for every service's pricing hint", () => {
    for (const s of services) expect(s.pricingHint.from).toBe(servicePrices[s.slug]);
  });

  it("keeps home plans, engagement models and tiers in step", () => {
    expect(pricingPlans[0].price).toBe(servicePrices["frontend-development"]);
    expect(pricingPlans[2].price).toBe(partnerMonthlyPrice);
    expect(engagementModels.find((m) => m.id === "dedicated")?.priceFrom).toBe(partnerMonthlyPrice);
    expect(engagementModels.find((m) => m.id === "fixed")?.priceFrom).toBe(Math.min(...Object.values(servicePrices)));
  });

  it("orders tiers by price, with custom quotes last", () => {
    for (const g of packageGroups) {
      const prices = g.tiers.map((t) => t.priceFrom || Infinity);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
      for (const t of g.tiers)
        for (const row of g.featureRows) expect(t.features, `${g.id}/${t.id}/${row.key}`).toHaveProperty(row.key);
    }
  });

  it("puts the smallest estimate close to each 'from' price", () => {
    // The estimator's small, no-extras low end rounds to the headline starting price.
    expect(estimate(estimateModel, { type: "website", size: "s", features: [] }).low).toBe(
      servicePrices["frontend-development"],
    );
  });
});

describe("about and team", () => {
  it("sorts the team by order and separates leaders", async () => {
    const { leaders, members, all } = await getTeam();
    expect(all.map((m) => m.order)).toEqual([...all.map((m) => m.order)].sort((a, b) => a - b));
    expect(leaders.every((m) => m.leadership)).toBe(true);
    expect(members.every((m) => !m.leadership)).toBe(true);
    expect(leaders.length + members.length).toBe(all.length);
    expect(new Set(all.map((m) => m.slug)).size).toBe(all.length);
  });

  it("finds [placeholder] text so it can't go live unnoticed", () => {
    expect(findPlaceholders({ a: "fine", b: ["[Year]"], c: { d: "Founded in [year]" } })).toEqual([
      { path: "b[0]", text: "[Year]" },
      { path: "c.d", text: "Founded in [year]" },
    ]);
    // The About data currently has obvious placeholders; `npm run check:placeholders`
    // fails until they're replaced.
    expect(findPlaceholders({ aboutContent, certifications }).length).toBeGreaterThan(0);
  });
});
