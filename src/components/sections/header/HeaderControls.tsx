"use client";

import { useEffect, useState } from "react";
import type { HeaderContent, Link } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { useIsMac } from "@/lib/platform";

/** Section links with scrollspy: the link for the section in the middle of the viewport is marked current. */
export function NavLinks({ links, label }: { links: Link[]; label: string }) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const opts = { rootMargin: "-45% 0px -50% 0px" };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setCurrent(`#${e.target.id}`);
      });
    }, opts);
    links.forEach((l) => {
      const t = document.querySelector(l.href);
      if (t) spy.observe(t);
    });
    const hero = document.getElementById("hero");
    const top = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setCurrent(null);
    }, opts);
    if (hero) top.observe(hero);
    return () => {
      spy.disconnect();
      top.disconnect();
    };
  }, [links]);

  return (
    <nav className="nav-links" aria-label={label}>
      {links.map((l) => (
        <a key={l.href} href={l.href} aria-current={current === l.href ? "true" : undefined}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}

export function SearchButton({ search }: { search: HeaderContent["search"] }) {
  const { openCommand } = useSite();
  const isMac = useIsMac();
  return (
    <button className="search" id="open-cmd" type="button" aria-label={search.ariaLabel} onClick={openCommand}>
      <Icon name="search" />
      <span>{search.label}</span>
      <span className="kbd" id="kbd-hint">
        {isMac ? search.shortcut.mac : search.shortcut.other}
      </span>
    </button>
  );
}

export function ThemeButton({ ariaLabel }: { ariaLabel: string }) {
  const { toggleTheme } = useSite();
  return (
    <button
      className="btn btn-ghost btn-icon theme-btn"
      id="theme"
      type="button"
      aria-label={ariaLabel}
      onClick={toggleTheme}
    >
      <Icon name="moon" className="moon" />
      <Icon name="sun" className="sun" />
    </button>
  );
}

export function MenuButton({ ariaLabel }: { ariaLabel: string }) {
  const { openMenu } = useSite();
  return (
    <button
      className="btn btn-ghost btn-icon menu-btn"
      id="open-menu"
      type="button"
      aria-label={ariaLabel}
      onClick={openMenu}
    >
      <Icon name="menu" />
    </button>
  );
}
