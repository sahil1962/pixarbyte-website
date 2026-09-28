import type { SectionCopy } from "./content";

export interface Milestone {
  /** A year such as "2025", or "Today". */
  year: string;
  title: string;
  description?: string;
}

export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** 800×1000 for leaders, 800×800 for members, same background and crop for everyone. */
  photo: string;
  /** One line. */
  bio: string;
  leadership: boolean;
  order: number;
  socials?: { linkedin?: string; github?: string; x?: string };
}

export interface Certification {
  name: string;
  issuer: string;
  detail?: string;
  /** Verification link. */
  url?: string;
  type: "certification" | "platform" | "partner" | "registration" | "award";
}

export interface AboutContent {
  seo: { title: string; description: string };
  breadcrumbLabel: string;
  breadcrumbHome: string;
  breadcrumbAbout: string;
  hero: { title: string; intro: string; primary: string; secondary: string };
  story: SectionCopy & { paragraphs: string[]; quote: { text: string; cite: string } };
  milestones: SectionCopy & { label: string; items: Milestone[] };
  missionVision: {
    title: string;
    intro: string;
    mission: string;
    vision: string;
    missionLabel: string;
    visionLabel: string;
  };
  values: SectionCopy & { items: Value[] };
  team: SectionCopy & {
    leadersLabel: string;
    membersLabel: string;
    smallTeamNote: string;
    photoAlt: string;
    socialLabels: { linkedin: string; github: string; x: string };
  };
  founderMessage: {
    title: string;
    name: string;
    role: string;
    photo: string;
    message: string[];
  };
  whyWorkWithUs: SectionCopy & { items: string[] };
  stats: SectionCopy;
  certifications: SectionCopy & { groupLabels: Record<Certification["type"], string>; verify: string };
  culture: SectionCopy & { photos: { src: string; alt: string; width: number; height: number }[] };
  cta: { title: string; text: string };
  /** Year the company was founded, for structured data. */
  foundingDate: string;
}
