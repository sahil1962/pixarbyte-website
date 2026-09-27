"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

const GAP = 22;
const RADIUS = 160;

function hexRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * The hero <section>: a twinkling pixel field that lights up around the pointer and ripples
 * on click, plus the pointer position (--px/--py) that drives the builder's parallax.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = section.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!hero || !cv || !ctx) return;

    const reduce = prefersReducedMotion();
    const root = document.documentElement;
    let pts: { x: number; y: number; v: number; s: number }[] = [];
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };
    let ripples: { x: number; y: number; t: number }[] = [];
    let cols = { fg: [9, 9, 11], ac: [37, 99, 235] };
    let visible = true;
    let raf = 0;

    function readCols() {
      const cs = getComputedStyle(root);
      cols = { fg: hexRgb(cs.getPropertyValue("--foreground")), ac: hexRgb(cs.getPropertyValue("--accent")) };
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);
      const { fg, ac } = cols;
      ripples = ripples.filter((r) => now - r.t < 1800);
      for (const p of pts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        let target = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS);
        for (const rp of ripples) {
          const age = now - rp.t;
          const rad = age * 0.55;
          const rd = Math.sqrt((p.x - rp.x) ** 2 + (p.y - rp.y) ** 2);
          const rk = Math.max(0, 1 - Math.abs(rd - rad) / 36) * (1 - age / 1800);
          if (rk > target) target = rk;
        }
        p.v += (target - p.v) * 0.14;
        const tw = reduce ? 0 : 0.5 + 0.5 * Math.sin(now / 1500 + p.s);
        if (p.v > 0.03) {
          const sz = 2 + p.v * 4;
          ctx!.fillStyle = `rgba(${ac[0]},${ac[1]},${ac[2]},${0.15 + p.v * 0.8})`;
          ctx!.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        } else {
          ctx!.fillStyle = `rgba(${fg[0]},${fg[1]},${fg[2]},${0.07 + tw * 0.07})`;
          ctx!.fillRect(p.x - 1, p.y - 1, 2, 2);
        }
      }
    }

    function size() {
      const r = hero!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = GAP / 2; y < H; y += GAP)
        for (let x = GAP / 2; x < W; x += GAP) pts.push({ x, y, v: 0, s: Math.random() * 6.283 });
      if (reduce) draw(0);
    }

    function loop(t: number) {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (!reduce && window.innerWidth > 1060) {
        hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      }
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
      hero.style.setProperty("--px", "0");
      hero.style.setProperty("--py", "0");
    };
    const onDown = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", size);

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
          })
        : null;
    io?.observe(hero);
    const mo = new MutationObserver(() => {
      readCols();
      if (reduce) draw(0);
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    let cancelled = false;
    const init = () => {
      if (cancelled) return;
      readCols();
      size();
      if (!reduce) raf = requestAnimationFrame(loop);
    };
    if (document.fonts?.ready) document.fonts.ready.then(init);
    else init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      mo.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", size);
    };
  }, []);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title" ref={section}>
      <canvas className="hero-canvas" id="field" aria-hidden="true" ref={canvas} />
      {children}
    </section>
  );
}
