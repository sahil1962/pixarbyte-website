"use client";

import { useEffect, useState } from "react";
import type { ActivityItem } from "@/types/content";
import { prefersReducedMotion } from "@/lib/hooks";

/** Floating "recent activity" chip under the builder; cycles through updates. */
export function ActivityChip({ items }: { items: ActivityItem[] }) {
  const [index, setIndex] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let swap: number | undefined;
    const timer = window.setInterval(() => {
      setOut(true);
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setOut(false);
      }, 300);
    }, 4200);
    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [items.length]);

  const item = items[index];
  return (
    <div className="fchip fchip-feed" aria-live="off">
      <span className="feed-av" id="feed-av" style={{ background: item.color }}>
        {item.initials}
      </span>
      <div className={out ? "feed-body out" : "feed-body"} id="feed-body">
        <strong id="feed-title">{item.title}</strong>
        <small id="feed-time">{item.time}</small>
      </div>
    </div>
  );
}
