import { describe, expect, it } from "vitest";
import { isValidTimeZone, supportedTimeZones } from "./timezones";

describe("timezones", () => {
  it("accepts IANA zones and rejects arbitrary input", () => {
    expect(isValidTimeZone("Asia/Kathmandu")).toBe(true);
    expect(isValidTimeZone("ram")).toBe(false);
  });

  it("always provides UTC and preserves a valid current zone", () => {
    expect(supportedTimeZones("Asia/Dubai")).toEqual(
      expect.arrayContaining(["UTC", "Asia/Dubai"]),
    );
  });
});
