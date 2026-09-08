import { describe, expect, it } from "vitest";
import {
  normalizePageSelections,
  recommendedPageSelections,
} from "./page-structure";

describe("multi-capability page structure", () => {
  it("is independent of capability selection order", () => {
    const left = recommendedPageSelections([
      "trekking",
      "motorcycle_rental",
      "equipment_rental",
    ]);
    const right = recommendedPageSelections([
      "equipment_rental",
      "trekking",
      "motorcycle_rental",
    ]);
    expect(left).toEqual(right);
  });

  it("does not force an experiences page for a rental-only business", () => {
    const pages = normalizePageSelections(["motorcycle_rental"]);
    expect(pages.some((page) => page.key === "rentals")).toBe(true);
    expect(pages.some((page) => page.key === "experiences")).toBe(false);
  });

  it("keeps Home but honors optional deselection and labels", () => {
    const selections = recommendedPageSelections(["safari"]).map((page) =>
      page.key === "experiences"
        ? { ...page, selected: false }
        : page.key === "about"
          ? { ...page, title: "Our story", slug: "our-story" }
          : { ...page, selected: page.key === "home" ? false : page.selected },
    );
    const pages = normalizePageSelections(["safari"], selections);
    expect(pages[0]?.key).toBe("home");
    expect(pages.some((page) => page.key === "experiences")).toBe(false);
    expect(pages.find((page) => page.key === "about")).toMatchObject({
      title: "Our story",
      slug: "our-story",
    });
  });
});
