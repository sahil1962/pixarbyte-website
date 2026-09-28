import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/", "/services", "/services/mobile-app-development", "/portfolio", "/pricing", "/about", "/contact"];

test.describe("accessibility", () => {
  test.skip(({ isMobile }) => isMobile, "Run once, on desktop");

  for (const scheme of ["light", "dark"] as const) {
    for (const path of paths) {
      test(`${path} has no axe violations (${scheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }
});
