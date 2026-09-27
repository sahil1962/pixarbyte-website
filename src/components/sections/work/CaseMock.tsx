import type { CSSProperties } from "react";
import type { CaseStudy } from "@/types/content";

/** Illustrated device mock for a case study card and dialog header. */
export function CaseVisual({ study, terminalLines }: { study: CaseStudy; terminalLines: string[] }) {
  const { c1, c2 } = study.colors;
  return (
    <div className="case-vis" style={{ "--c1": c1, "--c2": c2 } as CSSProperties}>
      <CaseMock study={study} terminalLines={terminalLines} />
    </div>
  );
}

function CaseMock({ study, terminalLines }: { study: CaseStudy; terminalLines: string[] }) {
  const { c1, c2 } = study.colors;

  if (study.mock === "phone") {
    return (
      <div className="mock phone" style={{ "--r": "-3deg" } as CSSProperties}>
        <i style={{ left: 14, right: 14, top: 22, height: 40, background: c1 }} />
        <i style={{ left: 14, right: 40, top: 72, height: 8, background: "#e4e4e7" }} />
        <i style={{ left: 14, right: 24, top: 90, height: 28, background: "#f4f4f5" }} />
        <i style={{ left: 14, right: 24, top: 124, height: 28, background: "#f4f4f5" }} />
        <i style={{ left: 14, right: 24, top: 158, height: 28, background: "#f4f4f5" }} />
      </div>
    );
  }

  if (study.mock === "term") {
    return (
      <div className="mock term">
        {terminalLines.map((line) => (
          <div key={line}>
            <b>✓</b>
            {` ${line}`}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mock browser" style={{ "--r": "1deg" } as CSSProperties}>
      <i style={{ left: 16, top: 32, width: "40%", height: 12, background: "#18181b" }} />
      <i style={{ left: 16, top: 52, width: "28%", height: 8, background: "#d4d4d8" }} />
      <i style={{ left: 16, top: 70, width: "18%", height: 18, background: c1 }} />
      <i style={{ right: 16, top: 32, width: "38%", height: 90, background: `linear-gradient(135deg,${c2},${c1})` }} />
      <i style={{ left: 16, top: 100, width: "22%", height: 40, background: "#f4f4f5" }} />
      <i style={{ left: "30%", top: 100, width: "22%", height: 40, background: "#f4f4f5" }} />
    </div>
  );
}
