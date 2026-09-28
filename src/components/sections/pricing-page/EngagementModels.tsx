import type { EngagementModel, PricingPageContent } from "@/types/pricing";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { formatGBP } from "@/lib/format";
import { ContentIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Fixed-price, hourly, dedicated and maintenance, as the home page's price cards. */
export function EngagementModels({ models, copy }: { models: EngagementModel[]; copy: PricingPageContent["models"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {models.map((m) => (
        <article key={m.id} className={cn("price glow", m.highlighted && "pop")}>
          <div className="price-top">
            <h3 className="m-0 inline-flex items-center gap-2 text-[15px] font-medium">
              <ContentIcon name={m.icon} className="size-4 text-muted-foreground" />
              {m.title}
            </h3>
          </div>
          <div className="amount">
            {m.priceFrom !== undefined ? (
              <>
                <small>{copy.fromLabel}</small>
                <strong>{formatGBP(m.priceFrom)}</strong>
                {m.priceUnit && copy.units[m.priceUnit] && <small>{copy.units[m.priceUnit]}</small>}
              </>
            ) : (
              <strong>{copy.quoted}</strong>
            )}
          </div>
          <p>
            <span className="sr-only">{`${copy.bestFor}: `}</span>
            {m.bestFor}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.howItWorks}</p>
          <ul className="ticks">
            {m.pros.map((p) => (
              <li key={p}>
                <Icon name="check" />
                {p}
              </li>
            ))}
          </ul>
          <Link className={m.highlighted ? "btn btn-primary" : "btn btn-outline"} href={`/contact?model=${m.id}`}>
            {m.cta.label}
          </Link>
        </article>
      ))}
    </div>
  );
}
