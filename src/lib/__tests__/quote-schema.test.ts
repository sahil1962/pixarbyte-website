import { describe, expect, it } from "vitest";
import { estimateModel } from "@/data/pricing";
import { prefillFromParams } from "@/lib/quote-prefill";
import {
  checkFile,
  estimateRequestSchema,
  fieldErrorsFrom,
  formatPhone,
  MAX_FILE_BYTES,
  quoteSchema,
  safeFileName,
} from "@/lib/validation/quote";

const validQuote = {
  name: "Jane Smith",
  email: "jane@example.co.uk",
  phoneCountry: "+44",
  phone: "07700 900123",
  company: "Smith & Co",
  clientType: "business",
  services: ["mobile-app-development"],
  projectType: "new",
  budget: "15k-30k",
  timeline: "1-3m",
  description: "A booking app for our three London clinics, with reminders.",
  attachments: [],
  source: "",
  wantsNda: false,
  consent: true,
  turnstileToken: "XXXX.DUMMY.TOKEN.XXXX",
  website: "",
};

function errorsFor(input: unknown) {
  const r = quoteSchema.safeParse(input);
  return r.success ? {} : fieldErrorsFrom(r.error);
}

describe("quoteSchema", () => {
  it("accepts a complete, valid request", () => {
    const r = quoteSchema.safeParse(validQuote);
    expect(r.success).toBe(true);
  });

  it("accepts the minimum: optional fields empty", () => {
    const r = quoteSchema.safeParse({
      ...validQuote,
      phone: "",
      company: "",
      projectType: "",
      timeline: "",
      attachments: undefined,
      wantsNda: undefined,
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.attachments).toEqual([]);
      expect(r.data.wantsNda).toBe(false);
    }
  });

  it("defaults the phone country to the UK", () => {
    const r = quoteSchema.safeParse({ ...validQuote, phoneCountry: undefined });
    expect(r.success && r.data.phoneCountry).toBe("+44");
  });

  it.each([
    ["name", { name: "J" }, "Please enter your name"],
    ["email", { email: "not-an-email" }, "Please enter a valid email address, like you@company.co.uk"],
    ["services", { services: [] }, "Please choose at least one service"],
    ["clientType", { clientType: undefined }, "Please choose one"],
    ["budget", { budget: "" }, "Please choose a budget range"],
    ["description", { description: "Too short" }, "Please tell us a bit more (at least 20 characters)"],
    ["consent", { consent: false }, "Please accept the privacy notice to continue"],
    ["turnstileToken", { turnstileToken: "" }, "Please complete the verification"],
    ["phone", { phone: "call me" }, "Please enter a valid phone number, like 07700 900123"],
  ])("rejects a bad %s with a clear message", (field, patch, message) => {
    expect(errorsFor({ ...validQuote, ...patch })[field]).toBe(message);
  });

  it("rejects unknown services and a filled honeypot", () => {
    expect(errorsFor({ ...validQuote, services: ["seo"] }).services).toBeDefined();
    expect(errorsFor({ ...validQuote, website: "http://spam" }).website).toBeDefined();
  });

  it("allows up to three attachments from Blob or temporary storage only", () => {
    const file = (url: string) => ({ name: "brief.pdf", size: 1000, url });
    expect(
      quoteSchema.safeParse({
        ...validQuote,
        attachments: [
          file("temp:0b8e5a0c-1f2d-4c1a-9a7e-3a6f2c1d9e10"),
          file("https://abc123.public.blob.vercel-storage.com/leads/brief.pdf"),
        ],
      }).success,
    ).toBe(true);
    expect(
      errorsFor({ ...validQuote, attachments: [file("https://evil.example.com/x.pdf")] }).attachments,
    ).toBeDefined();
    const four = Array.from({ length: 4 }, (_, i) => file(`temp:0b8e5a0c-1f2d-4c1a-9a7e-3a6f2c1d9e1${i}`));
    expect(errorsFor({ ...validQuote, attachments: four }).attachments).toBe("Up to 3 files");
  });
});

describe("estimateRequestSchema", () => {
  it("validates the quick estimate email request", () => {
    const ok = { email: "a@b.co.uk", type: "website", size: "m", features: ["cms"], turnstileToken: "t" };
    expect(estimateRequestSchema.safeParse(ok).success).toBe(true);
    expect(estimateRequestSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
    expect(estimateRequestSchema.safeParse({ ...ok, type: "blockchain" }).success).toBe(false);
  });
});

describe("formatPhone", () => {
  it("drops the UK trunk 0 and adds +44", () => {
    expect(formatPhone("+44", "07700 900123")).toBe("+44 7700 900123");
    expect(formatPhone("+44", "020 7946 0000")).toBe("+44 20 7946 0000");
  });
  it("keeps numbers typed in international form", () => {
    expect(formatPhone("+44", "+353 1 234 5678")).toBe("+353 1 234 5678");
  });
  it("returns undefined for an empty number", () => {
    expect(formatPhone("+44", "")).toBeUndefined();
  });
});

describe("attachments", () => {
  it("checks type and size", () => {
    expect(checkFile({ name: "a.pdf", type: "application/pdf", size: 100 })).toBeNull();
    expect(checkFile({ name: "a.exe", type: "application/x-msdownload", size: 100 })).toBe("badType");
    expect(checkFile({ name: "a.pdf", type: "application/pdf", size: MAX_FILE_BYTES + 1 })).toBe("tooBig");
  });
  it("makes file names safe for storage", () => {
    expect(safeFileName("../../etc/passwd")).toBe("etc-passwd");
    expect(safeFileName("My brief (final).pdf")).toBe("My-brief-final-.pdf");
  });
});

describe("prefillFromParams", () => {
  const ctx = { model: estimateModel, packages: { "websites-business": "Websites: Business" } };
  const prefill = (qs: string) => prefillFromParams(new URLSearchParams(qs), ctx);

  it("prefills a known service and ignores unknown ones", () => {
    expect(prefill("service=mobile-app-development").services).toEqual(["mobile-app-development"]);
    expect(prefill("service=hacking").services).toBeUndefined();
  });

  it("reads the audience type, or maps a project type to a service", () => {
    expect(prefill("type=business").clientType).toBe("business");
    expect(prefill("type=mobile").services).toEqual(["mobile-app-development"]);
    expect(prefill("type=<script>")).toEqual({});
  });

  it("adds a known package to meta and the description", () => {
    const p = prefill("package=websites-business");
    expect(p.meta?.package).toBe("websites-business");
    expect(p.description).toContain("Websites: Business");
    expect(prefill("package=free-money").meta).toBeUndefined();
  });

  it("adds an engagement model", () => {
    expect(prefill("model=hourly").meta?.model).toBe("hourly");
    expect(prefill("model=barter").meta).toBeUndefined();
  });

  it("recalculates the estimator range instead of trusting the URL", () => {
    const p = prefill("type=website&size=s&features=cms,bogus&estimate=£1");
    // 4,100 + 1,200 = 5,300 → £4,500 – £6,400
    expect(p.meta?.estimate).toBe("website, small, cms: £4,500 – £6,400");
    expect(p.description).toContain("£4,500 – £6,400");
    expect(p.description).toContain("edit content yourself");
    expect(p.description).not.toContain("bogus");
  });
});
