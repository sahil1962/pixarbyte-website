"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "@/types/content";
import { easeOutCubic } from "@/lib/format";
import { prefersReducedMotion, useOnView } from "@/lib/hooks";

const format = (s: Stat, v: number) => v.toFixed(s.decimals ?? 0) + (s.suffix ?? "");

/**
 * Headline numbers that count up once when scrolled into view. The server renders the final
 * values (so they read correctly without JavaScript); the count resets to 0 on hydration.
 */
export function StatGrid({ stats }: { stats: Stat[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const values = useRef<(HTMLElement | null)[]>([]);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || prefersReducedMotion()) return;
    values.current.forEach((el) => {
      if (el) el.textContent = "0";
    });
  }, []);

  useOnView(
    grid,
    (visible) => {
      if (!visible || done.current) return;
      done.current = true;
      const duration = prefersReducedMotion() ? 1 : 1400;
      stats.forEach((s, i) => {
        const el = values.current[i];
        if (!el) return;
        let t0: number | null = null;
        const step = (ts: number) => {
          t0 ??= ts;
          const p = Math.min(1, (ts - t0) / duration);
          el.textContent = format(s, s.value * easeOutCubic(p));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.4 },
  );

  return (
    <div className="stat-grid" id="stats" ref={grid}>
      {stats.map((s, i) => (
        <div className="stat" key={s.label}>
          <strong
            ref={(el) => {
              values.current[i] = el;
            }}
          >
            {format(s, s.value)}
          </strong>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
