import Link from "next/link";
import type { Tech } from "@/types/content";
import type { Service } from "@/types/service";
import { Icon } from "@/components/shared/Icon";
import { formatGBP } from "@/lib/format";
import { ContentIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ServiceVisual } from "../services/ServiceVisual";

export interface ServiceRowsCopy {
  fromLabel: string;
  more: string;
  offeringsLabel: string;
  stackLabel: string;
}

/**
 * One row per service, alternating sides on large screens: a summary card (price, what's
 * included, usual stack, link) beside the service's live illustration.
 */
export function ServiceRows({
  services,
  tech,
  copy,
}: {
  services: Service[];
  tech: Record<string, Tech[]>;
  copy: ServiceRowsCopy;
}) {
  return (
    <div className="grid gap-16 md:gap-20">
      {services.map((s, i) => (
        <div key={s.slug} id={s.slug} className="grid scroll-mt-24 items-stretch gap-4 lg:grid-cols-2">
          <div className={cn("aud-card", i % 2 === 1 && "lg:order-2")}>
            <div className="aud-top">
              <span className="for inline-flex items-center gap-2">
                <ContentIcon name={s.icon} className="size-4" />
                {s.navLabel}
              </span>
              <span className="badge">{`${copy.fromLabel} ${formatGBP(s.pricingHint.from)}`}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.hero.subheading}</p>
            <ul className="ticks" aria-label={copy.offeringsLabel}>
              {s.offerings.slice(0, 5).map((o) => (
                <li key={o.title}>
                  <Icon name="check" />
                  {o.title}
                </li>
              ))}
            </ul>
            <div className="mb-7">
              <div className="meta-label">{copy.stackLabel}</div>
              <div className="chips">
                {tech[s.slug].slice(0, 5).map((t) => (
                  <span className="badge" key={t.id}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
            <Link className="btn btn-primary" href={`/services/${s.slug}`} aria-label={`${copy.more}: ${s.name}`}>
              {copy.more}
            </Link>
          </div>
          <div className="svc glow min-h-[340px] [&>.svc-vis]:h-auto [&>.svc-vis]:min-h-[340px] [&>.svc-vis]:flex-1 [&>.svc-vis]:border-b-0 [&>.vis-front]:items-center">
            <ServiceVisual visual={s.visual} />
          </div>
        </div>
      ))}
    </div>
  );
}
