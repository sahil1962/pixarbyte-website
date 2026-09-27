import Link from "next/link";
import type { CSSProperties } from "react";

/** The 2×2 pixel logo mark. */
export function BrandMark({ style }: { style?: CSSProperties }) {
  return (
    <span className="brand-mark" aria-hidden="true" style={style}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Logo mark plus wordmark, linking home. */
export function Brand({ name, ariaLabel, href }: { name: string; ariaLabel: string; href: string }) {
  return (
    <Link className="brand" href={href} aria-label={ariaLabel}>
      <BrandMark />
      {name}
    </Link>
  );
}
