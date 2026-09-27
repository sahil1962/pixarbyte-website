import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { EstimateDialog } from "@/components/layout/EstimateDialog";
import { GlowTracker } from "@/components/layout/GlowTracker";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SiteProvider } from "@/components/layout/SiteProvider";
import { Toaster } from "@/components/layout/Toaster";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { IconSprite } from "@/components/shared/Icon";
import { JsonLd } from "@/components/shared/JsonLd";
import {
  getCommandMenu,
  getEstimator,
  getFooter,
  getHeader,
  getHero,
  getMessages,
  getMobileMenu,
  getServices,
  getSiteConfig,
} from "@/lib/content";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: { type: "website", siteName: site.name, locale: site.locale },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// Resolve the theme before first paint so `dark:` utilities and the canvases never flash.
const themeInit = `(function(){try{var d=document.documentElement;if(!d.dataset.theme)d.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){}})()`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, header, mobileMenu, footer, hero, estimator, commandMenu, messages, services] = await Promise.all([
    getSiteConfig(),
    getHeader(),
    getMobileMenu(),
    getFooter(),
    getHero(),
    getEstimator(),
    getCommandMenu(),
    getMessages(),
    getServices(),
  ]);
  const serviceLinks = services.map((s) => ({ label: s.navLabel, href: `/services/${s.slug}` }));

  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <IconSprite />
        <SiteProvider messages={messages} defaultAudience={hero.defaultAudience}>
          <a href="#main" className="btn btn-primary skip-link">
            {site.skipLink}
          </a>
          <Header content={header} site={site} services={serviceLinks} />
          <main id="main">{children}</main>
          <Footer content={footer} site={site} />
          <MobileMenu content={mobileMenu} site={site} />
          <EstimateDialog content={estimator.content} model={estimator.model} projects={estimator.projects} />
          <CommandMenu content={commandMenu} />
          <Toaster />
          <GlowTracker />
        </SiteProvider>
        <JsonLd data={organizationSchema(site)} />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
