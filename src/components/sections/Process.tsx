import type { ProcessSectionContent, ProcessStep } from "@/types/content";
import { SectionHead } from "@/components/shared/SectionHead";
import { ProcessTabs } from "./process/ProcessTabs";

/** "How a project runs": five steps as tabs. */
export function Process({
  section,
  steps,
  tint = false,
}: {
  section: ProcessSectionContent;
  steps: ProcessStep[];
  tint?: boolean;
}) {
  return (
    <section className={tint ? "section tint" : "section"} id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" title={section.title} intro={section.intro} />
        <ProcessTabs section={section} steps={steps} />
      </div>
    </section>
  );
}
