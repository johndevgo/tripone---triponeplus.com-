import { expect, test } from "@playwright/test";

test("marketing and auth entry points are usable", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /sell the experience.*run the operation/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /start building free/i }).first(),
  ).toHaveAttribute("href", "/signup");
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeEditable();
});

test("founding pricing and protected consoles are explicit", async ({
  page,
}) => {
  await page.goto("/pricing");
  await expect(
    page.getByRole("heading", { name: /three years free/i }),
  ).toBeVisible();
  await expect(page.getByText(/NPR\s*4,999/i).first()).toBeVisible();

  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await page.goto("/super-admin");
  await expect(page).toHaveURL(/\/login/);
});

test("growth studio is useful, honest and connected to the platform", async ({
  page,
}) => {
  const response = await page.goto("/growth-services");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /platform to run your website.*people to help grow it/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/do you guarantee rankings/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /discuss growth services/i }),
  ).toHaveAttribute("href", /^mailto:neurerohan@gmail\.com/);
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.some((schema) => schema.includes('"@type":"Service"'))).toBe(
    true,
  );
});

test("mobile navigation opens without horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only assertion");
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("navigation").last()).toContainText("Templates");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("resource library publishes useful metadata and structured content", async ({
  page,
}) => {
  const response = await page.goto(
    "/resources/tour-operator-website-checklist",
  );
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The complete tour operator website checklist",
    }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/complete tour operator website checklist/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/resources\/tour-operator-website-checklist$/,
  );
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(schemas.some((schema) => schema.includes('"@type":"Article"'))).toBe(
    true,
  );
  expect(schemas.some((schema) => schema.includes('"@type":"FAQPage"'))).toBe(
    true,
  );
});

test("resource library search and category controls work", async ({ page }) => {
  await page.goto("/resources");
  await expect(page.getByText(/Showing 18 of \d+ resources/)).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search the resource library" })
    .fill("airport transfer");
  await expect(
    page.getByRole("heading", {
      name: "Website planning guide for airport transfer companies",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Comparison", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /Open the comparison collection/i }),
  ).toHaveAttribute("href", "/resources/category/platform-comparisons");
});

test("marketing navigation has no broken internal destinations", async ({
  page,
  request,
}) => {
  const hrefs = new Set<string>();
  for (const route of [
    "/",
    "/features",
    "/growth-services",
    "/templates",
    "/pricing",
    "/resources",
  ]) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")).filter(Boolean),
      )) {
      if (typeof href === "string") hrefs.add(href);
    }
  }
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});

test("SEO discovery files include the marketing resource library", async ({
  page,
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain("/resources/tourism-website-seo-guide");
  expect(sitemapBody).toContain("/growth-services");
  expect(sitemapBody).toContain("/resources/triponeplus-vs-wix-tour-operators");
  expect(sitemapBody).toContain("/resources/category/platform-comparisons");
  expect(
    (sitemapBody.match(/<loc>[^<]*\/resources\//g) ?? []).length,
  ).toBeGreaterThanOrEqual(60);
  expect(sitemapBody).not.toContain("/privacy</loc>");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsBody = await robots.text();
  expect(robotsBody).toContain("/sitemap.xml");
  expect(robotsBody).toContain("/admin/");
  expect(robotsBody).toContain("/super-admin/");

  await page.goto("/");
  const socialImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(socialImage).toBeTruthy();
  const socialImageUrl = new URL(socialImage!);
  expect(
    (
      await request.get(`${socialImageUrl.pathname}${socialImageUrl.search}`)
    ).status(),
  ).toBe(200);
});

test("marketing photography loads with intrinsic rendered space", async ({
  page,
}) => {
  await page.goto("/");
  const images = page.locator("main img:visible");
  const count = await images.count();
  expect(count).toBeGreaterThanOrEqual(10);
  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const node = element as HTMLImageElement;
          return node.complete && node.naturalWidth > 0;
        }),
      )
      .toBe(true);
  }
});
