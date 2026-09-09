import { expect, test } from "@playwright/test";

const tenantOrigin = process.env.TRIPONE_E2E_TENANT_ORIGIN;
const fallbackSlug = process.env.TRIPONE_E2E_SCRIPT_SITE_SLUG;

test("advanced scripts execute only on the isolated verified tenant origin", async ({
  page,
}) => {
  test.skip(
    !tenantOrigin || !fallbackSlug,
    "Set the disposable script fixture.",
  );
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("ERR_NETWORK_ACCESS_DENIED")
    )
      runtimeErrors.push(message.text());
  });
  const tenantResponse = await page.goto(tenantOrigin!);
  expect(tenantResponse?.status()).toBe(200);
  const policy = tenantResponse?.headers()["content-security-policy"] ?? "";
  expect(policy).toContain("'strict-dynamic'");
  expect(policy).toMatch(/'nonce-[^']+'/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __triponeAdvancedBoundary?: string })
            .__triponeAdvancedBoundary,
      ),
    )
    .toContain("isolated-script-");

  const blockedApiStatus = await page.evaluate(async () =>
    fetch("/api/media").then((response) => response.status),
  );
  expect(blockedApiStatus).toBe(404);

  await page.goto(`/s/${fallbackSlug}`);
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { __triponeAdvancedBoundary?: string })
          .__triponeAdvancedBoundary,
    ),
  ).toBeUndefined();
  expect(runtimeErrors).toEqual([]);
});
