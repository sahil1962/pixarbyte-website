import { describe, expect, it } from "vitest";
import { homeBento, services } from "@/data/services";
import { servicePrices } from "@/data/pricing";
import { techCatalog } from "@/data/tech";
import { getBundles, getHomeServices, getServiceBySlug, getServices } from "@/lib/content";
import { icons } from "@/lib/icons";
import { faqSchema, serviceSchema as serviceJsonLd } from "@/lib/schema";
import { serviceSchema, servicesSchema } from "@/lib/validation/service";
import { siteConfig } from "@/data/site";

describe("services content", () => {
  it("passes the Zod schema", () => {
    expect(() => servicesSchema.parse(services)).not.toThrow();
  });

  it.each(services.map((s) => [s.slug, s] as const))("%s is complete", (_slug, s) => {
    const result = serviceSchema.safeParse(s);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });

  it("rejects an entry with a missing field", () => {
    const incomplete: Record<string, unknown> = { ...services[0] };
    delete incomplete.faqs;
    expect(serviceSchema.safeParse(incomplete).success).toBe(false);
  });

  it("only references known technologies and icons", () => {
    const ids = new Set(techCatalog.map((t) => t.id));
    for (const s of services) {
      s.techStack.forEach((id) => expect(ids.has(id), `${s.slug}: ${id}`).toBe(true));
      [s.icon, ...s.offerings.map((o) => o.icon), ...s.benefits.map((b) => b.icon)].forEach((name) =>
        expect(icons[name], `${s.slug}: ${name}`).toBeDefined(),
      );
    }
  });

  it("takes every starting price from the single price table", () => {
    for (const s of services) expect(s.pricingHint.from).toBe(servicePrices[s.slug]);
  });

  it("keeps the home bento prices and order", async () => {
    const { services: cards } = await getHomeServices();
    expect(cards.map((c) => c.slug)).toEqual(homeBento.map((b) => b.slug));
    expect(cards.map((c) => c.fromPrice)).toEqual([15000, 18000, 3500, 6000, 2500, 4000]);
  });

  it("prices bundles from the sum of their services", async () => {
    for (const b of await getBundles()) {
      expect(b.price).toBe(b.services.reduce((sum, slug) => sum + servicePrices[slug], 0));
    }
  });

  it("sorts services by order and finds them by slug", async () => {
    const list = await getServices();
    expect(list.map((s) => s.order)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(await getServiceBySlug("cloud-services")).not.toBeNull();
    expect(await getServiceBySlug("unknown")).toBeNull();
  });
});

describe("structured data", () => {
  const s = services[0];

  it("builds a Service with provider, URL and GBP offer", () => {
    const data = serviceJsonLd(siteConfig, s);
    expect(data["@type"]).toBe("Service");
    expect(data.url).toBe(`${siteConfig.url}/services/${s.slug}`);
    expect(data.provider).toMatchObject({ "@type": "Organization", name: siteConfig.name });
    expect(data.offers.priceSpecification).toMatchObject({ minPrice: s.pricingHint.from, priceCurrency: "GBP" });
  });

  it("builds a FAQPage with one Question per FAQ", () => {
    const data = faqSchema(s.faqs);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toHaveLength(s.faqs.length);
    expect(data.mainEntity[0]).toMatchObject({
      "@type": "Question",
      name: s.faqs[0].question,
      acceptedAnswer: { "@type": "Answer", text: s.faqs[0].answer },
    });
  });
});
