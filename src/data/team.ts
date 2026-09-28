import type { TeamMember } from "@/types/about";

/*
 * PLACEHOLDERS: every name in [square brackets] and the shared placeholder photo must be
 * replaced before launch (`npm run check:placeholders` lists them). Get written consent
 * from each person before publishing their photo.
 */
const photo = "/images/team/placeholder-portrait.svg";

export const team: TeamMember[] = [
  {
    slug: "founder",
    name: "[Founder name]",
    role: "Founder and Managing Director",
    photo,
    bio: "Leads every client relationship and still reviews the code.",
    leadership: true,
    order: 1,
    socials: {},
  },
  {
    slug: "technical-director",
    name: "[Co-founder name]",
    role: "Co-founder and Technical Director",
    photo,
    bio: "Sets our engineering standards and architects the bigger builds.",
    leadership: true,
    order: 2,
    socials: {},
  },
  {
    slug: "full-stack-developer",
    name: "[Team member name]",
    role: "Senior Full-stack Developer",
    photo,
    bio: "Next.js, Node.js and PostgreSQL, from first commit to launch.",
    leadership: false,
    order: 3,
  },
  {
    slug: "product-designer",
    name: "[Team member name]",
    role: "Product Designer",
    photo,
    bio: "Turns rough ideas into clear, accessible interfaces.",
    leadership: false,
    order: 4,
  },
  {
    slug: "mobile-developer",
    name: "[Team member name]",
    role: "Mobile Developer",
    photo,
    bio: "Builds iOS and Android apps in Flutter and React Native.",
    leadership: false,
    order: 5,
  },
  {
    slug: "cloud-engineer",
    name: "[Team member name]",
    role: "Cloud and DevOps Engineer",
    photo,
    bio: "Keeps client platforms fast, secure and online on AWS London.",
    leadership: false,
    order: 6,
  },
];
