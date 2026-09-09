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

test("marketing navigation has no broken internal destinations", async ({
  page,
  request,
}) => {
  const hrefs = new Set<string>();
  for (const route of [
    "/",
    "/features",
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
  expect(sitemapBody).toContain("/resources/triponeplus-vs-wix-tour-operators");
  expect(sitemapBody).not.toContain("/privacy</loc>");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("/sitemap.xml");

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
