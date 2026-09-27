import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon } from "@/components/shared/Icon";

/*
 * Components available in case study MDX. They map Markdown onto the design's existing
 * type scale and card styles, so long-form stories match the rest of the site.
 * Case study MDX is written by the team only: never render MDX from user input.
 */

function FeatureHighlight({
  title,
  image,
  alt = "",
  children,
}: {
  title: string;
  image?: string;
  alt?: string;
  children: ReactNode;
}) {
  return (
    <div className="aud-card my-8 gap-5 p-6 md:flex-row md:items-center">
      {image && (
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[10px] border border-border bg-[var(--muted-2)] md:w-[46%]">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 330px, (min-width: 768px) 40vw, 100vw"
          />
        </div>
      )}
      <div className="[&_p]:mb-0">
        <h3 className="mt-0 mb-2 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return <aside className="cd-quote my-8 [&_p]:m-0 [&_p]:text-foreground">{children}</aside>;
}

function StatInline({ value, label }: { value: string; label: string }) {
  return (
    <span className="whitespace-nowrap">
      <strong className="font-semibold text-foreground">{value}</strong> {label}
    </span>
  );
}

export const mdxComponents = {
  h2: (p: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-4 text-[26px] leading-tight font-semibold tracking-[-0.03em] first:mt-0" {...p} />
  ),
  h3: (p: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 text-lg font-semibold tracking-[-0.02em]" {...p} />
  ),
  p: (p: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-0 mb-4 text-[17px] leading-[1.7] text-pretty text-muted-foreground" {...p} />
  ),
  ul: (p: ComponentPropsWithoutRef<"ul">) => (
    <ul className="ticks my-6 [&>li]:text-[16px] [&>li]:leading-[1.6]" {...p} />
  ),
  li: ({ children, ...p }: ComponentPropsWithoutRef<"li">) => (
    <li {...p}>
      <Icon name="check" />
      <span>{children}</span>
    </li>
  ),
  a: (p: ComponentPropsWithoutRef<"a">) => (
    <a className="underline decoration-border underline-offset-4 hover:decoration-foreground" {...p} />
  ),
  strong: (p: ComponentPropsWithoutRef<"strong">) => <strong className="font-semibold text-foreground" {...p} />,
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) =>
    typeof src === "string" ? (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1600}
        height={1000}
        className="my-8 h-auto w-full rounded-xl border border-border"
        sizes="(min-width: 1024px) 760px, 100vw"
      />
    ) : null,
  FeatureHighlight,
  Callout,
  StatInline,
};
