import type { ReactNode } from "react";

/**
 * Section heading block: H2 plus intro. With `aside`, the heading sits on the left and
 * the aside (a button, filter or rating) on the right, as in the design's `.sec-head.row`.
 */
export function SectionHead({
  id,
  title,
  intro,
  aside,
}: {
  id: string;
  title: string;
  intro: string;
  aside?: ReactNode;
}) {
  const heading = (
    <>
      <h2 id={id}>{title}</h2>
      {intro && <p>{intro}</p>}
    </>
  );

  if (!aside) return <div className="sec-head">{heading}</div>;

  return (
    <div className="sec-head row">
      <div>{heading}</div>
      {aside}
    </div>
  );
}
