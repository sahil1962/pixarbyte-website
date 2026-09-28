import type { ServiceCard, ServicesSectionContent } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { SectionHead } from "@/components/shared/SectionHead";
import { ServiceCardView } from "./services/ServiceCardView";

/** "Everything you need to ship" services bento. */
export function Services({ section, services }: { section: ServicesSectionContent; services: ServiceCard[] }) {
  return (
    <section className="section tint" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead
          id="services-title"
          title={section.title}
          intro={section.intro}
          aside={<EstimateButton className="btn btn-outline">{section.cta}</EstimateButton>}
        />
        <div className="bento">
          {services.map((s) => (
            <ServiceCardView key={s.slug} card={s} fromLabel={section.fromLabel} bento />
          ))}
        </div>
      </div>
    </section>
  );
}
