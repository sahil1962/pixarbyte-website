import type { Metadata } from "next";
import { Faq } from "@/components/sections/Faq";
import { ContactAside } from "@/components/sections/contact/ContactAside";
import { QuoteForm } from "@/components/sections/contact/QuoteForm";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import { getContactPage, getEstimator, getFaqs, getPackageNames, getSiteConfig } from "@/lib/content";
import { faqSchema, localBusinessSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { storageMode } from "@/lib/storage";

export async function generateMetadata(): Promise<Metadata> {
  const [{ page }, site] = await Promise.all([getContactPage(), getSiteConfig()]);
  return buildMetadata({ title: page.seo.title, description: page.seo.description, path: "/contact", site });
}

export default async function ContactPage() {
  const [site, { page, options, faqs }, estimator, packages, faq] = await Promise.all([
    getSiteConfig(),
    getContactPage(),
    getEstimator(),
    getPackageNames(),
    getFaqs(),
  ]);

  return (
    <>
      <PageHero
        title={page.hero.title}
        intro={page.hero.intro}
        crumbs={[{ label: page.breadcrumbHome, href: "/" }, { label: page.breadcrumbContact }]}
        crumbsLabel={page.breadcrumbLabel}
        site={site}
      />

      <section className="section pt-0" id="quote" aria-labelledby="quote-title">
        <div className="container grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <QuoteForm
            copy={page.form}
            options={options}
            prefill={{ model: estimator.model, packages }}
            uploadMode={storageMode()}
          />
          <ContactAside copy={page.aside} site={site} />
        </div>
      </section>

      <PageSection id="next-steps" title={page.nextSteps.title} intro={page.nextSteps.intro} tint>
        <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-4">
          {page.nextSteps.steps.map((s, i) => (
            <li key={s.title} className="aud-card p-6">
              <span className="meta-label block font-mono">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 mb-0 text-[17px] font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 mb-0 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <Faq
        section={{ ...faq.section, title: page.faq.title, intro: page.faq.intro }}
        faqs={faqs}
        site={site}
        tint={false}
      />

      <JsonLd data={localBusinessSchema(site)} />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
