/**
 * Environment helpers shared by the service adapters (email, rate limiting, storage,
 * leads, Turnstile). Each adapter uses the real service only when its key looks real,
 * so the site runs with no `.env` file at all, and switching to real keys later needs
 * no code changes.
 */

/** Values that mean "not set yet": the samples in `.env.example` and common stand-ins. */
const SAMPLE = /(sample|placeholder|changeme|change-me|your[-_]|xxxx|example\.com|^todo$|^none$)/i;

/** True when `value` is set and isn't an obvious sample or placeholder. */
export function isConfigured(value: string | undefined | null): value is string {
  if (!value) return false;
  const v = value.trim();
  return v.length > 0 && !SAMPLE.test(v);
}

/** Reads an env var, returning it only when it's a real (non-sample) value. */
export function realEnv(name: string): string | undefined {
  const v = process.env[name];
  return isConfigured(v) ? v.trim() : undefined;
}
