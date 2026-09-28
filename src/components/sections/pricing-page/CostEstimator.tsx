"use client";

import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { useState } from "react";
import type { BuilderProject, EstimateModel, ProjectSize, ProjectType } from "@/types/content";
import type { PricingPageContent } from "@/types/pricing";
import { Segmented } from "@/components/shared/Segmented";
import { estimate } from "@/lib/estimator";
import { fill, formatEstimate } from "@/lib/format";

/**
 * The cost estimator: the quick estimate's questions laid out on the page, with a live
 * result card. It calls the same `estimate()` as the dialog, so the two always agree.
 */
export function CostEstimator({
  model,
  projects,
  copy,
}: {
  model: EstimateModel;
  projects: BuilderProject[];
  copy: PricingPageContent["estimator"];
}) {
  const [type, setType] = useState<ProjectType>(projects[0].key);
  const [size, setSize] = useState<ProjectSize>("s");
  const [features, setFeatures] = useState<string[]>([]);
  const result = estimate(model, { type, size, features });
  const typeLabel = projects.find((p) => p.key === type)?.label ?? "";
  const sizeCopy = copy.sizes.find((s) => s.id === size);
  const featureLabels = model.features[type].filter((f) => features.includes(f.id)).map((f) => f.label);

  function onCta() {
    trackEvent("estimator_complete", { type, low: result.low, high: result.high });
  }
  // /contact recalculates the range from these inputs rather than trusting a price in the URL.
  const quoteHref = `/contact?type=${type}&size=${size}&features=${encodeURIComponent(features.join(","))}&estimate=1`;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="aud-card grid gap-7">
        <div>
          <span className="field-label" id="calc-type-label">
            {copy.typeLabel}
          </span>
          <Segmented<ProjectType>
            className="est-seg w-full"
            ariaLabelledBy="calc-type-label"
            options={projects.map((p) => ({ value: p.key, label: p.label }))}
            value={type}
            onChange={(t) => {
              setType(t);
              setFeatures([]);
            }}
          />
        </div>
        <div>
          <span className="field-label" id="calc-size-label">
            {copy.sizeLabel}
          </span>
          <Segmented<ProjectSize>
            className="est-seg w-full"
            ariaLabelledBy="calc-size-label"
            options={copy.sizes.map((s) => ({ value: s.id, label: s.label }))}
            value={size}
            onChange={setSize}
          />
          <p className="ctrl-note mt-2 mb-0">{sizeCopy?.hint}</p>
        </div>
        <fieldset className="m-0 border-0 p-0">
          <legend className="field-label">{copy.featuresLabel}</legend>
          <div className="checks max-sm:grid-cols-1">
            {model.features[type].map((f) => (
              <label className="check" key={`${type}-${f.id}`}>
                <input
                  type="checkbox"
                  value={f.id}
                  checked={features.includes(f.id)}
                  onChange={(e) =>
                    setFeatures((cur) => (e.target.checked ? [...cur, f.id] : cur.filter((id) => id !== f.id)))
                  }
                />
                <span>{f.label}</span>
                <small>{`+${formatEstimate(f.price)}`}</small>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="price pop lg:sticky lg:top-24">
        <div className="price-top">
          <span>{copy.resultLabel}</span>
        </div>
        <div className="amount" aria-live="polite" aria-atomic="true">
          <strong id="calc-range" className="text-[34px] tabular-nums">
            {`${formatEstimate(result.low)} – ${formatEstimate(result.high)}`}
          </strong>
          <small className="w-full">{copy.vat}</small>
        </div>
        <dl className="mt-5 mb-0 grid gap-3 text-sm">
          <div>
            <dt className="meta-label">{copy.timelineLabel}</dt>
            <dd className="meta-val m-0">{fill(copy.timeline, { min: result.weeks[0], max: result.weeks[1] })}</dd>
          </div>
          <div>
            <dt className="meta-label">{copy.summaryLabel}</dt>
            <dd className="meta-val m-0">{[typeLabel, sizeCopy?.label, ...featureLabels].join(", ")}</dd>
          </div>
        </dl>
        <p className="disclaimer mt-5 mb-6">{copy.disclaimer}</p>
        <Link className="btn btn-primary" href={quoteHref} onClick={onCta}>
          {copy.cta}
        </Link>
      </div>
    </div>
  );
}
