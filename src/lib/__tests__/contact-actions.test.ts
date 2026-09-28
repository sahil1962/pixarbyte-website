import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* The Server Actions run for real against the fallback adapters (console email, memory rate
 * limit, local JSON leads, Turnstile test mode). Only the request headers, the network and,
 * for the email-failure case, the Resend SDK are stubbed. */

const req = vi.hoisted(() => ({ ip: "10.0.0.1", resendSend: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": `${req.ip}, 10.9.9.9`, "user-agent": "vitest" }),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: req.resendSend };
  },
}));

import { requestEstimate, submitQuote } from "@/app/contact/actions";
import { readLocalLeads } from "@/lib/leads";
import { resetMemoryRateLimits } from "@/lib/ratelimit";
import { TURNSTILE_TEST_TOKEN } from "@/lib/turnstile-keys";

const valid = {
  name: "Jane Smith",
  email: "jane@example.co.uk",
  phoneCountry: "+44",
  phone: "07700 900123",
  company: "",
  clientType: "business",
  services: ["mobile-app-development", "cloud-services"],
  projectType: "new",
  budget: "15k-30k",
  timeline: "1-3m",
  description: "A booking app for our three London clinics, with reminders.",
  attachments: [],
  source: "referral",
  wantsNda: true,
  consent: true,
  turnstileToken: TURNSTILE_TEST_TOKEN,
  website: "",
};

let dir: string;
let ipCounter = 0;
let logged: string[];
let errors: unknown[][];

beforeEach(async () => {
  vi.unstubAllEnvs();
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("LEADS_WEBHOOK_URL", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
  dir = await mkdtemp(path.join(os.tmpdir(), "actions-test-"));
  vi.stubEnv("LEADS_FILE", path.join(dir, "leads.json"));
  // Cloudflare can't be reached from tests: the adapter's test-mode fallback applies.
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  req.ip = `10.0.0.${++ipCounter}`;
  resetMemoryRateLimits();
  logged = [];
  errors = [];
  vi.spyOn(console, "info").mockImplementation((m: unknown) => void logged.push(String(m)));
  vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => void errors.push(args));
});

afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  await rm(dir, { recursive: true, force: true });
});

const emails = () => logged.filter((m) => m.includes("Email not sent"));
const emailTo = (to: string) => emails().find((m) => m.includes(`To:       ${to}`)) ?? "";

describe("submitQuote", () => {
  it("saves the lead, then sends the team notification and the client auto-reply", async () => {
    expect(await submitQuote(valid)).toEqual({ ok: true });

    const leads = await readLocalLeads();
    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({
      kind: "quote",
      ip: "10.0.0." + ipCounter,
      userAgent: "vitest",
      data: { name: "Jane Smith", email: "jane@example.co.uk", phone: "+44 7700 900123", wantsNda: true },
    });
    expect(leads[0].data).not.toHaveProperty("turnstileToken");
    expect(leads[0].data).toHaveProperty("consentAt");

    expect(emails()).toHaveLength(2);
    const team = emailTo("hello@pixarbyte.co.uk");
    const client = emailTo("jane@example.co.uk");
    expect(team).toContain("To:       hello@pixarbyte.co.uk");
    expect(team).toContain("Reply-To: jane@example.co.uk");
    expect(team).toContain("Subject:  New lead: Jane Smith · Mobile app, Cloud and DevOps · £15,000 to £30,000");
    expect(team).toContain("NDA requested");
    expect(team).toContain("https://wa.me/447700900123");
    expect(client).toContain("To:       jane@example.co.uk");
    expect(client).toContain("Thanks, Jane.");
    expect(client).toContain("within one working day");
  });

  it("labels temporary attachments in the team email", async () => {
    const r = await submitQuote({
      ...valid,
      attachments: [{ name: "brief.pdf", size: 2048, url: "temp:0b8e5a0c-1f2d-4c1a-9a7e-3a6f2c1d9e10" }],
    });
    expect(r.ok).toBe(true);
    expect(emailTo("hello@pixarbyte.co.uk")).toContain("stored temporarily");
  });

  it("pretends to succeed for bots that fill the honeypot, without saving anything", async () => {
    expect(await submitQuote({ ...valid, website: "https://spam.example" })).toEqual({ ok: true });
    expect(await readLocalLeads()).toEqual([]);
    expect(emails()).toEqual([]);
  });

  it("returns field errors for invalid input", async () => {
    const r = await submitQuote({ ...valid, name: "", email: "nope", services: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.fieldErrors).toMatchObject({
        name: "Please enter your name",
        email: "Please enter a valid email address, like you@company.co.uk",
        services: "Please choose at least one service",
      });
    }
    expect(await readLocalLeads()).toEqual([]);
  });

  it("rejects a failed Turnstile check and saves nothing", async () => {
    const r = await submitQuote({ ...valid, turnstileToken: "forged" });
    expect(r).toMatchObject({ ok: false, fieldErrors: { turnstileToken: expect.any(String) } });
    expect(await readLocalLeads()).toEqual([]);
  });

  it("rate limits each IP to 5 requests an hour", async () => {
    for (let i = 0; i < 5; i++) expect((await submitQuote(valid)).ok).toBe(true);
    const sixth = await submitQuote(valid);
    expect(sixth).toMatchObject({ ok: false, error: expect.stringContaining("Too many requests") });
    expect(await readLocalLeads()).toHaveLength(5);
    req.ip = "10.1.1.1";
    expect((await submitQuote(valid)).ok).toBe(true);
  });

  it("keeps the lead and still succeeds when email sending fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_live_123");
    req.resendSend.mockRejectedValue(new Error("Resend is down"));
    expect(await submitQuote(valid)).toEqual({ ok: true });
    expect(await readLocalLeads()).toHaveLength(1);
    expect(req.resendSend).toHaveBeenCalledTimes(2);
    expect(errors.filter((e) => String(e[0]).includes("email"))).toHaveLength(2);
  });

  it("reports an error if the lead can't be saved", async () => {
    vi.stubEnv("LEADS_FILE", "/dev/null/leads.json");
    const r = await submitQuote(valid);
    expect(r).toMatchObject({ ok: false, error: expect.stringContaining("hello@pixarbyte.co.uk") });
    expect(emails()).toEqual([]);
  });
});

describe("requestEstimate", () => {
  it("prices the estimate on the server, saves the lead and emails the breakdown", async () => {
    const r = await requestEstimate({
      email: "sam@example.co.uk",
      type: "website",
      size: "s",
      features: ["cms", "not-a-feature"],
      turnstileToken: TURNSTILE_TEST_TOKEN,
      website: "",
    });
    expect(r).toEqual({ ok: true });
    const [lead] = await readLocalLeads();
    expect(lead).toMatchObject({
      kind: "estimate",
      data: { email: "sam@example.co.uk", features: ["cms"], low: 4500, high: 6400 },
    });
    const client = emailTo("sam@example.co.uk");
    const team = emailTo("hello@pixarbyte.co.uk");
    expect(client).toContain("£4,500 – £6,400");
    expect(team).toContain("New estimate request: Website · £4,500 – £6,400");
  });

  it("rejects an invalid email", async () => {
    const r = await requestEstimate({ email: "x", type: "website", size: "s", features: [], turnstileToken: "t" });
    expect(r).toMatchObject({ ok: false, error: "Enter a valid email address, like you@company.co.uk." });
  });
});
