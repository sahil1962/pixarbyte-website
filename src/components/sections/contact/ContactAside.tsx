import type { ReactNode } from "react";
import type { ContactPageContent } from "@/data/contact";
import type { IconName, SiteConfig } from "@/types/content";
import { BookCallButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { isConfigured } from "@/lib/env";

type Copy = ContactPageContent["aside"];

function Row({
  icon,
  label,
  children,
  detail,
}: {
  icon: IconName;
  label: string;
  children: ReactNode;
  detail?: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">
        <Icon name={icon} />
      </span>
      <div className="min-w-0">
        <span className="meta-label block">{label}</span>
        <span className="block break-words">{children}</span>
        {detail && <small className="block text-[13px] text-muted-foreground">{detail}</small>}
      </div>
    </li>
  );
}

/** Other ways to get in touch, and what to expect after sending the form. */
export function ContactAside({ copy, site }: { copy: Copy; site: SiteConfig }) {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const waDigits = isConfigured(whatsapp) ? whatsapp.replace(/\D/g, "") : "";

  return (
    <aside className="grid gap-4 lg:sticky lg:top-24" aria-labelledby="contact-aside-title">
      <div className="aud-card p-6">
        <h2 id="contact-aside-title" className="m-0 text-[17px] font-semibold tracking-[-0.02em]">
          {copy.title}
        </h2>
        <ul className="m-0 mt-5 grid list-none gap-4 p-0 text-[15px]">
          <Row icon="mail" label={copy.email.label} detail={copy.email.detail}>
            <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </Row>
          <Row icon="phone" label={copy.phone.label} detail={copy.phone.detail}>
            <a className="underline-offset-4 hover:underline" href={site.phone.href}>
              {site.phone.display}
            </a>
          </Row>
          {waDigits && (
            <Row icon="hand" label={copy.whatsapp.label}>
              <a
                className="underline-offset-4 hover:underline"
                href={`https://wa.me/${waDigits}?text=${encodeURIComponent(copy.whatsapp.text)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.whatsapp.value}
              </a>
            </Row>
          )}
          <Row icon="cal" label={copy.book.label}>
            <BookCallButton className="link-btn p-0">{copy.book.value}</BookCallButton>
          </Row>
          <Row icon="pin" label={copy.office.label} detail={copy.office.detail}>
            {site.location}
          </Row>
        </ul>
      </div>
      <div className="aud-card p-6">
        <h2 className="m-0 text-[17px] font-semibold tracking-[-0.02em]">{copy.reassuranceTitle}</h2>
        <ul className="ticks mb-0">
          {copy.reassurance.map((r) => (
            <li key={r}>
              <Icon name="check" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
