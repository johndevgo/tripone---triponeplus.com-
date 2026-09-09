import { describe, expect, it } from "vitest";
import { themeMarketingImages } from "./marketing-assets";
import { getRelatedResources, getResource, resources } from "./resources";
import { themes } from "@/lib/site-generator/themes";

describe("marketing resource library", () => {
  it("uses unique stable slugs and complete article data", () => {
    const slugs = resources.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(resources.length).toBeGreaterThanOrEqual(8);
    for (const article of resources) {
      expect(article.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(article.title.length).toBeGreaterThan(20);
      expect(article.description.length).toBeGreaterThan(80);
      expect(article.image).toMatch(/^\/images\/marketing\/.+\.webp$/);
      expect(article.takeaways.length).toBeGreaterThanOrEqual(3);
      expect(article.sections.length).toBeGreaterThanOrEqual(4);
      expect(article.faqs.length).toBeGreaterThan(0);
    }
  });

  it("keeps comparison claims linked to primary HTTPS sources", () => {
    const comparisons = resources.filter(
      (article) => article.category === "Comparison",
    );
    expect(comparisons.length).toBeGreaterThanOrEqual(3);
    for (const article of comparisons) {
      expect(article.sources?.length).toBeGreaterThan(0);
      for (const source of article.sources ?? []) {
        expect(new URL(source.href).protocol).toBe("https:");
      }
    }
  });

  it("resolves articles and favors same-category recommendations", () => {
    const article = getResource("triponeplus-vs-wix-tour-operators");
    expect(article).toBeDefined();
    const related = getRelatedResources(article!);
    expect(related).toHaveLength(3);
    expect(related[0]?.category).toBe("Comparison");
    expect(related.every((item) => item.slug !== article?.slug)).toBe(true);
  });

  it("provides an optimized visual preview for every selectable theme", () => {
    expect(Object.keys(themeMarketingImages).sort()).toEqual(
      Object.keys(themes).sort(),
    );
    for (const image of Object.values(themeMarketingImages)) {
      expect(image).toMatch(/^\/images\/marketing\/.+\.webp$/);
    }
  });
});
