import { describe, expect, it } from "vitest";
import { parseAppUrl } from "./app-url";
import { publicGenerationError } from "./onboarding-errors";

describe("application URL configuration", () => {
  it("accepts one absolute application origin", () => {
    expect(parseAppUrl("https://triponeplus.com/")).toBe(
      "https://triponeplus.com",
    );
  });

  it("rejects the earlier comma-separated URL mistake", () => {
    expect(() =>
      parseAppUrl("https://triponeplus.com,tripone-triponeplus-com.vercel.app"),
    ).toThrow(/one absolute URL/);
  });
});

describe("website generation errors", () => {
  it("does not expose database error text to the customer", () => {
    const message = publicGenerationError(
      {
        code: "42883",
        message: "operator does not exist: text ->> unknown",
      },
      "repair-test",
    );
    expect(message).toContain("Reference: repair-test");
    expect(message).toContain("details are saved");
    expect(message).not.toContain("operator");
  });
});
