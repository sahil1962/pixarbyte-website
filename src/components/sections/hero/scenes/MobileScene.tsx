"use client";

import { useEffect, useRef, useState } from "react";
import type { BuilderContent } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { Segmented } from "@/components/shared/Segmented";
import { prefersReducedMotion, useTimers } from "@/lib/hooks";
import type { SceneProps } from "./types";

/** Mobile app preview: tap the phone for a push notification; switch between iOS and Android. */
export function MobileScene({ content, active, enterId, stopAutoplay }: SceneProps<BuilderContent["mobile"]>) {
  const timers = useTimers();
  const track = useRef<HTMLElement>(null);
  const [os, setOs] = useState<"ios" | "android">(content.platforms[0].id);
  const [push, setPush] = useState({ show: false, ...content.pushes[0] });
  const pushIdx = useRef(0);
  const pushTimer = useRef<number | undefined>(undefined);

  // Entering the scene clears the last notification.
  const [entered, setEntered] = useState(-1);
  if (active && entered !== enterId) {
    setEntered(enterId);
    setPush((s) => ({ ...s, show: false }));
  }

  function sendPush() {
    const p = content.pushes[pushIdx.current++ % content.pushes.length];
    setPush((s) => ({ ...s, show: false }));
    clearTimeout(pushTimer.current);
    pushTimer.current = window.setTimeout(
      () => {
        setPush({ show: true, ...p });
        try {
          navigator.vibrate?.(12);
        } catch {}
      },
      prefersReducedMotion() ? 0 : 180,
    );
  }

  useEffect(() => {
    if (!active) return;
    const tr = track.current;
    if (tr) {
      tr.style.transition = "none";
      tr.style.width = "0";
      tr.getBoundingClientRect();
      tr.style.transition = "";
      timers.later(() => (tr.style.width = "72%"), 50);
    }
    pushIdx.current = 0;
    timers.later(sendPush, prefersReducedMotion() ? 0 : 1100);
    return () => {
      timers.clear();
      clearTimeout(pushTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, enterId]);

  return (
    <div className="mob-layout">
      <button
        className={os === "android" ? "phone android" : "phone"}
        id="phone"
        type="button"
        aria-label={content.phoneAriaLabel}
        onClick={() => {
          stopAutoplay();
          sendPush();
        }}
      >
        <div className="pscreen">
          <div className="p-greet">{content.greeting}</div>
          <div className="p-title">{content.title}</div>
          <div className="p-card">
            <small>{content.etaLabel}</small>
            <strong id="eta">{content.eta}</strong>
            <div className="p-track">
              <i id="ptrack" ref={track} />
            </div>
          </div>
          {content.items.map((item, i) => (
            <div className="p-row" key={i}>
              <span className="p-av" style={{ background: item.color }} />
              <span className="ln" style={item.maxWidth ? { maxWidth: item.maxWidth } : undefined} />
              <em>{item.qty}</em>
            </div>
          ))}
          <div className="p-tabbar">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </button>
      <div className={push.show ? "float toast-mock show" : "float toast-mock"} id="toast-mock" aria-live="polite">
        <span className="ic">
          <Icon name="bell" />
        </span>
        <div>
          <strong id="tm-title">{push.title}</strong>
          <span id="tm-body">{push.body}</span>
        </div>
      </div>
      <div className="float tap-hint">
        <Icon name="hand" />
        {content.tapHint}
      </div>
      <div className="float os-float">
        <Segmented<"ios" | "android">
          className="xs"
          ariaLabel={content.platformLabel}
          options={content.platforms.map((p) => ({ value: p.id, label: p.label }))}
          value={os}
          onChange={setOs}
        />
      </div>
    </div>
  );
}
