const STAR = "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z";

/** Five filled stars. Pass `label` to expose the rating to assistive tech, otherwise it is hidden. */
export function Stars({ label }: { label?: string }) {
  const a11y = label ? { "aria-label": label } : { "aria-hidden": true as const };
  return (
    <span className="stars" {...a11y}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}
