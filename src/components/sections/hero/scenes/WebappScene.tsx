"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { BuilderContent, WebappRange } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { Segmented } from "@/components/shared/Segmented";
import { easeOutCubic } from "@/lib/format";
import { prefersReducedMotion } from "@/lib/hooks";
import type { SceneProps } from "./types";

/** Smooth path through the chart points in the 300×80 viewBox. */
function pathFrom(pts: number[]) {
  const step = 300 / (pts.length - 1);
  let d = `M0 ${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const x0 = (i - 1) * step;
    const x1 = i * step;
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${pts[i - 1]}, ${cx} ${pts[i]}, ${x1} ${pts[i]}`;
  }
  return d;
}

/** Web app preview: a dashboard whose KPIs, chart and tooltip follow the date range. */
export function WebappScene({ content, active, enterId }: SceneProps<BuilderContent["webapp"]>) {
  const [rangeId, setRangeId] = useState<WebappRange["id"]>(content.ranges[0].id);
  const [deltas, setDeltas] = useState(content.ranges[0].deltas);
  const [tip, setTip] = useState({ cursor: 0, left: 0, text: "" });
  const line = useRef<SVGPathElement>(null);
  const area = useRef<SVGPathElement>(null);
  const kpis = useRef<(HTMLElement | null)[]>([]);
  const kpiVals = useRef([0, 0, 0]);
  const tweens = useRef<number[]>([]);
  const range = content.ranges.find((r) => r.id === rangeId) ?? content.ranges[0];

  function countTo(i: number, from: number, to: number) {
    const el = kpis.current[i];
    if (!el) return;
    cancelAnimationFrame(tweens.current[i]);
    const prefix = i === 0 ? content.currency : "";
    const duration = prefersReducedMotion() ? 1 : 900;
    let t0: number | null = null;
    const step = (ts: number) => {
      t0 ??= ts;
      const p = Math.min(1, (ts - t0) / duration);
      el.textContent = prefix + Math.round(from + (to - from) * easeOutCubic(p)).toLocaleString("en-GB");
      if (p < 1) tweens.current[i] = requestAnimationFrame(step);
    };
    tweens.current[i] = requestAnimationFrame(step);
  }

  function draw(r: WebappRange, fromZero: boolean) {
    const l = line.current;
    const a = area.current;
    if (!l || !a) return;
    const p = pathFrom(r.points);
    l.setAttribute("d", p);
    a.setAttribute("d", `${p} L 300 80 L 0 80 Z`);
    l.style.transition = "none";
    l.style.strokeDashoffset = "700";
    a.style.opacity = "0";
    l.getBoundingClientRect();
    l.style.transition = "stroke-dashoffset 1.3s cubic-bezier(.3,.7,.2,1)";
    requestAnimationFrame(() => {
      l.style.strokeDashoffset = "0";
      a.style.opacity = "1";
    });
    r.kpis.forEach((v, i) => {
      countTo(i, fromZero ? 0 : kpiVals.current[i], v);
      kpiVals.current[i] = v;
    });
    setDeltas(r.deltas);
  }

  useEffect(() => {
    if (active) draw(range, true);
    // Only the scene entry redraws from zero; range changes redraw in the click handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enterId]);

  useEffect(() => () => tweens.current.forEach(cancelAnimationFrame), []);

  function onRange(id: WebappRange["id"]) {
    setRangeId(id);
    draw(content.ranges.find((r) => r.id === id) ?? range, false);
  }

  function onChartMove(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const inner = r.width - 16;
    const x = Math.max(0, Math.min(inner, e.clientX - r.left - 8));
    const pts = range.points;
    const idx = Math.round((x / inner) * (pts.length - 1));
    const px = 8 + (idx / (pts.length - 1)) * inner;
    const val = Math.round(((((80 - pts[idx]) / 80) * range.kpis[0]) / pts.length) * 1.6);
    const label =
      range.id === 7 ? content.weekDays[idx] : `${content.dayPrefix} ${idx * Math.round(range.id / pts.length) + 1}`;
    setTip({
      cursor: px,
      left: Math.max(40, Math.min(r.width - 40, px)),
      text: `${label}  ${content.currency}${val.toLocaleString("en-GB")}`,
    });
  }

  return (
    <div className="win">
      <div className="win-bar">
        <i />
        <i />
        <i />
        <span className="url">
          <Icon name="lock" />
          {content.url}
        </span>
      </div>
      <div className="dash">
        <div className="side">
          {content.nav.map((item, i) => (
            <div key={item} className={i === 0 ? "on" : undefined}>
              <i />
              {item}
            </div>
          ))}
        </div>
        <div className="main">
          <div className="dash-head">
            <strong>{content.heading}</strong>
            <Segmented
              className="xs"
              ariaLabel={content.rangeLabel}
              options={content.ranges.map((r) => ({ value: r.id, label: r.label }))}
              value={rangeId}
              onChange={onRange}
            />
          </div>
          <div className="kpis">
            {content.kpiLabels.map((label, i) => (
              <div className="kpi" key={label}>
                <small>{label}</small>
                <strong
                  id={`k${i}`}
                  ref={(el) => {
                    kpis.current[i] = el;
                  }}
                >
                  {i === 0 ? `${content.currency}0` : "0"}
                </strong>
                <em id={`k${i}d`}>{deltas[i]}</em>
              </div>
            ))}
          </div>
          <div className="chart" id="chart" onPointerMove={onChartMove}>
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--accent)" stopOpacity=".22" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line className="gline" x1="0" y1="27" x2="300" y2="27" />
              <line className="gline" x1="0" y1="54" x2="300" y2="54" />
              <path className="area" id="area" ref={area} />
              <path className="line" id="line" ref={line} />
            </svg>
            <div className="chart-cursor" id="ccur" style={tip.text ? { left: tip.cursor } : undefined} />
            <div className="chart-tip" id="ctip" style={tip.text ? { left: tip.left } : undefined}>
              {tip.text}
            </div>
          </div>
          <div className="rows">
            {content.rows.map((row) => (
              <div key={row.name}>
                <span>{row.name}</span>
                <span className={`st ${row.status}`}>{row.statusLabel}</span>
                <span className="amt">{row.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
