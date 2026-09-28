import type { ServiceVisual } from "@/types/content";
import { AutomationSwitch } from "./AutomationSwitch";
import { avatarBackground } from "@/lib/color";

/** Full-stack card: three layers that spread apart on hover (pure CSS). */
export function StackVisual({ layers, badge }: Extract<ServiceVisual, { kind: "stack" }>) {
  const [db, api, ui] = layers;
  return (
    <div className="svc-vis vis-stack" aria-hidden="true">
      <div className="stack3d">
        <div className="layer l3">
          <i />
          <b>{db}</b>
        </div>
        <div className="layer l2">
          <i />
          <b>{api}</b>
        </div>
        <div className="layer l1">
          <i />
          <b>{ui}</b>
        </div>
      </div>
      <div className="stack-labels">
        <span className="badge">{badge}</span>
      </div>
    </div>
  );
}

/** No-code card: automation rows with working switches. */
export function AutomationsVisual({ items }: Extract<ServiceVisual, { kind: "automations" }>) {
  return (
    <div className="svc-vis vis-nocode">
      {items.map((a) => (
        <div className="auto-row" key={a.title}>
          <span className="ai" style={{ background: avatarBackground(a.color) }}>
            {a.letter}
          </span>
          <span>
            {a.title}
            <small>{a.detail}</small>
          </span>
          <AutomationSwitch label={a.title} defaultOn={a.on} />
        </div>
      ))}
    </div>
  );
}

/** Cloud card: UK region with traffic pulsing out to its neighbours (pure CSS). */
export function RegionsVisual({ paths, regions }: Extract<ServiceVisual, { kind: "regions" }>) {
  return (
    <div className="svc-vis vis-cloud" aria-hidden="true">
      <svg preserveAspectRatio="none" viewBox="0 0 100 100">
        {paths.map((d) => (
          <path key={`line-${d}`} className="rline" d={d} vectorEffect="non-scaling-stroke" />
        ))}
        {paths.map((d, i) => (
          <path
            key={`pulse-${d}`}
            className={i % 2 ? "rpulse b" : "rpulse"}
            d={d}
            vectorEffect="non-scaling-stroke"
            pathLength={410}
          />
        ))}
      </svg>
      {regions.map((r) => (
        <span
          key={r.name}
          className={r.primary ? "rnode primary" : "rnode"}
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
        >
          <span className={r.primary ? "dot ping" : "dot"} />
          {r.name}
          <em>{r.detail}</em>
        </span>
      ))}
    </div>
  );
}
