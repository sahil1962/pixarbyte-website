import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";

export const alt = "PixarByte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image, in the design's dark palette. */
export default async function Image() {
  const site = await getSiteConfig();
  const cell = (color: string) => <div style={{ width: 30, height: 30, borderRadius: 6, background: color }} />;

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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 600 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 132,
            height: 132,
            padding: 30,
            gap: 12,
            borderRadius: 36,
            background: "#fafafa",
          }}
        >
          {cell("#18181b")}
          {cell("#18181b")}
          {cell("#18181b")}
          {cell("#3b82f6")}
        </div>
        {site.name}
      </div>
      <div style={{ fontSize: 56, lineHeight: 1.1, letterSpacing: -2, maxWidth: 1000 }}>{site.description}</div>
    </div>,
    size,
  );
}
