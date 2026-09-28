"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { TURNSTILE_TEST_SITE_KEY, TURNSTILE_TEST_TOKEN, turnstileSiteKey } from "@/lib/turnstile-keys";

interface TurnstileApi {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(id?: string): void;
  remove(id: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare Turnstile, loaded lazily (only on pages that show a form, after the page has
 * loaded). It uses NEXT_PUBLIC_TURNSTILE_SITE_KEY, or Cloudflare's always-pass test key.
 * With the test key only, if Cloudflare's script can't load (offline, blocked), it falls
 * back to the test token, which the server accepts in test mode too. With a real key there
 * is no fallback. Changing `resetKey` asks for a fresh token (tokens are single-use).
 */
export function Turnstile({
  onToken,
  resetKey = 0,
  fallbackNote,
  className,
  load = true,
}: {
  onToken(token: string): void;
  /** Set false to hold off loading Cloudflare's script (e.g. until the visitor starts the form). */
  load?: boolean;
  resetKey?: number;
  fallbackNote?: string;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const cb = useRef(onToken);
  const [fallback, setFallback] = useState(false);
  const siteKey = turnstileSiteKey();
  const isTest = siteKey === TURNSTILE_TEST_SITE_KEY;

  useEffect(() => {
    cb.current = onToken;
  });

  function fallBack() {
    if (!isTest) return;
    setFallback(true);
    console.info("Turnstile couldn't load; using Cloudflare's test token (test keys only).");
    cb.current(TURNSTILE_TEST_TOKEN);
  }

  function renderWidget() {
    if (!box.current || widget.current || !window.turnstile) return;
    try {
      widget.current = window.turnstile.render(box.current, {
        sitekey: siteKey,
        theme: "auto",
        appearance: "interaction-only",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(""),
        "error-callback": () => {
          cb.current("");
          fallBack();
        },
      });
    } catch {
      fallBack();
    }
  }

  // If the script never arrives (blocked without an error event), fall back after a while.
  useEffect(() => {
    if (!isTest || !load) return;
    const t = window.setTimeout(() => {
      if (!widget.current) fallBack();
    }, 10_000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTest, load]);

  // A new token after each failed submit.
  useEffect(() => {
    if (resetKey === 0) return;
    if (widget.current && window.turnstile) {
      cb.current("");
      window.turnstile.reset(widget.current);
    } else if (fallback) {
      cb.current(TURNSTILE_TEST_TOKEN);
    }
  }, [resetKey, fallback]);

  useEffect(
    () => () => {
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    },
    [],
  );

  return (
    <>
      {load && <Script src={SRC} strategy="lazyOnload" onReady={renderWidget} onError={fallBack} />}
      <div ref={box} className={className} />
      {fallback && fallbackNote && <p className="ctrl-note m-0">{fallbackNote}</p>}
    </>
  );
}
