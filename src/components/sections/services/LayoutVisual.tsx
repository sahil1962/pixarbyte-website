"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useOnView } from "@/lib/hooks";

/** Frontend card: blocks reflow between a desktop and tablet layout while visible, and on hover. */
export function LayoutVisual({ labels }: { labels: [string, string] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shuffled, setShuffled] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useOnView(ref, (visible) => {
    clearInterval(timer.current);
    if (visible && !prefersReducedMotion()) timer.current = window.setInterval(() => setShuffled((s) => !s), 2400);
  });

  useEffect(() => {
    const card = ref.current?.parentElement;
    if (!card) return;
    const flip = () => setShuffled((s) => !s);
    card.addEventListener("mouseenter", flip);
    return () => {
      card.removeEventListener("mouseenter", flip);
      clearInterval(timer.current);
    };
  }, []);

  return (
    <div className={shuffled ? "svc-vis vis-front shuffle" : "svc-vis vis-front"} aria-hidden="true" ref={ref}>
      <div className="mini-browser">
        <div className="bar">
          <i />
          <i />
          <i />
        </div>
        <div className="blocks">
          <i className="blk a" />
          <i className="blk b" />
          <i className="blk c" />
          <i className="blk d" />
        </div>
      </div>
      <span className="badge bp">{shuffled ? labels[1] : labels[0]}</span>
    </div>
  );
}
