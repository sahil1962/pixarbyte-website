import type { CaseStudy, WorkSectionContent } from "@/types/content";
import { CtaCard } from "../work/CtaCard";
import { ProjectCard, type ProjectCardCopy } from "./ProjectCard";

/** Static grid of case study cards: the portfolio's no-JavaScript view and related projects. */
export function ProjectGrid({
  projects,
  copy,
  ctaCard,
}: {
  projects: CaseStudy[];
  copy: ProjectCardCopy;
  ctaCard?: WorkSectionContent["ctaCard"];
}) {
  return (
    <ul className="work-grid project-grid" role="list">
      {projects.map((p) => (
        <li key={p.slug} className="grid">
          <ProjectCard project={p} copy={copy} />
        </li>
      ))}
      {ctaCard && (
        <li className="grid">
          <CtaCard content={ctaCard} />
        </li>
      )}
    </ul>
  );
}
