"use client";

import Link from "next/link";
import type { MobileMenuContent, SiteConfig } from "@/types/content";
import { Brand } from "@/components/shared/Brand";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { useModalDialog } from "@/lib/hooks";

/** Slide-over menu for narrow screens (opened from the header's menu button). */
export function MobileMenu({ content, site }: { content: MobileMenuContent; site: SiteConfig }) {
  const { menuOpen, closeMenu, openEstimate, book } = useSite();
  const dialog = useModalDialog(menuOpen);
  // Close synchronously so the anchor's scroll happens with the modal already gone.
  const close = () => dialog.current?.close();

  return (
    <dialog
      id="menu"
      aria-label={content.ariaLabel}
      ref={dialog}
      onClose={closeMenu}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeMenu();
      }}
    >
      <div className="menu-top">
        <Brand wordmark={site.wordmark} ariaLabel={site.brandAriaLabel} href="/" onClick={close} />
        <button className="btn btn-ghost btn-icon" type="button" aria-label={content.closeAriaLabel} onClick={close}>
          <Icon name="x" />
        </button>
      </div>
      <nav className="menu-links" aria-label={content.navLabel}>
        {content.links.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="menu-foot">
        <button className="btn btn-primary btn-lg" type="button" onClick={() => openEstimate()}>
          {content.primaryCta}
        </button>
        <button className="btn btn-outline btn-lg" type="button" onClick={book}>
          {content.secondaryCta}
        </button>
      </div>
    </dialog>
  );
}
