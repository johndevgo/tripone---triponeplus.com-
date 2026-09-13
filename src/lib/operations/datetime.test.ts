import { describe, expect, it } from "vitest";
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
  isoToLocalDateTime,
  localDateTimeToIso,
} from "./datetime";

describe("localDateTimeToIso", () => {
  it("stores Nepal wall time as the correct UTC instant", () => {
    expect(localDateTimeToIso("2099-10-01T09:00", "Asia/Kathmandu")).toBe(
      "2099-10-01T03:15:00.000Z",
    );
  });

  it("accounts for seasonal timezone offsets", () => {
    expect(localDateTimeToIso("2099-07-01T09:00", "America/New_York")).toBe(
      "2099-07-01T13:00:00.000Z",
    );
  });

  it("rejects malformed local values", () => {
    expect(() => localDateTimeToIso("tomorrow", "UTC")).toThrow();
  });

  it("round-trips an instant for editing in the business timezone", () => {
    const instant = localDateTimeToIso("2099-10-01T09:00", "Asia/Kathmandu");
    expect(isoToLocalDateTime(instant, "Asia/Kathmandu")).toBe(
      "2099-10-01T09:00",
    );
  });
});

describe("business calendar helpers", () => {
  it("uses the business-local date near a UTC boundary", () => {
    expect(
      dateKeyInTimeZone("2026-09-12T19:00:00.000Z", "Asia/Kathmandu"),
    ).toBe("2026-09-13");
  });

  it("adds calendar days across a month boundary", () => {
    expect(addDaysToDateKey("2026-09-30", 7)).toBe("2026-10-07");
  });
});
