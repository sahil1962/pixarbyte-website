"use client";

import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
}

/**
 * The design's segmented radio group (`.seg`). Arrow Left/Right move focus and select,
 * like the original's shared radiogroup keyboard handler.
 */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  className,
  ariaLabel,
  ariaLabelledBy,
  id,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange(value: T): void;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  id?: string;
}) {
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[n].focus();
    buttons[n].click();
  }

  return (
    <div
      className={cn("seg", className)}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
      onKeyDown={onKeyDown}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
