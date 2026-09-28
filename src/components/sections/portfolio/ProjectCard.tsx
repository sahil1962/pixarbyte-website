import Link from "next/link";
import type { CaseStudy } from "@/types/content";
import { CaseVisual } from "../work/CaseMock";

export interface ProjectCardCopy {
  locationPrefix: string;
  open: string;
  concept: string;
  terminalMock: string[];
}

/**
 * A case study card in the home "Recent work" style. The title links to the case study
 * and stretches over the whole card.
 */
export function ProjectCard({ project, copy }: { project: CaseStudy; copy: ProjectCardCopy }) {
  return (
    <article className="case case-card relative h-full">
      <CaseVisual study={project} terminalLines={copy.terminalMock} />
      <div className="case-body">
        <div className="case-meta">
          <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>{project.client}</strong>
          <span>{`${copy.locationPrefix} ${project.location}`}</span>
          {project.concept && <span className="badge">{copy.concept}</span>}
        </div>
        <h3>
          <Link href={project.href} className="card-link">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 mb-0 line-clamp-2 text-sm leading-normal text-muted-foreground">{project.summary}</p>
        <div className="case-stats">
          {project.stats.slice(0, 2).map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <span className="case-open mt-auto pt-4" aria-hidden="true">
          {copy.open}
        </span>
      </div>
    </article>
  );
}
