import type { IconName } from "@/types/content";
import { cn } from "@/lib/utils";

/** An icon from the design's sprite. Rendered once per page by <IconSprite />. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={cn("i", className)}>
      <use href={`#i-${name}`} />
    </svg>
  );
}

/** The design's hand-drawn icon set, kept as a hidden sprite so every use is a tiny <use>. */
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="i-search" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </symbol>
      <symbol id="i-sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </symbol>
      <symbol id="i-moon" viewBox="0 0 24 24">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </symbol>
      <symbol id="i-x" viewBox="0 0 24 24">
        <path d="M18 6 6 18M6 6l12 12" />
      </symbol>
      <symbol id="i-check" viewBox="0 0 24 24">
        <path d="M20 6 9 17l-5-5" />
      </symbol>
      <symbol id="i-lock" viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </symbol>
      <symbol id="i-web" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
      </symbol>
      <symbol id="i-phone" viewBox="0 0 24 24">
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <path d="M11 18h2" />
      </symbol>
      <symbol id="i-grid" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </symbol>
      <symbol id="i-flow" viewBox="0 0 24 24">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M9 6h4a3 3 0 0 1 3 3v6" />
      </symbol>
      <symbol id="i-cloud" viewBox="0 0 24 24">
        <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 12.5 3.5 3.5 0 0 0 6.5 19z" />
      </symbol>
      <symbol id="i-calc" viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h8" />
      </symbol>
      <symbol id="i-cal" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </symbol>
      <symbol id="i-file" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </symbol>
      <symbol id="i-bell" viewBox="0 0 24 24">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
      </symbol>
      <symbol id="i-play" viewBox="0 0 24 24">
        <path d="M6 4l14 8-14 8z" />
      </symbol>
      <symbol id="i-refresh" viewBox="0 0 24 24">
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
        <path d="M21 3v5h-5" />
      </symbol>
      <symbol id="i-zap" viewBox="0 0 24 24">
        <path d="M13 2 3 14h9l-1 8 10-12h-9z" />
      </symbol>
      <symbol id="i-mail" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </symbol>
      <symbol id="i-pin" viewBox="0 0 24 24">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </symbol>
      <symbol id="i-menu" viewBox="0 0 24 24">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </symbol>
      <symbol id="i-hand" viewBox="0 0 24 24">
        <path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" />
      </symbol>
    </svg>
  );
}
