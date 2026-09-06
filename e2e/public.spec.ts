import { expect, test } from "@playwright/test";

test("marketing and auth entry points are usable", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /websites built to/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /build your website/i }).first(),
  ).toHaveAttribute("href", "/signup");
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeEditable();
});

test("mobile navigation opens without horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only assertion");
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(page.getByRole("navigation").last()).toContainText("Templates");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
