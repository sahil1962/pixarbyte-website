import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/sections/Cta";
import {
  CertificationsSection,
  CultureGallery,
  FounderMessage,
  MilestonesTimeline,
  MissionVision,
  StorySection,
  TeamSection,
  ValuesGrid,
  WhyWorkWithUs,
} from "@/components/sections/about/AboutSections";
import { StatGrid } from "@/components/sections/why/StatGrid";
import { BookCallButton } from "@/components/shared/Actions";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageSection } from "@/components/shared/PageSection";
import { getAbout, getCertifications, getFinalCta, getSiteConfig, getTeam, getWhyUs } from "@/lib/content";
import { aboutPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [about, site] = await Promise.all([getAbout(), getSiteConfig()]);
  return buildMetadata({ title: about.seo.title, description: about.seo.description, path: "/about", site });
}

export default async function AboutPage() {
  const [site, about, team, certs, why, cta] = await Promise.all([
    getSiteConfig(),
    getAbout(),
    getTeam(),
    getCertifications(),
    getWhyUs(),
    getFinalCta(),
  ]);

  // Sections alternate between plain and tinted bands; optional ones drop out cleanly.
  const sections = [
    { id: "story", ...about.story, body: <StorySection story={about.story} /> },
    {
      id: "milestones",
      ...about.milestones,
      body: <MilestonesTimeline items={about.milestones.items} label={about.milestones.label} />,
    },
    { id: "mission", ...about.missionVision, body: <MissionVision copy={about.missionVision} /> },
    { id: "values", ...about.values, body: <ValuesGrid items={about.values.items} /> },
    {
      id: "team",
      ...about.team,
      body: <TeamSection leaders={team.leaders} members={team.members} copy={about.team} />,
    },
    {
      id: "founder",
      title: about.founderMessage.title,
      intro: "",
      body: <FounderMessage copy={about.founderMessage} />,
    },
    { id: "why", ...about.whyWorkWithUs, body: <WhyWorkWithUs items={about.whyWorkWithUs.items} /> },
    {
      id: "numbers",
      ...about.stats,
      body: <StatGrid stats={why.stats} id="about-stats" className="lg:grid-cols-4" />,
    },
    ...(certs.length
      ? [
          {
            id: "certifications",
            ...about.certifications,
            body: <CertificationsSection items={certs} copy={about.certifications} />,
          },
        ]
      : []),
    ...(about.culture.photos.length
      ? [{ id: "culture", ...about.culture, body: <CultureGallery photos={about.culture.photos} /> }]
      : []),
  ];

  return (
    <>
      <PageHero
        title={about.hero.title}
        intro={about.hero.intro}
        crumbs={[{ label: about.breadcrumbHome, href: "/" }, { label: about.breadcrumbAbout }]}
        crumbsLabel={about.breadcrumbLabel}
        site={site}
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/contact">
              {about.hero.primary}
            </Link>
            <BookCallButton className="btn btn-outline btn-lg">{about.hero.secondary}</BookCallButton>
          </>
        }
      />

      {sections.map((s, i) => (
        <PageSection key={s.id} id={s.id} title={s.title} intro={s.intro} tint={i % 2 === 0}>
          {s.body}
        </PageSection>
      ))}

      <Cta content={{ ...cta, title: about.cta.title, text: about.cta.text }} />

      <JsonLd data={aboutPageSchema(site, team.leaders, team.all.length, about.foundingDate)} />
    </>
  );
}
