"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { BuilderContent } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import type { SceneProps } from "./types";

type Frac = [number, number];

/** Where the three steps sit, as fractions of the free space, on wide and narrow canvases. */
const LAYOUTS: Record<"wide" | "narrow", Frac[]> = {
  wide: [
    [0.03, 0.02],
    [0.5, 0.5],
    [0.97, 0.98],
  ],
  narrow: [
    [0, 0],
    [1, 0.5],
    [0, 1],
  ],
};

interface Box {
  l: number;
  t: number;
  r: number;
  b: number;
  cx: number;
  cy: number;
}

function box(n: HTMLElement): Box {
  return {
    l: n.offsetLeft,
    t: n.offsetTop,
    r: n.offsetLeft + n.offsetWidth,
    b: n.offsetTop + n.offsetHeight,
    cx: n.offsetLeft + n.offsetWidth / 2,
    cy: n.offsetTop + n.offsetHeight / 2,
  };
}

/** Curved wire between two steps, leaving from whichever sides face each other. */
function link(A: HTMLElement, B: HTMLElement) {
  const a = box(A);
  const b = box(B);
  if (b.l >= a.r + 12) {
    const dx = Math.max(24, (b.l - a.r) / 2);
    return `M${a.r} ${a.cy} C ${a.r + dx} ${a.cy}, ${b.l - dx} ${b.cy}, ${b.l} ${b.cy}`;
  }
  if (a.l >= b.r + 12) {
    const dx = Math.max(24, (a.l - b.r) / 2);
    return `M${a.l} ${a.cy} C ${a.l - dx} ${a.cy}, ${b.r + dx} ${b.cy}, ${b.r} ${b.cy}`;
  }
  const down = b.t >= a.b;
  const y1 = down ? a.b : a.t;
  const y2 = down ? b.t : b.b;
  const dy = Math.max(18, Math.abs(y2 - y1) / 2) * (down ? 1 : -1);
  return `M${a.cx} ${y1} C ${a.cx} ${y1 + dy}, ${b.cx} ${y2 - dy}, ${b.cx} ${y2}`;
}

/** No-code preview: a draggable three-step automation that can run a test. */
export function NocodeScene({ content, active, enterId, isAutoplay }: SceneProps<BuilderContent["nocode"]>) {
  const { notify } = useSite();
  const flow = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const wires = useRef<(SVGPathElement | null)[]>([]);
  const fracs = useRef<Frac[]>(LAYOUTS.wide.map((f) => [...f] as Frac));
  const layoutName = useRef<"wide" | "narrow" | null>(null);
  const flowTimers = useRef<number[]>([]);
  const activeRef = useRef(active);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const [dragging, setDragging] = useState<number | null>(null);
  const [hit, setHit] = useState<boolean[]>(() => content.nodes.map(() => false));
  const [done, setDone] = useState<boolean[]>(() => content.nodes.map(() => false));
  const [live, setLive] = useState<boolean[]>(() => content.nodes.slice(1).map(() => false));
  const [runs, setRuns] = useState(content.runsToday);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  function drawWires() {
    const n = nodes.current;
    wires.current.forEach((w, i) => {
      const a = n[i];
      const b = n[i + 1];
      if (w && a && b) w.setAttribute("d", link(a, b));
    });
  }

  function placeNodes() {
    const f = flow.current;
    if (!f) return;
    const fw = f.clientWidth;
    const fh = f.clientHeight;
    if (!fw || !fh) return;
    const name = fw < 460 ? "narrow" : "wide";
    if (name !== layoutName.current) {
      layoutName.current = name;
      fracs.current = LAYOUTS[name].map((p) => [...p] as Frac);
    }
    nodes.current.forEach((n, i) => {
      if (!n) return;
      n.style.left = `${fracs.current[i][0] * (fw - n.offsetWidth)}px`;
      n.style.top = `${fracs.current[i][1] * (fh - n.offsetHeight)}px`;
    });
    drawWires();
  }

  function runFlow(loop: boolean) {
    flowTimers.current.forEach(clearTimeout);
    flowTimers.current = [];
    const at = (fn: () => void, ms: number) => flowTimers.current.push(window.setTimeout(fn, ms));
    const set = (setter: typeof setHit, i: number) => setter((s) => s.map((v, j) => (j === i ? true : v)));

    setHit(content.nodes.map(() => false));
    setDone(content.nodes.map(() => false));
    setLive(content.nodes.slice(1).map(() => false));
    at(() => set(setHit, 0), 100);
    at(() => {
      set(setDone, 0);
      set(setLive, 0);
    }, 550);
    at(() => set(setHit, 1), 1000);
    at(() => {
      set(setDone, 1);
      set(setLive, 1);
    }, 1450);
    at(() => {
      set(setHit, 2);
      set(setDone, 2);
      setRuns((r) => r + 1);
      if (!loop) notify("flowPassed");
    }, 1900);
    if (loop)
      at(() => {
        if (activeRef.current) runFlow(true);
      }, 3600);
  }

  // A run in progress finishes (and counts) even if the visitor switches tab; the loop stops itself.
  useEffect(() => {
    if (!active) return;
    placeNodes();
    runFlow(isAutoplay());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enterId]);

  useEffect(() => {
    const timers = flowTimers;
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const f = flow.current;
    if (!f || !("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(() => {
      if (activeRef.current) placeNodes();
    });
    ro.observe(f);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onDown(e: PointerEvent<HTMLDivElement>, i: number) {
    const n = e.currentTarget;
    n.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: n.offsetLeft, oy: n.offsetTop };
    setDragging(i);
  }

  function onMove(e: PointerEvent<HTMLDivElement>, i: number) {
    const d = drag.current;
    const f = flow.current;
    if (dragging !== i || !d || !f) return;
    const n = e.currentTarget;
    const nx = Math.max(0, Math.min(f.clientWidth - n.offsetWidth, d.ox + e.clientX - d.sx));
    const ny = Math.max(0, Math.min(f.clientHeight - n.offsetHeight, d.oy + e.clientY - d.sy));
    n.style.left = `${nx}px`;
    n.style.top = `${ny}px`;
    fracs.current[i] = [
      nx / Math.max(1, f.clientWidth - n.offsetWidth),
      ny / Math.max(1, f.clientHeight - n.offsetHeight),
    ];
    drawWires();
  }

  function onUp() {
    drag.current = null;
    setDragging(null);
  }

  return (
    <>
      <div className="flow" id="flow" ref={flow}>
        <svg className="wires" aria-hidden="true">
          {live.map((on, i) => (
            <path
              key={i}
              className={on ? "wire live" : "wire"}
              id={`w${i + 1}`}
              ref={(el) => {
                wires.current[i] = el;
              }}
            />
          ))}
        </svg>
        {content.nodes.map((node, i) => (
          <div
            key={node.title}
            className={["node", dragging === i && "drag", hit[i] && "hit", done[i] && "done"].filter(Boolean).join(" ")}
            id={`n${i + 1}`}
            ref={(el) => {
              nodes.current[i] = el;
            }}
            onPointerDown={(e) => onDown(e, i)}
            onPointerMove={(e) => onMove(e, i)}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <span className="tag">{node.tag}</span>
            <div className="node-top">
              <span className="node-ic" style={{ background: node.color }}>
                {node.letter}
              </span>
              <strong>{node.title}</strong>
            </div>
            <p>{node.text}</p>
            <span className="ok">
              <Icon name="check" />
            </span>
          </div>
        ))}
      </div>
      <div className="flow-foot">
        <span className="drag-hint">
          <Icon name="hand" />
          <span>{content.dragHint}</span>
        </span>
        <button className="run" id="run-flow" type="button" onClick={() => runFlow(false)}>
          <span className="play">
            <Icon name="play" />
            {content.runLabel}
          </span>
          <span className="dot ping" aria-hidden="true" />
          <span id="runs" aria-live="polite">{`${runs} ${content.runsSuffix}`}</span>
        </button>
      </div>
    </>
  );
}
