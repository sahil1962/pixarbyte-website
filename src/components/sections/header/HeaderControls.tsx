"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { HeaderContent, Link } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { useIsMac } from "@/lib/platform";

export interface ServicesMenu {
  allLabel: string;
  items: Link[];
}

/**
 * Header links. On the home page, the link for the section in the middle of the viewport is
 * marked current (scrollspy); elsewhere the link for the current page is. "Services" opens a
 * menu of every service on hover or keyboard focus; Escape closes it.
 */
export function NavLinks({ links, label, servicesMenu }: { links: Link[]; label: string; servicesMenu: ServicesMenu }) {
  const pathname = usePathname();
  const [current, setCurrent] = useState<string | null>(null);
  const [menuClosed, setMenuClosed] = useState(false);
  const servicesLink = useRef<HTMLAnchorElement>(null);
  const onHome = pathname === "/";

  useEffect(() => {
    if (!onHome || !("IntersectionObserver" in window)) return;
    const opts = { rootMargin: "-45% 0px -50% 0px" };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setCurrent(e.target.id);
      });
    }, opts);
    links.forEach((l) => {
      const id = l.href.split("#")[1];
      const t = id ? document.getElementById(id) : null;
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
      setCurrent(null);
    };
  }, [links, onHome]);

  function isCurrent(href: string) {
    const [path, id] = href.split("#");
    if (id) return onHome && current === id;
    return path !== "/" && (pathname === path || pathname.startsWith(`${path}/`));
  }

  return (
    <nav className="nav-links" aria-label={label}>
      {links.map((l) =>
        l.href === "/services" ? (
          <div
            key={l.href}
            className={menuClosed ? "nav-item closed" : "nav-item"}
            onMouseLeave={() => setMenuClosed(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenuClosed(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setMenuClosed(true);
                servicesLink.current?.focus();
              }
            }}
          >
            <NextLink ref={servicesLink} href={l.href} aria-current={isCurrent(l.href) ? "true" : undefined}>
              {l.label}
            </NextLink>
            <div className="hovercard nav-drop">
              <NextLink href={l.href} onClick={() => setMenuClosed(true)}>
                {servicesMenu.allLabel}
              </NextLink>
              {servicesMenu.items.map((item) => (
                <NextLink
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "true" : undefined}
                  onClick={() => setMenuClosed(true)}
                >
                  {item.label}
                </NextLink>
              ))}
            </div>
          </div>
        ) : (
          <NextLink key={l.href} href={l.href} aria-current={isCurrent(l.href) ? "true" : undefined}>
            {l.label}
          </NextLink>
        ),
      )}
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
