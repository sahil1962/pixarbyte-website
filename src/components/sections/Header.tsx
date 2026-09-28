import type { HeaderContent, Link, SiteConfig } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { Brand } from "@/components/shared/Brand";
import { MenuButton, NavLinks, SearchButton, ThemeButton } from "./header/HeaderControls";

export function Header({ content, site, services }: { content: HeaderContent; site: SiteConfig; services: Link[] }) {
  return (
    <header className="nav" id="top">
      <div className="nav-inner">
        <Brand name={site.name} ariaLabel={site.brandAriaLabel} href="/" />
        <NavLinks
          links={content.nav}
          label={content.navLabel}
          servicesMenu={{ allLabel: content.allServicesLabel, items: services }}
        />
        <div className="nav-actions">
          <SearchButton search={content.search} />
          <ThemeButton ariaLabel={content.themeAriaLabel} />
          <EstimateButton className="btn btn-primary">{content.primaryCta}</EstimateButton>
          <MenuButton ariaLabel={content.menuAriaLabel} />
        </div>
      </div>
    </header>
  );
}
