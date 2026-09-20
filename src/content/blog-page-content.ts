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
  "/blog/tiktok-marketing-tour-operators": {
    thesis:
      "TikTok marketing for tour operators works when short video makes a real experience easier to understand, imagine and evaluate. The channel is strongest as a discovery and learning system connected to accurate product pages, permissioned media and a measurable next step.",
    context:
      "Travel video can earn attention through place, people, motion and practical detail, but views alone do not establish commercial value. Organic publishing, creator collaboration and paid distribution have different rights, disclosure and measurement requirements. A useful programme connects each creative idea to a genuine traveller question and serviceable tour.",
    steps: [
      "Define the traveller, product, season and decision the video supports",
      "Build repeatable formats around proof, preparation, place and people",
      "Capture vertical footage with explicit usage and contributor permission",
      "Publish accurate captions, location context and a relevant next step",
      "Connect qualified viewers to a focused mobile product journey",
      "Review retention, inquiry quality and bookings before scaling paid reach",
    ],
    foundation:
      "Create a rights register, approved claims library, destination and product facts, brand safety rules and response owner before increasing output. The team should know which media can be posted organically, licensed to creators, used in advertisements or retained for future seasons. Product availability and policy information must remain controlled outside the video itself.",
    execution:
      "Use a compact editorial system: answer a real question, show a distinctive moment, explain a practical choice, introduce a qualified team member or correct a common misunderstanding. Test hooks and structures without manufacturing urgency or risk. Send viewers to the closest useful page rather than a generic home page, and preserve campaign context in forms or messages.",
    measurement:
      "Use hold rate, completion, saves, profile activity and landing behaviour as creative diagnostics. Judge commercial effect with qualified inquiries, booking progression, confirmed contribution and assisted discovery where evidence supports it. Compare formats and audiences over a meaningful period instead of declaring success from one viral post.",
    safeguards: [
      "Obtain rights and disclosure approval for customer, staff and creator media",
      "Do not encourage unsafe participation or conceal material activity risks",
      "Do not state live prices or availability in evergreen video without controls",
      "Do not optimise solely for views, followers or inexpensive clicks",
    ],
    roadmap:
      "Month one establishes rights, formats, product pages and measurement. Month two publishes a controlled organic series and learns from qualified response. Month three promotes only proven, serviceable creative and documents the next seasonal production cycle.",
  },
  "/blog/social-media-marketing-tour-operators": {
    thesis:
      "Social media marketing for tour operators should distribute four distinct kinds of value: awareness, proof, education and conversion. A balanced system helps travellers discover the operator, understand the experience, trust delivery and reach an appropriate booking or inquiry path.",
    context:
      "Instagram, TikTok and Facebook reward different behaviours and formats, while reviews and customer media supply a separate form of evidence. Copying every post across every channel often produces activity without clarity. The operating challenge is to preserve truthful product context, media rights and response ownership across a manageable publishing plan.",
    steps: [
      "Choose channel roles from audience behaviour and team capacity",
      "Map content to awareness, proof, education or conversion",
      "Create reusable formats from verified product and destination knowledge",
      "Document permissions, moderation and response service levels",
      "Link each conversion post to the closest relevant customer journey",
      "Review qualified demand and assisted bookings alongside platform metrics",
    ],
    foundation:
      "Centralise approved imagery, usage rights, product facts, common questions, policies, escalation routes and brand voice. Define who publishes, who answers public comments, who handles private customer information and how unanswered questions enter the CRM. A sustainable cadence is more useful than an ambitious calendar the team cannot maintain.",
    execution:
      "Build recurring series instead of isolated posts: product walkthroughs, guide knowledge, destination preparation, customer proof with consent, behind-the-scenes operations and seasonal availability. Adapt the opening, dimensions and interaction to each platform while retaining the same verified source. Make conversion posts specific about the product and next step.",
    measurement:
      "Use reach, retention, saves, shares and profile actions to diagnose distribution and relevance. Use tagged sessions, inquiries, response, booking progression and contribution to judge business value. Record dark-social and assisted influence carefully rather than forcing every sale into a single last-click story.",
    safeguards: [
      "Do not republish customer content without documented permission",
      "Do not expose traveller information while showing operational proof",
      "Do not fabricate reviews, scarcity, locations or experience conditions",
      "Do not let unanswered messages become an unofficial booking system",
    ],
    roadmap:
      "The first 30 days define roles, rights and four content pillars. The next 30 establish repeatable production and response. The final 30 compare formats with qualified customer outcomes and retain only the cadence the team can support.",
  },
  "/blog/tour-operator-website-design": {
    thesis:
      "Tour operator website design is product and decision architecture before it is decoration. The site should help a traveller identify the right experience, understand suitability and logistics, establish trust and complete the next action on a mobile connection.",
    context:
      "Beautiful destination imagery can create desire, but it cannot replace navigable categories, complete tour pages, transparent constraints or a functioning booking journey. Design choices should reflect the operator's catalogue and sales model, not a generic travel mood. Accessibility and performance are part of customer service and conversion quality.",
    steps: [
      "Model tours, destinations, categories and decision attributes",
      "Design navigation around traveller tasks rather than internal departments",
      "Create one complete tour-page information hierarchy",
      "Place proof, policies and practical answers near the related decision",
      "Build an accessible mobile action and confirmation journey",
      "Test real content, slow networks and edge cases before visual polish",
    ],
    foundation:
      "Start with structured product records for title, summary, price context, duration, location, schedule, capacity, inclusions, exclusions, suitability, policy, media and action. Decide which fields drive cards, detail pages, structured data and operations so the same fact is not maintained in conflicting places. Use clear URL and internal-link architecture.",
    execution:
      "Prototype the highest-value journey with production-length copy and real media. Maintain readable contrast, focus states, form labels, responsive controls and predictable navigation. Optimise image dimensions and loading, reserve space to avoid layout movement and keep sticky calls to action from obscuring content or browser controls.",
    measurement:
      "Review discovery, product comparison, action starts, form or checkout completion, response and confirmed booking by page and device. Pair quantitative funnels with support questions, search terms and usability observation. A redesign succeeds when it improves comprehension and completed customer outcomes without weakening speed or accessibility.",
    safeguards: [
      "Do not hide material prices, restrictions or cancellation terms behind decoration",
      "Do not use motion, overlays or sticky controls that block reading and focus",
      "Do not publish unoptimised media or duplicate catalogue content",
      "Do not treat a desktop mock-up as evidence of mobile usability",
    ],
    roadmap:
      "Month one defines content models, architecture and one journey. Month two implements the shared design system and complete product template. Month three tests performance, accessibility and conversion, then expands reusable sections from verified evidence.",
  },
  "/blog/travel-website-seo": {
    thesis:
      "Travel website SEO is a site-wide system connecting crawlable architecture, useful destination and product content, internal links, structured data and trustworthy business signals. Isolated keyword pages cannot compensate for duplicate inventory, weak facts or inaccessible rendering.",
    context:
      "Travel demand spans destinations, activities, seasons, logistics and commercial products. Search engines and travellers both need to distinguish informational guidance from bookable inventory and understand their relationship. Technical controls should preserve one indexable version of useful pages while drafts, filters and thin combinations remain managed.",
    steps: [
      "Inventory pages, templates, entities and the search intent each serves",
      "Define canonical URL, navigation and internal-link rules",
      "Strengthen product and destination pages with verified first-hand detail",
      "Implement accurate metadata, headings, schema and media alternatives",
      "Control duplicate, filtered, draft and discontinued URLs",
      "Measure indexation, queries, qualified landings and bookings together",
    ],
    foundation:
      "Create a content model for business, place, experience, offer, person, review and policy information, then map those records to page types. Maintain sitemaps, status codes, redirects and canonicals from publication state. Ensure primary content and links exist in server-rendered HTML and remain usable without fragile client-only behaviour.",
    execution:
      "Prioritise templates that serve real inventory and traveller decisions. Add unique logistics, suitability, comparisons, questions and local expertise instead of changing a place name in repeated copy. Use descriptive internal anchors from relevant context, validate structured data against visible content and update time-sensitive facts with ownership.",
    measurement:
      "Track valid indexation, crawl and rendering issues, query-to-page alignment, non-brand discovery, engaged product exploration and qualified conversion. Segment by template, market and device. Search visibility is diagnostic evidence, while commercial impact requires confirmed customer records and cautious attribution.",
    safeguards: [
      "Do not generate empty destination and category combinations for coverage",
      "Do not mark up reviews, prices or availability absent from the page",
      "Do not force unnatural keyword repetition into customer copy",
      "Do not change URLs without tested redirects and internal-link updates",
    ],
    roadmap:
      "The first month audits architecture, indexation and core templates. The second repairs technical controls and deepens the highest-value clusters. The third evaluates search and customer evidence, consolidates weak pages and plans the next authoritative topic set.",
  },
  "/blog/improve-travel-website-conversion": {
    thesis:
      "Improving travel website conversion starts by locating the decision stage where suitable travellers lose clarity, confidence or momentum. The answer may be stronger product information, clearer price context, faster mobile interaction, better proof or a more reliable response—not simply a louder call to action.",
    context:
      "Travel purchases carry timing, party, suitability, cancellation and trust questions. A single conversion rate can hide very different journeys and traffic quality. Diagnosis should separate discovery, comparison, action, completion, qualification and confirmed booking while protecting accessibility and truthful choice.",
    steps: [
      "Define the qualified outcome and each prerequisite decision",
      "Segment the funnel by product, source, device and new or returning visitor",
      "Inspect page speed, comprehension, trust, form and handoff friction",
      "Prioritise one evidence-based hypothesis with a measurable guardrail",
      "Test the full journey including confirmation and response",
      "Keep, revise or reject the change from qualified commercial evidence",
    ],
    foundation:
      "Instrument meaningful events with consent and stable names, then reconcile them with inquiry and booking records. Establish baseline performance and data quality before experimentation. Make price, duration, location, inclusions, suitability, availability context and cancellation information findable where the customer needs them.",
    execution:
      "Begin with high-confidence defects such as broken actions, invisible errors, unclear labels, slow media, poor contrast or lost context. For larger tests, change one material decision variable and document the audience, period and expected mechanism. Keep a human route for complex or accessibility-related needs.",
    measurement:
      "Use product views, action starts, completion, qualification, response, booking and contribution as a connected funnel. Watch cancellation, support burden and lead quality as guardrails. Treat small samples and seasonal shifts cautiously and retain a decision log rather than announcing certainty from noise.",
    safeguards: [
      "Do not use hidden fees, false scarcity or obstructive choice design",
      "Do not remove essential detail merely to shorten a page",
      "Do not declare a winner without enough representative evidence",
      "Do not optimise form quantity while ignoring qualification and response",
    ],
    roadmap:
      "Month one repairs instrumentation and obvious friction. Month two runs the highest-value product and action hypotheses. Month three connects experiments to confirmed outcomes, standardises proven patterns and documents unresolved customer questions.",
  },
  "/blog/how-to-price-tours": {
    thesis:
      "To price a tour, calculate the cost of safely delivering the promised experience at realistic capacity, then add the contribution required for overhead, risk and sustainable profit. Competitor prices and customer demand inform positioning, but they do not reveal the operator's economics.",
    context:
      "Tours combine fixed and variable costs, taxes, payment fees, guide or vehicle capacity, distributor commission, seasonality, cancellations and sometimes foreign-exchange exposure. A starting price, private price and per-person departure price may require different models. Every assumption needs a date and owner.",
    steps: [
      "Define the exact product unit, inclusions and sale channel",
      "Separate fixed departure, per-guest and allocated overhead costs",
      "Model realistic minimum, expected and maximum paid capacity",
      "Add commission, tax, payment, contingency and target contribution",
      "Compare market value and willingness without copying competitors",
      "Approve price, validity, review triggers and customer presentation",
    ],
    foundation:
      "Use supplier contracts and operating records rather than memory. Distinguish tax-inclusive and tax-exclusive inputs, recoverable amounts, complimentary places and costs triggered by thresholds. Model gross booking value separately from net revenue and contribution so a high selling price is not mistaken for healthy profit.",
    execution:
      "Run scenarios for low and expected occupancy, direct and distributor sales, and relevant seasons. If the required price exceeds perceived value, redesign the product or cost structure rather than hiding charges. Publish clear price units and material inclusions, and align the checkout, quote and operations record to the approved version.",
    measurement:
      "Review average realised price, paid occupancy, discount, channel cost, variable cost, contribution, refund and cancellation by departure or product. Compare forecast with actual delivery. Update only from controlled evidence and retain historical price versions for bookings already confirmed.",
    safeguards: [
      "Do not price below full delivery cost without an explicit strategy and limit",
      "Do not confuse margin with markup or booking value with earned revenue",
      "Do not apply commission after solving a formula that assumed net price",
      "Do not change confirmed customer terms through a later price update",
    ],
    roadmap:
      "Month one creates the cost model and reconciles recent departures. Month two tests channel, occupancy and value scenarios. Month three updates presentation and approval rules, then schedules supplier and seasonal review dates.",
  },
  "/blog/how-to-create-tour-packages": {
    thesis:
      "Creating tour packages means combining compatible services into a coherent traveller outcome with controlled itinerary, responsibility, capacity, price and terms. A package is not merely a list of attractions or a discount applied to unrelated products.",
    context:
      "Accommodation, transport, activities, guides and meals may have different suppliers, cancellation rules and inventory states. Package obligations also vary by jurisdiction. The product team should verify legal and commercial responsibilities and distinguish confirmed components, alternatives and optional additions.",
    steps: [
      "Define the traveller, outcome, duration and organising promise",
      "Map the day-by-day flow and realistic movement between components",
      "Contract suppliers and align capacity, cut-offs and cancellation terms",
      "Calculate package cost, channel effect and contribution by scenario",
      "Write inclusions, exclusions, suitability and contingency clearly",
      "Pilot the complete package before broad distribution",
    ],
    foundation:
      "Maintain one structured package record linked to controlled service, supplier and destination records. Record item order, day, quantity, optional status, fulfilment owner and version. Decide what happens when a component becomes unavailable and which substitutions require customer approval.",
    execution:
      "Build the itinerary around pacing and traveller purpose rather than maximising item count. Confirm transfer and check-in time, rest, accessibility, meal and luggage assumptions. On the product page, show the package as a complete decision: who it suits, route, accommodation context, included value, price basis, policy and next step.",
    measurement:
      "Track qualified interest, quote effort, component availability, conversion, package contribution, supplier exceptions and customer feedback. Review which items create value or operational friction. Use evidence to refine the package while preserving booked versions and customer communications.",
    safeguards: [
      "Do not describe proposed components as confirmed inventory",
      "Do not hide material transfer, room, meal or eligibility constraints",
      "Do not combine incompatible supplier cancellation conditions silently",
      "Do not publish a package the operations team has not reviewed end to end",
    ],
    roadmap:
      "The first month validates audience, route, suppliers and responsibilities. The second completes pricing, content and operating documentation. The third pilots delivery and refines the package from margin and exception evidence before wider promotion.",
  },
  "/blog/tour-booking-management": {
    thesis:
      "Tour booking management is a controlled lifecycle from initial request or checkout through confirmation, payment, amendment, departure, completion and cancellation. A useful system shows the current state, responsible person and next action without losing the history that explains them.",
    context:
      "A row in a spreadsheet rarely captures traveller, product, departure, capacity, payment and communication state reliably. Booking status must remain distinct from payment and fulfilment status. External booking engines or distributors may own parts of the journey, so reconciliation and responsibility need explicit rules.",
    steps: [
      "Define booking, payment and fulfilment status models separately",
      "Create records for customer, participants, product and departure",
      "Reserve capacity according to documented hold and expiry rules",
      "Issue accurate confirmation, payment and preparation messages",
      "Record amendments, cancellations, refunds and operational notes",
      "Reconcile completed service and close the record with an audit trail",
    ],
    foundation:
      "Choose stable identifiers, required fields, access roles and event history. Define which actions are automated and which require approval. Keep sensitive traveller and payment data to the minimum necessary and separate operational notes from general marketing fields. Document the authoritative source when systems integrate.",
    execution:
      "Design queues around work that needs action: pending response, awaiting payment, capacity exception, document due, upcoming departure and refund review. Templates should insert controlled facts but remain reviewable. Every customer-facing status change should leave evidence of time, channel and responsible actor.",
    measurement:
      "Monitor response, time to confirmation, payment collection, amendment volume, cancellations, no-shows, fulfilment exceptions and reconciliation gaps. Analyse by product and source. Speed matters only when the underlying status and customer communication remain accurate.",
    safeguards: [
      "Do not mark a request confirmed before inventory and terms are accepted",
      "Do not store full payment credentials or unnecessary identity documents",
      "Do not overwrite history when dates, guests or prices change",
      "Do not let integrations create duplicate customers or capacity",
    ],
    roadmap:
      "Month one maps the lifecycle and cleans identifiers and statuses. Month two implements queues, templates and integrations around one product flow. Month three reconciles exceptions, tightens permissions and expands only after the audit trail is reliable.",
  },
  "/blog/tour-availability-capacity-management": {
    thesis:
      "Tour availability management calculates whether a specific product can be sold for a date or time from the intersection of schedule, capacity, resources, existing commitments and operating rules. A calendar marked open is not sufficient when guides, vehicles, equipment or supplier inventory constrain delivery.",
    context:
      "Capacity can belong to a departure, shared resource, pickup zone, rate or package component. Holds, buffers, maintenance, private bookings and external channels further affect sellable inventory. The system must define an authoritative quantity and update path before promising real-time availability.",
    steps: [
      "Define the sellable unit and every constraining resource",
      "Create departures, schedules, capacity and booking cut-off rules",
      "Model holds, buffers, maintenance and private allocation",
      "Connect channels only after source-of-truth ownership is explicit",
      "Test simultaneous booking, amendment and cancellation scenarios",
      "Reconcile upcoming capacity and investigate every exception",
    ],
    foundation:
      "Represent product capacity separately from resource availability where their limits differ. Use transactions or equivalent concurrency controls for inventory changes and stable external references for integrations. Decide when a request reserves inventory, when a hold expires and who may override a constraint.",
    execution:
      "Start with a single inventory model and direct channel. Create operational views for low capacity, unassigned resources, expired holds and overbooking risk. When an OTA or reseller is introduced, document polling or webhook behaviour, latency, failure alerts and reconciliation instead of assuming perfect synchronisation.",
    measurement:
      "Track sellable capacity, paid occupancy, utilisation, denied requests, expired holds, manual overrides, channel lag and overbooking incidents. Examine contribution alongside occupancy because filling every place at an unsustainable rate is not an operational success.",
    safeguards: [
      "Do not expose real-time claims without an authoritative update mechanism",
      "Do not count the same shared guide, vehicle or equipment twice",
      "Do not leave holds without clear expiry and release behaviour",
      "Do not allow manual overrides without identity, reason and audit history",
    ],
    roadmap:
      "Month one maps products, departures and constraints. Month two implements reservation, expiry and exception queues for the direct channel. Month three tests integration failure and concurrency, reconciles real departures and only then expands distribution.",
  },
  "/blog/crm-for-tour-operators": {
    thesis:
      "A CRM for tour operators should organise the traveller lifecycle from inquiry and qualification through proposal, booking, delivery and repeat relationship. Generic deal stages are useful only when they preserve trip context, ownership, consent and the next customer action.",
    context:
      "Travel inquiries often include destination, dates, party, preferences, product and source before a sale exists. Multiple travellers may belong to one customer or booking, and sensitive information should not be copied into broad marketing records. The CRM must connect commercial work without becoming the uncontrolled source for every operational detail.",
    steps: [
      "Define lead, customer, traveller, opportunity and booking relationships",
      "Capture source, product, dates, party and consent with minimal friction",
      "Design stages from observable customer commitments",
      "Assign an owner, due action and response expectation",
      "Connect accepted opportunities to controlled booking records",
      "Segment retention only from lawful, accurate customer history",
    ],
    foundation:
      "Agree unique identifiers, required fields, duplicate handling, permissions and retention. Separate marketing consent from service communication and restrict passport, health or payment information to appropriate systems. Make stage entry and exit conditions concrete enough that two team members classify the same situation consistently.",
    execution:
      "Build views around overdue response, unqualified inquiries, proposals awaiting decision, deposits due, upcoming customers and post-trip follow-up. Automate reminders and context transfer, not unsupported decisions. Record lost reasons and customer objections in structured form while retaining useful conversation history.",
    measurement:
      "Measure response, qualification, stage progression, sales cycle, booking value, contribution, source quality, loss reasons and repeat behaviour. Audit missing owners, stale records, duplicates and automation failures. Use cohorts where seasonality or long planning windows make weekly conversion misleading.",
    safeguards: [
      "Do not store sensitive traveller information in unrestricted notes",
      "Do not treat marketing consent as implied by a service inquiry",
      "Do not automate messages without timing, suppression and ownership rules",
      "Do not inflate pipeline value with unqualified or duplicate inquiries",
    ],
    roadmap:
      "The first month defines the lifecycle, data model and access rules. The second configures stages, queues, templates and one booking handoff. The third cleans exceptions, validates reporting and introduces only the automations the team can monitor.",
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
