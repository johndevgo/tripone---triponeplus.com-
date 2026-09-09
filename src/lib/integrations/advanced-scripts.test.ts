import { describe, expect, it } from "vitest";
import {
  advancedScriptsSchema,
  parsePathRules,
  safeInlineScript,
  scriptMatchesPath,
} from "./advanced-scripts";

const script = advancedScriptsSchema.parse([
  {
    id: "script_1234",
    name: "Booking attribution",
    placement: "body_end",
    consentCategory: "analytics",
    enabled: true,
    sourceUrl: "https://cdn.example.com/booking.js",
    code: "",
    includePaths: ["/experiences/*"],
    excludePaths: ["/experiences/private"],
  },
])[0]!;

describe("advanced tenant scripts", () => {
  it("validates HTTPS scripts and applies inclusion before exclusion", () => {
    expect(scriptMatchesPath(script, "/experiences/marina")).toBe(true);
    expect(scriptMatchesPath(script, "/experiences/private")).toBe(false);
    expect(scriptMatchesPath(script, "/rentals/boat")).toBe(false);
    expect(
      advancedScriptsSchema.safeParse([
        { ...script, sourceUrl: "javascript:alert(1)" },
      ]).success,
    ).toBe(false);
  });

  it("normalizes path lists and neutralizes closing script tags", () => {
    expect(parsePathRules("/tours/*, /contact\n/tours/*")).toEqual([
      "/tours/*",
      "/contact",
    ]);
    expect(safeInlineScript("window.x='</script>'")).toContain("<\\/script>");
  });
});
