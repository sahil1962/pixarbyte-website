import type { AudienceSectionContent } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { SectionHead } from "@/components/shared/SectionHead";
import { AudienceCardShell } from "./who/AudienceCardShell";

/** "Two ways to work with us". The card matching the hero's "I'm…" pick is highlighted. */
export function WhoWeHelp({ section }: { section: AudienceSectionContent }) {
  return (
    <section className="section" id="who" aria-labelledby="who-title">
      <div className="container">
        <SectionHead id="who-title" title={section.title} intro={section.intro} />
        <div className="aud-grid">
          {section.cards.map((card) => (
            <AudienceCardShell key={card.id} audience={card.id}>
              <div className="aud-top">
                <span className="for">{card.label}</span>
                <span className="badge here-badge">{section.matchBadge}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <ul className="ticks">
                {card.points.map((p) => (
                  <li key={p}>
                    <Icon name="check" />
                    {p}
                  </li>
                ))}
              </ul>
              <EstimateButton className={`btn btn-${card.cta.variant}`}>{card.cta.label}</EstimateButton>
            </AudienceCardShell>
          ))}
        </div>
      </div>
    </section>
  );
}
