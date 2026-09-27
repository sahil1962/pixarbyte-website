import type { PricingPlan, PricingSectionContent } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { SectionHead } from "@/components/shared/SectionHead";
import { formatGBP } from "@/lib/format";

/** "Clear prices, agreed before we start": three starting-point plans. */
export function Pricing({ section, plans }: { section: PricingSectionContent; plans: PricingPlan[] }) {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHead id="pricing-title" title={section.title} intro={section.intro} />
        <div className="price-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={plan.popular ? "price pop glow" : "price glow"}>
              <div className="price-top">
                <span>{plan.name}</span>
                {plan.badge && <span className="badge">{plan.badge}</span>}
              </div>
              <div className="amount">
                <small>{section.fromLabel}</small>
                <strong>{formatGBP(plan.price)}</strong>
                {plan.unit && <small>{plan.unit}</small>}
              </div>
              <p>{plan.description}</p>
              <ul className="ticks">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    {f}
                  </li>
                ))}
              </ul>
              <EstimateButton className={plan.popular ? "btn btn-primary" : "btn btn-outline"} type={plan.cta.type}>
                {plan.cta.label}
              </EstimateButton>
            </div>
          ))}
        </div>
        <p className="price-note">{section.note}</p>
      </div>
    </section>
  );
}
