"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useMemo } from "react";
import type { CaseStudy, WorkSectionContent } from "@/types/content";
import { Segmented } from "@/components/shared/Segmented";
import { ALL, filterProjects, readFilter } from "@/lib/portfolio";
import { CtaCard } from "../work/CtaCard";
import { ProjectCard, type ProjectCardCopy } from "./ProjectCard";

export interface ExplorerCopy {
  serviceLabel: string;
  industryLabel: string;
  all: string;
  allIndustries: string;
  countOne: string;
  countMany: string;
  emptyTitle: string;
  emptyText: string;
  reset: string;
}

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Service and industry filters over the case study grid. The filters live in the URL
 * (`?service=…&industry=…`), so a filtered view can be shared or linked to from a service
 * page. Updating the URL through the History API keeps filtering instant: no server request.
 */
export function PortfolioExplorer({
  projects,
  services,
  industries,
  copy,
  cardCopy,
  ctaCard,
}: {
  projects: CaseStudy[];
  services: { value: string; label: string }[];
  industries: string[];
  copy: ExplorerCopy;
  cardCopy: ProjectCardCopy;
  ctaCard: WorkSectionContent["ctaCard"];
}) {
  const params = useSearchParams();
  const service = readFilter(
    params.get("service"),
    services.map((s) => s.value),
  );
  const industry = readFilter(params.get("industry"), industries);
  const shown = useMemo(() => filterProjects(projects, service, industry), [projects, service, industry]);

  function setFilter(key: "service" | "industry", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === ALL) next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }

  const count = (shown.length === 1 ? copy.countOne : copy.countMany).replace("{count}", String(shown.length));

  return (
    <MotionConfig reducedMotion="user">
      <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="max-w-full min-w-0">
          <span className="field-label" id="service-filter-label">
            {copy.serviceLabel}
          </span>
          <Segmented<string>
            className="max-w-full overflow-x-auto [&>button]:shrink-0"
            ariaLabelledBy="service-filter-label"
            options={[{ value: ALL, label: copy.all }, ...services]}
            value={service}
            onChange={(v) => setFilter("service", v)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="industry-filter">
            {copy.industryLabel}
          </label>
          <select
            id="industry-filter"
            className="input h-[34px] pr-8"
            value={industry}
            onChange={(e) => setFilter("industry", e.target.value)}
          >
            <option value={ALL}>{copy.allIndustries}</option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <p className="ctrl-note m-0 ml-auto pb-2" aria-live="polite">
          {count}
        </p>
      </div>

      {shown.length === 0 && (
        <div className="aud-card mb-4 items-start">
          <h3>{copy.emptyTitle}</h3>
          <p>{copy.emptyText}</p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => window.history.replaceState(null, "", window.location.pathname)}
          >
            {copy.reset}
          </button>
        </div>
      )}

      <motion.ul layout className="work-grid project-grid" role="list">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.slug}
              layout
              className="grid"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease }}
            >
              <ProjectCard project={p} copy={cardCopy} />
            </motion.li>
          ))}
          <motion.li key="cta" layout className="grid" transition={{ duration: 0.35, ease }}>
            <CtaCard content={ctaCard} />
          </motion.li>
        </AnimatePresence>
      </motion.ul>
    </MotionConfig>
  );
}
