"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True when the visitor asked the OS for less motion. False during server rendering. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** Reads the current value without subscribing, for use inside event handlers and effects. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

/**
 * Calls `onChange(isVisible)` whenever the element enters or leaves the viewport
 * (the design's `onView` helper). Without IntersectionObserver it reports visible once.
 */
export function useOnView(
  ref: RefObject<Element | null>,
  onChange: (visible: boolean) => void,
  options: IntersectionObserverInit = { threshold: 0.25 },
) {
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });
  const { threshold, rootMargin } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      cb.current(true);
      return;
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => cb.current(e.isIntersecting)), {
      threshold,
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
}

/** Collects timeouts so a whole sequence can be cancelled at once (the design's `later`). */
export function useTimers() {
  const [api] = useState(() => {
    let ids: number[] = [];
    return {
      later(fn: () => void, ms: number) {
        const id = window.setTimeout(fn, ms);
        ids.push(id);
        return id;
      },
      clear() {
        ids.forEach(clearTimeout);
        ids = [];
      },
    };
  });
  useEffect(() => () => api.clear(), [api]);
  return api;
}

/** Keeps a `<dialog>` in sync with `open`, using showModal() so it renders in the top layer. */
export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return ref;
}
