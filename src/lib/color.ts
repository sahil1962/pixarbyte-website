/** Colour helpers for WCAG contrast. */

function channels(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: [number, number, number]) {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(channels(a)), luminance(channels(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * An avatar background dark enough for white initials (at least 4.5:1). Colours that
 * already pass are returned unchanged; lighter ones are darkened just enough, so the
 * hue stays the same.
 */
export function avatarBackground(hex: string, min = 4.5): string {
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) || contrast(hex, "#ffffff") >= min) return hex;
  const base = channels(hex);
  for (let f = 0.97; f > 0.3; f -= 0.01) {
    const c = base.map((v) => Math.round(v * f)) as [number, number, number];
    const out = "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
    if (contrast(out, "#ffffff") >= min) return out;
  }
  return "#18181b";
}
