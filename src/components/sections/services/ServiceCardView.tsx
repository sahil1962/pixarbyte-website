import Link from "next/link";
import type { ServiceCard } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { formatGBP } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ServiceVisual } from "./ServiceVisual";

/**
 * A service card from the home bento. The title links to the service page and stretches
 * over the whole card; the interactive illustration and the estimate button sit above it.
 */
export function ServiceCardView({
  card,
  fromLabel,
  bento = false,
}: {
  card: ServiceCard;
  fromLabel: string;
  /** Apply the bento column spans from `card.layout`. */
  bento?: boolean;
}) {
  return (
    <article className={cn("svc", bento && `s${card.layout.span}`, bento && card.layout.tall && "tall", "glow")}>
      <ServiceVisual visual={card.visual} />
      <div className="svc-body">
        <h3>
          <Link href={`/services/${card.slug}`} className="card-link">
            {card.title}
          </Link>
        </h3>
        <p>{card.shortDescription}</p>
      </div>
      <div className="svc-foot">
        <span className="from">
          {`${fromLabel} `}
          <strong>{formatGBP(card.fromPrice)}</strong>
        </span>
        <EstimateButton className="link-btn" type={card.estimate.type}>
          {card.estimate.label}
        </EstimateButton>
      </div>
    </article>
  );
}
