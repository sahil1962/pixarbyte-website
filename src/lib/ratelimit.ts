import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { realEnv } from "./env";

/**
 * Rate limiting adapter. With UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set it
 * uses Upstash (shared by every server instance). Without them it falls back to an
 * in-memory sliding window with the same limits, which is fine for local development and
 * previews (each server instance keeps its own count).
 */

type Duration = `${number} ${"s" | "m" | "h"}`;

export const limits = {
  /** Quote form submissions per IP. */
  quote: { requests: 5, window: "1 h" },
  /** Quick estimate emails per IP. */
  estimate: { requests: 5, window: "1 h" },
  /** File uploads per IP (3 files per quote, with room for retries). */
  upload: { requests: 20, window: "1 h" },
} as const satisfies Record<string, { requests: number; window: Duration }>;

export type LimitBucket = keyof typeof limits;
export type RateLimitMode = "upstash" | "memory";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** When the window resets, in ms since the epoch. */
  reset: number;
  mode: RateLimitMode;
}

export function rateLimitMode(): RateLimitMode {
  return realEnv("UPSTASH_REDIS_REST_URL") && realEnv("UPSTASH_REDIS_REST_TOKEN") ? "upstash" : "memory";
}

function windowMs(window: Duration): number {
  const [n, unit] = window.split(" ") as [string, "s" | "m" | "h"];
  return Number(n) * { s: 1000, m: 60_000, h: 3_600_000 }[unit];
}

/* ---------- Upstash ---------- */

const upstash = new Map<LimitBucket, Ratelimit>();

function upstashLimiter(bucket: LimitBucket): Ratelimit {
  let limiter = upstash.get(bucket);
  if (!limiter) {
    const { requests, window } = limits[bucket];
    limiter = new Ratelimit({
      redis: new Redis({ url: realEnv("UPSTASH_REDIS_REST_URL")!, token: realEnv("UPSTASH_REDIS_REST_TOKEN")! }),
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix: `pixarbyte:${bucket}`,
    });
    upstash.set(bucket, limiter);
  }
  return limiter;
}

/* ---------- In-memory fallback ---------- */

const hits = new Map<string, number[]>();

function memoryLimit(bucket: LimitBucket, key: string, now = Date.now()): RateLimitResult {
  const { requests, window } = limits[bucket];
  const span = windowMs(window);
  const id = `${bucket}:${key}`;
  const recent = (hits.get(id) ?? []).filter((t) => now - t < span);
  const success = recent.length < requests;
  if (success) recent.push(now);
  hits.set(id, recent);
  // Keep the map from growing without bound on a long-running server.
  if (hits.size > 10_000) {
    for (const [k, times] of hits) if (!times.some((t) => now - t < span)) hits.delete(k);
  }
  return {
    success,
    remaining: Math.max(0, requests - recent.length),
    reset: (recent[0] ?? now) + span,
    mode: "memory",
  };
}

/** Test helper: forget every in-memory count. */
export function resetMemoryRateLimits() {
  hits.clear();
  upstash.clear();
}

/** Counts one request for `key` (usually the visitor's IP) in `bucket`. */
export async function rateLimit(bucket: LimitBucket, key: string): Promise<RateLimitResult> {
  if (rateLimitMode() === "memory") return memoryLimit(bucket, key);
  try {
    const r = await upstashLimiter(bucket).limit(key);
    return { success: r.success, remaining: r.remaining, reset: r.reset, mode: "upstash" };
  } catch (e) {
    // Never turn visitors away because Redis is unreachable: count locally instead.
    console.error("Upstash rate limit failed; using the in-memory limiter", e);
    return memoryLimit(bucket, key);
  }
}
