"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceVisual } from "@/types/content";
import { prefersReducedMotion, useOnView } from "@/lib/hooks";

type Request = Extract<ServiceVisual, { kind: "requests" }>["requests"][number];
type Row = Request & { key: number };

const MAX_ROWS = 5;
const INITIAL_ROWS = 4;

/** Backend card: a live request log that streams in while the card is visible. */
export function RequestLogVisual({ requests }: { requests: Request[] }) {
  // Start from a fixed slice so server and client render the same rows; new rows are random.
  const [rows, setRows] = useState<Row[]>(() => requests.slice(0, INITIAL_ROWS).map((r, key) => ({ ...r, key })));
  const nextKey = useRef(INITIAL_ROWS);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useOnView(ref, (visible) => {
    clearInterval(timer.current);
    if (!visible || prefersReducedMotion()) return;
    timer.current = window.setInterval(() => {
      const r = requests[Math.floor(Math.random() * requests.length)];
      const ms = Math.max(12, r.ms + Math.round((Math.random() - 0.5) * 20));
      const row = { ...r, ms, key: nextKey.current++ };
      setRows((cur) => [...cur, row].slice(-MAX_ROWS));
    }, 1300);
  });

  useEffect(() => () => clearInterval(timer.current), []);

  return (
    <div className="svc-vis vis-back" id="reqlog" aria-hidden="true" ref={ref}>
      {rows.map((r) => (
        <div className="req" key={r.key}>
          <span className={`m ${r.method.toLowerCase()}`}>{r.method}</span>
          <span className="p">{r.path}</span>
          <span className="s">200</span>
          <span className="t">{`${r.ms} ms`}</span>
        </div>
      ))}
    </div>
  );
}
