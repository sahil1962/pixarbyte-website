import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { getNotFound } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false },
  alternates: { canonical: null },
};

/** Friendly 404: what happened, the way home, and the most useful pages. */
export default async function NotFound() {
  const content = await getNotFound();
  return (
    <section className="section" aria-labelledby="nf-title">
      <div className="container grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <span className="badge">{content.eyebrow}</span>
          <h1
            id="nf-title"
            className="mt-4 mb-0 min-h-0 text-[clamp(34px,5vw,56px)] leading-[1.05] font-semibold tracking-[-0.04em]"
          >
            {content.title}
          </h1>
          <p className="mt-4 mb-0 max-w-[36em] text-[17px] text-muted-foreground">{content.text}</p>
          <div className="cta-row">
            <Link className="btn btn-primary btn-lg" href="/">
              {content.cta}
            </Link>
            <Link className="btn btn-outline btn-lg" href="/contact">
              {content.secondary}
            </Link>
          </div>
          <p className="ctrl-note mt-6 mb-0">{content.searchHint}</p>
        </div>
        <nav className="aud-card p-6" aria-labelledby="nf-links">
          <h2 id="nf-links" className="m-0 text-[17px] font-semibold tracking-[-0.02em]">
            {content.linksTitle}
          </h2>
          <ul className="m-0 mt-4 grid list-none gap-2 p-0">
            {content.links.map((l) => (
              <li key={l.href}>
                <Link className="check justify-between" href={l.href}>
                  <span>
                    <strong className="block font-medium">{l.label}</strong>
                    <small className="ml-0 block font-sans text-[13px]">{l.detail}</small>
                  </span>
                  <Icon name="file" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
