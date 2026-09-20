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

  it("gives comparison pages forty-one to fifty current first-party sources", () => {
    const batch = seoPages.slice(40, 50);
    for (const page of batch) {
      const sections = buildSeoContent(page);
      const sources = sections.flatMap((section) => section.sources ?? []);
      expect(
        sources.length,
        `${page.path} source count`,
      ).toBeGreaterThanOrEqual(2);
      expect(
        sources.every((source) => source.href.startsWith("https://")),
      ).toBe(true);
      expect(sections.map((section) => section.heading).join(" ")).toContain(
        "Run the same practical trial",
      );
    }
  });

  it("gives comparison pages fifty-one to sixty specialist evaluation evidence", () => {
    for (const page of seoPages.slice(50, 60)) {
      const sections = buildSeoContent(page);
      expect(
        sections.flatMap((section) => section.sources ?? []).length,
        `${page.path} source count`,
      ).toBeGreaterThanOrEqual(2);
      const body = sections
        .flatMap((section) => [section.heading, ...section.paragraphs])
        .join(" ");
      expect(body).toContain("TripOne+");
      expect(body).toContain("Migration");
    }
  });

  it("gives comparison pages sixty-one to seventy specialist evaluation evidence", () => {
    for (const page of seoPages.slice(60, 70)) {
      const sections = buildSeoContent(page);
      expect(
        sections.flatMap((section) => section.sources ?? []).length,
        `${page.path} source count`,
      ).toBeGreaterThanOrEqual(2);
      const body = sections
        .flatMap((section) => [section.heading, ...section.paragraphs])
        .join(" ");
      expect(body).toContain("TripOne+");
      expect(body).toContain("Migration");
    }
  });

  it("gives pages seventy-one to eighty comparison evidence and working resources", () => {
    const batch = seoPages.slice(70, 80);
    expect(
      new Set(batch.map((page) => JSON.stringify(buildSeoContent(page)))).size,
    ).toBe(10);
    for (const [index, page] of batch.entries()) {
      const sections = buildSeoContent(page);
      const headings = sections.map((section) => section.heading).join(" ");
      if (index < 2) {
        expect(
          sections.flatMap((section) => section.sources ?? []).length,
        ).toBeGreaterThanOrEqual(2);
        expect(headings).toContain("Run the same practical trial");
      } else {
        expect(headings).toContain("Complete the work in decision order");
        expect(headings).toContain("Quality and trust checks before approval");
      }
    }
  });

  it("gives resources eighty-one to ninety distinct operational templates", () => {
    const batch = seoPages.slice(80, 90);
    const sections = batch.map((page) => buildSeoContent(page));
    expect(new Set(sections.map((items) => JSON.stringify(items))).size).toBe(
      10,
    );
    for (const items of sections) {
      const headings = items.map((section) => section.heading).join(" ");
      expect(headings).toContain("Complete the work in decision order");
      expect(headings).toContain(
        "Turn the completed resource into an operating system",
      );
      expect(items.some((section) => (section.bullets?.length ?? 0) >= 4)).toBe(
        true,
      );
    }
  });

  it("gives pages ninety-one to one hundred distinct pricing resources and calculator guidance", () => {
    const batch = seoPages.slice(90, 100);
    const sections = batch.map((page) => buildSeoContent(page));
    expect(new Set(sections.map((items) => JSON.stringify(items))).size).toBe(
      10,
    );
    for (const [index, items] of sections.entries()) {
      const headings = items.map((section) => section.heading).join(" ");
      if (index < 2) {
        expect(headings).toContain("Complete the work in decision order");
      } else {
        expect(headings).toContain("How to read the live result");
        expect(headings).toContain("Assumptions and limitations");
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
