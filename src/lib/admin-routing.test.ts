import { describe, expect, it } from "vitest";
import {
  activationPath,
  adminPathFromLegacy,
  legacyPathFromAdmin,
} from "./admin-routing";

const siteId = "4ecfee29-3ec3-48ff-8d8a-db3a8f818809";

describe("clean admin routing", () => {
  it("removes site identifiers from visible workspace URLs", () => {
    expect(adminPathFromLegacy(`/dashboard/sites/${siteId}`)).toBe(
      "/admin/dashboard",
    );
    expect(adminPathFromLegacy(`/dashboard/sites/${siteId}/builder`)).toBe(
      "/admin/website",
    );
    expect(adminPathFromLegacy(`/dashboard/sites/${siteId}/bookings/42`)).toBe(
      "/admin/bookings/42",
    );
  });

  it("resolves global pages without an active workspace", () => {
    expect(legacyPathFromAdmin(undefined, "/admin/account")).toBe(
      "/dashboard/account",
    );
    expect(legacyPathFromAdmin(undefined, "/admin/workspaces")).toBe(
      "/dashboard/sites",
    );
  });

  it("requires a valid active site for site-scoped pages", () => {
    expect(legacyPathFromAdmin(undefined, "/admin/dashboard")).toBeNull();
    expect(legacyPathFromAdmin("not-a-site", "/admin/website")).toBeNull();
    expect(legacyPathFromAdmin(siteId, "/admin/website")).toBe(
      `/dashboard/sites/${siteId}/builder`,
    );
    expect(legacyPathFromAdmin(siteId, "/admin/%2e%2e/account")).toBeNull();
    expect(legacyPathFromAdmin(siteId, "/admin/bad%ZZpath")).toBeNull();
  });

  it("builds a safe activation URL", () => {
    expect(activationPath(siteId, "/admin/domains")).toBe(
      `/api/workspace/activate?siteId=${siteId}&next=%2Fadmin%2Fdomains`,
    );
  });
});
