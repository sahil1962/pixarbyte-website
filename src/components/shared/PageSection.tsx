import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionHead } from "./SectionHead";

/**
 * A standard page section: `.section` spacing, optional grey tint, container and heading.
 * Pages alternate `tint` so consecutive sections read as separate bands, as on the home page.
 */
export function PageSection({
  id,
  title,
  intro,
  aside,
  tint = false,
  children,
}: {
  id: string;
  title: string;
  intro: string;
  aside?: ReactNode;
  tint?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={cn("section", tint && "tint")} id={id} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHead id={`${id}-title`} title={title} intro={intro} aside={aside} />
        {children}
      </div>
    </section>
  );
}
