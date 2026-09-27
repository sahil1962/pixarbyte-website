import type { ProcessSectionContent, ProcessStep } from "@/types/content";
import { SectionHead } from "@/components/shared/SectionHead";
import { ProcessTabs } from "./process/ProcessTabs";

/** "How a project runs": five steps as tabs. */
export function Process({ section, steps }: { section: ProcessSectionContent; steps: ProcessStep[] }) {
  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" title={section.title} intro={section.intro} />
        <ProcessTabs section={section} steps={steps} />
      </div>
    </section>
  );
}
