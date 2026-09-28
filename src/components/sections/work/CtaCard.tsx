"use client";

import { useRef, useState } from "react";
import type { WorkSectionContent } from "@/types/content";
import { useSite } from "@/components/layout/SiteProvider";
import { prefersReducedMotion, useOnView } from "@/lib/hooks";

/** Pixels lit on the card (a small P). */
const DECO_ON = [0, 1, 2, 6, 8, 12, 13, 14];
const DECO_COUNT = 18;

/** "Your project could be next": the dark card closing a grid of case studies. */
export function CtaCard({ content, decoId }: { content: WorkSectionContent["ctaCard"]; decoId?: string }) {
  const { openEstimate } = useSite();
  const card = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<number[]>([]);
  useOnView(card, (visible) => {
    if (!visible || prefersReducedMotion()) return;
    DECO_ON.forEach((i) => setTimeout(() => setLit((cur) => (cur.includes(i) ? cur : [...cur, i])), i * 40));
  });

  return (
    <div className="case cta-card" ref={card}>
      <div>
        <div className="pix-deco" id={decoId} aria-hidden="true">
          {Array.from({ length: DECO_COUNT }, (_, i) => (
            <i key={i} className={lit.includes(i) ? "on" : undefined} />
          ))}
        </div>
        <h3>{content.title}</h3>
        <p>{content.text}</p>
      </div>
      <button className="btn btn-primary" type="button" onClick={() => openEstimate()}>
        {content.button}
      </button>
    </div>
  );
}
