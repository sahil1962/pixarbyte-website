"use client";

import { useEffect, useRef, useState } from "react";
import type { BuilderContent } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useTimers } from "@/lib/hooks";
import type { SceneProps } from "./types";

const RING = 88;

interface Inspect {
  on: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
  name: string;
  size: string;
}

/** Website preview: Lighthouse rings fill up and an inspector outlines each component. */
export function WebsiteScene({ content, active, enterId }: SceneProps<BuilderContent["website"]>) {
  const timers = useTimers();
  const win = useRef<HTMLDivElement>(null);
  const rings = useRef<(SVGCircleElement | null)[]>([]);
  const [insp, setInsp] = useState<Inspect>({ on: false, left: 0, top: 0, width: 0, height: 0, name: "", size: "" });
  const hovering = useRef(false);
  const idx = useRef(0);

  // Entering the scene hides the inspector until its first step.
  const [entered, setEntered] = useState(-1);
  if (active && entered !== enterId) {
    setEntered(enterId);
    setInsp((s) => ({ ...s, on: false }));
  }

  function inspect(el: HTMLElement) {
    const w = win.current;
    if (!w) return;
    const wr = w.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setInsp({
      on: true,
      left: r.left - wr.left - 3,
      top: r.top - wr.top - 3,
      width: r.width + 6,
      height: r.height + 6,
      name: el.dataset.comp ?? "",
      size: `${Math.round(r.width)}×${Math.round(r.height)}`,
    });
  }

  useEffect(() => {
    if (!active) return;
    rings.current.forEach((c, i) => {
      if (!c) return;
      c.style.transition = "none";
      c.style.strokeDashoffset = String(RING);
      c.getBoundingClientRect();
      c.style.transition = "";
      timers.later(() => {
        c.style.strokeDashoffset = String(RING - (RING * content.scores[i]) / 100);
      }, 200);
    });

    idx.current = 0;
    let cycle: number | undefined;
    const step = () => {
      const comps = win.current?.querySelectorAll<HTMLElement>("[data-comp]");
      if (comps?.length && !hovering.current) inspect(comps[idx.current++ % comps.length]);
      cycle = window.setTimeout(step, 1400);
    };
    timers.later(step, 600);

    return () => {
      timers.clear();
      clearTimeout(cycle);
    };
    // `content.scores` is static data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enterId]);

  // Hovering a component inspects it and pauses the automatic tour.
  useEffect(() => {
    const comps = Array.from(win.current?.querySelectorAll<HTMLElement>("[data-comp]") ?? []);
    const handlers = comps.map((el) => () => {
      hovering.current = true;
      inspect(el);
    });
    comps.forEach((el, i) => el.addEventListener("pointerenter", handlers[i]));
    return () => comps.forEach((el, i) => el.removeEventListener("pointerenter", handlers[i]));
  }, []);

  const c = content.components;

  return (
    <>
      <div className="win" ref={win}>
        <div className="win-bar">
          <i />
          <i />
          <i />
          <span className="url">
            <Icon name="lock" />
            {content.url}
          </span>
          <span className="inspect-hint">{content.inspectHint}</span>
        </div>
        <div
          className={insp.on ? "inspect on" : "inspect"}
          id="inspect"
          style={{ left: insp.left, top: insp.top, width: insp.width, height: insp.height }}
        >
          <span>
            {`<${insp.name} />`}
            <em>{insp.size}</em>
          </span>
        </div>
        <div className="site" onPointerLeave={() => (hovering.current = false)}>
          <div className="site-nav" data-comp={c.navbar}>
            <span className="site-logo" />
            <span className="ln" />
            <span className="ln" />
            <span className="ln" />
            <span className="sbtn" />
          </div>
          <div className="site-hero">
            <div className="site-copy" data-comp={c.heroCopy}>
              <span className="h" style={{ width: "92%" }} />
              <span className="h" style={{ width: "70%" }} />
              <span className="ln" style={{ width: "85%", marginTop: 4 }} />
              <span className="ln" style={{ width: "60%" }} />
              <div className="site-btns" data-comp={c.button}>
                <i />
                <i />
              </div>
            </div>
            <div className="site-img" data-comp={c.heroImage} />
          </div>
          <div className="site-feats" data-comp={c.featureGrid}>
            <div>
              <b />
              <span className="ln" style={{ width: "80%" }} />
              <span className="ln" style={{ width: "55%" }} />
            </div>
            <div>
              <b />
              <span className="ln" style={{ width: "70%" }} />
              <span className="ln" style={{ width: "60%" }} />
            </div>
            <div>
              <b />
              <span className="ln" style={{ width: "75%" }} />
              <span className="ln" style={{ width: "45%" }} />
            </div>
          </div>
        </div>
      </div>
      <div className="float lh">
        {content.scores.map((score, i) => (
          <div className="ring" key={i}>
            <svg viewBox="0 0 34 34">
              <circle className="bgc" cx="17" cy="17" r="14" />
              <circle
                className="fg"
                cx="17"
                cy="17"
                r="14"
                data-val={score}
                ref={(el) => {
                  rings.current[i] = el;
                }}
              />
            </svg>
            <b>{score}</b>
          </div>
        ))}
        <div className="lh-label">
          <strong>{content.scoreTitle}</strong>
          {content.scoreDetail}
        </div>
      </div>
    </>
  );
}
