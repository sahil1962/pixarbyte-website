"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { useSite } from "@/components/layout/SiteProvider";

/**
 * The quick estimate and booking dialogs, loaded on first use rather than with every page.
 * Once opened they stay mounted, so reopening is instant and state carries over.
 */
const EstimateDialog = dynamic(() => import("./EstimateDialog").then((m) => m.EstimateDialog), { ssr: false });
const BookingDialog = dynamic(() => import("./BookingDialog").then((m) => m.BookingDialog), { ssr: false });

export function LazyOverlays({
  estimate,
  booking,
}: {
  estimate: ComponentProps<typeof EstimateDialog>;
  booking: ComponentProps<typeof BookingDialog>;
}) {
  const site = useSite();
  return (
    <>
      {site.estimate.session > 0 && <EstimateDialog {...estimate} />}
      {site.bookingUsed && <BookingDialog {...booking} />}
    </>
  );
}
