import { describe, expect, it } from "vitest";
import { canonicalUrl, createPublishedMetadata } from "./published-metadata";

describe("published metadata", () => {
  it("keeps fallback canonicals under the published site prefix", () => {
    expect(
      canonicalUrl(
        "/experiences/sunset-tour",
        "https://tools.neurerohan.com.np/s/dubai-wave",
        "/experiences/sunset-tour",
      ),
    ).toBe(
      "https://tools.neurerohan.com.np/s/dubai-wave/experiences/sunset-tour",
    );
  });

  it("supports safe absolute canonical overrides and rejects script URLs", () => {
    expect(
      canonicalUrl(
        "https://travel.example/treks/annapurna",
        "https://travel.example",
        "/experiences/annapurna",
      ),
    ).toBe("https://travel.example/treks/annapurna");
    expect(
      canonicalUrl(
        "javascript:alert(1)",
        "https://travel.example",
        "/experiences/annapurna",
      ),
    ).toBe("https://travel.example/experiences/annapurna");
  });

  it("combines site and page robots controls without enabling indexing", () => {
    const metadata = createPublishedMetadata({
      pageTitle: "Annapurna Trek",
      seo: { indexable: true, nofollow: true, noarchive: true },
      publicBaseUrl: "https://travel.example",
      requestedPath: "/treks/annapurna",
      siteIndexingEnabled: false,
    });
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      noarchive: true,
    });
  });
});
