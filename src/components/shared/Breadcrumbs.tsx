import { Fragment } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/types/content";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";
import { JsonLd } from "./JsonLd";

/** Visual breadcrumb trail plus BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ crumbs, label, site }: { crumbs: Crumb[]; label: string; site: SiteConfig }) {
  return (
    <>
      <nav aria-label={label}>
        <ol className="aud-label flex flex-wrap items-center gap-1.5">
          {crumbs.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 && (
                <li aria-hidden="true" className="opacity-60">
                  /
                </li>
              )}
              <li>
                {c.href ? (
                  <Link href={c.href} className="hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">
                    {c.label}
                  </span>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(site, crumbs)} />
    </>
  );
}
