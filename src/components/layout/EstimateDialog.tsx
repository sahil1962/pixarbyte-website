"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { BuilderProject, EstimateContent, EstimateModel, ProjectSize, ProjectType } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { Segmented } from "@/components/shared/Segmented";
import { useSite } from "@/components/layout/SiteProvider";
import { pixelBurst } from "@/lib/burst";
import { estimate as calcEstimate } from "@/lib/estimator";
import { easeOutCubic, fill, formatEstimate } from "@/lib/format";
import { prefersReducedMotion, useModalDialog } from "@/lib/hooks";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EstimateDialog({
  content,
  model,
  projects,
}: {
  content: EstimateContent;
  model: EstimateModel;
  projects: BuilderProject[];
}) {
  const { estimate, closeEstimate, notify } = useSite();
  const dialog = useModalDialog(estimate.open);

  const [session, setSession] = useState(estimate.session);
  const [type, setType] = useState<ProjectType>(estimate.type);
  const [size, setSize] = useState<ProjectSize>(content.defaultSize);
  const [feats, setFeats] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentText, setSentText] = useState<string | null>(null);

  // Each time the dialog opens: fresh type and features, empty email, form view.
  // The size choice is kept between opens, as in the design.
  if (estimate.session !== session) {
    setSession(estimate.session);
    setType(estimate.type);
    setFeats([]);
    setEmail("");
    setError("");
    setSentText(null);
  }

  const rangeRef = useRef<HTMLElement>(null);
  const shownRange = useRef<[number, number]>([0, 0]);
  const shownSession = useRef(-1);
  const emailRef = useRef<HTMLInputElement>(null);
  const successIcon = useRef<HTMLDivElement>(null);
  const burstLayer = useRef<HTMLDivElement>(null);

  // Recalculate and count the range up from what's currently shown (from £0 on open).
  useEffect(() => {
    if (!estimate.open) return;
    if (shownSession.current !== estimate.session) {
      shownSession.current = estimate.session;
      shownRange.current = [0, 0];
    }
    const { mid } = calcEstimate(model, { type, size, features: feats });
    const lo = mid * model.spread.low;
    const hi = mid * model.spread.high;
    const from = shownRange.current;
    shownRange.current = [lo, hi];

    const duration = prefersReducedMotion() ? 1 : 500;
    let t0: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      t0 ??= ts;
      const e = easeOutCubic(Math.min(1, (ts - t0) / duration));
      if (rangeRef.current) {
        rangeRef.current.textContent = `${formatEstimate(from[0] + (lo - from[0]) * e)} – ${formatEstimate(from[1] + (hi - from[1]) * e)}`;
      }
      if (e < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [estimate.open, estimate.session, type, size, feats, model]);

  useEffect(() => {
    if (!sentText || prefersReducedMotion()) return;
    const raf = requestAnimationFrame(() => {
      if (successIcon.current && burstLayer.current) pixelBurst(successIcon.current, burstLayer.current);
    });
    return () => cancelAnimationFrame(raf);
  }, [sentText]);

  const { weeks } = calcEstimate(model, { type, size, features: feats });
  const timeline = fill(content.timeline, { min: weeks[0], max: weeks[1] });
  const label = projects.find((p) => p.key === type)?.label ?? "";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL.test(v)) {
      setError(content.emailError);
      emailRef.current?.focus();
      return;
    }
    setError("");
    setSentText(
      fill(content.success.text, { type: label.toLowerCase(), range: rangeRef.current?.textContent ?? "", email: v }),
    );
    notify("estimateSent");
  }

  return (
    <dialog
      id="estimate"
      aria-labelledby="est-title"
      ref={dialog}
      onClose={closeEstimate}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEstimate();
      }}
    >
      <button
        className="btn btn-ghost btn-icon dlg-close"
        type="button"
        aria-label={content.closeAriaLabel}
        onClick={closeEstimate}
      >
        <Icon name="x" />
      </button>
      <div id="est-form" style={sentText ? { display: "none" } : undefined}>
        <div className="dlg-head">
          <h2 id="est-title">{content.title}</h2>
          <p>{content.intro}</p>
        </div>
        <div className="dlg-body">
          <div>
            <span className="field-label" id="lbl-type">
              {content.typeLabel}
            </span>
            <Segmented<ProjectType>
              id="est-type"
              className="est-seg"
              ariaLabelledBy="lbl-type"
              options={projects.map((p) => ({ value: p.key, label: p.label }))}
              value={type}
              onChange={(t) => {
                setType(t);
                setFeats([]);
              }}
            />
          </div>
          <div>
            <span className="field-label" id="lbl-size">
              {content.sizeLabel}
            </span>
            <Segmented<ProjectSize>
              id="est-size"
              className="est-seg"
              ariaLabelledBy="lbl-size"
              options={content.sizes.map((s) => ({ value: s.id, label: s.label }))}
              value={size}
              onChange={setSize}
            />
          </div>
          <div>
            <span className="field-label">{content.featuresLabel}</span>
            <div className="checks" id="est-feats">
              {model.features[type].map((f) => (
                <label className="check" key={`${type}-${f.id}`}>
                  <input
                    type="checkbox"
                    value={f.id}
                    checked={feats.includes(f.id)}
                    onChange={(e) =>
                      setFeats((cur) => (e.target.checked ? [...cur, f.id] : cur.filter((id) => id !== f.id)))
                    }
                  />
                  <span>{f.label}</span>
                  <small>{`+${formatEstimate(f.price)}`}</small>
                </label>
              ))}
            </div>
          </div>
          <div className="result" aria-live="polite">
            <div>
              <small>{content.rangeLabel}</small>
              <strong id="est-range" ref={rangeRef}>
                £0
              </strong>
            </div>
            <div className="tline">
              <small>{content.timelineLabel}</small>
              <span id="est-time">{timeline}</span>
            </div>
          </div>
          <p className="disclaimer">{content.disclaimer}</p>
          <form id="est-email" noValidate onSubmit={onSubmit}>
            <label className="field-label" htmlFor="email">
              {content.emailLabel}
            </label>
            <div className="email-row">
              <input
                ref={emailRef}
                className="input"
                id="email"
                type="email"
                placeholder={content.emailPlaceholder}
                autoComplete="email"
                aria-describedby="email-err"
                aria-invalid={error ? "true" : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                {content.submit}
              </button>
            </div>
            <div className="err-msg" id="email-err">
              {error}
            </div>
          </form>
        </div>
      </div>
      <div className={sentText ? "success on" : "success"} id="est-success">
        <div className="ic" ref={successIcon}>
          <Icon name="check" />
        </div>
        <h3>{content.success.title}</h3>
        <p id="success-text">{sentText}</p>
        <button className="btn btn-outline" type="button" onClick={closeEstimate}>
          {content.success.done}
        </button>
      </div>
      <div ref={burstLayer} />
    </dialog>
  );
}
