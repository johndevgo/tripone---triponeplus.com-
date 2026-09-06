import { expect, test } from "@playwright/test";

const email = process.env.TRIPONE_E2E_EMAIL;
const password = process.env.TRIPONE_E2E_PASSWORD;

test("authenticated onboarding creates a real draft website", async ({
  page,
}) => {
  test.skip(
    !email || !password,
    "Set TRIPONE_E2E_EMAIL and TRIPONE_E2E_PASSWORD for a fresh confirmed user.",
  );
  await page.goto("/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/(onboarding|dashboard)/);
  test.skip(
    !page.url().includes("/onboarding"),
    "The configured user already has a website.",
  );

  await page.getByRole("button", { name: /Jet Ski Rental/i }).click();
  await page.getByRole("button", { name: /Next/i }).click();
  const slug = `playwright-wave-${Date.now()}`;
  await page.getByLabel("Business name").fill("Playwright Wave Tours");
  await page.getByLabel("Subdomain").fill(slug);
  await page
    .getByLabel("Short description")
    .fill(
      "A test-only set of guided water experiences for browser validation.",
    );
  await page.getByLabel("Country").fill("United Arab Emirates");
  await page.getByLabel("City").fill("Dubai Marina");
  await page.getByLabel("Currency (3 letters)").fill("AED");
  await page.getByLabel("Business email").fill(email!);
  await page.getByRole("button", { name: /Next/i }).click();
  await page.getByRole("button", { name: /Next/i }).click();
  await page.getByRole("button", { name: /Add jet ski experience/i }).click();
  await page.getByLabel("Name").last().fill("60 Minute Test Experience");
  await page
    .getByLabel("Short description")
    .last()
    .fill(
      "A test-only experience used to verify the complete website generation flow.",
    );
  await page.getByRole("button", { name: /Next/i }).click();
  await page.getByRole("button", { name: /Horizon/i }).click();
  await page.getByRole("button", { name: /Next/i }).click();
  await page.getByRole("button", { name: /Build My Website/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/sites\/[0-9a-f-]+\/created/);
  await expect(
    page.getByRole("heading", { name: /website is ready/i }),
  ).toBeVisible();
});
