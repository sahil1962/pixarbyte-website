"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "@/types/content";
import { easeOutCubic } from "@/lib/format";
import { prefersReducedMotion, useOnView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const format = (s: Stat, v: number) => {
  const d = s.decimals ?? 0;
  const n = s.group ? v.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d }) : v.toFixed(d);
  return (s.prefix ?? "") + n + (s.suffix ?? "");
};

/**
 * Headline numbers that count up once when scrolled into view. The server renders the final
 * values (so they read correctly without JavaScript); the count resets to 0 on hydration.
 */
export function StatGrid({ stats, id = "stats", className }: { stats: Stat[]; id?: string; className?: string }) {
  const grid = useRef<HTMLDivElement>(null);
  const values = useRef<(HTMLElement | null)[]>([]);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || prefersReducedMotion()) return;
    values.current.forEach((el, i) => {
      if (el) el.textContent = stats[i].prefix || stats[i].group ? format(stats[i], 0) : "0";
    });
  }, [stats]);

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
    <div className={cn("stat-grid", className)} id={id} ref={grid}>
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
