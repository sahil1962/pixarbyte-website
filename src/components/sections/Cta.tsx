import type { CtaContent } from "@/types/content";
import { BookCallButton, EstimateButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { CtaField } from "./cta/CtaField";

/** Closing call to action with contact details. */
export function Cta({ content }: { content: CtaContent }) {
  return (
    <section className="section" id="contact" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-final">
          <div className="aur" aria-hidden="true" />
          <CtaField />
          <div className="cta-inner">
            <div>
              <h2 id="cta-title">{content.title}</h2>
              <p>{content.text}</p>
              <div className="cta-actions">
                <EstimateButton className="btn btn-primary btn-lg">{content.primary}</EstimateButton>
                <BookCallButton className="btn btn-outline btn-lg">{content.secondary}</BookCallButton>
              </div>
            </div>
            <div className="cta-contact">
              {content.contacts.map((c) => {
                const inner = (
                  <>
                    <Icon name={c.icon} />
                    <div>
                      {c.title}
                      <small>{c.detail}</small>
                    </div>
                  </>
                );
                return c.href ? (
                  <a key={c.title} href={c.href}>
                    {inner}
                  </a>
                ) : (
                  <div key={c.title}>{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
