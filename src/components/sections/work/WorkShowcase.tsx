"use client";

import { useRef, useState, type RefObject } from "react";
import type { CaseStudy, WorkFilter, WorkSectionContent } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { Segmented } from "@/components/shared/Segmented";
import { useSite } from "@/components/layout/SiteProvider";
import { prefersReducedMotion, useModalDialog, useOnView } from "@/lib/hooks";
import { CaseVisual } from "./CaseMock";

/** Pixels lit on the "Your project could be next" card (a small P). */
const DECO_ON = [0, 1, 2, 6, 8, 12, 13, 14];
const DECO_COUNT = 18;

/**
 * Case study cards, the "Your project could be next" card and the case study dialog.
 * Used by the home Work section (with a filter) and by "Related work" on service pages.
 */
export function CaseGrid({
  section,
  caseStudies,
  filter = "all",
  run = 0,
  gridRef,
}: {
  section: WorkSectionContent;
  caseStudies: CaseStudy[];
  filter?: WorkFilter;
  run?: number;
  gridRef?: RefObject<HTMLDivElement | null>;
}) {
  const { openEstimate } = useSite();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [shownIdx, setShownIdx] = useState(0);
  const dialog = useModalDialog(openIdx !== null);

  const ctaCard = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<number[]>([]);
  useOnView(ctaCard, (visible) => {
    if (!visible || prefersReducedMotion()) return;
    DECO_ON.forEach((i) => setTimeout(() => setLit((cur) => (cur.includes(i) ? cur : [...cur, i])), i * 40));
  });

  function openCase(i: number) {
    setShownIdx(i);
    setOpenIdx(i);
  }

  const study = caseStudies[shownIdx];

  return (
    <>
      <div className="work-grid" id="work-grid" ref={gridRef}>
        {caseStudies.map((c, i) => {
          const show = filter === "all" || c.filter === filter;
          // A new key restarts the entrance animation for every card a filter shows.
          return (
            <button
              key={show ? `${c.id}-${run}` : c.id}
              type="button"
              className={show ? (run > 0 ? "case enter" : "case") : "case hide"}
              data-f={c.filter}
              aria-label={section.openAriaPrefix + c.title}
              onClick={() => openCase(i)}
            >
              <CaseVisual study={c} terminalLines={section.terminalMock} />
              <div className="case-body">
                <div className="case-meta">
                  <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>{c.client}</strong>
                  <span>{`${section.locationPrefix} ${c.location}`}</span>
                </div>
                <h3>{c.title}</h3>
                <div className="case-stats">
                  {c.stats.slice(0, 2).map((s) => (
                    <div key={s.label}>
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <span className="case-open">{section.openLabel}</span>
              </div>
            </button>
          );
        })}
        <div className="case cta-card" ref={ctaCard}>
          <div>
            <div className="pix-deco" id="pix-deco" aria-hidden="true">
              {Array.from({ length: DECO_COUNT }, (_, i) => (
                <i key={i} className={lit.includes(i) ? "on" : undefined} />
              ))}
            </div>
            <h3>{section.ctaCard.title}</h3>
            <p>{section.ctaCard.text}</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => openEstimate()}>
            {section.ctaCard.button}
          </button>
        </div>
      </div>

      <dialog
        id="case"
        aria-labelledby="cd-title"
        ref={dialog}
        onClose={() => setOpenIdx(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpenIdx(null);
        }}
      >
        <button
          className="btn btn-ghost btn-icon dlg-close"
          type="button"
          aria-label={section.dialog.closeAriaLabel}
          style={{ zIndex: 2, background: "var(--background)" }}
          onClick={() => setOpenIdx(null)}
        >
          <Icon name="x" />
        </button>
        <div className="case-hero" id="cd-hero">
          <CaseVisual study={study} terminalLines={section.terminalMock} />
        </div>
        <div className="case-dlg-body">
          <div>
            <div className="case-meta" id="cd-meta">
              <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>{study.client}</strong>
              <span>{`${section.locationPrefix} ${study.location}`}</span>
              {study.tags.map((t) => (
                <span className="badge" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <h2 id="cd-title">{study.title}</h2>
          </div>
          <div className="cd-stats" id="cd-stats">
            {study.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="cd-grid">
            <div>
              <h4>{section.dialog.challenge}</h4>
              <p id="cd-challenge">{study.challenge}</p>
            </div>
            <div>
              <h4>{section.dialog.solution}</h4>
              <p id="cd-solution">{study.solution}</p>
            </div>
          </div>
          <blockquote className="cd-quote" id="cd-quote">
            {`“${study.quote.text}”`}
            <footer>{study.quote.cite}</footer>
          </blockquote>
          <div className="cd-actions">
            <button
              className="btn btn-primary"
              id="cd-cta"
              type="button"
              onClick={() => {
                setOpenIdx(null);
                openEstimate(section.estimateFor[study.filter]);
              }}
            >
              {section.dialog.cta}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => setOpenIdx(null)}>
              {section.dialog.close}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

/** Home "Recent work": filter pills above the case study grid. */
export function WorkShowcase({ section, caseStudies }: { section: WorkSectionContent; caseStudies: CaseStudy[] }) {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [run, setRun] = useState(0);
  const grid = useRef<HTMLDivElement>(null);

  function applyFilter(f: WorkFilter) {
    setFilter(f);
    setRun((r) => r + 1);
    grid.current?.scrollTo?.({ left: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="sec-head row">
        <div>
          <h2 id="work-title">{section.title}</h2>
          <p>{section.intro}</p>
        </div>
        <Segmented
          id="work-filter"
          ariaLabel={section.filterLabel}
          options={section.filters.map((f) => ({ value: f.id, label: f.label }))}
          value={filter}
          onChange={applyFilter}
        />
      </div>
      <CaseGrid section={section} caseStudies={caseStudies} filter={filter} run={run} gridRef={grid} />
    </>
  );
}
