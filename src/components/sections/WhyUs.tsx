import type { Comparison, ComparisonCell, SectionCopy, Stat } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { SectionHead } from "@/components/shared/SectionHead";
import { StatGrid } from "./why/StatGrid";

function Cell({ cell }: { cell: ComparisonCell }) {
  switch (cell.kind) {
    case "yes":
      return (
        <span className="yes">
          <Icon name="check" />
          {cell.text}
        </span>
      );
    case "no":
      return (
        <span className="no">
          <Icon name="x" />
          {cell.text}
        </span>
      );
    case "meh":
      return <span className="meh">{cell.text}</span>;
    case "strong":
      return <strong>{cell.text}</strong>;
  }
}

/** "Senior quality, without the London agency markup": stats plus a comparison table. */
export function WhyUs({ section, stats, comparison }: { section: SectionCopy; stats: Stat[]; comparison: Comparison }) {
  const [us, ...others] = comparison.columns;
  return (
    <section className="section tint" id="why" aria-labelledby="why-title">
      <div className="container">
        <SectionHead id="why-title" title={section.title} intro={section.intro} />
        <div className="why-grid">
          <StatGrid stats={stats} />
          <div className="compare">
            <div className="compare-scroll" tabIndex={0} role="region" aria-label={comparison.caption}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">{comparison.featureLabel}</span>
                    </th>
                    <th scope="col" className="us">
                      {us}
                    </th>
                    {others.map((c) => (
                      <th scope="col" key={c}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.cells.map((cell, i) => (
                        <td key={i} className={i === 0 ? "us" : undefined}>
                          <Cell cell={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
