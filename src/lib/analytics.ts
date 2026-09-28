/**
 * GA4 events. The gtag script loads lazily (see components/layout/Analytics.tsx), so events
 * are queued on `dataLayer` and sent once it arrives. Does nothing without NEXT_PUBLIC_GA_ID.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_GA_ID) return;
  window.dataLayer = window.dataLayer ?? [];
  // gtag.js only reads `arguments` objects from the queue, not plain arrays.
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  (gtag as (...args: unknown[]) => void)("event", name, params);
}
