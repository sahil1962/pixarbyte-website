import Link from "next/link";
import type { Tech, Testimonial } from "@/types/content";
import type { Benefit, Service, SubService } from "@/types/service";
import { EstimateButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { Stars } from "@/components/shared/Stars";
import { formatGBP, initials } from "@/lib/format";
import { ContentIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ServiceVisual } from "../services/ServiceVisual";

/** Hero right-hand column: the service's live illustration with its starting price. */
export function ServiceHeroCard({ service, fromLabel }: { service: Service; fromLabel: string }) {
  return (
    <div className="svc glow relative [&>.svc-vis]:h-auto [&>.svc-vis]:min-h-[320px] [&>.svc-vis]:flex-1 [&>.vis-front]:items-center">
      <ServiceVisual visual={service.visual} />
      <div className="svc-foot">
        <span className="from">
          {`${fromLabel} `}
          <strong>{formatGBP(service.pricingHint.from)}</strong>
        </span>
        <EstimateButton className="link-btn" type={service.estimate.type}>
          {service.estimate.label}
        </EstimateButton>
      </div>
    </div>
  );
}

/** Intro paragraphs under a heading, in the section-heading style. */
export function ServiceOverview({
  id,
  title,
  paragraphs,
  tint,
}: {
  id: string;
  title: string;
  paragraphs: string[];
  tint?: boolean;
}) {
  return (
    <section className={cn("section", tint && "tint")} id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="sec-head mb-0">
          <h2 id={`${id}-title`}>{title}</h2>
          {paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** What's included: icon, title and a line of text per offering. */
export function OfferingsGrid({ items }: { items: SubService[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((o) => (
        <article key={o.title} className="svc glow pb-[22px]">
          <div className="svc-body">
            <ContentIcon name={o.icon} className="mb-3.5 size-5 text-muted-foreground" />
            <h3>{o.title}</h3>
            <p>{o.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

/** Four benefits in a 2 × 2 grid. */
export function BenefitsGrid({ items }: { items: Benefit[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((b) => (
        <div key={b.title} className="proc-card">
          <ContentIcon name={b.icon} className="mb-4 size-6 text-brand" />
          <h3>{b.title}</h3>
          <p>{b.description}</p>
        </div>
      ))}
    </div>
  );
}

/** Semantic comparison table in the design's comparison style. */
export function ComparisonTable({ caption, headers, rows }: NonNullable<Service["comparison"]>) {
  return (
    <div className="compare">
      {/* Focusable so keyboard users can scroll the table sideways on small screens. */}
      <div className="compare-scroll" tabIndex={0} role="region" aria-label={caption}>
        <table>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {headers.map((h, i) =>
                // An empty top-left corner is a data cell, not a header.
                h ? (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ) : (
                  <td key={i} className="bg-[var(--muted-2)]" />
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                <th scope="row">{row[0]}</th>
                {row.slice(1).map((cell, i) => (
                  <td key={i}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** The usual stack, as the home page's technology chips. */
export function TechList({ tech, label }: { tech: Tech[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-3" aria-label={label}>
      {tech.map((t) => (
        <li key={t.id} className="tech-chip">
          <i style={{ background: t.color }} />
          {t.name}
          <small>{t.category}</small>
        </li>
      ))}
    </ul>
  );
}

/** Typical projects beside the starting price. */
export function UseCasesAndPrice({
  service,
  copy,
}: {
  service: Service;
  copy: {
    useCasesTitle: string;
    useCasesLead: string;
    pricingTitle: string;
    fromLabel: string;
    pricingLink: string;
    pricingHref: string;
  };
}) {
  const hint = service.pricingHint;
  return (
    <div className="aud-grid">
      <div className="aud-card">
        <div className="aud-top">
          <span className="for">{copy.useCasesTitle}</span>
        </div>
        <h3>{copy.useCasesLead}</h3>
        <ul className="ticks mb-0">
          {service.useCases.map((u) => (
            <li key={u}>
              <Icon name="check" />
              {u}
            </li>
          ))}
        </ul>
      </div>
      <div className="price pop">
        <div className="price-top">
          <span>{copy.pricingTitle}</span>
        </div>
        <div className="amount">
          <small>{copy.fromLabel.toLowerCase()}</small>
          <strong>{formatGBP(hint.from)}</strong>
          {hint.unit && <small>{hint.unit}</small>}
        </div>
        {hint.note && <p>{hint.note}</p>}
        <div className="mt-auto grid gap-3 pt-6">
          <EstimateButton className="btn btn-primary w-full" type={service.estimate.type}>
            {service.estimate.label}
          </EstimateButton>
          <Link href={copy.pricingHref} className="link-btn justify-self-center">
            {copy.pricingLink}
          </Link>
        </div>
      </div>
    </div>
  );
}

/** One client quote, in the featured review style. */
export function ServiceTestimonial({ t, starsLabel }: { t: Testimonial; starsLabel: string }) {
  return (
    <figure className="review feature mx-auto mb-0 max-w-[760px]">
      <Stars label={starsLabel} />
      <blockquote>{`“${t.quote}”`}</blockquote>
      <figcaption className="who">
        <span style={{ background: t.color }}>{initials(t.name)}</span>
        <div>
          <strong>{t.name}</strong>
          <small>{t.role}</small>
        </div>
      </figcaption>
    </figure>
  );
}
