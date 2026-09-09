export type ResourceCategory = "Guide" | "SEO" | "Conversion" | "Comparison";

export type ResourceSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ResourceFaq = {
  question: string;
  answer: string;
};

export type ResourceSource = {
  label: string;
  href: string;
};

export type ResourceArticle = {
  slug: string;
  category: ResourceCategory;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  takeaways: string[];
  sections: ResourceSection[];
  faqs: ResourceFaq[];
  sources?: ResourceSource[];
};

export const resources: ResourceArticle[] = [
  {
    slug: "tour-operator-website-checklist",
    category: "Guide",
    title: "The complete tour operator website checklist",
    description:
      "A practical launch checklist for building a clear, trustworthy website that helps travellers choose and enquire.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A local guide leading a small walking tour",
    readTime: "9 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Give each important experience its own useful page.",
      "Answer planning questions before asking for the booking.",
      "Treat mobile navigation and enquiry paths as primary journeys.",
    ],
    sections: [
      {
        heading: "Start with the traveller's decision",
        paragraphs: [
          "A tourism website is not only a brochure. Its job is to help a traveller understand what you offer, decide whether an experience fits, trust the operator, and take a clear next step.",
          "Organize the site around those decisions. A strong starting structure is Home, Experiences, About, FAQ and Contact, with location or category pages only when they add genuinely distinct information.",
        ],
        bullets: [
          "A specific promise and location in the main heading",
          "Visible experience categories and starting prices where known",
          "A clear booking or enquiry action",
          "Real contact details and realistic operating information",
        ],
      },
      {
        heading: "Build complete experience pages",
        paragraphs: [
          "Every major tour, rental or activity should have a stable URL and enough information to stand on its own. Thin cards that send visitors directly to an external checkout leave important questions unanswered.",
        ],
        bullets: [
          "Duration, location, meeting point and guest limits",
          "Highlights, itinerary, inclusions and exclusions",
          "Age, difficulty or safety requirements where relevant",
          "Cancellation terms and a useful booking label",
          "Accurate photographs with descriptive alternative text",
        ],
      },
      {
        heading: "Make trust verifiable",
        paragraphs: [
          "Use claims that a visitor can understand and verify. Show the people behind the operation, explain safety or guide credentials where they are real, and link to legitimate third-party profiles when available.",
          "Avoid invented superlatives, unsupported awards and decorative review counts. Honest detail is stronger than generic social proof.",
        ],
      },
      {
        heading: "Run the launch checks",
        paragraphs: [
          "Before publishing, test the complete path on a real phone: arrive from search, open the menu, compare two experiences, submit an enquiry and return to the previous page. Then verify titles, canonical URLs, social previews, structured data, sitemap coverage and redirects.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many pages does a tour operator website need?",
        answer:
          "Start with the pages travellers need to understand and choose your offer. Five strong pages plus complete experience detail pages are usually more useful than dozens of thin pages.",
      },
      {
        question: "Should every tour have a separate page?",
        answer:
          "Important, bookable experiences should normally have separate URLs so visitors and search engines can understand their distinct location, duration, price and itinerary.",
      },
    ],
  },
  {
    slug: "tourism-website-seo-guide",
    category: "SEO",
    title: "SEO for tour and activity websites: a durable guide",
    description:
      "Build discoverability with useful destination structure, clean technical signals and experience pages written for real travellers.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "Hikers looking across a mountain route at sunrise",
    readTime: "11 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Create pages for real offerings and useful location relationships.",
      "Keep metadata descriptive, concise and unique.",
      "Earn visibility with first-hand detail rather than repeated keywords.",
    ],
    sections: [
      {
        heading: "Model the business before writing pages",
        paragraphs: [
          "Search-friendly tourism websites begin with clear entities: the business, each experience or rental, the places served, and the relationships between them. That structure makes navigation, internal linking and metadata consistent.",
          "Create a location page only when you can provide location-specific knowledge. Create a category page when it helps visitors compare a meaningful group of offers. Do not create every possible keyword-and-city combination.",
        ],
      },
      {
        heading: "Give each page one clear purpose",
        paragraphs: [
          "A useful title can combine the experience, location and brand without becoming a list of keywords. A useful description tells the searcher what the page contains and why it may answer their question.",
        ],
        bullets: [
          "Use one descriptive H1 that matches the page topic",
          "Write unique titles and descriptions from verified business data",
          "Use readable paths and preserve old URLs with redirects",
          "Add helpful internal links between locations and experiences",
        ],
      },
      {
        heading: "Support crawling and sharing",
        paragraphs: [
          "Publish canonical URLs, an XML sitemap, appropriate robots rules and Open Graph images. Structured data should describe what is actually visible; it should never invent ratings, availability or price information.",
          "Image dimensions, responsive source sets and meaningful alternative text improve usability as well as search understanding. Compress originals before upload and avoid using one oversized hero file everywhere.",
        ],
      },
      {
        heading: "Measure actions, not vanity",
        paragraphs: [
          "Monitor pages that lead to experience views, booking clicks and genuine enquiries. Search impressions matter, but the useful question is whether the right visitors find a clear path to the right offer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does adding more destination pages improve SEO?",
        answer:
          "Only when each page serves a distinct traveller need with original, location-specific information. Large sets of near-duplicate pages can make a site less useful.",
      },
      {
        question: "Can structured data guarantee rich results?",
        answer:
          "No. Structured data helps systems understand a page, but search engines decide whether and how to display enhanced results.",
      },
    ],
  },
  {
    slug: "convert-tourism-website-visitors-into-enquiries",
    category: "Conversion",
    title: "How to turn tourism website visits into qualified enquiries",
    description:
      "Improve booking intent with clearer offers, useful reassurance and lower-friction mobile journeys.",
    image: "/images/marketing/coastal-yacht.webp",
    imageAlt: "A yacht moving through clear coastal water",
    readTime: "8 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Match calls to action to the visitor's level of intent.",
      "Place essential planning details near the decision point.",
      "Measure booking clicks and enquiries separately.",
    ],
    sections: [
      {
        heading: "Reduce uncertainty before adding urgency",
        paragraphs: [
          "Travellers hesitate when the experience is unclear, not simply because a button is the wrong color. Show duration, meeting area, starting price, suitability and what happens after the enquiry before introducing urgency.",
          "Use 'Check availability' when availability must be confirmed, 'Request a quote' for variable packages, and 'Book now' only when the next step genuinely supports booking.",
        ],
      },
      {
        heading: "Design the mobile decision path",
        paragraphs: [
          "Keep the primary action visible without covering important content. Use appropriately sized tap targets, readable text, compact navigation and forms that request only information needed for the first response.",
        ],
        bullets: [
          "Name and a reliable contact method",
          "Desired date when it affects availability",
          "Guest count when it affects capacity or price",
          "A short message for questions or requirements",
        ],
      },
      {
        heading: "Use reassurance near the action",
        paragraphs: [
          "Cancellation information, response expectations, safety requirements and accepted booking methods belong close to the decision. Verified testimonials can help, but they should not replace concrete operational detail.",
        ],
      },
      {
        heading: "Build a measurement loop",
        paragraphs: [
          "Track page views, product views, booking-link clicks and successful lead submissions as separate events. Look for pages that attract interest but fail to move visitors forward, then improve the missing information before changing the visual design.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should a tourism website use WhatsApp as its main CTA?",
        answer:
          "WhatsApp can be valuable for high-consideration or local bookings, but provide enough context first and retain another accessible contact route for visitors who do not use it.",
      },
    ],
  },
  {
    slug: "jet-ski-rental-website-guide",
    category: "Guide",
    title: "A better website structure for jet ski rental businesses",
    description:
      "Organize ride options, safety information, locations and booking paths for fast mobile decisions.",
    image: "/images/marketing/ocean-hero.webp",
    imageAlt: "A jet ski crossing the sea near a rocky coast",
    readTime: "7 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Separate ride durations or routes when the choice materially differs.",
      "Explain driver, passenger and safety requirements early.",
      "Use real location and meeting-point information.",
    ],
    sections: [
      {
        heading: "Make ride options easy to compare",
        paragraphs: [
          "Visitors commonly compare duration, route, machine or rider capacity, and price. Present those fields consistently across cards and detail pages so the choice does not require opening multiple chat conversations.",
        ],
      },
      {
        heading: "Treat safety as useful product information",
        paragraphs: [
          "State minimum driver age, passenger rules, required identification, included safety equipment and instructor or guide arrangements. Avoid broad safety promises that you cannot substantiate.",
        ],
      },
      {
        heading: "Show the full arrival journey",
        paragraphs: [
          "Clarify the meeting area, arrival time, parking or transfer information, what to bring and what happens when weather changes. This information reduces pre-booking friction and repetitive support messages.",
        ],
      },
      {
        heading: "Use photography responsibly",
        paragraphs: [
          "Prioritize current images of the actual equipment, launch point and riding area. Add alternative text that describes the useful scene rather than repeating the business name or stuffing location keywords.",
        ],
      },
    ],
    faqs: [
      {
        question: "What should appear above the fold on a jet ski website?",
        answer:
          "Use a clear location-led heading, a concise description, a real activity image and one primary action that matches the booking process.",
      },
    ],
  },
  {
    slug: "triponeplus-vs-wix-tour-operators",
    category: "Comparison",
    title: "TripOne+ vs Wix for tour and activity operators",
    description:
      "A fair comparison of a tourism-structured workflow and a broad general-purpose website platform.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A guide discussing a route with a small travel group",
    readTime: "8 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Wix serves many business categories with broad design and business tools.",
      "TripOne+ starts from structured tourism inventory and page recipes.",
      "Choose based on workflow fit, required integrations and desired design freedom.",
    ],
    sections: [
      {
        heading: "The core difference",
        paragraphs: [
          "Wix is a general website platform with freeform design, templates and business tools including scheduling, payments, lead management and SEO guidance. That breadth can suit teams that want one broad ecosystem.",
          "TripOne+ is narrower by design. It models experiences, rentals, rates, destinations and tourism-specific details, then uses deterministic recipes to create a recommended website structure without an AI API.",
        ],
      },
      {
        heading: "When Wix may be the stronger fit",
        paragraphs: [
          "Consider Wix when you need its wider application ecosystem, general commerce features, AI-assisted creation, or highly freeform construction across business types that are not primarily tours and activities.",
        ],
      },
      {
        heading: "When TripOne+ may be the stronger fit",
        paragraphs: [
          "Consider TripOne+ when the website should begin with tourism terminology, reusable experience and rental records, category-aware page recipes, controlled themes, first-party enquiry tracking and the same renderer from builder preview to production.",
        ],
      },
      {
        heading: "How to decide",
        paragraphs: [
          "List the records you update every week and the actions visitors must complete. Test both workflows with one real tour, one change to its price or route, and one mobile enquiry. The better tool is the one your team can keep accurate after launch.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does TripOne+ replace every Wix feature?",
        answer:
          "No. TripOne+ focuses on tourism website structure, publishing, leads and first-party activity analytics. Wix offers a much broader general business ecosystem.",
      },
    ],
    sources: [
      { label: "Wix website platform", href: "https://www.wix.com/" },
      {
        label: "Wix travel-agency website overview",
        href: "https://www.wix.com/business/solutions/travel-agency-website",
      },
    ],
  },
  {
    slug: "triponeplus-vs-webflow-tourism",
    category: "Comparison",
    title: "TripOne+ vs Webflow for tourism websites",
    description:
      "Compare specialist tourism structure with a powerful visual-first, composable website platform.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "A wide mountain landscape with two hikers",
    readTime: "8 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Webflow emphasizes visual development, composable CMS and broad design control.",
      "TripOne+ emphasizes guided tourism records, presets and operating workflows.",
      "The right choice depends on who maintains the site after launch.",
    ],
    sections: [
      {
        heading: "Two different starting points",
        paragraphs: [
          "Webflow describes a visual-first platform with a composable CMS, detailed design control, APIs, collaboration, hosting and SEO tooling. It is well suited to teams that want to design custom web experiences across many industries.",
          "TripOne+ begins with the operating model of a tourism business. Experiences, rentals, destinations, activities and rates are first-class records, and site generation applies business-category recipes and safe copy templates.",
        ],
      },
      {
        heading: "When Webflow may be the stronger fit",
        paragraphs: [
          "Webflow may fit better when a designer needs granular layout and interaction control, a marketing team needs a general composable CMS, or developers need headless APIs and a wider integration ecosystem.",
        ],
      },
      {
        heading: "When TripOne+ may be the stronger fit",
        paragraphs: [
          "TripOne+ may fit better when a small operator wants guided setup, consistent experience pages, tourism-specific inputs, simpler publishing guardrails, lead management and built-in product-level analytics without assembling the model from scratch.",
        ],
      },
      {
        heading: "Evaluate maintenance, not only launch",
        paragraphs: [
          "A visually impressive launch can decay when routine updates are difficult. Ask who will change itineraries, rates, images, destination relationships and SEO fields, and compare the number of steps each platform requires.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is TripOne+ as freeform as Webflow?",
        answer:
          "No. TripOne+ intentionally uses theme tokens, validated section types and tourism-aware guardrails. Webflow is designed for broader visual control.",
      },
    ],
    sources: [
      {
        label: "Webflow CMS overview",
        href: "https://webflow.com/feature/cms",
      },
      {
        label: "Webflow SEO overview",
        href: "https://webflow.com/feature/seo",
      },
    ],
  },
  {
    slug: "website-builder-vs-tour-booking-software",
    category: "Comparison",
    title: "Tourism website builder vs booking software: what do you need?",
    description:
      "Understand the different jobs of your marketing website and reservation system—and when they should work together.",
    image: "/images/marketing/safari-dawn.webp",
    imageAlt: "Elephants crossing open savannah at dawn",
    readTime: "7 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "A website explains and merchandises the offer; booking software manages reservations and availability.",
      "Many operators need both systems connected through clear booking links or widgets.",
      "Do not promise live availability unless the booking system actually provides it.",
    ],
    sections: [
      {
        heading: "The website's job",
        paragraphs: [
          "A tourism website helps people discover, understand and compare experiences. It communicates the brand, builds location context, answers planning questions, earns organic visibility and routes visitors toward booking or enquiry.",
        ],
      },
      {
        heading: "The reservation system's job",
        paragraphs: [
          "Booking platforms typically focus on inventory, availability, checkout, channel distribution and operational management. For example, Bókun presents booking widgets, website options, reseller and OTA connections, and centralized reservation management.",
        ],
      },
      {
        heading: "A practical connected setup",
        paragraphs: [
          "Maintain the canonical experience description and discovery journey on your website, then send high-intent visitors to the accurate booking flow. Use a deep link to the relevant product rather than a generic booking homepage whenever the provider supports it.",
        ],
        bullets: [
          "Keep names and essential policies consistent across systems",
          "Track outbound booking clicks separately from completed enquiries",
          "Test return, cancellation and mobile checkout journeys",
          "Avoid showing stale prices or availability on the marketing site",
        ],
      },
      {
        heading: "Where TripOne+ fits",
        paragraphs: [
          "TripOne+ is the website, structured-content, publishing, lead and first-party interaction layer. It can link to an operator's booking URL; it does not claim to replace a live reservation inventory system.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use TripOne+ with existing booking software?",
        answer:
          "Yes. Experiences and rentals can use booking URLs so the public website can direct visitors to an existing reservation flow.",
      },
    ],
    sources: [
      {
        label: "Bókun booking platform overview",
        href: "https://www.bokun.io/",
      },
    ],
  },
  {
    slug: "diving-website-content-checklist",
    category: "Guide",
    title: "The diving and snorkelling website content checklist",
    description:
      "Publish useful trip, certification, safety and reef information without hiding essential details behind an enquiry form.",
    image: "/images/marketing/reef-diving.webp",
    imageAlt: "Two scuba divers above a healthy coral reef",
    readTime: "7 min read",
    publishedAt: "2026-09-10",
    updatedAt: "2026-09-10",
    takeaways: [
      "Separate certified dives, introductory activities and snorkelling offers.",
      "State qualification, health and equipment requirements accurately.",
      "Explain meeting points, transfers and weather decisions.",
    ],
    sections: [
      {
        heading: "Separate experiences by eligibility",
        paragraphs: [
          "A certified dive, introductory experience and guided snorkelling trip serve different guests. Use distinct records and pages so prerequisites, duration and included equipment remain unambiguous.",
        ],
      },
      {
        heading: "Publish verified operational details",
        paragraphs: [
          "Include certification requirements, minimum age, medical or health guidance, group limits, supervision, equipment inclusions and the policy for weather changes. Refer visitors to the appropriate professional documentation where required.",
        ],
      },
      {
        heading: "Describe the day from arrival to return",
        paragraphs: [
          "Explain check-in, briefing, transport, water time, surface intervals and approximate return. This helps guests compare offers and prepare without implying conditions that cannot be guaranteed.",
        ],
      },
      {
        heading: "Use honest marine imagery",
        paragraphs: [
          "Use photographs from places you actually visit and avoid implying guaranteed wildlife encounters. Caption or describe useful context such as boat setup, entry style and representative reef conditions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should wildlife sightings appear in the page title?",
        answer:
          "Only when the wording is accurate and not a guarantee. Describe the actual activity and location first, then explain potential wildlife responsibly in the page content.",
      },
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}

export function getRelatedResources(article: ResourceArticle, limit = 3) {
  return resources
    .filter((resource) => resource.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.category === article.category) -
        Number(a.category === article.category),
    )
    .slice(0, limit);
}
