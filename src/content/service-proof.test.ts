import { describe, expect, it } from "vitest";
import { seoPages } from "./seo-catalog";
import { getServiceProofs } from "./service-proof";

describe("growth-service proof library", () => {
  it("provides contextual, accessible evidence for every growth-service page", () => {
    for (const page of seoPages.filter(
      (candidate) => candidate.pageType === "Growth Service",
    )) {
      const items = getServiceProofs(page.path);
      expect(items.length, page.path).toBeGreaterThanOrEqual(3);
      expect(new Set(items.map((item) => item.src)).size).toBe(items.length);
      expect(items.every((item) => item.alt.length >= 20)).toBe(true);
      expect(items.every((item) => item.caption.length >= 50)).toBe(true);
    }
  });
});
