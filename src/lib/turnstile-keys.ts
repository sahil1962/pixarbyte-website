/**
 * Cloudflare's official Turnstile test keys (https://developers.cloudflare.com/turnstile/troubleshooting/testing/).
 * They always pass, so the form works end to end before a real Turnstile site exists.
 * Safe to ship: they protect nothing, and real keys replace them through env variables.
 */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";
/** The token the test site key produces, and the only one the test secret accepts. */
export const TURNSTILE_TEST_TOKEN = "XXXX.DUMMY.TOKEN.XXXX";

/** The site key the browser uses: the real one when set, otherwise the always-pass test key. */
export function turnstileSiteKey(): string {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key && !/sample|placeholder/i.test(key) ? key : TURNSTILE_TEST_SITE_KEY;
}
