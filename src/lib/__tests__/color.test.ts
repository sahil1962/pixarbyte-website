import { describe, expect, it } from "vitest";
import { avatarBackground, contrast } from "@/lib/color";

describe("avatarBackground", () => {
  it("keeps colours that already pass and darkens light ones just enough for white text", () => {
    expect(avatarBackground("#2563eb")).toBe("#2563eb");
    for (const c of ["#f97316", "#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b", "#e11d48", "#64748b"]) {
      const out = avatarBackground(c);
      expect(contrast(out, "#ffffff")).toBeGreaterThanOrEqual(4.5);
    }
  });
});
