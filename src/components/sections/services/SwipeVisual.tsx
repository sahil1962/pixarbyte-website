"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ServiceVisual } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { prefersReducedMotion } from "@/lib/hooks";

type Props = Extract<ServiceVisual, { kind: "swipe" }>;
type Card = { pos: number; gone: boolean };

/** Mobile apps card: tap (or Enter/Space) to swipe the top card away; it rejoins the back of the stack. */
export function SwipeVisual({ ariaLabel, hint, cards }: Props) {
  const [state, setState] = useState<Card[]>(() => cards.map((_, i) => ({ pos: i, gone: false })));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  function swipe() {
    const top = state.findIndex((c) => c.pos === 0 && !c.gone);
    if (top < 0) return;
    setState((s) => s.map((c, i) => (i === top ? { ...c, gone: true } : { ...c, pos: c.pos - 1 })));
    setTimeout(
      () => {
        // Snap the card to the back of the stack without animating, then restore transitions.
        const el = refs.current[top];
        if (el) el.style.transition = "none";
        flushSync(() => setState((s) => s.map((c, i) => (i === top ? { pos: cards.length - 1, gone: false } : c))));
        if (el) {
          el.getBoundingClientRect();
          el.style.transition = "";
        }
      },
      prefersReducedMotion() ? 0 : 450,
    );
  }

  return (
    <div
      className="svc-vis vis-mob"
      id="swipe"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={swipe}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          swipe();
        }
      }}
    >
      <div className="mini-phone" aria-hidden="true">
        <div className="scr">
          {cards.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={state[i].gone ? "swipe-card gone" : "swipe-card"}
              data-pos={state[i].pos}
              style={{ background: `linear-gradient(160deg,${c.from},${c.to})` }}
            >
              <small>{c.label}</small>
              <strong>{c.title}</strong>
            </div>
          ))}
          <div className="swipe-acts">
            <span>
              <Icon name="x" />
            </span>
            <span>
              <Icon name="check" />
            </span>
          </div>
        </div>
      </div>
      <span className="vis-hint">
        <Icon name="hand" />
        {hint}
      </span>
    </div>
  );
}
