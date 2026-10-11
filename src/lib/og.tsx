import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/** The logo's "p" mark, inlined so share images need no network fetch. */
const mark = `data:image/svg+xml;base64,${readFileSync(
  path.join(process.cwd(), "public/brand/pixarbyte-mark.svg"),
).toString("base64")}`;

export const ogSize = { width: 1200, height: 630 };

/** Share image in the design's dark palette: logo, an eyebrow, a title and a detail line. */
export function renderOgImage({
  wordmark,
  eyebrow,
  title,
  detail,
  colors,
}: {
  /** Text beside the "p" mark ("ixarByte"), so the lockup reads "PixarByte". */
  wordmark: string;
  eyebrow?: string;
  title: string;
  detail?: string;
  /** Two colours for a gradient band along the bottom edge (a case study's palette). */
  colors?: [string, string];
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#09090b",
        color: "#fafafa",
        position: "relative",
      }}
    >
      {colors && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 16,
            background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
          }}
        />
      )}
      {/* Logo lockup: the mark drops below the text baseline like a lowercase p. */}
      <div style={{ display: "flex", alignItems: "flex-end", fontSize: 60, fontWeight: 500, letterSpacing: -1.2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={66} height={66} alt="" style={{ marginRight: 4 }} />
        <div style={{ display: "flex", lineHeight: 1, marginBottom: 4 }}>{wordmark}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {eyebrow && <div style={{ fontSize: 30, color: "#a1a1aa" }}>{eyebrow}</div>}
        <div style={{ fontSize: 68, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1040 }}>{title}</div>
        {detail && <div style={{ fontSize: 32, color: colors ? colors[1] : "#60a5fa" }}>{detail}</div>}
      </div>
    </div>,
    ogSize,
  );
}
