"use client";

import { useRef, type MouseEvent } from "react";
import type { FAQ } from "@/types/content";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * A native <details> disclosure that animates its height. Without JavaScript, or with
 * reduced motion, it opens and closes instantly like a plain <details>.
 */
export function FaqItem({ faq }: { faq: FAQ }) {
  const details = useRef<HTMLDetailsElement>(null);
  const answer = useRef<HTMLDivElement>(null);

  function onToggle(e: MouseEvent) {
    const d = details.current;
    const ans = answer.current;
    if (!d || !ans || prefersReducedMotion()) return;
    e.preventDefault();
    if (d.open) {
      ans.style.height = `${ans.scrollHeight}px`;
      ans.getBoundingClientRect();
      ans.style.height = "0px";
      setTimeout(() => {
        d.open = false;
        ans.style.height = "";
      }, 300);
    } else {
      d.open = true;
      const h = ans.scrollHeight;
      ans.style.height = "0px";
      ans.getBoundingClientRect();
      ans.style.height = `${h}px`;
      setTimeout(() => {
        ans.style.height = "";
      }, 300);
    }
  }

  return (
    <details className="faq-item" ref={details}>
      <summary onClick={onToggle}>
        {faq.question}
        <span className="pm" aria-hidden="true" />
      </summary>
      <div className="faq-ans" ref={answer}>
        <p>{faq.answer}</p>
      </div>
    </details>
  );
}
