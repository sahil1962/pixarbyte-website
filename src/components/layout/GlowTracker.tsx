"use client";

import { useEffect } from "react";

/** Moves the pointer-follow border glow on any `.glow` card. One listener for the whole page. */
export function GlowTracker() {
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const g = (e.target as Element | null)?.closest?.<HTMLElement>(".glow");
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty("--gx", `${e.clientX - r.left}px`);
      g.style.setProperty("--gy", `${e.clientY - r.top}px`);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
