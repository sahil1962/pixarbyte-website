"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Audience, HeroContent } from "@/types/content";
import { Segmented } from "@/components/shared/Segmented";
import { useSite } from "@/components/layout/SiteProvider";
import { prefersReducedMotion } from "@/lib/hooks";

/** plain: server-rendered text · pre: words mounted hidden · in: words revealed · out: words leaving */
type Mode = "plain" | "pre" | "in" | "out";

/**
 * Audience switch, headline, lead and primary CTA. The headline is plain text until fonts
 * load, then it is split into words that blur and rise in, as in the design.
 */
export function HeroCopy({ content }: { content: HeroContent }) {
  const { audience, setAudience, openEstimate } = useSite();
  const [shown, setShown] = useState<Audience>(audience);
  const [mode, setMode] = useState<Mode>("plain");
  const [leadOut, setLeadOut] = useState(false);
  const h1 = useRef<HTMLHeadingElement>(null);
  const swap = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const start = () => !cancelled && setMode("pre");
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();
    return () => {
      cancelled = true;
      clearTimeout(swap.current);
    };
  }, []);

  // Words must be laid out hidden before `.in` is added, or the transition won't run.
  useLayoutEffect(() => {
    if (mode !== "pre") return;
    h1.current?.getBoundingClientRect();
    const id = requestAnimationFrame(() => setMode("in"));
    return () => cancelAnimationFrame(id);
  }, [mode, shown]);

  function choose(next: Audience) {
    if (next === audience) return;
    setAudience(next);
    setMode((m) => (m === "plain" ? m : "out"));
    setLeadOut(true);
    clearTimeout(swap.current);
    swap.current = window.setTimeout(
      () => {
        setShown(next);
        setMode((m) => (m === "plain" ? m : "pre"));
        setLeadOut(false);
      },
      prefersReducedMotion() ? 0 : 220,
    );
  }

  const copy = content.copy[shown];
  const words = copy.headline.split(" ");
  const wordClass = mode === "in" ? "w in" : mode === "out" ? "w in out" : "w";

  return (
    <>
      <div className="aud">
        <span className="aud-label" id="aud-label">
          {content.audienceLabel}
        </span>
        <Segmented
          ariaLabelledBy="aud-label"
          options={content.audienceOptions.map((o) => ({ value: o.id, label: o.label }))}
          value={audience}
          onChange={choose}
        />
      </div>

      {mode === "plain" ? (
        <h1 id="hero-title" ref={h1}>
          {copy.headline}
        </h1>
      ) : (
        <h1 id="hero-title" ref={h1} aria-label={copy.headline}>
          {words.map((w, i) => (
            <Fragment key={`${shown}-${i}`}>
              <span className={wordClass} aria-hidden="true" style={{ transitionDelay: `${i * 55}ms` }}>
                {w}
              </span>{" "}
            </Fragment>
          ))}
        </h1>
      )}
      <p className={leadOut ? "lead swap out" : "lead swap"} id="lead">
        {copy.lead}
      </p>

      <div className="cta-row">
        <button className="btn btn-primary btn-lg" id="hero-cta" type="button" onClick={() => openEstimate()}>
          {copy.cta}
        </button>
        <a className="btn btn-outline btn-lg" href={content.secondaryCta.href}>
          {content.secondaryCta.label}
        </a>
      </div>
    </>
  );
}
