"use client";

import Link from "next/link";
import type { BookingPlaceholderContent } from "@/data/contact";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { useModalDialog } from "@/lib/hooks";

/** Shown by "Book a call" until NEXT_PUBLIC_CALENDLY_URL is set. */
export function BookingDialog({ content }: { content: BookingPlaceholderContent }) {
  const { bookingOpen, closeBooking } = useSite();
  const dialog = useModalDialog(bookingOpen);

  return (
    <dialog
      id="booking"
      aria-labelledby="booking-title"
      aria-describedby="booking-text"
      ref={dialog}
      onClose={closeBooking}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBooking();
      }}
    >
      <button
        className="btn btn-ghost btn-icon dlg-close"
        type="button"
        aria-label={content.closeAriaLabel}
        onClick={closeBooking}
      >
        <Icon name="x" />
      </button>
      <div className="dlg-head">
        <h2 id="booking-title">{content.title}</h2>
        <p id="booking-text">{content.text}</p>
      </div>
      <div className="dlg-body">
        <div className="grid gap-2.5">
          <a className="check" href={`mailto:${content.email}`}>
            <Icon name="mail" />
            <span>{content.email}</span>
          </a>
          <a className="check" href={content.phone.href}>
            <Icon name="phone" />
            <span>{content.phone.display}</span>
          </a>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link className="btn btn-primary" href="/contact" onClick={closeBooking}>
            {content.contactLink}
          </Link>
          <button className="btn btn-outline" type="button" onClick={closeBooking}>
            {content.close}
          </button>
        </div>
      </div>
    </dialog>
  );
}
