import { describe, expect, it } from "vitest";
import {
  formatPlanPrice,
  inactiveAccountCutoff,
  isInactiveAccount,
} from "./config";

describe("platform access policy", () => {
  it("uses the most recent sign-in to determine inactivity", () => {
    const cutoff = inactiveAccountCutoff(new Date("2026-09-13T00:00:00Z"), 60);
    expect(cutoff.toISOString()).toBe("2026-07-15T00:00:00.000Z");
    expect(
      isInactiveAccount(
        {
          createdAt: "2026-01-01T00:00:00Z",
          lastSignInAt: "2026-09-01T00:00:00Z",
        },
        cutoff,
      ),
    ).toBe(false);
    expect(
      isInactiveAccount(
        {
          createdAt: "2026-01-01T00:00:00Z",
          lastSignInAt: "2026-07-01T00:00:00Z",
        },
        cutoff,
      ),
    ).toBe(true);
  });

  it("falls back to account creation for users who never signed in", () => {
    expect(
      isInactiveAccount(
        { createdAt: "2026-01-01T00:00:00Z" },
        new Date("2026-07-15T00:00:00Z"),
      ),
    ).toBe(true);
  });

  it("formats the configured renewal currency without inventing a charge", () => {
    expect(formatPlanPrice(4999, "NPR")).toMatch(/4,999/);
  });
});
