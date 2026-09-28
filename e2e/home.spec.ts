import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero and every key section", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/PixarByte/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("software");

    for (const id of ["services", "who", "work", "process", "why", "pricing", "faq", "contact"]) {
      await expect(page.locator(`section#${id}`), `section #${id}`).toBeAttached();
    }
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("opens the quick estimate", async ({ page }) => {
    await page.goto("/");
    await page.locator("#hero-cta").click();
    const dialog = page.getByRole("dialog", { name: "Quick estimate" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Get an exact quote" })).toHaveAttribute("href", /\/contact\?type=/);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
