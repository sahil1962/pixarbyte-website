import { isConfigured } from "./env";

/**
 * "Book a call". With NEXT_PUBLIC_CALENDLY_URL set, Calendly's popup opens; its script and
 * stylesheet (about 300 KB) load only on the first click. If they can't load, the booking
 * page opens in a new tab instead. Without the variable, callers show a placeholder dialog.
 */

const CSS = "https://assets.calendly.com/assets/external/widget.css";
const JS = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: { initPopupWidget(options: { url: string }): void };
  }
}

export function calendlyUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
  return isConfigured(url) && /^https:\/\//.test(url) ? url : null;
}

let loading: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS;
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("Calendly failed to load"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

export async function openCalendly(url: string) {
  try {
    await loadCalendly();
    if (!window.Calendly) throw new Error("Calendly unavailable");
    window.Calendly.initPopupWidget({ url });
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
