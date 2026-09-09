import { expect, test } from "@playwright/test";

const widths = [375, 430, 768, 1024, 1440] as const;
const publishedSlug = process.env.TRIPONE_PUBLISHED_SITE_SLUG;

test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name.includes("mobile"),
    "The explicit five-width matrix runs once in Chromium.",
  );
});

for (const width of widths) {
  test(`marketing page is usable at ${width}px`, async ({ page }) => {
    const runtimeErrors = collectRuntimeErrors(page);
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
    expect(runtimeErrors).toEqual([]);
    await page.screenshot({
      path: `.qa/marketing-${width}.png`,
      fullPage: true,
    });
  });

  test(`published fallback is usable at ${width}px`, async ({ page }) => {
    test.skip(!publishedSlug, "Set TRIPONE_PUBLISHED_SITE_SLUG");
    const runtimeErrors = collectRuntimeErrors(page);
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    const response = await page.goto(`/s/${publishedSlug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
    expect(runtimeErrors).toEqual([]);
    await page.screenshot({
      path: `.qa/published-${width}.png`,
      fullPage: true,
    });
  });
}

function collectRuntimeErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("ERR_NETWORK_ACCESS_DENIED")
    )
      errors.push(message.text());
  });
  return errors;
}

async function hasHorizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
}
