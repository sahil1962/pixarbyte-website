import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* ---------- SDK mocks: the "real" paths talk to these instead of the network ---------- */

const sdk = vi.hoisted(() => ({
  resendSend: vi.fn(),
  resendKey: [] as string[],
  upstashLimit: vi.fn(),
  redisConfig: [] as unknown[],
  handleUpload: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sdk.resendSend };
    constructor(key: string) {
      sdk.resendKey.push(key);
    }
  },
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor(config: unknown) {
      sdk.redisConfig.push(config);
    }
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    class {
      limit = sdk.upstashLimit;
    },
    { slidingWindow: (n: number, w: string) => ({ n, w }) },
  ),
}));

vi.mock("@vercel/blob/client", () => ({ handleUpload: sdk.handleUpload }));

import { isConfigured } from "@/lib/env";
import { emailMode, sendEmail } from "@/lib/email";
import { leadStoreMode, readLocalLeads, saveLead } from "@/lib/leads";
import { limits, rateLimit, rateLimitMode, resetMemoryRateLimits } from "@/lib/ratelimit";
import { describeAttachments, handleBlobUpload, saveTemporaryFile, storageMode } from "@/lib/storage";
import { turnstileMode, verifyTurnstile } from "@/lib/turnstile";
import { TURNSTILE_TEST_SECRET_KEY, TURNSTILE_TEST_TOKEN } from "@/lib/turnstile-keys";

const Hello = ({ name }: { name: string }) => createElement("p", null, `Hello ${name}, welcome.`);

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  for (const name of [
    "RESEND_API_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "BLOB_READ_WRITE_TOKEN",
    "LEADS_WEBHOOK_URL",
    "LEADS_WEBHOOK_SECRET",
    "TURNSTILE_SECRET_KEY",
  ])
    vi.stubEnv(name, "");
  vi.clearAllMocks();
  sdk.resendKey.length = 0;
  sdk.redisConfig.length = 0;
  resetMemoryRateLimits();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isConfigured", () => {
  it("treats missing, empty and sample values as not set", () => {
    expect(isConfigured(undefined)).toBe(false);
    expect(isConfigured("")).toBe(false);
    expect(isConfigured("re_sample_placeholder")).toBe(false);
    expect(isConfigured("https://sample-redis.upstash.io")).toBe(false);
    expect(isConfigured("https://hooks.example.com/sample-leads")).toBe(false);
    expect(isConfigured("re_9aB3kLq")).toBe(true);
  });
});

describe("email adapter", () => {
  it("logs the full email to the console without a key", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    const r = await sendEmail({
      to: "jane@example.co.uk",
      subject: "Hello there",
      replyTo: "team@pixarbyte.co.uk",
      react: createElement(Hello, { name: "Jane" }),
    });
    expect(emailMode()).toBe("console");
    expect(r).toEqual({ mode: "console", id: null });
    expect(sdk.resendSend).not.toHaveBeenCalled();
    const out = log.mock.calls.map((c) => String(c[0])).join("\n");
    expect(out).toContain("To:       jane@example.co.uk");
    expect(out).toContain("Subject:  Hello there");
    expect(out).toContain("Reply-To: team@pixarbyte.co.uk");
    expect(out).toContain("Hello Jane, welcome."); // rendered text
    expect(out).toContain("<p>Hello Jane, welcome.</p>"); // rendered HTML
  });

  it("treats the sample key as missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_sample_placeholder");
    vi.spyOn(console, "info").mockImplementation(() => {});
    expect(emailMode()).toBe("console");
    await sendEmail({ to: "a@b.co.uk", subject: "x", react: createElement(Hello, { name: "A" }) });
    expect(sdk.resendSend).not.toHaveBeenCalled();
  });

  it("sends through Resend with a real key", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_live_123");
    sdk.resendSend.mockResolvedValue({ data: { id: "em_1" }, error: null });
    const r = await sendEmail({ to: "a@b.co.uk", subject: "Hi", react: createElement(Hello, { name: "A" }) });
    expect(emailMode()).toBe("resend");
    expect(r).toEqual({ mode: "resend", id: "em_1" });
    expect(sdk.resendKey).toEqual(["re_live_123"]);
    const sent = sdk.resendSend.mock.calls[0][0];
    expect(sent).toMatchObject({ to: "a@b.co.uk", subject: "Hi", from: "PixarByte <hello@pixarbyte.co.uk>" });
    expect(sent.html).toContain("Hello A, welcome.");
    expect(sent.text).toContain("Hello A, welcome.");
  });

  it("throws when Resend rejects the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_live_123");
    sdk.resendSend.mockResolvedValue({ data: null, error: { message: "Domain not verified" } });
    await expect(
      sendEmail({ to: "a@b.co.uk", subject: "Hi", react: createElement(Hello, { name: "A" }) }),
    ).rejects.toThrow("Domain not verified");
  });
});

describe("rate limit adapter", () => {
  it("uses an in-memory sliding window with the same limits when Upstash isn't set", async () => {
    expect(rateLimitMode()).toBe("memory");
    const results = [];
    for (let i = 0; i < limits.quote.requests + 1; i++) results.push(await rateLimit("quote", "9.9.9.9"));
    expect(results.slice(0, -1).every((r) => r.success)).toBe(true);
    expect(results.at(-1)).toMatchObject({ success: false, remaining: 0, mode: "memory" });
    // Other visitors and other buckets are counted separately.
    expect((await rateLimit("quote", "8.8.8.8")).success).toBe(true);
    expect((await rateLimit("upload", "9.9.9.9")).success).toBe(true);
    expect(sdk.upstashLimit).not.toHaveBeenCalled();
  });

  it("uses Upstash when both variables are set", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://eu1-real.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "AXk1real");
    sdk.upstashLimit.mockResolvedValue({ success: false, remaining: 0, reset: 123 });
    expect(rateLimitMode()).toBe("upstash");
    expect(await rateLimit("quote", "1.1.1.1")).toEqual({ success: false, remaining: 0, reset: 123, mode: "upstash" });
    expect(sdk.upstashLimit).toHaveBeenCalledWith("1.1.1.1");
    expect(sdk.redisConfig).toEqual([{ url: "https://eu1-real.upstash.io", token: "AXk1real" }]);
  });

  it("falls back to memory if Upstash is unreachable", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://eu1-real.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "AXk1real");
    sdk.upstashLimit.mockRejectedValue(new Error("ECONNREFUSED"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await rateLimit("quote", "2.2.2.2")).toMatchObject({ success: true, mode: "memory" });
  });
});

describe("storage adapter", () => {
  it("keeps files in temporary storage without a Blob token, labelled as temporary", async () => {
    expect(storageMode()).toBe("temporary");
    const saved = await saveTemporaryFile({
      name: "../My brief.pdf",
      type: "application/pdf",
      bytes: new TextEncoder().encode("%PDF-1.4 test"),
    });
    expect(saved.url).toMatch(/^temp:[0-9a-f-]{36}$/);
    expect(saved.name).toBe("My-brief.pdf");
    if (saved.location !== "memory") expect((await stat(saved.location)).size).toBe(13);
    const [info] = await describeAttachments([{ name: saved.name, size: saved.size, url: saved.url }]);
    expect(info).toMatchObject({ name: "My-brief.pdf", temporary: true, location: saved.location });
    expect(info.href).toBeUndefined();
  });

  it("describes Blob files with their public link", async () => {
    const url = "https://abc.public.blob.vercel-storage.com/leads/brief-x1.pdf";
    expect(await describeAttachments([{ name: "brief.pdf", size: 10, url }])).toEqual([
      { name: "brief.pdf", size: 10, href: url, temporary: false },
    ]);
  });

  it("issues Vercel Blob upload tokens restricted to our types and size when the token is set", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "vercel_blob_rw_REAL123");
    expect(storageMode()).toBe("blob");
    sdk.handleUpload.mockResolvedValue({ type: "blob.generate-client-token", clientToken: "tok" });
    const req = new Request("http://localhost/api/upload", { method: "POST" });
    const body = { type: "blob.generate-client-token", payload: { pathname: "leads/a.pdf" } };
    await expect(handleBlobUpload(req, body as never)).resolves.toMatchObject({ clientToken: "tok" });
    const opts = sdk.handleUpload.mock.calls[0][0];
    expect(opts.token).toBe("vercel_blob_rw_REAL123");
    const rules = await opts.onBeforeGenerateToken("leads/a.pdf", null, false);
    expect(rules.maximumSizeInBytes).toBe(10 * 1024 * 1024);
    expect(rules.allowedContentTypes).toContain("application/pdf");
    expect(rules.allowedContentTypes).not.toContain("text/html");
    await expect(opts.onBeforeGenerateToken("elsewhere/a.pdf", null, false)).rejects.toThrow();
  });
});

describe("lead storage adapter", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "leads-test-"));
    vi.stubEnv("LEADS_FILE", path.join(dir, "leads.json"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  const record = {
    kind: "quote" as const,
    createdAt: "2026-09-28T10:00:00.000Z",
    ip: "1.2.3.4",
    userAgent: "vitest",
    data: { name: "Jane" },
  };

  it("appends leads to the local JSON file when no webhook is set", async () => {
    expect(leadStoreMode()).toBe("file");
    const a = await saveLead(record);
    const b = await saveLead({ ...record, data: { name: "Sam" } });
    expect(a).toMatchObject({ store: "file", location: path.join(dir, "leads.json") });
    const leads = await readLocalLeads();
    expect(leads.map((l) => l.id)).toEqual([a.id, b.id]);
    expect(leads[1].data).toEqual({ name: "Sam" });
    expect(JSON.parse(await readFile(path.join(dir, "leads.json"), "utf8"))).toHaveLength(2);
  });

  it("posts leads to the webhook when one is set", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hooks.zapier.com/hooks/catch/123/abc");
    vi.stubEnv("LEADS_WEBHOOK_SECRET", "s3cret");
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const r = await saveLead(record);
    expect(r).toMatchObject({ store: "webhook", location: "hooks.zapier.com" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hooks.zapier.com/hooks/catch/123/abc");
    expect(init.headers.authorization).toBe("Bearer s3cret");
    expect(JSON.parse(init.body)).toMatchObject({ id: r.id, kind: "quote", data: { name: "Jane" } });
    expect(await readLocalLeads()).toEqual([]);
  });

  it("never loses a lead: falls back to the file if the webhook fails", async () => {
    vi.stubEnv("LEADS_WEBHOOK_URL", "https://hooks.zapier.com/hooks/catch/123/abc");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("down", { status: 503 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await saveLead(record);
    expect(r.store).toBe("file");
    expect((await readLocalLeads()).map((l) => l.id)).toEqual([r.id]);
  });
});

describe("Turnstile adapter", () => {
  it("verifies with Cloudflare using the test secret by default", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ success: true }));
    vi.stubGlobal("fetch", fetchMock);
    expect(turnstileMode()).toBe("test");
    expect(await verifyTurnstile(TURNSTILE_TEST_TOKEN, "1.2.3.4")).toEqual({ success: true, mode: "test", errors: [] });
    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(body.get("secret")).toBe(TURNSTILE_TEST_SECRET_KEY);
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });

  it("accepts only the test token locally when Cloudflare is unreachable in test mode", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await verifyTurnstile(TURNSTILE_TEST_TOKEN)).success).toBe(true);
    expect((await verifyTurnstile("forged-token")).success).toBe(false);
  });

  it("uses the real secret when set, and fails closed if Cloudflare is unreachable", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "0x4AAAAAAAreal");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ success: false, "error-codes": ["invalid-input-response"] }));
    vi.stubGlobal("fetch", fetchMock);
    expect(turnstileMode()).toBe("cloudflare");
    expect(await verifyTurnstile(TURNSTILE_TEST_TOKEN)).toEqual({
      success: false,
      mode: "cloudflare",
      errors: ["invalid-input-response"],
    });
    expect((fetchMock.mock.calls[0][1].body as URLSearchParams).get("secret")).toBe("0x4AAAAAAAreal");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await verifyTurnstile(TURNSTILE_TEST_TOKEN)).success).toBe(false);
  });

  it("rejects an empty token without calling Cloudflare", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await verifyTurnstile("")).success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
