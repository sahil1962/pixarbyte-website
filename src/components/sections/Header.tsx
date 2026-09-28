import type { HeaderContent, SiteConfig } from "@/types/content";
import { EstimateButton } from "@/components/shared/Actions";
import { Brand } from "@/components/shared/Brand";
import { MenuButton, NavLinks, SearchButton, ThemeButton } from "./header/HeaderControls";

export function Header({ content, site }: { content: HeaderContent; site: SiteConfig }) {
  return (
    <header className="nav" id="top">
      <div className="nav-inner">
        <Brand name={site.name} ariaLabel={site.brandAriaLabel} href="#" />
        <NavLinks links={content.nav} label={content.navLabel} />
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
