"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { HeroContent } from "@/types/content";
import { initials } from "@/lib/format";
import { avatarBackground } from "@/lib/color";

/** Client avatars beside the rating. Hover, focus or tap one to read their review in a hovercard. */
export function ProofAvatars({ proof, children }: { proof: HeroContent["proof"]; children: ReactNode }) {
  const [card, setCard] = useState<{ index: number; show: boolean } | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const hovercard = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  // Position above the avatar once the new quote is rendered and its height is known.
  useLayoutEffect(() => {
    const hc = hovercard.current;
    const btn = card && buttons.current[card.index];
    const parent = hc?.offsetParent;
    if (!card?.show || !hc || !btn || !parent) return;
    const p = parent.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    hc.style.left = `${Math.max(0, Math.min(b.left - p.left - 12, p.width - 290))}px`;
    hc.style.top = `${b.top - p.top - hc.offsetHeight - 10}px`;
  }, [card]);

  function show(index: number) {
    clearTimeout(hideTimer.current);
    setCard({ index, show: true });
  }
  function hide() {
    hideTimer.current = window.setTimeout(() => setCard((c) => (c ? { ...c, show: false } : c)), 80);
  }

  const review = card ? proof.reviews[card.index] : null;

  return (
    <>
      <div className="proof">
        <div className="avatars" id="avatars">
          {proof.reviews.map((r, i) => (
            <button
              key={r.name}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              style={{ background: avatarBackground(r.color) }}
              data-q={i}
              aria-label={`${proof.reviewAriaPrefix} ${r.name}`}
              onMouseEnter={() => show(i)}
              onFocus={() => show(i)}
              onClick={() => show(i)}
              onMouseLeave={hide}
              onBlur={hide}
            >
              {initials(r.name)}
            </button>
          ))}
        </div>
        {children}
      </div>
      <div
        className={card?.show ? "hovercard show" : "hovercard"}
        id="hovercard"
        role={review ? "tooltip" : undefined}
        ref={hovercard}
      >
        {review && (
          <>
            <p>{`“${review.quote}”`}</p>
            <div className="who">
              <span style={{ background: avatarBackground(review.color) }}>{initials(review.name)}</span>
              <div>
                <strong>{review.name}</strong>
                <small>{review.role}</small>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
