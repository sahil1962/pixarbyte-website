import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("shows validation errors on an empty submit and focuses the first field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send my request" }).click();

    await expect(page.getByText("Please enter your name")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
    await expect(page.getByText("Please choose at least one service")).toBeVisible();
    await expect(page.getByText("Please choose a budget range")).toBeVisible();
    await expect(page.getByText("Please tell us a bit more")).toBeVisible();
    await expect(page.getByText("Please accept the privacy notice")).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeFocused();
    await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("clears an error once the field is fixed", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send my request" }).click();
    await expect(page.getByText("Please enter your name")).toBeVisible();
    await page.getByLabel("Full name").fill("Jane Smith");
    await expect(page.getByText("Please enter your name")).toBeHidden();
  });

  test("prefills the service from the URL", async ({ page }) => {
    await page.goto("/contact?service=mobile-app-development");
    await expect(page.getByLabel("Mobile app")).toBeChecked();
  });
});
