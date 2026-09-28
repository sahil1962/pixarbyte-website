import type { CaseStudy, WorkSectionContent } from "@/types/content";
import { WorkShowcase } from "./work/WorkShowcase";

/** "Recent work": filterable case studies with a detail dialog. */
export function Work({ section, caseStudies }: { section: WorkSectionContent; caseStudies: CaseStudy[] }) {
  return (
    <section className="section tint" id="work" aria-labelledby="work-title">
      <div className="container">
        <WorkShowcase section={section} caseStudies={caseStudies} />
      </div>
    </section>
  );
}
