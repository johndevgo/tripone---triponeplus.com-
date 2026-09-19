import { describe, expect, it } from "vitest";
import {
  businessModelForCapability,
  representativesForModels,
} from "./business-models";

describe("simplified business models", () => {
  it("groups niche activities into customer-friendly models", () => {
    expect(businessModelForCapability("jetski")).toBe("tours");
    expect(businessModelForCapability("motorcycle_rental")).toBe("rentals");
    expect(businessModelForCapability("multi_day_tour")).toBe("packages");
  });

  it("persists one representative capability per selected model", () => {
    expect(representativesForModels(["tours", "rentals", "packages"])).toEqual([
      "tour_operator",
      "boat_rental",
      "travel_agency",
    ]);
  });
});
