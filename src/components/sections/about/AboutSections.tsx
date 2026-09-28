import Image from "next/image";
import type { AboutContent, Certification, Milestone, TeamMember, Value } from "@/types/about";
import { Icon } from "@/components/shared/Icon";
import { fill } from "@/lib/format";
import { ContentIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Story paragraphs beside a pull quote. */
export function StorySection({ story }: { story: AboutContent["story"] }) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="max-w-[680px]">
        {story.paragraphs.map((p) => (
          <p key={p.slice(0, 32)} className="mt-0 mb-5 text-[17px] leading-[1.7] text-muted-foreground">
            {p}
          </p>
        ))}
      </div>
      <figure className="review feature m-0">
        <blockquote className="mt-0">{`“${story.quote.text}”`}</blockquote>
        <figcaption className="text-sm opacity-70">{story.quote.cite}</figcaption>
      </figure>
    </div>
  );
}

/**
 * Milestones as an ordered list: a vertical line on phones, a horizontal row that scrolls
 * (and can be scrolled from the keyboard) on larger screens.
 */
export function MilestonesTimeline({ items, label }: { items: Milestone[]; label: string }) {
  return (
    <div className="overflow-x-auto pb-2 md:snap-x md:snap-mandatory" tabIndex={0} role="region" aria-label={label}>
      <ol className="m-0 grid list-none gap-0 border-l border-border p-0 pl-6 md:flex md:gap-4 md:border-l-0 md:pl-0">
        {items.map((m, i) => (
          <li key={`${m.year}-${m.title}`} className="relative pb-8 md:w-[260px] md:shrink-0 md:snap-start md:pb-0">
            <span
              className={cn(
                "absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-background md:static md:mb-4 md:block",
                i === items.length - 1 ? "bg-brand" : "bg-foreground",
              )}
              aria-hidden="true"
            />
            <div className="aud-card h-full p-5">
              <time className="meta-label mb-2 block font-mono">{m.year}</time>
              <h3 className="m-0 text-[17px] font-semibold tracking-[-0.02em]">{m.title}</h3>
              {m.description && <p className="mt-2 mb-0 text-sm text-muted-foreground">{m.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function MissionVision({ copy }: { copy: AboutContent["missionVision"] }) {
  const cards = [
    { icon: "Target", label: copy.missionLabel, text: copy.mission },
    { icon: "Eye", label: copy.visionLabel, text: copy.vision },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((c) => (
        <div key={c.label} className="aud-card">
          <div className="aud-top">
            <span className="for inline-flex items-center gap-2">
              <ContentIcon name={c.icon} className="size-4" />
              {c.label}
            </span>
          </div>
          <p className="m-0 text-[20px] leading-[1.45] tracking-[-0.02em] text-foreground">{c.text}</p>
        </div>
      ))}
    </div>
  );
}

export function ValuesGrid({ items }: { items: Value[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((v) => (
        <div key={v.title} className="proc-card">
          <ContentIcon name={v.icon} className="mb-4 size-6 text-brand" />
          <h3>{v.title}</h3>
          <p>{v.description}</p>
        </div>
      ))}
    </div>
  );
}

function SocialLinks({ m, labels }: { m: TeamMember; labels: AboutContent["team"]["socialLabels"] }) {
  const links = (["linkedin", "github", "x"] as const).filter((k) => m.socials?.[k]);
  if (!links.length) return null;
  return (
    <div className="mt-3 flex justify-center gap-2">
      {links.map((k) => (
        <a
          key={k}
          href={m.socials![k]}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-icon"
          aria-label={fill(labels[k], { name: m.name })}
        >
          <span aria-hidden="true" className="text-xs font-medium">
            {k === "linkedin" ? "in" : k === "github" ? "gh" : "x"}
          </span>
        </a>
      ))}
    </div>
  );
}

function TeamMemberCard({ m, size, copy }: { m: TeamMember; size: "sm" | "lg"; copy: AboutContent["team"] }) {
  return (
    <article className="aud-card items-center p-5 text-center">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-border bg-[var(--muted-2)]",
          size === "lg" ? "aspect-[4/5] max-w-[320px]" : "aspect-square",
        )}
      >
        <Image
          src={m.photo}
          alt={fill(copy.photoAlt, { name: m.name })}
          fill
          sizes={size === "lg" ? "(min-width: 768px) 320px, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className="object-cover"
        />
      </div>
      <h3 className="mt-4 mb-0 text-lg font-semibold tracking-[-0.02em]">{m.name}</h3>
      <p className="mt-1 mb-0 text-sm font-medium text-brand">{m.role}</p>
      <p className="mt-2 mb-0 text-sm text-muted-foreground">{m.bio}</p>
      <SocialLinks m={m} labels={copy.socialLabels} />
    </article>
  );
}

export function TeamSection({
  leaders,
  members,
  copy,
}: {
  leaders: TeamMember[];
  members: TeamMember[];
  copy: AboutContent["team"];
}) {
  return (
    <div className="grid gap-10">
      <div>
        <h3 className="meta-label mb-4 text-sm">{copy.leadersLabel}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {leaders.map((m) => (
            <TeamMemberCard key={m.slug} m={m} size="lg" copy={copy} />
          ))}
        </div>
      </div>
      {members.length > 0 ? (
        <div>
          <h3 className="meta-label mb-4 text-sm">{copy.membersLabel}</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {members.map((m) => (
              <TeamMemberCard key={m.slug} m={m} size="sm" copy={copy} />
            ))}
          </div>
        </div>
      ) : (
        <p className="m-0 text-muted-foreground">{copy.smallTeamNote}</p>
      )}
    </div>
  );
}

export function FounderMessage({ copy }: { copy: AboutContent["founderMessage"] }) {
  return (
    <figure className="review feature m-0 grid items-center gap-8 p-8 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-xl">
        <Image src={copy.photo} alt={`Portrait of ${copy.name}`} fill sizes="220px" className="object-cover" />
      </div>
      <div>
        <blockquote className="m-0 grid gap-4">
          {copy.message.map((p) => (
            <p key={p.slice(0, 32)} className="m-0">
              {p}
            </p>
          ))}
        </blockquote>
        <figcaption className="who mt-6">
          <div>
            <strong>{copy.name}</strong>
            <small>{copy.role}</small>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}

export function WhyWorkWithUs({ items }: { items: string[] }) {
  return (
    <div className="aud-card">
      <ul className="ticks my-0 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i}>
            <Icon name="check" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CertificationsSection({
  items,
  copy,
}: {
  items: Certification[];
  copy: AboutContent["certifications"];
}) {
  const types = [...new Set(items.map((c) => c.type))];
  return (
    <div className="grid gap-8">
      {types.map((type) => (
        <div key={type}>
          <h3 className="meta-label mb-4 text-sm">{copy.groupLabels[type]}</h3>
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
            {items
              .filter((c) => c.type === type)
              .map((c) => (
                <li key={c.name} className="aud-card flex-row items-start gap-4 p-5">
                  <ContentIcon name="BadgeCheck" className="mt-0.5 size-5 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <strong className="block text-[15px] font-semibold">{c.name}</strong>
                    <span className="block text-sm text-muted-foreground">{c.issuer}</span>
                    {c.detail && <span className="mt-1 block text-sm text-muted-foreground">{c.detail}</span>}
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-btn mt-2 inline-block text-sm"
                        aria-label={`${copy.verify}: ${c.name} (opens in a new tab)`}
                      >
                        {copy.verify}
                      </a>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Photos in CSS columns: no JavaScript needed. */
export function CultureGallery({ photos }: { photos: AboutContent["culture"]["photos"] }) {
  return (
    <div className="columns-2 gap-4 md:columns-3">
      {photos.map((p) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          width={p.width}
          height={p.height}
          sizes="(min-width: 768px) 33vw, 50vw"
          className="mb-4 h-auto w-full break-inside-avoid rounded-xl border border-border"
        />
      ))}
    </div>
  );
}
