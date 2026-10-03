import Link from "next/link";
import type { CSSProperties } from "react";

/** The PixarByte "p" mark (public/brand/pixarbyte-mark.svg), cropped tight to the artwork. */
export function BrandMark({
  size = 24,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    // A plain <img>: the mark is a small static SVG, so next/image would add nothing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/pixarbyte-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className ?? "brand-mark"}
      style={style}
      decoding="async"
    />
  );
}

/**
 * The logo lockup: the "p" mark followed by the wordmark ("ixarByte"), so together they read
 * "PixarByte". The mark sits partly below the text baseline like a lowercase p, as in the
 * logo artwork. Screen readers get the full name from `ariaLabel`.
 */
export function Brand({
  wordmark,
  ariaLabel,
  href,
  onClick,
}: {
  wordmark: string;
  ariaLabel: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link className="brand" href={href} aria-label={ariaLabel} onClick={onClick}>
      <BrandMark />
      <span aria-hidden="true">{wordmark}</span>
    </Link>
  );
}
