import { describe, expect, it } from "vitest";
import {
  getRelatedSeoPages,
  getSeoEditorialLinks,
  getSeoPage,
  getSeoPages,
  seoPages,
} from "./seo-catalog";
import {
  buildSeoContent,
  buildSeoFaqs,
  seoContentWordCount,
} from "./seo-content";

describe("SEO content catalog", () => {
  it("contains every unique page from the supplied inventory", () => {
    expect(seoPages).toHaveLength(138);
    expect(new Set(seoPages.map((page) => page.path)).size).toBe(138);
  });

  it("generates at least 1,500 visible words for every page", () => {
    for (const page of seoPages) {
      expect(
        seoContentWordCount(page),
        `${page.path} content depth`,
      ).toBeGreaterThanOrEqual(1500);
    }
  });

  it("gives the first ten growth-service pages distinct service-specific plans", () => {
    const batch = seoPages.slice(0, 10);
    expect(batch.every((page) => page.pageType === "Growth Service")).toBe(
      true,
    );
    const bodies = batch.map((page) =>
      buildSeoContent(page)
        .flatMap((section) => [
          section.heading,
          ...section.paragraphs,
          ...(section.bullets ?? []),
        ])
        .join(" "),
    );
    expect(new Set(bodies).size).toBe(10);
    for (const body of bodies) {
      expect(body).toContain("Measurement and evidence");
      expect(body).toContain("A practical 30, 60 and 90-day roadmap");
    }
  });

  it("gives pages eleven to twenty distinct service and industry operating plans", () => {
    const batch = seoPages.slice(10, 20);
    const bodies = batch.map((page) =>
      buildSeoContent(page)
        .flatMap((section) => [
          section.heading,
          ...section.paragraphs,
          ...(section.bullets ?? []),
        ])
        .join(" "),
    );

    expect(new Set(bodies).size).toBe(10);
    for (const [index, body] of bodies.entries()) {
      if (index < 6) {
        expect(body).toContain("Measurement and evidence");
        expect(body).toContain("Common risks to control");
      } else {
        expect(body).toContain("From catalogue to customer and delivery");
        expect(body).toContain("Operational safeguards before scale");
      }
    }
  });

  it("gives specialist operator pages twenty-one to thirty distinct operating plans", () => {
    const batch = seoPages.slice(20, 30);
    const bodies = batch.map((page) =>
      buildSeoContent(page)
        .flatMap((section) => [
          section.heading,
          ...section.paragraphs,
          ...(section.bullets ?? []),
        ])
        .join(" "),
    );

    expect(new Set(bodies).size).toBe(10);
    for (const body of bodies) {
      expect(body).toContain("From catalogue to customer and delivery");
      expect(body).toContain("Operational safeguards before scale");
      expect(body).toContain("A practical 30, 60 and 90-day implementation");
    }
  });

  it("gives pages thirty-one to forty sourced industry and comparison guidance", () => {
    const batch = seoPages.slice(30, 40);
    const sections = batch.map((page) => buildSeoContent(page));
    expect(new Set(sections.map((items) => JSON.stringify(items))).size).toBe(
      10,
    );

    for (const [index, items] of sections.entries()) {
      const body = items.map((item) => item.heading).join(" ");
      if (index < 4) {
        expect(body).toContain("From catalogue to customer and delivery");
      } else {
        expect(body).toContain("Run the same practical trial");
        expect(items.some((item) => (item.sources?.length ?? 0) >= 2)).toBe(
          true,
        );
      }
    }
  });

  it("builds valid contextual related-page links", () => {
    for (const page of seoPages) {
      const related = getRelatedSeoPages(page);
      expect(related).toHaveLength(6);
      expect(related.every((item) => getSeoPage(item.path))).toBe(true);
      expect(related.some((item) => item.path === page.path)).toBe(false);
    }
  });

  it("keeps every industry page in the industry hub, including supplied root slugs", () => {
    expect(getSeoPages("for")).toHaveLength(18);
    expect(getSeoPage("/for-diving-snorkelling")?.pageType).toBe("Industry");
    expect(getSeoPage("/for-transfer-operators")?.pageType).toBe("Industry");
  });

  it("provides six valid, non-self editorial links per page", () => {
    for (const page of seoPages) {
      const links = getSeoEditorialLinks(page);
      expect(links, `${page.path} editorial links`).toHaveLength(6);
      expect(new Set(links.map((link) => link.href)).size).toBe(6);
      expect(links.every((link) => link.href.startsWith("/"))).toBe(true);
      expect(links.some((link) => link.href === page.path)).toBe(false);
    }
  });

  it("covers the primary query and every supplied entity in visible copy", () => {
    for (const page of seoPages) {
      const visibleText = [
        page.title,
        page.metaDescription,
        ...buildSeoContent(page).flatMap((section) => [
          section.heading,
          ...section.paragraphs,
          ...(section.bullets ?? []),
        ]),
        ...buildSeoFaqs(page).flatMap((faq) => [faq.question, faq.answer]),
      ]
        .join(" ")
        .toLocaleLowerCase("en");
      expect(
        occurrences(visibleText, page.primaryKeyword.toLocaleLowerCase("en")),
        `${page.path} primary-keyword coverage`,
      ).toBeGreaterThanOrEqual(4);
      for (const entity of page.entities) {
        expect(visibleText, `${page.path} entity: ${entity}`).toContain(
          entity.toLocaleLowerCase("en"),
        );
      }
    }
  });

  it("answers at least seven visible questions on every catalog page", () => {
    for (const page of seoPages) {
      const faqs = buildSeoFaqs(page);
      expect(faqs.length, `${page.path} FAQ depth`).toBeGreaterThanOrEqual(7);
      expect(new Set(faqs.map((faq) => faq.question)).size).toBe(faqs.length);
    }
  });
});

function occurrences(source: string, query: string) {
  return source.split(query).length - 1;
}
