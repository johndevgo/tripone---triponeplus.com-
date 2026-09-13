import { describe, expect, it } from "vitest";
import { operationsDemoFixtures } from "./demo-fixtures";

describe("operations demo fixtures", () => {
  it("covers five distinct travel operating models", () => {
    expect(operationsDemoFixtures).toHaveLength(5);
    expect(
      new Set(
        operationsDemoFixtures.map(
          (fixture) => fixture.business.primaryCapability,
        ),
      ).size,
    ).toBe(5);
  });

  it("keeps package composition as valid offering references", () => {
    for (const fixture of operationsDemoFixtures) {
      const keys = new Set(fixture.offerings.map((offering) => offering.key));
      for (const itemKey of fixture.packages.flatMap(
        (travelPackage) => travelPackage.itemKeys,
      )) {
        expect(keys.has(itemKey)).toBe(true);
      }
    }
  });

  it("uses local image assets and no fabricated social proof", () => {
    for (const offering of operationsDemoFixtures.flatMap(
      (fixture) => fixture.offerings,
    )) {
      expect(offering.image).toMatch(/^\/images\/marketing\/.+\.webp$/);
      expect(offering.name).not.toMatch(/best|award|reviews?|customers?/i);
    }
  });
});
