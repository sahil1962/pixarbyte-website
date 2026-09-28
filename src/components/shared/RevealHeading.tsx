"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The hero H1 with the home page's word-by-word reveal. It is plain text until fonts are
 * ready (and without JavaScript), then each word blurs and rises into place.
 */
export function RevealHeading({
  text,
  id = "hero-title",
  className,
}: {
  text: string;
  id?: string;
  className?: string;
}) {
  const [mode, setMode] = useState<"plain" | "pre" | "in">("plain");
  const h1 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let cancelled = false;
    const start = () => !cancelled && setMode("pre");
    if (document.fonts?.ready) document.fonts.ready.then(start);
    else start();
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (mode !== "pre") return;
    h1.current?.getBoundingClientRect();
    const raf = requestAnimationFrame(() => setMode("in"));
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  if (mode === "plain")
    return (
      <h1 id={id} ref={h1} className={className}>
        {text}
      </h1>
    );

  return (
    <h1 id={id} ref={h1} className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className={mode === "in" ? "w in" : "w"} aria-hidden="true" style={{ transitionDelay: `${i * 55}ms` }}>
            {w}
          </span>{" "}
        </Fragment>
      ))}
    </h1>
  );
}
