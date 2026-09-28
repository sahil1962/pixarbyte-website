import "server-only";
import { realEnv } from "./env";
import { TURNSTILE_TEST_SECRET_KEY, TURNSTILE_TEST_TOKEN } from "./turnstile-keys";

/**
 * Turnstile adapter. Tokens are always checked with Cloudflare's siteverify endpoint, using
 * TURNSTILE_SECRET_KEY when it's set and Cloudflare's always-pass test secret otherwise.
 * In test mode only, if Cloudflare can't be reached (offline development, locked-down
 * CI), the test token is accepted locally, which is exactly what Cloudflare would answer.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileMode = "cloudflare" | "test";

export interface TurnstileResult {
  success: boolean;
  mode: TurnstileMode;
  errors: string[];
}

function secretKey(): string {
  return realEnv("TURNSTILE_SECRET_KEY") ?? TURNSTILE_TEST_SECRET_KEY;
}

export function turnstileMode(): TurnstileMode {
  return secretKey() === TURNSTILE_TEST_SECRET_KEY ? "test" : "cloudflare";
}

export async function verifyTurnstile(token: string, ip?: string): Promise<TurnstileResult> {
  const mode = turnstileMode();
  if (!token) return { success: false, mode, errors: ["missing-input-response"] };

  const body = new URLSearchParams({ secret: secretKey(), response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`siteverify returned ${res.status}`);
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return { success: json.success === true, mode, errors: json["error-codes"] ?? [] };
  } catch (e) {
    if (mode === "test") {
      const success = token === TURNSTILE_TEST_TOKEN;
      return { success, mode, errors: success ? [] : ["invalid-input-response"] };
    }
    console.error("Turnstile verification could not reach Cloudflare", e);
    return { success: false, mode, errors: ["internal-error"] };
  }
}
