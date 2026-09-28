"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { PackageGroup, PricingPageContent } from "@/types/pricing";
import { Icon } from "@/components/shared/Icon";
import { fill, formatGBP } from "@/lib/format";
import { cn } from "@/lib/utils";

type Copy = PricingPageContent["packages"];

/** ✓, – or a short value such as "Up to 5", with a text alternative for the marks. */
function FeatureValue({ value, copy }: { value: boolean | string; copy: Copy }) {
  if (typeof value === "string") return <>{value}</>;
  return value ? (
    <span className="inline-flex text-[var(--success)]" role="img" aria-label={copy.included}>
      <Icon name="check" className="size-4 [stroke-width:2.5]" />
    </span>
  ) : (
    <span className="text-muted-foreground" role="img" aria-label={copy.notIncluded}>
      –
    </span>
  );
}

/**
 * Package tiers, one tab per service. The active tab follows the URL hash, so service pages
 * can link straight to `/pricing#mobile-apps`; choosing a tab updates the hash in turn.
 */
export function PackageTabs({ groups, copy }: { groups: PackageGroup[]; copy: Copy }) {
  const [active, setActive] = useState(groups[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromHash = (scroll: boolean) => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!groups.some((g) => g.id === id)) return;
      setActive(id);
      if (scroll) section.current?.scrollIntoView({ block: "start" });
    };
    // On load the browser can't scroll to a tab id (no element has it), so do it here.
    fromHash(true);
    const onHash = () => fromHash(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [groups]);

  function select(id: string, focus = false) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    if (focus) tabs.current[groups.findIndex((g) => g.id === id)]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = groups.findIndex((g) => g.id === active);
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % groups.length
        : e.key === "ArrowLeft"
          ? (i - 1 + groups.length) % groups.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? groups.length - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(groups[next].id, true);
  }

  return (
    <div ref={section} className="scroll-mt-24">
      <div
        className="seg mb-8 max-w-full overflow-x-auto [&>button]:shrink-0"
        role="tablist"
        aria-label={copy.tablistLabel}
        onKeyDown={onKeyDown}
      >
        {groups.map((g, i) => (
          <button
            key={g.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={g.id === active}
            aria-controls={`panel-${g.id}`}
            tabIndex={g.id === active ? 0 : -1}
            onClick={() => select(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {groups.map((g) => (
        <div
          key={g.id}
          id={`panel-${g.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${g.id}`}
          hidden={g.id !== active}
          tabIndex={0}
        >
          <p className="mt-0 mb-6 max-w-[640px] text-muted-foreground">
            {`${g.intro} `}
            <Link href={`/services/${g.service}`} className="link-btn">
              {fill(copy.serviceLink, { label: g.label.toLowerCase() })}
            </Link>
          </p>
          <div className="price-grid">
            {g.tiers.map((t) => (
              <article key={t.id} className={cn("price glow", t.highlighted && "pop max-[960px]:order-first")}>
                <div className="price-top">
                  <h3 className="m-0 text-[15px] font-medium">{t.name}</h3>
                  {t.highlighted && <span className="badge">{copy.popular}</span>}
                </div>
                <div className="amount">
                  {t.priceFrom > 0 ? (
                    <>
                      <small>{copy.fromLabel}</small>
                      <strong className="tabular-nums">{formatGBP(t.priceFrom)}</strong>
                    </>
                  ) : (
                    <strong>{copy.customQuote}</strong>
                  )}
                </div>
                <p>{t.idealFor}</p>
                <dl className="mt-5 mb-0 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="meta-label">{copy.delivery}</dt>
                    <dd className="meta-val m-0">{t.deliveryTime}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">{copy.support}</dt>
                    <dd className="meta-val m-0">{t.supportPeriod}</dd>
                  </div>
                </dl>
                <ul className="ticks">
                  {g.featureRows.map((row) => {
                    const v = t.features[row.key];
                    return (
                      <li key={row.key} className={v === false ? "text-muted-foreground" : undefined}>
                        {v === false ? (
                          <span className="inline-block w-4 shrink-0 text-center" aria-hidden="true">
                            –
                          </span>
                        ) : (
                          <Icon name="check" />
                        )}
                        <span>
                          {v === false && <span className="sr-only">{`${copy.notIncluded}: `}</span>}
                          {row.label}
                          {typeof v === "string" && <span className="text-muted-foreground">{`: ${v}`}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  className={t.highlighted ? "btn btn-primary" : "btn btn-outline"}
                  href={`/contact?service=${g.service}&package=${g.id}-${t.id}`}
                  aria-label={`${t.cta.label}: ${g.label} ${t.name}`}
                >
                  {t.cta.label}
                </Link>
              </article>
            ))}
          </div>

          <details className="faq-item mt-6">
            <summary>
              {copy.compare}
              <span className="pm" aria-hidden="true" />
            </summary>
            <div className="compare mt-2">
              <div
                className="compare-scroll"
                tabIndex={0}
                role="region"
                aria-label={fill(copy.compareCaption, { label: g.label })}
              >
                <table>
                  <caption className="sr-only">{fill(copy.compareCaption, { label: g.label })}</caption>
                  <thead>
                    <tr>
                      <td className="bg-[var(--muted-2)]" />
                      {g.tiers.map((t) => (
                        <th key={t.id} scope="col">
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">{copy.fromLabel}</th>
                      {g.tiers.map((t) => (
                        <td key={t.id} className="tabular-nums">
                          {t.priceFrom > 0 ? formatGBP(t.priceFrom) : copy.customQuote}
                        </td>
                      ))}
                    </tr>
                    {g.featureRows.map((row) => (
                      <tr key={row.key}>
                        <th scope="row">
                          {row.label}
                          {row.tooltip && (
                            <small className="block font-normal text-muted-foreground">{row.tooltip}</small>
                          )}
                        </th>
                        {g.tiers.map((t) => (
                          <td key={t.id}>
                            <FeatureValue value={t.features[row.key]} copy={copy} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row">{copy.delivery}</th>
                      {g.tiers.map((t) => (
                        <td key={t.id}>{t.deliveryTime}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row">{copy.support}</th>
                      {g.tiers.map((t) => (
                        <td key={t.id}>{t.supportPeriod}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
