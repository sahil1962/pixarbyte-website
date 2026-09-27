import type { FAQ, FaqSectionContent, SiteConfig } from "@/types/content";
import { BrandMark } from "@/components/shared/Brand";
import { SectionHead } from "@/components/shared/SectionHead";
import { FaqItem } from "./faq/FaqItem";

/** "Questions, answered": sticky intro and contact card beside the question list. */
export function Faq({ section, faqs, site }: { section: FaqSectionContent; faqs: FAQ[]; site: SiteConfig }) {
  return (
    <section className="section tint" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="faq-side">
          <SectionHead id="faq-title" title={section.title} intro={section.intro} />
          <div className="faq-contact">
            <BrandMark style={{ width: 34, height: 34, borderRadius: 9, flex: "none" }} />
            <p>
              {site.email}
              <small>{`${section.phonePrefix} ${site.phone.display}`}</small>
            </p>
          </div>
        </div>
        <div className="faq-list" id="faq-list">
          {faqs.map((f) => (
            <FaqItem key={f.question} faq={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
