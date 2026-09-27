"use client";

import { useState, type ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { ServiceSlug } from "@/types/content";
import type { FinderOption } from "@/types/service";
import { Segmented } from "@/components/shared/Segmented";

/**
 * "Which service do I need?": pick a need, see the recommended service cards.
 * Cards are rendered on the server and passed in, so this stays a small client leaf.
 */
export function ServiceFinder({
  options,
  cards,
  copy,
}: {
  options: FinderOption[];
  cards: Record<ServiceSlug, ReactNode>;
  copy: { label: string; prompt: string; resultLabel: string };
}) {
  const [need, setNeed] = useState<string | null>(null);
  const chosen = options.find((o) => o.need === need);

  function choose(value: string) {
    setNeed(value);
    if (process.env.NEXT_PUBLIC_GA_ID) sendGAEvent("event", "service_finder", { need: value });
  }

  return (
    <div className="grid gap-8">
      <div>
        <span className="field-label" id="finder-label">
          {copy.label}
        </span>
        <Segmented<string>
          className="max-w-full flex-wrap max-sm:[&>button]:h-auto max-sm:[&>button]:py-1.5 max-sm:[&>button]:text-left max-sm:[&>button]:whitespace-normal"
          ariaLabelledBy="finder-label"
          options={options.map((o) => ({ value: o.need, label: o.need }))}
          value={need ?? ""}
          onChange={choose}
        />
      </div>
      <div aria-live="polite">
        {chosen ? (
          <>
            <p className="meta-label">{copy.resultLabel}</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chosen.recommend.map((slug) => (
                <div key={slug} className="grid">
                  {cards[slug]}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="ctrl-note">{copy.prompt}</p>
        )}
      </div>
    </div>
  );
}
