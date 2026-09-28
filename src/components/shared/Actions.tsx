"use client";

import { useEffect, type ReactNode } from "react";
import type { ProjectType } from "@/types/content";
import { useSite } from "@/components/layout/SiteProvider";

/**
 * Small interactive leaves used inside server-rendered sections, so the sections
 * themselves can stay Server Components.
 */

/** Opens the quick estimate. Without `type`, it prices whatever the hero builder is showing. */
export function EstimateButton({
  type,
  className,
  children,
  id,
}: {
  type?: ProjectType;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const { openEstimate } = useSite();
  return (
    <button type="button" id={id} className={className} onClick={() => openEstimate(type)}>
      {children}
    </button>
  );
}

/** "Book a call": opens Calendly (NEXT_PUBLIC_CALENDLY_URL) or the "coming soon" booking dialog. */
export function BookCallButton({ className, children }: { className?: string; children: ReactNode }) {
  const { book } = useSite();
  return (
    <button type="button" className={className} onClick={book}>
      {children}
    </button>
  );
}

/** A link rendered as `<a href="#">` whose action is a toast (a page that doesn't exist yet) or booking. */
export function ActionLink({
  action,
  className,
  ariaLabel,
  children,
}: {
  action: "demo" | "book";
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const { demo, book } = useSite();
  return (
    <a
      href="#"
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        if (action === "demo") demo();
        else book();
      }}
    >
      {children}
    </a>
  );
}

/** Sets which project type the estimate dialog opens on for this page. Renders nothing. */
export function PageEstimateType({ type }: { type: ProjectType }) {
  const { setPageEstimateType } = useSite();
  useEffect(() => {
    setPageEstimateType(type);
    return () => setPageEstimateType(null);
  }, [type, setPageEstimateType]);
  return null;
}
