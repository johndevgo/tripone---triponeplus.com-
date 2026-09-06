import { expect, test } from "@playwright/test";

const email = process.env.TRIPONE_E2E_EMAIL;
const password = process.env.TRIPONE_E2E_PASSWORD;
const siteId = process.env.TRIPONE_E2E_SITE_ID;

test("builder edits, reorders, previews and autosaves", async ({ page }) => {
  test.skip(
    !email || !password || !siteId,
    "Authenticated builder credentials are not configured.",
  );
  await page.goto("/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.goto(`/dashboard/sites/${siteId}/builder`);
  await page.getByRole("button", { name: "Add section" }).click();
  await page.getByPlaceholder("Search sections").fill("rich text");
  await page.getByRole("button", { name: /Rich text/i }).click();
  await page
    .getByLabel("title", { exact: false })
    .last()
    .fill("Playwright builder heading");
  await expect(page.getByText("Playwright builder heading")).toBeVisible();
  await page.getByRole("button", { name: "Undo" }).click();
  await page.getByRole("button", { name: "mobile preview" }).click();
  await expect(page.getByText(/Saved|Saving|Unsaved/)).toBeVisible();
  const preview = page.getByRole("link", { name: "Preview" });
  await expect(preview).toHaveAttribute("target", "_blank");
});
