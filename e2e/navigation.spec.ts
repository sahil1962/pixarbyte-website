import { expect, test } from "@playwright/test";

const pages = [
  { path: "/services", h1: /services|software/i },
  { path: "/portfolio", h1: /work/i },
  { path: "/pricing", h1: /./ },
  { path: "/about", h1: /./ },
  { path: "/contact", h1: /build something together/i },
];

test.describe("navigation", () => {
  test("header links reach services, work and pricing", async ({ page, isMobile }) => {
    await page.goto("/");
    for (const [label, path] of [
      ["Services", "/services"],
      ["Work", "/portfolio"],
      ["Pricing", "/pricing"],
    ] as const) {
      if (isMobile) {
        await page.getByRole("button", { name: "Open menu" }).click();
        await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: label, exact: true }).click();
      } else {
        await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label, exact: true }).click();
      }
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("footer and header reach about and contact", async ({ page, isMobile }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    if (!isMobile) {
      await page.getByRole("banner").getByRole("link", { name: "Start a project" }).click();
      await expect(page).toHaveURL(/\/contact$/);
    }
  });

  for (const p of pages) {
    test(`${p.path} has one H1, a title and a canonical URL`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
      await expect(page).toHaveTitle(/PixarByte/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${p.path}$`));
    });
  }

  test("unknown pages show the friendly 404", async ({ page }) => {
    const res = await page.goto("/no-such-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("We couldn't find that page.");
    await expect(page.getByRole("link", { name: "Back to the home page" })).toBeVisible();
  });
});
