"use client";

import { useEffect, useRef, useState } from "react";
import type { BuilderContent, TermLine } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { fill } from "@/lib/format";
import { prefersReducedMotion, useTimers } from "@/lib/hooks";
import type { SceneProps } from "./types";

type Content = BuilderContent["cloud"];
type Row = { id: number; line: TermLine | null };
type Region = { state: "up" | "down" | null; text: string };

const MAX_LINES = 9;
const UPTIME_DAYS = 30;

/** Cloud preview: a deploy streams through the terminal; "Simulate outage" shows automatic failover. */
export function CloudScene({ content, active, enterId }: SceneProps<Content>) {
  const { notify } = useSite();
  const timers = useTimers();
  const ms = (n: number) => `${n} ${content.latencyUnit}`;
  const baseRegions = (): Region[] => content.regions.map((r) => ({ state: null, text: ms(r.ms) }));

  const [rows, setRows] = useState<Row[]>([]);
  const [regions, setRegions] = useState<Region[]>(baseRegions);
  const nextId = useRef(0);
  const version = useRef(1);
  const busy = useRef(false);

  // Entering the scene starts from an empty terminal and unknown regions.
  const [entered, setEntered] = useState(-1);
  if (active && entered !== enterId) {
    setEntered(enterId);
    setRows([]);
    setRegions(baseRegions());
  }

  /** Appends a line (null = the blinking prompt), dropping the previous prompt and old lines. */
  function print(line: TermLine | null) {
    setRows((cur) => [...cur.filter((r) => r.line), { id: nextId.current++, line }].slice(-MAX_LINES));
  }
  function setRegion(i: number, patch: Partial<Region>) {
    setRegions((cur) => cur.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  function deploy() {
    timers.clear();
    busy.current = true;
    const reduce = prefersReducedMotion();
    const values = { version: content.versionPrefix + version.current++, seconds: 38 + Math.floor(Math.random() * 10) };
    content.deploy.forEach((l, i) => {
      const line = l.map((t) => (typeof t === "string" ? fill(t, values) : { ...t, text: fill(t.text, values) }));
      timers.later(() => print(line), reduce ? 0 : 150 + i * 380);
    });
    content.regions.forEach((_, i) => timers.later(() => setRegion(i, { state: "up" }), reduce ? 0 : 2100 + i * 220));
    timers.later(
      () => {
        print(null);
        busy.current = false;
      },
      reduce ? 0 : 2900,
    );
  }

  function outage() {
    if (busy.current) return;
    timers.clear();
    busy.current = true;
    const o = content.outage;
    const fail = content.regions[o.failIndex];
    const failover = content.regions[o.failoverIndex];
    print(o.failed);
    setRegion(o.failIndex, { state: "down", text: o.downLabel });
    timers.later(() => print(o.rerouting), 700);
    timers.later(() => {
      setRegion(o.failoverIndex, { text: ms(o.failoverMs) });
      print(o.failoverDone);
    }, 1500);
    timers.later(() => print(o.replacing), 2400);
    timers.later(() => {
      setRegion(o.failIndex, { state: "up", text: ms(fail.ms) });
      setRegion(o.failoverIndex, { text: ms(failover.ms) });
      print(o.recovered);
      print(null);
      busy.current = false;
      notify("outageHandled");
    }, 3600);
  }

  useEffect(() => {
    if (!active) return;
    deploy();
    return () => timers.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enterId]);

  return (
    <div className="cloud">
      <div className="term">
        <div className="win-bar">
          <i />
          <i />
          <i />
          <span className="url">{content.title}</span>
          <button
            className="mini-btn"
            id="redeploy"
            type="button"
            onClick={() => {
              if (!busy.current) deploy();
            }}
          >
            <Icon name="refresh" />
            {content.deployLabel}
          </button>
        </div>
        <div className="term-body" id="term" aria-live="polite">
          {rows.map((row) =>
            row.line ? (
              <div className="tl" key={row.id}>
                {row.line.map((t, i) =>
                  typeof t === "string" ? (
                    t
                  ) : (
                    <span key={i} className={t.tone}>
                      {t.text}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <div className="tl caret-line" key={row.id}>
                <span className="p">{content.prompt}</span> <span className="caret" />
              </div>
            ),
          )}
        </div>
      </div>
      <div className="side-col">
        <div className="panel">
          <h4>
            {content.regionsTitle}
            <button className="mini-btn" id="outage" type="button" onClick={outage}>
              <Icon name="zap" />
              {content.outageLabel}
            </button>
          </h4>
          {content.regions.map((r, i) => (
            <div key={r.name} className={regions[i].state ? `region ${regions[i].state}` : "region"} data-base={r.ms}>
              <span className="dot" />
              {r.name}
              <em>{regions[i].text}</em>
            </div>
          ))}
        </div>
        <div className="panel">
          <h4>{content.uptimeTitle}</h4>
          <div className="uptime" id="uptime">
            {Array.from({ length: UPTIME_DAYS }, (_, i) => (
              <i key={i} className={i === content.uptimeWarningDay ? "w" : undefined} />
            ))}
          </div>
          <div className="uptime-foot">
            <span>{content.uptimeFrom}</span>
            <strong>{content.uptimeValue}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
