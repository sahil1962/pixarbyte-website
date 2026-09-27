import type { ReactNode } from "react";
import type { SiteConfig } from "@/types/content";
import { HeroStage } from "@/components/sections/hero/HeroStage";
import type { Crumb } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./Breadcrumbs";
import { RevealHeading } from "./RevealHeading";

/**
 * Hero for inner pages, built from the home hero: pixel field, breadcrumbs where the
 * audience switch sits, the revealed H1, lead text and actions. `aside` fills the
 * right-hand column (where the home page has its builder).
 */
export function PageHero({
  title,
  intro,
  crumbs,
  crumbsLabel,
  site,
  actions,
  aside,
}: {
  title: string;
  intro: string;
  crumbs: Crumb[];
  crumbsLabel: string;
  site: SiteConfig;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <HeroStage>
      <div className={cn("hero-inner", !aside && "grid-cols-1")}>
        <div>
          <div className="top-row">
            <Breadcrumbs crumbs={crumbs} label={crumbsLabel} site={site} />
          </div>
          {/* No reserved height: that's only needed on the home hero, where the copy swaps. */}
          <RevealHeading text={title} className="min-h-0" />
          <p className="lead min-h-0">{intro}</p>
          {actions && <div className="cta-row">{actions}</div>}
        </div>
        {aside && (
          <div className="builder-wrap">
            <div className="aurora" aria-hidden="true" />
            {aside}
          </div>
        )}
      </div>
    </HeroStage>
  );
}
