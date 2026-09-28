import type { ServiceCard, ServicesSectionContent, ServiceVisual } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { SectionHead } from "@/components/shared/SectionHead";
import { formatGBP } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LayoutVisual } from "./services/LayoutVisual";
import { RequestLogVisual } from "./services/RequestLogVisual";
import { AutomationsVisual, RegionsVisual, StackVisual } from "./services/StaticVisuals";
import { SwipeVisual } from "./services/SwipeVisual";

function Visual({ visual }: { visual: ServiceVisual }) {
  switch (visual.kind) {
    case "stack":
      return <StackVisual {...visual} />;
    case "swipe":
      return <SwipeVisual {...visual} />;
    case "layout":
      return <LayoutVisual labels={visual.labels} />;
    case "requests":
      return <RequestLogVisual requests={visual.requests} />;
    case "automations":
      return <AutomationsVisual {...visual} />;
    case "regions":
      return <RegionsVisual {...visual} />;
  }
}

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
            <article key={s.slug} className={cn("svc", `s${s.layout.span}`, s.layout.tall && "tall", "glow")}>
              <Visual visual={s.visual} />
              <div className="svc-body">
                <h3>{s.title}</h3>
                <p>{s.shortDescription}</p>
              </div>
              <div className="svc-foot">
                <span className="from">
                  {`${section.fromLabel} `}
                  <strong>{formatGBP(s.fromPrice)}</strong>
                </span>
                <EstimateButton className="link-btn" type={s.estimate.type}>
                  {s.estimate.label}
                </EstimateButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
