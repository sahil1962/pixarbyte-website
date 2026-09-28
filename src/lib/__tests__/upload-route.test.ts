import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/upload/route";
import { resetMemoryRateLimits } from "@/lib/ratelimit";

function upload(file: File, ip = "10.2.0.1") {
  const body = new FormData();
  body.append("file", file);
  return POST(new Request("http://localhost/api/upload", { method: "POST", body, headers: { "x-forwarded-for": ip } }));
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  resetMemoryRateLimits();
});

describe("/api/upload without Vercel Blob", () => {
  it("stores an allowed file temporarily", async () => {
    const res = await upload(new File(["%PDF-1.4"], "brief.pdf", { type: "application/pdf" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      name: "brief.pdf",
      size: 8,
      url: expect.stringMatching(/^temp:/),
      temporary: true,
    });
  });

  it("refuses other file types and files over 10 MB", async () => {
    expect((await upload(new File(["MZ"], "run.exe", { type: "application/x-msdownload" }))).status).toBe(415);
    const big = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "big.pdf", { type: "application/pdf" });
    expect((await upload(big)).status).toBe(413);
  });

  it("refuses Blob token requests when Blob isn't configured", async () => {
    const res = await POST(
      new Request("http://localhost/api/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "blob.generate-client-token" }),
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rate limits uploads per IP", async () => {
    const file = () => new File(["hi"], "a.txt", { type: "text/plain" });
    for (let i = 0; i < 20; i++) expect((await upload(file(), "10.2.0.9")).status).toBe(200);
    expect((await upload(file(), "10.2.0.9")).status).toBe(429);
  });
});
