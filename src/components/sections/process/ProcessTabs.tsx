"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ProcessSectionContent, ProcessStep } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { prefersReducedMotion, useOnView } from "@/lib/hooks";

/** The five project steps. Advances on its own while visible until the visitor picks a step. */
export function ProcessTabs({ section, steps }: { section: ProcessSectionContent; steps: ProcessStep[] }) {
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(0);
  const [out, setOut] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const auto = useRef(true);
  const autoTimer = useRef<number | undefined>(undefined);
  const swapTimer = useRef<number | undefined>(undefined);

  function setStep(i: number) {
    setSelected(i);
    const btn = strip.current?.querySelector<HTMLElement>(`#ps-${i}`);
    if (btn)
      strip.current?.scrollTo({ left: btn.offsetLeft - 24, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setOut(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(
      () => {
        setShown(i);
        setOut(false);
      },
      prefersReducedMotion() ? 0 : 180,
    );
  }

  const latest = useRef({ selected, setStep });
  useEffect(() => {
    latest.current = { selected, setStep };
  });

  useEffect(() => {
    auto.current = !prefersReducedMotion();
    return () => {
      clearInterval(autoTimer.current);
      clearTimeout(swapTimer.current);
    };
  }, []);

  // Observe the whole section, as the design does.
  const sectionRef = useRef<Element | null>(null);
  useEffect(() => {
    sectionRef.current = strip.current?.closest("section") ?? null;
  }, []);
  useOnView(sectionRef, (visible) => {
    clearInterval(autoTimer.current);
    if (visible && auto.current) {
      autoTimer.current = window.setInterval(() => {
        if (auto.current) latest.current.setStep((latest.current.selected + 1) % steps.length);
      }, 4500);
    }
  });

  function pick(i: number) {
    auto.current = false;
    clearInterval(autoTimer.current);
    setStep(i);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (n === null) return;
    e.preventDefault();
    const next = (n + steps.length) % steps.length;
    pick(next);
    strip.current?.querySelector<HTMLElement>(`#ps-${next}`)?.focus();
  }

  const step = steps[shown];

  return (
    <>
      <div className="proc-steps" role="tablist" aria-label={section.tablistLabel} id="proc-steps" ref={strip}>
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            className={i < selected ? "proc-step done" : "proc-step"}
            role="tab"
            id={`ps-${i}`}
            aria-controls="proc-panel"
            aria-selected={i === selected}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => pick(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="proc-num">{i + 1}</span>
            <strong>{s.title}</strong>
            <small>{s.time}</small>
          </button>
        ))}
      </div>
      <div className="proc-track" aria-hidden="true">
        <i id="proc-fill" style={{ width: `${((selected + 1) / steps.length) * 100}%` }} />
      </div>
      <div
        className={out ? "proc-panel out" : "proc-panel"}
        id="proc-panel"
        role="tabpanel"
        aria-live="polite"
        aria-labelledby={`ps-${selected}`}
      >
        <div className="proc-card">
          <h3 id="pp-title">{step.title}</h3>
          <p id="pp-text">{step.text}</p>
          <div className="proc-kv">
            <div>
              <small>{section.lengthLabel}</small>
              <strong id="pp-time">{step.time}</strong>
            </div>
            <div>
              <small>{section.yourTimeLabel}</small>
              <strong id="pp-you">{step.you}</strong>
            </div>
          </div>
        </div>
        <div className="proc-card">
          <h4>{section.getsTitle}</h4>
          <ul className="ticks" id="pp-gets">
            {step.gets.map((g) => (
              <li key={g}>
                <Icon name="check" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
