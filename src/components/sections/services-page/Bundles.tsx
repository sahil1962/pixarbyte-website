import type { Bundle } from "@/types/service";
import { EstimateButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { formatGBP } from "@/lib/format";

export type PricedBundle = Bundle & { price: number; serviceNames: string[] };

/** Popular service combinations, as pricing cards. */
export function Bundles({
  bundles,
  copy,
}: {
  bundles: PricedBundle[];
  copy: { fromLabel: string; includesLabel: string; note: string };
}) {
  return (
    <>
      <div className="price-grid">
        {bundles.map((b) => (
          <div key={b.name} className={b.popular ? "price pop glow" : "price glow"}>
            <div className="price-top">
              <span>{b.name}</span>
              {b.badge && <span className="badge">{b.badge}</span>}
            </div>
            <div className="amount">
              <small>{copy.fromLabel}</small>
              <strong>{formatGBP(b.price)}</strong>
            </div>
            <p>{b.description}</p>
            <div className="chips mt-4">
              <span className="sr-only">{`${copy.includesLabel}:`}</span>
              {b.serviceNames.map((n) => (
                <span className="badge" key={n}>
                  {n}
                </span>
              ))}
            </div>
            <ul className="ticks">
              {b.features.map((f) => (
                <li key={f}>
                  <Icon name="check" />
                  {f}
                </li>
              ))}
            </ul>
            <EstimateButton className={b.popular ? "btn btn-primary" : "btn btn-outline"} type={b.cta.type}>
              {b.cta.label}
            </EstimateButton>
          </div>
        ))}
      </div>
      <p className="price-note">{copy.note}</p>
    </>
  );
}
