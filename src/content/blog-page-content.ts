import type { SeoPageSpec } from "./seo-catalog";
import type { SeoContentSection } from "./seo-content";

type BlogProfile = {
  thesis: string;
  context: string;
  steps: string[];
  foundation: string;
  execution: string;
  measurement: string;
  safeguards: string[];
  roadmap: string;
};

const profiles: Record<string, BlogProfile> = {
  "/blog/how-to-start-tour-operator-business": {
    thesis:
      "Starting a tour operator business begins with a deliverable experience, lawful operating model and controlled path to a first paying customer. A logo and broad destination website are downstream decisions; product safety, permission, supplier, pricing and responsibility come first.",
    context:
      "The exact licences, insurance, tax, consumer protection and safety duties depend on jurisdiction and activity. Founders should obtain qualified local advice rather than treating an international checklist as legal approval. The practical goal is to validate one complete product and workflow before expanding a catalogue.",
    steps: [
      "Define one traveller, problem, destination and experience promise",
      "Verify registration, licensing, insurance, permits and safety ownership",
      "Design the itinerary, capacity, resources and contingency process",
      "Contract suppliers and build a dated cost and pricing model",
      "Create accurate product content and an enquiry or booking journey",
      "Pilot, record feedback and prove delivery before scaling demand",
    ],
    foundation:
      "Model the experience as an operating system: meeting point, timing, route, guide or equipment, accessibility, inclusions, exclusions, minimum and maximum group, cancellation and emergency response. Write customer information from those verified records so marketing cannot promise a version operations does not recognise.",
    execution:
      "A focused launch can use one product page, one useful destination or preparation guide, one inquiry path and disciplined follow-up. Distribution partners may supplement direct demand, but ownership of customer communication, availability and payment must be explicit. Test every mobile step with a real submission before spending on traffic.",
    measurement:
      "Track qualified inquiries, response time, proposal or checkout progression, confirmed bookings, contribution, cancellation reasons and delivery exceptions. Separate passengers from customers and booking value from earned revenue. Early learning is valuable only when the records are consistent enough to explain it.",
    safeguards: [
      "Do not operate before required licences, insurance and qualified safety controls",
      "Do not confirm capacity or suppliers that remain unverified",
      "Do not price from competitors without a complete cost model",
      "Do not invent reviews, awards, rankings or customer volume",
    ],
    roadmap:
      "In the first month, validate compliance, the product and cost model. In the second, complete the customer and operating journey and run controlled pilots. In the third, compare real demand, margin and delivery evidence, then add only the next product or channel the team can support.",
  },
  "/blog/how-to-start-travel-agency": {
    thesis:
      "Starting a travel agency means designing a trusted advisory and transaction service around a defined customer, trip type and supplier ecosystem. The business must explain how it earns money, protects traveller information and remains accountable when plans change.",
    context:
      "Host-agency, accreditation, bonding, insurance, registration and seller-of-travel requirements vary by market and business model. A founder should verify local professional and legal obligations and read the contracts that govern commission, payment, liability and client ownership.",
    steps: [
      "Choose a customer segment and trip problem the agency can serve deeply",
      "Confirm business, host, accreditation, insurance and compliance structure",
      "Document supplier access, commercial terms and booking responsibility",
      "Define planning fees, commissions, service boundaries and cash flow",
      "Build inquiry, proposal, payment, documentation and support workflows",
      "Launch useful destination and service content around real expertise",
    ],
    foundation:
      "Start with one representative inquiry and map research, proposal, approval, supplier booking, payment, final documents, travel support and post-trip follow-up. Decide where passport, payment and sensitive preference data may be collected, who needs access and when it should be removed.",
    execution:
      "A strong public site clarifies audience, services, fees or consultation approach, destination expertise and next step. CRM records should preserve source, trip context, owner and due action. Templates can accelerate consistent work, but advisers must review availability, entry information, terms and customer-specific suitability.",
    measurement:
      "Review qualified inquiries, proposal effort, response, fee collection, conversion, commission timing, cancellation and repeat customers. Measure profitability by service type and channel with a consistent cost definition instead of interpreting supplier sales volume as agency income.",
    safeguards: [
      "Do not promise supplier inventory before confirmation",
      "Do not collect sensitive traveller information in unsecured general forms",
      "Do not recognise commission before the applicable agreement permits it",
      "Do not present destination familiarity or credentials the team cannot evidence",
    ],
    roadmap:
      "Month one establishes the legal, host and commercial model. Month two builds the website, CRM and service workflow around one trip type. Month three tests qualified inquiries and delivery, then refines positioning, fees and systems from observed workload and outcomes.",
  },
  "/blog/how-to-get-more-direct-tour-bookings": {
    thesis:
      "More direct tour bookings come from making an owned discovery and decision journey easier to trust and complete, while responding reliably after the action. Direct growth is not simply removing distributors or adding a Book now button.",
    context:
      "A distributor can create valuable reach, payment convenience and traveller confidence. The useful goal is a healthier channel mix and stronger customer relationship, not a universal direct-only policy. Operators should compare total contribution, cancellation, data access and serviceability by source.",
    steps: [
      "Identify the products and audiences suited to direct acquisition",
      "Make price context, itinerary, suitability and policies easy to compare",
      "Build destination and planning content around genuine local expertise",
      "Reduce mobile friction in inquiry, checkout and external handoffs",
      "Preserve source and product context for fast human follow-up",
      "Retain permissioned customer relationships after a successful trip",
    ],
    foundation:
      "Direct-booking readiness starts with accurate product data, stable URLs, useful media, transparent conditions and a tested action. Technical SEO and speed help discovery, while clear cancellation, meeting, safety and support information reduces uncertainty at the point of purchase.",
    execution:
      "Prioritise searches and partnerships that match real products, use channel-specific landing pages where intent differs and build email or remarketing only with appropriate consent. Give reservations a response standard and enough context to continue the exact conversation the visitor started.",
    measurement:
      "Track direct discovery, qualified actions, response, confirmed bookings, contribution and retention. Compare direct acquisition and service cost with total distributed cost on a consistent basis. Attribute only what the booking and customer records can support.",
    safeguards: [
      "Do not undercut contracted rate rules without review",
      "Do not hide important conditions to reduce page friction",
      "Do not count clicks, calls or messages as confirmed bookings",
      "Do not abandon productive partners without a transition test",
    ],
    roadmap:
      "First repair one high-value product and its mobile action. Next strengthen the supporting destination and trust journey, then test one acquisition source. Scale after direct contribution, response and delivery evidence remain healthy.",
  },
  "/blog/how-to-market-tour-company": {
    thesis:
      "Marketing a tour company means connecting a well-defined experience to the traveller most likely to value and complete it. The operating capacity, offer and response journey should determine the channel plan—not the desire to appear everywhere.",
    context:
      "Tours are visual and emotional purchases, but practical facts decide whether attention becomes a suitable booking. Season, location, group fit, safety, price, logistics and cancellation context must travel with the creative promise. Unsupported urgency or popularity can damage both trust and operations.",
    steps: [
      "Choose the priority product, audience, season and commercial constraint",
      "Document positioning, proof, objections and claim boundaries",
      "Assign search, social, paid, partner and email distinct roles",
      "Connect every campaign to an accurate landing and response path",
      "Tag source and preserve product context through the pipeline",
      "Review qualified demand, bookings, contribution and capacity together",
    ],
    foundation:
      "Build from a maintained product record and a small library of representative media. The homepage establishes the business promise; product pages resolve the experience decision; destination and planning guides capture useful context; and campaign pages continue a specific advert or partner message.",
    execution:
      "Sequence activity around the constraint. Search can capture existing demand, paid media can test a clear offer, social can build familiarity and customer proof, and email can support permissioned relationships. One complete measured journey is more valuable than several unowned channel calendars.",
    measurement:
      "Use discovery and engagement as diagnostics, then judge performance through qualified enquiries, bookings, contribution and customer outcomes. Document attribution windows and reconcile platform reports with sales and booking records where possible.",
    safeguards: [
      "Do not promote capacity the operation cannot safely deliver",
      "Do not use customer media or reviews without appropriate rights",
      "Do not let channel teams publish conflicting prices or terms",
      "Do not scale a campaign before response and attribution work",
    ],
    roadmap:
      "In 30 days, establish the offer, audience, assets and measurement. By 60 days, run one focused campaign and repair the downstream journey. By 90 days, shift effort toward evidence-backed channels and document the next seasonal plan.",
  },
  "/blog/tour-operator-seo-guide": {
    thesis:
      "Tour operator SEO is the work of making real products, destinations and expertise crawlable, understandable and useful across the traveller's search journey. It is not the production of many lightly altered location pages or the repetition of target phrases.",
    context:
      "Search demand can begin with a destination, activity, itinerary, suitability question or named product. The site architecture should reflect those relationships while keeping one clear purpose for each indexable URL. Product facts and operational knowledge create the depth generic writing cannot.",
    steps: [
      "Audit crawl, indexation, templates, canonicals and redirects",
      "Map products, packages, destinations and customer questions",
      "Assign one primary search purpose to each useful URL",
      "Improve mobile performance, accessibility and structured content",
      "Build descriptive internal links and consolidate overlap",
      "Measure search landing journeys through qualified outcomes",
    ],
    foundation:
      "Technical foundations include successful responses, intentional indexation, stable canonicals, XML sitemaps, performant images and accessible semantic templates. Editorial foundations include distinctive product and destination facts, clear ownership and update triggers. Both are required; neither compensates for the other.",
    execution:
      "Start with revenue-relevant pages already receiving demand or internal links. Strengthen their information, media, schema and next action, then create supporting guides from real questions. Earn mentions through genuine expertise, partnerships and resources rather than manufactured link volume.",
    measurement:
      "Review indexing, queries, clicks and landing behaviour alongside qualified enquiries and bookings. Segment brand and non-brand where useful, annotate material releases and avoid claiming causation from a single ranking movement.",
    safeguards: [
      "Do not create doorway pages for every keyword and location combination",
      "Do not publish unsupported reviews, prices or availability schema",
      "Do not hide entity or keyword lists in customer-facing copy",
      "Do not report traffic growth as booking growth without records",
    ],
    roadmap:
      "Month one fixes discovery and architecture. Month two strengthens priority product and destination journeys and publishes the first useful support content. Month three reviews index and commercial evidence, consolidates weak pages and plans the next cluster.",
  },
  "/blog/travel-agency-seo": {
    thesis:
      "Travel agency SEO should make genuine destination knowledge, service approach and trip expertise discoverable while guiding the right prospect into a consultative sales journey. It should not imply that every destination query represents inventory or firsthand expertise.",
    context:
      "Agencies may sell tailor-made, cruise, group, corporate, luxury or specialist travel through supplier relationships rather than owned departures. Search content must clarify the agency's role, service area, planning process and limits so inquiries arrive with realistic expectations.",
    steps: [
      "Define the agency's audience, trip types, destinations and service model",
      "Repair technical discovery and one authoritative page per purpose",
      "Build service and destination hubs from demonstrable expertise",
      "Answer planning, comparison and process questions with useful detail",
      "Connect pages to consultation forms that preserve trip context",
      "Review qualified pipeline and bookings beside search demand",
    ],
    foundation:
      "Core pages should explain who the agency helps, what advisers do, how fees or consultation work and where supplier responsibility begins. Destination content can demonstrate planning judgement with season, pacing and suitability information without pretending to provide live prices or entry guarantees.",
    execution:
      "Prioritise the destinations and services that produce valuable, deliverable work. Create internal links from broad hubs to focused guides and service pages, and keep adviser bios and proof accurate. Local SEO matters where the agency serves a physical market, but location pages need distinct relevance.",
    measurement:
      "Track non-brand discovery, consultations, qualified opportunities, proposal and booking outcomes. Long research journeys make last-click attribution incomplete, so use landing, source and CRM context while documenting gaps.",
    safeguards: [
      "Do not claim destination expertise the team cannot evidence",
      "Do not publish generic destination pages solely for keyword coverage",
      "Do not state live prices, visas or entry rules without update controls",
      "Do not collect sensitive traveller data at the first generic inquiry",
    ],
    roadmap:
      "In the first month, define architecture and repair the core service journey. In the second, publish one expert destination cluster and improve consultation capture. In the third, compare search and sales quality before expanding.",
  },
  "/blog/google-ads-for-tour-operators": {
    thesis:
      "Google Ads can help a tour operator capture existing travel intent when keywords, location, product, landing page and conversion evidence stay aligned. The platform can accelerate a sound offer, but it can also scale irrelevant clicks and measurement errors quickly.",
    context:
      "A search for a destination activity may reflect planning, price comparison, immediate availability or general curiosity. Campaign structure and negative keywords should separate those intents while respecting season, service area and capacity. Automation still needs trustworthy conversion and value signals.",
    steps: [
      "Choose a product, market, period and qualified conversion",
      "Research intent and build controlled keyword and negative themes",
      "Write accurate ads that continue into a relevant landing page",
      "Verify consent, tags, calls, forms and booking handoffs",
      "Review search terms, lead quality and confirmed outcomes",
      "Scale by contribution and capacity, not click volume",
    ],
    foundation:
      "The account needs controlled access, billing, conversion definitions, campaign taxonomy and change history. The page needs clear product detail, price context, trust, mobile speed and a complete action. Broken response or availability cannot be repaired by more bidding.",
    execution:
      "Begin with a narrow campaign and deliberate match strategy. Review search terms and exclusions, segment location and device evidence and test one material message or landing hypothesis at a time. Feed qualified outcomes back only when the CRM and privacy basis support it.",
    measurement:
      "Use impressions and click-through rate to diagnose delivery, but judge business value through qualified leads, bookings, contribution and cancellations. Reconcile platform-attributed revenue before presenting ROAS as commercial fact.",
    safeguards: [
      "Do not optimise to page views or weak button clicks",
      "Do not bid outside the genuine service area or season",
      "Do not publish unsupported price, availability or urgency claims",
      "Do not expand automation without reliable conversion evidence",
    ],
    roadmap:
      "Weeks one and two establish tracking, terms and landing quality. Weeks three and four gather controlled search and lead evidence. The next 60 days refine negatives, value and creative before any material budget increase.",
  },
  "/blog/meta-ads-for-travel-businesses": {
    thesis:
      "Meta Ads can create and recapture travel demand through visual stories, but the creative must lead to a specific, serviceable offer and accountable follow-up. Low-cost attention is not the same as a qualified traveller or profitable booking.",
    context:
      "People encounter travel advertising in discovery mode, often far from a final decision. Creative can establish desire and fit, while the page, form or message must supply logistics, price context and next-step clarity. Consent and data-use boundaries apply throughout tracking and audience activation.",
    steps: [
      "Define the audience, product, season, action and capacity",
      "Develop distinct creative hypotheses from real product evidence",
      "Choose landing, instant-form or message journeys deliberately",
      "Preserve campaign and product context for the response team",
      "Review creative diagnostics and qualified sales outcomes together",
      "Refresh or scale according to contribution and serviceability",
    ],
    foundation:
      "Prepare rights-cleared media, honest claims, approved brand and product facts, consent-aware events and response ownership. Test the complete mobile experience from advertisement to confirmation and ensure messages or forms ask only what the next step requires.",
    execution:
      "Use a compact creative matrix that changes meaningful variables such as traveller problem, proof or product angle. Avoid fragmenting small budgets across many nearly identical ads. Let sales-quality evidence distinguish curious engagement from relevant demand.",
    measurement:
      "Diagnose delivery with reach, frequency, thumb-stop and landing metrics, then use response, qualification, booking and contribution to judge the campaign. Document platform attribution and reconcile observed commercial records.",
    safeguards: [
      "Do not use customer, creator or staff media without rights",
      "Do not count messages or form leads as bookings",
      "Do not build sensitive audiences without an appropriate basis",
      "Do not let attractive creative overpromise the actual experience",
    ],
    roadmap:
      "Month one prepares the offer, assets, measurement and response. Month two runs a controlled creative and journey test. Month three consolidates around qualified evidence and documents the next seasonal campaign.",
  },
};

export function buildBlogSections(
  page: SeoPageSpec,
): SeoContentSection[] | undefined {
  const profile = profiles[page.path];
  if (!profile) return undefined;
  return [
    {
      heading: `${page.title}: where to begin`,
      paragraphs: [profile.thesis, profile.context],
      bullets: profile.steps,
    },
    {
      heading: "Build the operating foundation first",
      paragraphs: [profile.foundation],
    },
    {
      heading: "Execute one complete customer journey",
      paragraphs: [profile.execution, profile.measurement],
    },
    {
      heading: "Safeguards that protect trust and performance",
      paragraphs: [
        "Use these controls to keep implementation accurate, supportable and useful to the traveller:",
      ],
      bullets: profile.safeguards,
    },
    {
      heading: "A practical 90-day action plan",
      paragraphs: [profile.roadmap],
    },
  ];
}
