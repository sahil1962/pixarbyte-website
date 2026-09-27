"use client";

import type { ReactNode } from "react";
import type { Audience } from "@/types/content";
import { useSite } from "@/components/layout/SiteProvider";

/** Card wrapper that follows the hero's audience switch. Content is rendered on the server. */
export function AudienceCardShell({ audience, children }: { audience: Audience; children: ReactNode }) {
  const site = useSite();
  return (
    <div className={site.audience === audience ? "aud-card here" : "aud-card"} data-aud-card={audience}>
      {children}
    </div>
  );
}
