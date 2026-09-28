import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudy } from "@/types/content";
import { StatGrid } from "@/components/sections/why/StatGrid";
import { resultToStat } from "@/lib/portfolio";

/** Hero right-hand column: the project's cover image. */
export function CoverImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-card">
      <Image src={src} alt={alt} fill preload sizes="(min-width: 1100px) 520px, (min-width: 860px) 45vw, 100vw" />
    </div>
  );
}

/** Key facts as a definition list, sticky beside the story on large screens. */
export function QuickFacts({ title, facts }: { title: string; facts: { label: string; value: ReactNode }[] }) {
  return (
    <aside className="aud-card p-6 lg:sticky lg:top-28" aria-labelledby="facts-title">
      <h2 id="facts-title" className="mt-0 mb-5 text-lg font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      <dl className="m-0 grid gap-4">
        {facts.map((f) => (
          <div key={f.label} className="grid gap-1 border-t border-border pt-4 first:border-t-0 first:pt-0">
            <dt className="meta-label mb-0">{f.label}</dt>
            <dd className="meta-val m-0">{f.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

/** Headline results. Numbers count up like the home stats; anything else is shown as written. */
export function ResultsStats({ results }: { results: { value: string; label: string }[] }) {
  const stats = results.map((r) => resultToStat(r.value, r.label));
  const grid = "max-[479px]:grid-cols-1 md:grid-cols-3";
  if (stats.every((s) => s !== null)) return <StatGrid stats={stats} id="results-stats" className={grid} />;
  return (
    <div className={`stat-grid ${grid}`}>
      {results.map((r) => (
        <div className="stat" key={r.label}>
          <strong>{r.value}</strong>
          <span>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Previous and next case studies, as a pair of compact link cards. */
export function ProjectPagination({
  prev,
  next,
  copy,
}: {
  prev: CaseStudy | null;
  next: CaseStudy | null;
  copy: { label: string; prev: string; next: string };
}) {
  if (!prev && !next) return null;
  const item = (p: CaseStudy, label: string, rel: "prev" | "next") => (
    <Link
      href={p.href}
      rel={rel}
      className={`aud-card gap-1 p-5 no-underline hover:border-ring ${rel === "next" ? "md:col-start-2 md:text-right" : ""}`}
    >
      <span className="meta-label mb-0">
        {rel === "prev" && <span aria-hidden="true">{"← "}</span>}
        {label}
        {rel === "next" && <span aria-hidden="true">{" →"}</span>}
      </span>
      <span className="font-medium">{`${p.client}: ${p.title}`}</span>
    </Link>
  );
  return (
    <nav aria-label={copy.label} className="grid gap-4 md:grid-cols-2">
      {prev && item(prev, copy.prev, "prev")}
      {next && item(next, copy.next, "next")}
    </nav>
  );
}
