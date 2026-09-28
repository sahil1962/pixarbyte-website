import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Share image in the design's dark palette: brand mark, an eyebrow, a title and a detail line. */
export function renderOgImage({
  brand,
  eyebrow,
  title,
  detail,
  colors,
}: {
  brand: string;
  eyebrow?: string;
  title: string;
  detail?: string;
  /** Two colours for a gradient band along the bottom edge (a case study's palette). */
  colors?: [string, string];
}) {
  const cell = (color: string) => <div style={{ width: 22, height: 22, borderRadius: 5, background: color }} />;
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
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36, fontWeight: 600 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 96,
            height: 96,
            padding: 22,
            gap: 8,
            borderRadius: 26,
            background: "#fafafa",
          }}
        >
          {cell("#18181b")}
          {cell("#18181b")}
          {cell("#18181b")}
          {cell("#3b82f6")}
        </div>
        {brand}
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
