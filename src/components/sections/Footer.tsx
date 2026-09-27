import Link from "next/link";
import type { FooterContent, FooterLink, SiteConfig } from "@/types/content";
import { ActionLink } from "@/components/shared/Actions";
import { Brand } from "@/components/shared/Brand";
import { NewsletterForm } from "./footer/NewsletterForm";

function FooterAnchor({ link }: { link: FooterLink }) {
  if ("action" in link) return <ActionLink action={link.action}>{link.label}</ActionLink>;
  if (link.href.startsWith("/")) return <Link href={link.href}>{link.label}</Link>;
  return <a href={link.href}>{link.label}</a>;
}

/** "© {year} …" with the year in its own span, as in the design. */
function LegalLine({ template }: { template: string }) {
  const [before, after = ""] = template.split("{year}");
  return (
    <span>
      {before}
      <span id="year">{new Date().getFullYear()}</span>
      {after}
    </span>
  );
}

export function Footer({ content, site }: { content: FooterContent; site: SiteConfig }) {
  return (
    <footer className="site-foot">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <Brand name={site.name} ariaLabel={site.brandAriaLabel} href="/" />
            <p>{content.blurb}</p>
            <NewsletterForm content={content.newsletter} />
            <div className="socials">
              {content.socials.map((s) =>
                s.href ? (
                  <a key={s.label} href={s.href} aria-label={s.ariaLabel}>
                    {s.label}
                  </a>
                ) : (
                  <ActionLink key={s.label} action="demo" ariaLabel={s.ariaLabel}>
                    {s.label}
                  </ActionLink>
                ),
              )}
            </div>
          </div>
          {content.columns.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterAnchor link={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          <LegalLine template={content.legal} />
          <nav aria-label={content.legalNavLabel}>
            {content.legalLinks.map((l) => (
              <FooterAnchor key={l.label} link={l} />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
