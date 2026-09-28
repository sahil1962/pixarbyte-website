import type { Metadata } from "next";
import Link from "next/link";
import { BookCallButton } from "@/components/shared/Actions";
import { Icon } from "@/components/shared/Icon";
import { getThankYouPage } from "@/lib/content";
import { fill } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getThankYouPage();
  return {
    title: page.seo.title,
    description: page.seo.description,
    robots: { index: false, follow: false },
    alternates: { canonical: "/thank-you" },
  };
}

/** Letters, spaces, apostrophes and hyphens only, and not too long. React escapes it anyway. */
function cleanName(raw: string | string[] | undefined) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return (
    v
      ?.replace(/[^\p{L}\s'-]/gu, "")
      .trim()
      .slice(0, 40) ?? ""
  );
}

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ name?: string | string[] }> }) {
  const [page, { name }] = await Promise.all([getThankYouPage(), searchParams]);
  const first = cleanName(name);

  return (
    <section className="section" aria-labelledby="thanks-title">
      <div className="container">
        <div className="success on mx-auto max-w-[640px] px-0">
          <div className="ic">
            <Icon name="check" />
          </div>
          <h1
            id="thanks-title"
            className="m-0 text-[clamp(28px,4vw,40px)] leading-tight font-semibold tracking-[-0.03em]"
          >
            {fill(page.title, { name: first ? `, ${first}` : "" })}
          </h1>
          <p className="text-[17px]">{page.intro}</p>
          <h2 className="mt-8 mb-0 text-[17px] font-semibold tracking-[-0.02em]">{page.nextTitle}</h2>
          <div className="cta-row mt-4 justify-center">
            <BookCallButton className="btn btn-primary btn-lg">{page.bookCall}</BookCallButton>
            <Link className="btn btn-outline btn-lg" href="/portfolio">
              {page.work}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link className="link-btn" href="/pricing">
              {page.pricing}
            </Link>
            <Link className="link-btn" href="/">
              {page.home}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
