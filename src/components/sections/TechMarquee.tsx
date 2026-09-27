import type { Tech, TechSectionContent } from "@/types/content";
import { SectionHead } from "@/components/shared/SectionHead";

function Chips({ list, clone }: { list: Tech[]; clone?: boolean }) {
  return list.map((t) => (
    <span
      key={t.name}
      className="tech-chip"
      aria-hidden={clone ? "true" : undefined}
      data-marquee-clone={clone ? "" : undefined}
    >
      <i style={{ background: t.color }} />
      {t.name}
      <small>{t.category}</small>
    </span>
  ));
}

/**
 * Two rows of technology chips scrolling in opposite directions. Pure CSS: the list is
 * rendered twice for a seamless loop, and the copy is hidden when motion is reduced.
 */
export function TechMarquee({ section, rows }: { section: TechSectionContent; rows: [Tech[], Tech[]] }) {
  return (
    <section className="section" id="tech" aria-labelledby="tech-title">
      <div className="container">
        <SectionHead id="tech-title" title={section.title} intro={section.intro} />
      </div>
      <div className="tech-rows" aria-label={section.ariaLabel}>
        {rows.map((list, i) => (
          <div key={i} className={i === 1 ? "tech-row rev" : "tech-row"}>
            <div className="tech-track" id={i === 0 ? "tech-a" : "tech-b"}>
              <Chips list={list} />
              <Chips list={list} clone />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
