import type { IconCard, PricingPageContent } from "@/types/pricing";
import { Icon } from "@/components/shared/Icon";
import { ContentIcon } from "@/lib/icons";

/** What affects the price: icon cards in the process-card style. */
export function CostFactors({ items }: { items: IconCard[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <div key={f.title} className="proc-card">
          <ContentIcon name={f.icon} className="mb-4 size-6 text-brand" />
          <h3>{f.title}</h3>
          <p>{f.description}</p>
        </div>
      ))}
    </div>
  );
}

/** "Always included" checklist in two columns. */
export function AlwaysIncluded({ items }: { items: string[] }) {
  return (
    <div className="aud-card">
      <ul className="ticks my-0 grid-cols-1 md:grid-cols-2 md:gap-x-10">
        {items.map((i) => (
          <li key={i}>
            <Icon name="check" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The 30/40/30 milestone bar, payment methods and terms. */
export function PaymentTerms({ copy }: { copy: PricingPageContent["payment"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="aud-card">
        <ol className="m-0 flex list-none gap-1.5 p-0" aria-label={copy.title}>
          {copy.stages.map((s, i) => (
            <li key={s.label} className="min-w-0" style={{ flexBasis: `${s.percent}%` }}>
              <div className="h-3 rounded-full bg-foreground" style={{ opacity: 1 - i * 0.3 }} aria-hidden="true" />
              <strong className="mt-4 block text-[28px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                {`${s.percent}%`}
              </strong>
              <span className="mt-2 block text-[15px] font-medium">{s.label}</span>
              <span className="mt-1 block text-[13px] text-muted-foreground">{s.when}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="aud-card">
        <span className="meta-label">{copy.methodsLabel}</span>
        <div className="chips mb-5">
          {copy.methods.map((m) => (
            <span className="badge h-auto py-1 whitespace-normal" key={m}>
              {m}
            </span>
          ))}
        </div>
        <ul className="ticks my-0">
          {copy.notes.map((n) => (
            <li key={n}>
              <Icon name="check" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
