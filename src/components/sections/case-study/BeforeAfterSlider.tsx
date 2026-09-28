"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Before/after comparison. The after image is clipped to the handle position; the control
 * is a native range input laid over the images, so it works by touch, mouse and keyboard.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  portrait,
  copy,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  /** Phone screenshots: a narrower, taller frame. */
  portrait: boolean;
  copy: { sliderLabel: string; before: string; after: string };
}) {
  const [pos, setPos] = useState(50);
  const sizes = portrait ? "360px" : "(min-width: 1100px) 1052px, 100vw";

  return (
    <div className={portrait ? "mx-auto max-w-[360px]" : undefined}>
      <div className={`ba ${portrait ? "aspect-[39/80]" : "aspect-[8/5]"}`}>
        <Image src={before} alt={beforeAlt} fill sizes={sizes} />
        <div className="ba-after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <Image src={after} alt={afterAlt} fill sizes={sizes} />
        </div>
        <span className="badge ba-tag left-3" aria-hidden="true">
          {copy.before}
        </span>
        <span className="badge ba-tag right-3" aria-hidden="true">
          {copy.after}
        </span>
        <div className="ba-line" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="ba-knob">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          aria-label={copy.sliderLabel}
          aria-valuetext={`${copy.before} ${pos}%, ${copy.after} ${100 - pos}%`}
          onChange={(e) => setPos(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
