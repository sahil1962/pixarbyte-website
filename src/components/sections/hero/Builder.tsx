"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { BuilderContent, ProjectType } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { prefersReducedMotion } from "@/lib/hooks";
import { CloudScene } from "./scenes/CloudScene";
import { MobileScene } from "./scenes/MobileScene";
import { NocodeScene } from "./scenes/NocodeScene";
import { WebappScene } from "./scenes/WebappScene";
import { WebsiteScene } from "./scenes/WebsiteScene";

/** How long each tab shows before autoplay moves on. */
const DURATION = 7000;

type SceneState = { hidden: boolean; active: boolean };

/** "What are you building?": five live, clickable previews that autoplay until the visitor takes over. */
export function Builder({ content }: { content: BuilderContent }) {
  const site = useSite();
  const keys = content.projects.map((p) => p.key);

  const [current, setCurrent] = useState(0);
  const [scenes, setScenes] = useState<SceneState[]>(() => keys.map((_, i) => ({ hidden: i !== 0, active: i === 0 })));
  const [enterId, setEnterId] = useState(0);
  const [autoplayOff, setAutoplayOff] = useState(false);
  const [meta, setMeta] = useState({ index: 0, out: false });

  const builder = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = useRef<HTMLElement>(null);

  const currentRef = useRef(0);
  const autoplay = useRef(false);
  const paused = useRef(false);
  const startTime = useRef(0);
  const elapsed = useRef(0);
  const raf = useRef(0);
  const metaTimer = useRef<number | undefined>(undefined);

  const moveIndicator = useCallback(() => {
    const tab = tabs.current[currentRef.current];
    const ind = indicator.current;
    if (!tab || !ind) return;
    ind.style.width = `${tab.offsetWidth}px`;
    ind.style.transform = `translateX(${tab.offsetLeft - 3}px)`;
  }, []);

  const select = useCallback(
    (i: number, focus = false) => {
      const n = keys.length;
      const next = (i + n) % n;
      const reduce = prefersReducedMotion();
      currentRef.current = next;
      setCurrent(next);

      // Leaving scenes fade out now and are hidden once the fade ends; the new one is
      // un-hidden first and activated two frames later so its entrance transition runs.
      setScenes((s) => s.map((sc, j) => (j === next ? { ...sc, hidden: false } : { ...sc, active: false })));
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setScenes((s) => s.map((sc, j) => (j === next ? { hidden: false, active: true } : sc)));
          setEnterId((e) => e + 1);
        }),
      );
      setTimeout(
        () =>
          setScenes((s) => s.map((sc, j) => (j !== currentRef.current && !sc.active ? { ...sc, hidden: true } : sc))),
        400,
      );

      const tab = tabs.current[next];
      const bar = strip.current;
      if (tab && bar) {
        const target = tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
        if (focus) tab.focus({ preventScroll: true });
      }

      setMeta((m) => ({ ...m, out: true }));
      clearTimeout(metaTimer.current);
      metaTimer.current = window.setTimeout(() => setMeta({ index: next, out: false }), reduce ? 0 : 160);

      elapsed.current = 0;
      startTime.current = performance.now();
    },
    [keys.length],
  );

  const stopAutoplay = useCallback(() => {
    if (!autoplay.current) return;
    autoplay.current = false;
    cancelAnimationFrame(raf.current);
    setAutoplayOff(true);
  }, []);

  useLayoutEffect(moveIndicator, [current, moveIndicator]);

  useEffect(() => {
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [moveIndicator]);

  // Expose the builder to the command menu and the estimate dialog.
  const { registerBuilder } = site;
  useEffect(() => {
    registerBuilder({
      currentKey: () => keys[currentRef.current],
      stopAutoplay,
      preview(key: ProjectType) {
        stopAutoplay();
        select(keys.indexOf(key));
        builder.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      },
    });
    return () => registerBuilder(null);
  });

  // Start once fonts are ready, like the design, so the tab indicator measures real widths.
  useEffect(() => {
    let cancelled = false;
    function tick(now: number) {
      if (!autoplay.current) return;
      if (!paused.current) {
        const p = (elapsed.current + now - startTime.current) / DURATION;
        if (progress.current) progress.current.style.width = `${Math.min(100, p * 100)}%`;
        if (p >= 1) select(currentRef.current + 1);
      }
      raf.current = requestAnimationFrame(tick);
    }
    function init() {
      if (cancelled) return;
      select(0);
      autoplay.current = !prefersReducedMotion();
      if (autoplay.current) raf.current = requestAnimationFrame(tick);
      else setAutoplayOff(true);
    }
    if (document.fonts?.ready) document.fonts.ready.then(init);
    else init();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
      clearTimeout(metaTimer.current);
    };
  }, [select]);

  function pause() {
    if (!paused.current) {
      paused.current = true;
      elapsed.current += performance.now() - startTime.current;
    }
  }
  function resume() {
    if (paused.current) {
      paused.current = false;
      startTime.current = performance.now();
    }
  }

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    const map: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: keys.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      stopAutoplay();
      select(map[e.key], true);
    }
  }

  const sceneProps = (i: number) => ({
    active: scenes[i].active,
    enterId,
    stopAutoplay,
    isAutoplay: () => autoplay.current,
  });
  const metaProject = content.projects[meta.index];

  return (
    <div
      className="builder"
      id="builder"
      ref={builder}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--bx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--by", `${e.clientY - r.top}px`);
      }}
    >
      <div className="builder-head">
        <div className="builder-title">
          {`${content.title} `}
          <span>{content.subtitle}</span>
        </div>
        <div className="hint" id="builder-hint" aria-hidden="true">
          <span className="kbd">{content.switchKeys[0]}</span>
          <span className="kbd">{content.switchKeys[1]}</span>
          {` ${content.switchHint}`}
        </div>
      </div>

      <div className="tabs-wrap">
        <div className="tabs" role="tablist" aria-label={content.tablistLabel} ref={strip}>
          <span className="tab-ind" aria-hidden="true" ref={indicator} />
          {content.projects.map((p, i) => (
            <button
              key={p.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tab"
              type="button"
              role="tab"
              id={`tab-${p.key}`}
              aria-controls={`scene-${p.key}`}
              aria-selected={i === current}
              tabIndex={i === current ? 0 : -1}
              onClick={() => {
                stopAutoplay();
                if (i !== currentRef.current) select(i);
              }}
              onKeyDown={onTabKey}
            >
              <Icon name={p.icon} />
              {p.label}
            </button>
          ))}
        </div>
        <div className={autoplayOff ? "autoplay off" : "autoplay"} id="autoplay-bar" aria-hidden="true">
          <i id="progress" ref={progress} />
        </div>
      </div>

      <div className="stage" onPointerDown={stopAutoplay}>
        {content.projects.map((p, i) => (
          <div
            key={p.key}
            className={scenes[i].active ? "scene active" : "scene"}
            id={`scene-${p.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${p.key}`}
            data-key={p.key}
            hidden={scenes[i].hidden}
          >
            {p.key === "website" && <WebsiteScene content={content.website} {...sceneProps(i)} />}
            {p.key === "mobile" && <MobileScene content={content.mobile} {...sceneProps(i)} />}
            {p.key === "webapp" && <WebappScene content={content.webapp} {...sceneProps(i)} />}
            {p.key === "nocode" && <NocodeScene content={content.nocode} {...sceneProps(i)} />}
            {p.key === "cloud" && <CloudScene content={content.cloud} {...sceneProps(i)} />}
          </div>
        ))}
      </div>

      <div className="meta">
        <div className={meta.out ? "meta-cols out" : "meta-cols"} id="meta">
          <div>
            <div className="meta-label">{content.timelineLabel}</div>
            <div className="meta-val" id="m-time">
              {metaProject.timeline}
            </div>
          </div>
          <div>
            <div className="meta-label">{content.stackLabel}</div>
            <div className="chips" id="m-stack">
              {metaProject.stack.map((s) => (
                <span className="badge" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          id="m-cta"
          type="button"
          onClick={() => site.openEstimate(keys[currentRef.current])}
        >
          {content.projects[current].cta}
        </button>
      </div>
    </div>
  );
}
