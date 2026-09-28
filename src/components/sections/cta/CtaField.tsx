"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

const GAP = 24;
const RADIUS = 140;

/** Dot grid behind the final call to action; dots near the pointer light up blue. */
export function CtaField() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const box = c?.parentElement;
    const g = c?.getContext("2d");
    if (!c || !box || !g) return;

    const reduce = prefersReducedMotion();
    let points: { x: number; y: number; v: number; s: number }[] = [];
    let w = 0;
    let h = 0;
    const m = { x: -999, y: -999 };
    let visible = false;
    let raf = 0;

    function size() {
      const r = box!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      c!.width = w * dpr;
      c!.height = h * dpr;
      g!.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      for (let y = GAP / 2; y < h; y += GAP)
        for (let x = GAP / 2; x < w; x += GAP) points.push({ x, y, v: 0, s: Math.random() * 6.28 });
      draw(0);
    }

    function draw(t: number) {
      g!.clearRect(0, 0, w, h);
      for (const p of points) {
        const d = Math.hypot(p.x - m.x, p.y - m.y);
        const target = Math.max(0, 1 - d / RADIUS);
        p.v += (target - p.v) * 0.15;
        if (p.v > 0.03) {
          const s = 2 + p.v * 4;
          g!.fillStyle = `rgba(96,165,250,${0.2 + p.v * 0.8})`;
          g!.fillRect(p.x - s / 2, p.y - s / 2, s, s);
        } else {
          const tw = reduce ? 0 : 0.05 * (0.5 + 0.5 * Math.sin(t / 1400 + p.s));
          g!.fillStyle = `rgba(255,255,255,${0.05 + tw})`;
          g!.fillRect(p.x - 1, p.y - 1, 2, 2);
        }
      }
    }

    function loop(t: number) {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      m.x = e.clientX - r.left;
      m.y = e.clientY - r.top;
    };
    const onLeave = () => {
      m.x = m.y = -999;
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", size);

    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => entries.forEach((e) => (visible = e.isIntersecting)), { threshold: 0 })
        : null;
    if (io) io.observe(box);
    else visible = true;

    size();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas id="cta-field" aria-hidden="true" ref={canvas} />;
}
