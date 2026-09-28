"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/shared/Icon";
import { useModalDialog } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
  device: "mobile" | "desktop" | "tablet";
}

export interface GalleryCopy {
  open: string;
  dialogLabel: string;
  prev: string;
  next: string;
  close: string;
  counter: string;
}

const ratio = { mobile: "aspect-[39/80]", tablet: "aspect-[3/4]", desktop: "aspect-[8/5]" } as const;

/**
 * Screenshots in a grid; selecting one opens a lightbox. The native modal <dialog> traps
 * focus, closes on Escape and returns focus to the thumbnail. Arrow keys move between images.
 */
export function Gallery({ images, copy }: { images: GalleryImage[]; copy: GalleryCopy }) {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const dialog = useModalDialog(open !== null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (d: number) => {
    const i = (shown + d + images.length) % images.length;
    setShown(i);
    setOpen(i);
  };
  const close = () => {
    setOpen(null);
    triggers.current[shown]?.focus();
  };
  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  }

  const img = images[shown];
  const desktops = images.filter((i) => i.device !== "mobile");
  const phones = images.filter((i) => i.device === "mobile");

  const thumb = (g: GalleryImage) => {
    const i = images.indexOf(g);
    return (
      <li key={g.src} className={cn(g.device === "mobile" ? "w-[calc(50%-8px)] sm:w-[200px]" : "w-full")}>
        <button
          ref={(el) => {
            triggers.current[i] = el;
          }}
          type="button"
          className={cn(
            "group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-ring",
            ratio[g.device],
          )}
          aria-label={copy.open + g.alt}
          onClick={() => {
            setShown(i);
            setOpen(i);
          }}
        >
          <Image
            src={g.src}
            alt=""
            fill
            sizes={g.device === "mobile" ? "200px" : "(min-width: 1100px) 700px, (min-width: 768px) 60vw, 100vw"}
            className="transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        </button>
      </li>
    );
  };

  return (
    <>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        {desktops.length > 0 && <ul className="m-0 grid list-none gap-4 p-0">{desktops.map(thumb)}</ul>}
        {phones.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-4 p-0 lg:max-w-[416px]">{phones.map(thumb)}</ul>
        )}
      </div>

      <dialog
        id="lightbox"
        aria-label={copy.dialogLabel}
        ref={dialog}
        onClose={() => open !== null && close()}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="ctrl-note m-0" aria-live="polite">
            {copy.counter.replace("{index}", String(shown + 1)).replace("{count}", String(images.length))}
            <span className="sr-only">{`: ${img.alt}`}</span>
          </p>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-icon" type="button" aria-label={copy.prev} onClick={() => go(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button className="btn btn-outline btn-icon" type="button" aria-label={copy.next} onClick={() => go(1)}>
              <span aria-hidden="true">→</span>
            </button>
            <button className="btn btn-ghost btn-icon" type="button" aria-label={copy.close} onClick={close}>
              <Icon name="x" />
            </button>
          </div>
        </div>
        <div className="grid place-items-center bg-[var(--muted-2)] p-4">
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={img.device === "mobile" ? 390 : 1600}
            height={img.device === "mobile" ? 800 : 1000}
            sizes="(min-width: 1100px) 1068px, 100vw"
            className={cn(
              "h-auto max-h-[calc(100dvh-160px)] w-auto max-w-full rounded-lg",
              img.device === "mobile" && "max-w-[340px]",
            )}
          />
        </div>
      </dialog>
    </>
  );
}
