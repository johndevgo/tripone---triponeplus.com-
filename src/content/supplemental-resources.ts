import type {
  ResourceArticle,
  ResourceCategory,
  ResourceSource,
} from "./resources";

const publishedAt = "2026-09-13";

type VerticalGuide = {
  slug: string;
  label: string;
  audience: string;
  image: string;
  imageAlt: string;
  needs: [string, string, string, string];
  booking: string;
  operating: string;
};

const verticalGuides: VerticalGuide[] = [
  {
    slug: "boat-rental-website-planning-guide",
    label: "boat rental businesses",
    audience:
      "Guests compare vessel type, capacity, route, crew and total time before they enquire.",
    image: "/images/marketing/coastal-yacht.webp",
    imageAlt: "A motor yacht travelling through clear coastal water",
    needs: [
      "Vessel and passenger capacity",
      "Crew and licence requirements",
      "Departure marina and route",
      "Fuel, food and equipment inclusions",
    ],
    booking:
      "Separate an availability request from a confirmed charter, especially when weather, crew or vessel allocation still needs review.",
    operating:
      "Keep vessel maintenance, turnaround time and captain assignment connected to each accepted charter.",
  },
  {
    slug: "safari-company-website-planning-guide",
    label: "safari companies",
    audience:
      "Travellers need to understand the route, season, accommodation, transport and realistic wildlife expectations.",
    image: "/images/marketing/safari-dawn.webp",
    imageAlt: "Elephants crossing open savannah at dawn",
    needs: [
      "Daily route and park areas",
      "Accommodation standard",
      "Vehicle and guide arrangement",
      "Responsible wildlife language",
    ],
    booking:
      "Use an enquiry or quote path when accommodation, permits or private departures must be confirmed.",
    operating:
      "Link each departure to vehicle capacity, guide availability, permits and accommodation confirmations.",
  },
  {
    slug: "trekking-company-website-planning-guide",
    label: "trekking companies",
    audience:
      "Trekkers compare difficulty, altitude, walking time, accommodation and support before choosing a route.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "Hikers following a high mountain trail at sunrise",
    needs: [
      "Elevation and difficulty profile",
      "Day-by-day walking plan",
      "Accommodation and meals",
      "Guide, porter and permit details",
    ],
    booking:
      "Collect fitness, date and group information without implying that permits or guides are confirmed immediately.",
    operating:
      "Plan guide capacity, permit lead time, emergency contacts and seasonal route changes around each departure.",
  },
  {
    slug: "rafting-operator-website-planning-guide",
    label: "rafting operators",
    audience:
      "Guests need a clear picture of river grade, age limits, safety equipment, transfers and water conditions.",
    image: "/images/marketing/desert-atv.webp",
    imageAlt: "An outdoor adventure group preparing with safety equipment",
    needs: [
      "River section and grade",
      "Minimum age and swimming guidance",
      "Safety equipment and briefing",
      "Pickup, changing and return plan",
    ],
    booking:
      "Use capacity-aware departures and explain when river or weather conditions may require confirmation.",
    operating:
      "Coordinate guides, rafts, safety equipment, drivers and launch windows as one fulfilment plan.",
  },
  {
    slug: "atv-buggy-business-website-guide",
    label: "ATV and buggy operators",
    audience:
      "Riders compare vehicle type, driver rules, route, duration, passenger options and safety support.",
    image: "/images/marketing/desert-atv.webp",
    imageAlt: "A guided ATV group crossing desert terrain at golden hour",
    needs: [
      "Vehicle model and seating",
      "Driver age and licence rules",
      "Route and riding duration",
      "Helmet, briefing and guide details",
    ],
    booking:
      "Ask for drivers, passengers and preferred time so the operator can allocate the correct vehicles.",
    operating:
      "Block maintenance windows and prevent one vehicle from being assigned to overlapping rides.",
  },
  {
    slug: "local-guide-website-planning-guide",
    label: "independent local guides",
    audience:
      "Visitors choose a guide based on subject knowledge, language, route, pace and the feel of the experience.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A local guide speaking with a small group of travellers",
    needs: [
      "Guide background and languages",
      "Route and meeting point",
      "Private or shared format",
      "Accessibility and pace",
    ],
    booking:
      "Let visitors request a date and group size while making the response and confirmation process explicit.",
    operating:
      "Protect personal availability, travel time between meetings and the maximum group size you can guide well.",
  },
  {
    slug: "day-tour-company-website-guide",
    label: "day tour companies",
    audience:
      "Travellers want to compare a complete day: pickup, stops, pace, meals, transport and return time.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "Travellers listening to their guide during a day tour",
    needs: [
      "Pickup area and start time",
      "Ordered stops and durations",
      "Meal and ticket inclusions",
      "Expected return and mobility level",
    ],
    booking:
      "Offer exact departures when capacity is known and a request flow when pickup or private routing varies.",
    operating:
      "Connect each confirmed trip to a guide, vehicle, pickup manifest and realistic turnaround time.",
  },
  {
    slug: "multi-day-tour-website-guide",
    label: "multi-day tour operators",
    audience:
      "Longer trips require confidence in the itinerary, accommodation, transport, group style and support.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "A broad mountain route suitable for a multi-day itinerary",
    needs: [
      "Day-by-day itinerary",
      "Accommodation and meal basis",
      "Transport between stages",
      "Deposit and cancellation explanation",
    ],
    booking:
      "Use a qualified enquiry when rooming, transfers or group composition must be checked before confirmation.",
    operating:
      "Track departure capacity, room preferences, suppliers, guides and staged confirmation notes together.",
  },
  {
    slug: "travel-agency-package-website-guide",
    label: "travel agencies",
    audience:
      "Package shoppers need destinations, duration, major components, price basis and a credible next step.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "Travel specialists planning a detailed itinerary with a client",
    needs: [
      "Destinations and trip duration",
      "Included transport and stays",
      "Price basis and exclusions",
      "Customisation and response process",
    ],
    booking:
      "Treat variable packages as quote requests and collect destination, dates, travellers and budget range early.",
    operating:
      "Keep the customer brief, package version, supplier checks and follow-up date visible in one workflow.",
  },
  {
    slug: "airport-transfer-website-guide",
    label: "airport transfer companies",
    audience:
      "Passengers compare vehicle capacity, luggage allowance, pickup process, service area and timing reliability.",
    image: "/images/marketing/airport-transfer.webp",
    imageAlt: "A professional airport transfer driver welcoming travellers",
    needs: [
      "Airport and service area",
      "Vehicle and luggage capacity",
      "Meet-and-greet instructions",
      "Waiting time and delay policy",
    ],
    booking:
      "Collect flight, pickup, destination, passenger and luggage details before confirming the vehicle.",
    operating:
      "Account for live arrival changes, driver travel time, vehicle capacity and overlapping assignments.",
  },
  {
    slug: "hiking-tour-website-guide",
    label: "guided hiking businesses",
    audience:
      "Hikers assess distance, elevation, terrain, pace, weather exposure and guide support.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "Hikers viewing a mountain trail and surrounding peaks",
    needs: [
      "Distance and elevation gain",
      "Terrain and difficulty",
      "Equipment and weather guidance",
      "Meeting point and turnaround time",
    ],
    booking:
      "Ask enough about the party to recommend a suitable route without turning the first form into a medical questionnaire.",
    operating:
      "Match route conditions, guide capacity, transport and daylight windows to each scheduled walk.",
  },
  {
    slug: "water-sports-business-website-guide",
    label: "water sports businesses",
    audience:
      "Customers compare activity type, session length, instruction, age rules, equipment and weather policy.",
    image: "/images/marketing/ocean-hero.webp",
    imageAlt: "A fast water-sports activity beside a rocky coastline",
    needs: [
      "Activity and session format",
      "Age and ability requirements",
      "Instruction and equipment",
      "Weather and rescheduling process",
    ],
    booking:
      "Route each request to the right activity, time slot, participant count and equipment requirement.",
    operating:
      "Treat instructors, launch windows and equipment as limited resources instead of an unlimited calendar.",
  },
  {
    slug: "cultural-tour-website-guide",
    label: "cultural tour operators",
    audience:
      "Visitors value context, guide expertise, respectful access, route detail and a clear meeting plan.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A guide sharing local context with an attentive group",
    needs: [
      "Theme and places visited",
      "Guide expertise and languages",
      "Access or dress guidance",
      "Walking distance and meeting point",
    ],
    booking:
      "Make private, shared and custom formats distinct so travellers request the experience they actually want.",
    operating:
      "Coordinate guide languages, venue access, group limits and closures before confirming the visit.",
  },
  {
    slug: "motorcycle-tour-website-guide",
    label: "motorcycle tour companies",
    audience:
      "Riders compare bike, route, road conditions, licence requirements, support and luggage arrangements.",
    image: "/images/marketing/desert-atv.webp",
    imageAlt: "Adventure vehicles travelling across an open landscape",
    needs: [
      "Motorcycle model and setup",
      "Licence and riding experience",
      "Daily distance and road type",
      "Support vehicle and luggage plan",
    ],
    booking:
      "Qualify licence, experience, dates and equipment needs before assigning a motorcycle.",
    operating:
      "Protect maintenance time and connect every departure to bikes, guides, support vehicles and spares.",
  },
  {
    slug: "car-rental-tourism-website-guide",
    label: "tourism car rental businesses",
    audience:
      "Renters need the vehicle class, passenger and luggage fit, pickup terms, mileage and driver requirements.",
    image: "/images/marketing/airport-transfer.webp",
    imageAlt: "A clean passenger vehicle ready for a tourism transfer",
    needs: [
      "Vehicle class and capacity",
      "Driver and deposit requirements",
      "Pickup, return and mileage",
      "Insurance and excluded use",
    ],
    booking:
      "Capture the complete rental window and location before presenting the request as confirmed.",
    operating:
      "Prevent overlapping allocations and reserve enough turnaround time for inspection and cleaning.",
  },
  {
    slug: "yacht-charter-website-guide",
    label: "yacht charter businesses",
    audience:
      "Charter guests compare vessel style, guest capacity, crew, route, catering and the full price basis.",
    image: "/images/marketing/coastal-yacht.webp",
    imageAlt: "A premium yacht underway near a Mediterranean coastline",
    needs: [
      "Guest and overnight capacity",
      "Crew and onboard facilities",
      "Route and charter window",
      "Catering, fuel and marina costs",
    ],
    booking:
      "Use a considered enquiry for variable charters and disclose which details remain subject to confirmation.",
    operating:
      "Coordinate vessel, crew, berth, provisioning and cleaning across the full charter window.",
  },
  {
    slug: "snorkelling-tour-website-guide",
    label: "snorkelling tour operators",
    audience:
      "Guests compare water access, supervision, swimming expectations, equipment, marine setting and trip length.",
    image: "/images/marketing/reef-diving.webp",
    imageAlt: "Swimmers exploring clear water above a coral reef",
    needs: [
      "Entry style and water conditions",
      "Swimming and age guidance",
      "Guide ratio and equipment",
      "Boat, beach and transfer plan",
    ],
    booking:
      "Explain that wildlife and weather vary while collecting the guest details needed for safe planning.",
    operating:
      "Match boat or shore capacity, guides, equipment sizes and weather decisions to each trip.",
  },
  {
    slug: "adventure-park-website-guide",
    label: "adventure activity parks",
    audience:
      "Families and groups need to compare activities, eligibility, session times, supervision and arrival logistics.",
    image: "/images/marketing/desert-atv.webp",
    imageAlt: "An adventure group receiving an outdoor safety briefing",
    needs: [
      "Activity zones and duration",
      "Height, age and ability rules",
      "Supervision and safety equipment",
      "Arrival, parking and spectator details",
    ],
    booking:
      "Let guests select a suitable product and participant mix before reserving limited sessions or equipment.",
    operating:
      "Balance instructors, equipment, course capacity and staggered start times across the day.",
  },
];

type StrategyGuide = {
  slug: string;
  category: Exclude<ResourceCategory, "Comparison">;
  title: string;
  description: string;
  focus: string;
  actions: [string, string, string, string];
  risk: string;
  metric: string;
  image: string;
  imageAlt: string;
};

const strategyGuides: StrategyGuide[] = [
  {
    slug: "local-seo-for-tour-operators",
    category: "SEO",
    title: "Local SEO foundations for tour and activity operators",
    description:
      "A practical system for connecting your real service area, business identity and experience pages without creating doorway pages.",
    focus:
      "help nearby travellers and destination planners understand where the business operates",
    actions: [
      "Keep business name and contact details consistent",
      "Describe the real meeting and service areas",
      "Link relevant experiences to useful location pages",
      "Maintain accurate map and directory profiles",
    ],
    risk: "Publishing a separate near-identical page for every neighbourhood creates noise rather than local expertise.",
    metric:
      "Track qualified visits and enquiries by landing page and location, not rankings alone.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A guide meeting travellers in a local destination",
  },
  {
    slug: "destination-page-seo-framework",
    category: "SEO",
    title: "A destination-page SEO framework for tourism websites",
    description:
      "Decide when a destination deserves a page and build one around genuine planning value, connected services and first-hand detail.",
    focus: "turn destination knowledge into a navigable planning resource",
    actions: [
      "Explain why and when people visit",
      "Connect only services genuinely available there",
      "Add transport, season and meeting context",
      "Link onward to detailed experience pages",
    ],
    risk: "Swapping a city name inside generic copy produces thin pages that do not help travellers choose.",
    metric: "Measure destination-page assisted experience views and enquiries.",
    image: "/images/marketing/coastal-village.webp",
    imageAlt: "A coastal destination with a compact waterfront village",
  },
  {
    slug: "tour-page-seo-checklist",
    category: "SEO",
    title: "The experience-page SEO checklist for tours and activities",
    description:
      "Create one useful, indexable page per meaningful offer with clean metadata, traveller detail and strong internal relationships.",
    focus: "make each important experience understandable on its own",
    actions: [
      "Use a descriptive experience and location title",
      "Publish duration, route and suitability",
      "Connect related locations and categories",
      "Keep canonical paths stable when editing",
    ],
    risk: "A gallery and booking button alone rarely answer enough questions to deserve a dedicated search result.",
    metric:
      "Compare organic entrances with product views, booking starts and enquiries.",
    image: "/images/marketing/ocean-hero.webp",
    imageAlt: "A coastal experience shown in a wide travel photograph",
  },
  {
    slug: "tourism-image-seo-guide",
    category: "SEO",
    title: "Image SEO for tour, rental and destination websites",
    description:
      "Use original visual assets with sensible formats, dimensions, captions and alternative text that improve both discovery and usability.",
    focus: "make photography fast, descriptive and relevant to the page",
    actions: [
      "Compress originals before publishing",
      "Reserve intrinsic image dimensions",
      "Write scene-based alternative text",
      "Match each image to nearby visible content",
    ],
    risk: "Keyword-filled alt text and oversized duplicate hero files create accessibility and performance problems.",
    metric:
      "Monitor image loading, layout stability and engagement after the image enters the viewport.",
    image: "/images/marketing/reef-diving.webp",
    imageAlt: "Detailed underwater travel photography of a coral reef",
  },
  {
    slug: "internal-linking-for-tourism-websites",
    category: "SEO",
    title: "Internal linking for complex tourism websites",
    description:
      "Connect experiences, packages, destinations and practical guides so travellers can explore naturally and crawlers can understand the structure.",
    focus: "create clear relationships between the records travellers compare",
    actions: [
      "Link packages to their included experiences",
      "Link locations to services actually offered there",
      "Recommend genuinely related products",
      "Use descriptive anchor text in useful context",
    ],
    risk: "Large repeated footer lists can overwhelm visitors and blur which pages are actually important.",
    metric:
      "Review assisted journeys and orphaned pages alongside crawl coverage.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "A travel planner connecting destinations and itinerary details",
  },
  {
    slug: "structured-data-for-tourism-websites",
    category: "SEO",
    title: "Structured data for tourism websites without invented claims",
    description:
      "Apply organization, breadcrumb, article and product-oriented schema only where it accurately represents visible, supported information.",
    focus: "help machines understand the same facts a traveller can see",
    actions: [
      "Use one canonical business identity",
      "Describe visible offers and page hierarchy",
      "Validate generated JSON-LD",
      "Remove ratings or prices that are not supported",
    ],
    risk: "Markup is not a place to add testimonials, availability or awards that the page and business cannot verify.",
    metric:
      "Track schema validation and search enhancement eligibility without promising rich results.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt:
      "Structured itinerary information arranged during travel planning",
  },
  {
    slug: "multilingual-tourism-seo-planning",
    category: "SEO",
    title: "Multilingual SEO planning for tourism operators",
    description:
      "Plan language versions around real customer support capacity, localized travel intent and technically consistent alternate pages.",
    focus:
      "serve international visitors with complete, maintainable language experiences",
    actions: [
      "Choose languages the team can support",
      "Translate operational details, not only headlines",
      "Keep language navigation predictable",
      "Use correct canonical and alternate relationships",
    ],
    risk: "Partial machine-translated pages can create misleading policies and a support experience the team cannot sustain.",
    metric: "Compare qualified enquiries and completion rates by language.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "An international group speaking with a local guide",
  },
  {
    slug: "tourism-website-core-web-vitals",
    category: "SEO",
    title: "Core Web Vitals for image-rich tourism websites",
    description:
      "Keep immersive travel photography while controlling layout movement, loading priority, responsive sources and unnecessary client JavaScript.",
    focus:
      "deliver visual impact without making mobile visitors wait or lose their place",
    actions: [
      "Preload only the primary hero",
      "Lazy-load below-fold galleries",
      "Provide responsive image sizes",
      "Reserve stable media and form space",
    ],
    risk: "Loading every full-resolution image eagerly can make a beautiful page unusable on a real travel connection.",
    metric:
      "Use field loading, interaction and layout data alongside laboratory checks.",
    image: "/images/marketing/coastal-yacht.webp",
    imageAlt: "A high-resolution yacht scene prepared for responsive delivery",
  },
  {
    slug: "google-business-profile-tour-operators",
    category: "Growth",
    title: "Google Business Profile planning for tour operators",
    description:
      "Keep a tourism listing accurate and useful by connecting its identity, location, contact routes and service information to the canonical website.",
    focus: "help searchers verify and contact the real operator",
    actions: [
      "Use the accurate business identity",
      "Maintain hours and seasonal changes",
      "Choose a truthful primary category",
      "Point visitors to the canonical website",
    ],
    risk: "Adding service areas or names that the business does not genuinely use weakens trust and creates maintenance debt.",
    metric:
      "Review calls, website visits and direction requests in the context of genuine leads.",
    image: "/images/marketing/local-guide.webp",
    imageAlt:
      "A local tourism business welcoming visitors at its meeting point",
  },
  {
    slug: "tourism-content-audit-process",
    category: "SEO",
    title: "A repeatable content audit for tourism websites",
    description:
      "Review every experience, location and policy page against current operations, search intent and the decisions travellers actually make.",
    focus:
      "find outdated, duplicated and missing information before adding more pages",
    actions: [
      "Inventory indexable URLs",
      "Assign one owner and purpose to each page",
      "Check operational facts against source records",
      "Merge or redirect redundant content",
    ],
    risk: "Publishing new articles while old prices, routes and policies remain visible compounds inconsistency.",
    metric:
      "Track corrected records, consolidated URLs and conversion changes after updates.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "A travel team reviewing structured business information",
  },
  {
    slug: "tourism-url-redirect-strategy",
    category: "SEO",
    title: "URL and redirect strategy for changing tour catalogues",
    description:
      "Preserve useful discovery signals when tours, categories and destinations are renamed, consolidated, archived or seasonally replaced.",
    focus: "keep public paths understandable while preventing broken journeys",
    actions: [
      "Use concise stable slugs",
      "Redirect a replaced page to its closest successor",
      "Return an honest not-found state when nothing matches",
      "Update navigation and internal links together",
    ],
    risk: "Redirecting every removed tour to the homepage hides the change and creates a poor visitor experience.",
    metric:
      "Monitor not-found requests, redirect chains and landing-page engagement.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "A clear mountain path representing a stable visitor route",
  },
  {
    slug: "seasonal-seo-tour-activities",
    category: "SEO",
    title: "Seasonal SEO for tours and outdoor activities",
    description:
      "Plan evergreen service pages and timely seasonal guidance without deleting valuable URLs or presenting closed activities as available.",
    focus: "align discovery content with real operating seasons",
    actions: [
      "Keep durable offering URLs",
      "State current operating windows",
      "Publish seasonal preparation guidance",
      "Update calls to action when requests are closed",
    ],
    risk: "Creating a new URL every season fragments history and leaves stale availability across the site.",
    metric:
      "Compare seasonal impressions with valid booking requests and reopening dates.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "A mountain landscape showing changing seasonal conditions",
  },
  {
    slug: "tourism-call-to-action-framework",
    category: "Conversion",
    title: "A call-to-action framework for tourism websites",
    description:
      "Choose labels and placements that match the real next step, from viewing options to requesting availability or completing an external booking.",
    focus: "set an accurate expectation before the visitor clicks",
    actions: [
      "Match the verb to the workflow",
      "Keep one primary action per decision point",
      "Use supporting details near the action",
      "Preserve a clear back path",
    ],
    risk: "Calling every action Book now creates distrust when the next screen is only an unqualified contact form.",
    metric:
      "Measure product views, booking starts, completed requests and outbound booking clicks separately.",
    image: "/images/marketing/ocean-hero.webp",
    imageAlt: "An active coastal experience representing a clear next step",
  },
  {
    slug: "mobile-booking-form-design",
    category: "Conversion",
    title: "Mobile booking-request form design for activity businesses",
    description:
      "Collect enough information to act on a request while keeping fields, input types, validation and recovery comfortable on a small screen.",
    focus:
      "reduce avoidable effort without losing operationally necessary detail",
    actions: [
      "Use native date and contact inputs",
      "Group adults, children and quantity clearly",
      "Explain why specialist details are requested",
      "Preserve entered values after a validation error",
    ],
    risk: "Long generic forms ask irrelevant questions and make visitors repeat details during follow-up.",
    metric:
      "Track form starts, validated submissions and field-level failure patterns without storing sensitive input in analytics.",
    image: "/images/marketing/airport-transfer.webp",
    imageAlt:
      "Travellers using a mobile-friendly service while arriving at an airport",
  },
  {
    slug: "tour-itinerary-page-design",
    category: "Conversion",
    title: "How to design an itinerary travellers can evaluate",
    description:
      "Turn a list of stops into a readable sequence with timing, activity, travel, meals and accommodation detail appropriate to the trip.",
    focus:
      "help visitors picture the complete experience before asking them to enquire",
    actions: [
      "Use ordered days or stages",
      "Separate travel from activity time",
      "Name inclusions at the relevant point",
      "Keep optional items visibly optional",
    ],
    risk: "A long unstructured paragraph makes important differences between packages almost impossible to compare.",
    metric:
      "Review itinerary expansion, package comparison and booking-request behavior.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "A detailed day-by-day itinerary being reviewed with a traveller",
  },
  {
    slug: "tourism-pricing-transparency",
    category: "Conversion",
    title: "Pricing transparency for tours, rentals and packages",
    description:
      "Present starting prices, units, inclusions, optional costs and quote conditions without implying a fixed total where one does not exist.",
    focus: "give travellers a usable price frame and reduce surprise",
    actions: [
      "Label per-person, per-group or per-unit pricing",
      "State what the starting price includes",
      "Separate optional additions",
      "Explain when a custom quote is required",
    ],
    risk: "A bare number without currency, unit or conditions creates more confusion than omitting the price.",
    metric:
      "Compare qualified requests, pricing questions and accepted quotes after clarification.",
    image: "/images/marketing/coastal-yacht.webp",
    imageAlt: "A premium travel service where pricing context matters",
  },
  {
    slug: "trust-signals-for-tour-operators",
    category: "Conversion",
    title: "Trust signals that responsible tour operators can prove",
    description:
      "Build confidence with concrete people, process, policy and contact information instead of unsupported superlatives or decorative statistics.",
    focus: "make the operator and fulfilment process understandable",
    actions: [
      "Show the real team where appropriate",
      "Explain safety and preparation accurately",
      "Publish reachable contact details",
      "Use testimonials only with genuine permission",
    ],
    risk: "Invented awards, review totals and best-in-destination claims can damage the credibility they are meant to create.",
    metric:
      "Look for reduced pre-booking uncertainty and stronger qualified enquiry completion.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A real guide building trust through direct conversation",
  },
  {
    slug: "whatsapp-conversion-tourism",
    category: "Conversion",
    title: "Using WhatsApp effectively on a tourism website",
    description:
      "Place messaging where it helps high-intent travellers while retaining context, privacy-aware analytics and accessible alternative contact routes.",
    focus:
      "make messaging a supported decision path rather than a floating distraction",
    actions: [
      "Prefill only useful non-sensitive context",
      "Keep the relevant product visible",
      "State expected response times honestly",
      "Offer an email or form alternative",
    ],
    risk: "An oversized floating button can obscure content and route every question into an unstructured inbox.",
    metric:
      "Track messaging clicks separately from confirmed leads and bookings.",
    image: "/images/marketing/airport-transfer.webp",
    imageAlt: "A traveller contacting a local tourism service during arrival",
  },
  {
    slug: "tour-package-comparison-design",
    category: "Conversion",
    title: "Designing package comparisons that reduce confusion",
    description:
      "Help travellers compare duration, route, accommodation, inclusions and price basis without compressing complex trips into unreadable tables.",
    focus: "surface meaningful differences while keeping full detail available",
    actions: [
      "Choose a small set of decision fields",
      "Use consistent units and labels",
      "Link to complete itineraries",
      "Explain flexible or optional components",
    ],
    risk: "Comparing dozens of attributes gives every difference equal weight and makes the choice harder.",
    metric:
      "Measure package-detail views and qualified requests after comparison interactions.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "Travel packages being compared during a planning session",
  },
  {
    slug: "tourism-photo-selection-guide",
    category: "Conversion",
    title: "A practical photo-selection guide for tourism websites",
    description:
      "Choose a balanced image set that shows the experience, people, equipment, place and operational reality without misleading prospective guests.",
    focus: "answer visual questions instead of filling space",
    actions: [
      "Lead with a representative experience",
      "Show scale and guest participation",
      "Include equipment or vehicle context",
      "Use location images from the actual route",
    ],
    risk: "Generic destination imagery can imply access, equipment or conditions the operator does not provide.",
    metric:
      "Review image engagement, product progression and visitor questions for missing context.",
    image: "/images/marketing/reef-diving.webp",
    imageAlt: "Travel photography showing both place and activity detail",
  },
  {
    slug: "tourism-faq-conversion-guide",
    category: "Conversion",
    title: "Building tourism FAQs that support real decisions",
    description:
      "Turn recurring pre-booking questions into concise, product-specific answers placed where travellers need them instead of one oversized generic page.",
    focus: "resolve uncertainty without hiding essential facts",
    actions: [
      "Collect questions from real enquiries",
      "Answer policies in plain language",
      "Keep product-specific answers on product pages",
      "Review answers when operations change",
    ],
    risk: "Using FAQs to bury price, cancellation or eligibility detail forces visitors to hunt for core information.",
    metric:
      "Track repeated support questions and booking progression after publishing answers.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A guide answering practical questions from travellers",
  },
  {
    slug: "qualifying-custom-trip-leads",
    category: "Conversion",
    title: "How to qualify custom-trip leads without a giant form",
    description:
      "Capture destination, dates, party, interests and budget context in a respectful first step that gives an agency enough information to respond.",
    focus: "balance response quality with completion effort",
    actions: [
      "Ask destination or route intent",
      "Collect flexible or fixed dates",
      "Separate adults and children when useful",
      "Use a broad optional budget range",
    ],
    risk: "Requesting passport, medical or payment details before a proposal exists adds risk and unnecessary friction.",
    metric:
      "Measure qualified response rate and time to a useful first proposal.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "A custom trip brief being discussed with travel specialists",
  },
  {
    slug: "booking-request-confirmation-ux",
    category: "Conversion",
    title: "Booking-request confirmation UX for tourism businesses",
    description:
      "Make the post-submit state clear about what was received, what happens next and whether the activity is actually reserved.",
    focus: "prevent a request from being mistaken for a confirmed reservation",
    actions: [
      "Use an unambiguous success heading",
      "State the expected response process",
      "Repeat the requested service and date safely",
      "Provide a reachable follow-up route",
    ],
    risk: "Displaying a booking reference beside celebratory confirmed language can create operational conflict when capacity is still unchecked.",
    metric:
      "Monitor duplicate requests, follow-up questions and successful confirmations.",
    image: "/images/marketing/ocean-hero.webp",
    imageAlt:
      "A traveller completing an activity request with clear expectations",
  },
  {
    slug: "tour-availability-models-explained",
    category: "Operations",
    title: "Tour availability models: recurring, fixed and on request",
    description:
      "Choose an availability model that reflects how each service actually runs instead of forcing tours, rentals and packages into one calendar pattern.",
    focus: "represent operating intent accurately before accepting demand",
    actions: [
      "Use recurring rules for repeatable slots",
      "Use departures for capacity-controlled starts",
      "Use date ranges for rental windows",
      "Use on request when confirmation is manual",
    ],
    risk: "Showing instant-looking availability for a manually coordinated service creates false certainty.",
    metric:
      "Compare request accuracy, rescheduling and capacity conflicts by availability model.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "A scheduled group departure beginning a mountain route",
  },
  {
    slug: "tour-resource-planning-guide",
    category: "Operations",
    title: "Resource planning for guides, vehicles and equipment",
    description:
      "Model the limited people and assets needed to fulfil bookings, then protect capacity and turnaround time across overlapping work.",
    focus: "connect accepted demand to the resources that make it possible",
    actions: [
      "Name resources consistently",
      "Set meaningful capacity",
      "Record maintenance or unavailable states",
      "Check overlapping assignments",
    ],
    risk: "A booking calendar without resource allocation can look available while every suitable guide or vehicle is already committed.",
    metric:
      "Track assignment conflicts, utilisation and maintenance-related changes.",
    image: "/images/marketing/airport-transfer.webp",
    imageAlt:
      "A professional vehicle and driver prepared as fulfilment resources",
  },
  {
    slug: "tourism-customer-records-guide",
    category: "Operations",
    title: "Customer records for tourism businesses without CRM clutter",
    description:
      "Keep contact, source, enquiry and booking context together while limiting duplication and avoiding data that the operation does not need.",
    focus: "give the team enough history to respond consistently",
    actions: [
      "Deduplicate within the business",
      "Preserve lead and booking relationships",
      "Record practical preferences carefully",
      "Restrict records to authorised staff",
    ],
    risk: "Scattered spreadsheets and inboxes create duplicate follow-up and expose more personal information than necessary.",
    metric:
      "Measure duplicate reduction, response time and record completeness.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "A travel specialist reviewing an organised customer record",
  },
  {
    slug: "booking-status-workflow-tourism",
    category: "Operations",
    title: "A dependable booking-status workflow for tour teams",
    description:
      "Use a small guarded state model so pending requests, confirmations, completions, cancellations and no-shows remain operationally meaningful.",
    focus: "make every booking state explain what the team should do next",
    actions: [
      "Separate request from confirmation",
      "Record authorised transitions",
      "Release resources on cancellation",
      "Keep a visible activity history",
    ],
    risk: "A free-form status field allows contradictory states and makes reporting impossible to trust.",
    metric:
      "Review time in pending states, cancellation handling and unfulfilled confirmed work.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A tourism team coordinating the next operational step",
  },
  {
    slug: "fixed-departure-capacity-guide",
    category: "Operations",
    title: "Fixed-departure capacity control for tours and packages",
    description:
      "Protect limited seats under concurrent requests by treating departures as concrete inventory and checking active allocations atomically.",
    focus: "avoid accepting more active guests than a departure can serve",
    actions: [
      "Create one departure per real start",
      "Lock inventory during allocation",
      "Count only capacity-consuming states",
      "Keep minimum participation separate",
    ],
    risk: "Reading capacity and inserting later without a lock allows simultaneous requests to overbook the same departure.",
    metric:
      "Track remaining capacity, waitlisted demand and rejected over-capacity requests.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt: "A small group beginning a capacity-limited departure",
  },
  {
    slug: "tour-cancellation-operations",
    category: "Operations",
    title: "Cancellation operations for tours, rentals and transfers",
    description:
      "Connect public policy language to an internal process that records the change, releases resources and preserves the customer history.",
    focus:
      "turn a difficult customer event into a consistent operational workflow",
    actions: [
      "Record who changed the status",
      "Capture an appropriate internal reason",
      "Release assigned resources",
      "Send follow-up through the authorised channel",
    ],
    risk: "Deleting a cancelled record removes useful history and can leave vehicles or guides incorrectly blocked.",
    metric:
      "Monitor cancellation reasons, released capacity and repeated operational causes.",
    image: "/images/marketing/airport-transfer.webp",
    imageAlt: "A tourism vehicle waiting for an updated operational plan",
  },
  {
    slug: "travel-package-operations-guide",
    category: "Operations",
    title: "Operating multi-service travel packages from reusable products",
    description:
      "Compose packages from canonical tours and rentals while retaining package-specific itinerary, inclusion, pricing and policy information.",
    focus: "avoid silently duplicating every service inside every package",
    actions: [
      "Reference canonical offerings",
      "Order package components explicitly",
      "Store package-only narrative separately",
      "Review dependencies before publishing",
    ],
    risk: "Copied service records drift when a route, duration or operating rule changes in only one place.",
    metric: "Track broken references, package update time and component reuse.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "Multiple travel services assembled into one coherent package",
  },
  {
    slug: "tourism-lead-follow-up-system",
    category: "Operations",
    title: "A practical lead follow-up system for tourism teams",
    description:
      "Move enquiries through clear stages with an owner, next action and useful timeline instead of relying on inbox memory.",
    focus:
      "make the next customer action visible without overbuilding a sales CRM",
    actions: [
      "Assign one current stage",
      "Set a realistic follow-up time",
      "Record meaningful activity",
      "Convert without losing the original enquiry",
    ],
    risk: "Unstructured notes do not reveal which leads need attention or why an opportunity was lost.",
    metric:
      "Measure response time, stage age, conversion and documented loss reasons.",
    image: "/images/marketing/local-guide.webp",
    imageAlt: "A tourism team following up with a prospective traveller",
  },
];

type ComparisonGuide = {
  slug: string;
  title: string;
  description: string;
  competitor: string;
  competitorFit: string;
  triponeFit: string;
  decision: string;
  image: string;
  imageAlt: string;
  sources: ResourceSource[];
};

const comparisonGuides: ComparisonGuide[] = [
  {
    slug: "triponeplus-vs-squarespace-tourism",
    title: "TripOne+ vs Squarespace for tourism businesses",
    description:
      "Compare a broad no-code website platform with a travel-native website and operations workflow for tours, rentals and packages.",
    competitor: "Squarespace",
    competitorFit:
      "a team values broad no-code design, general commerce, marketing and an established all-in-one website ecosystem",
    triponeFit:
      "the starting point should be structured offerings, packages, travel-specific page recipes and connected booking-request operations",
    decision:
      "Build one real service page, update its operating details and test the complete mobile request workflow in each platform.",
    image: "/images/marketing/coastal-village.webp",
    imageAlt:
      "A polished travel website concept overlooking a coastal destination",
    sources: [
      {
        label: "Squarespace website builder",
        href: "https://www.squarespace.com/websites",
      },
      {
        label: "Squarespace feature index",
        href: "https://www.squarespace.com/feature-index",
      },
    ],
  },
  {
    slug: "triponeplus-vs-wordpress-tour-operators",
    title: "TripOne+ vs WordPress.com for tour operators",
    description:
      "Compare hosted WordPress publishing flexibility with a guided tourism data model, deterministic generation and connected operating records.",
    competitor: "WordPress.com",
    competitorFit:
      "the team wants a broad publishing platform, block editing, many themes and the option to extend the site through plugins",
    triponeFit:
      "operators prefer tourism terminology, controlled sections and products that flow directly into packages, enquiries and bookings",
    decision:
      "Compare who will maintain the site, which extensions are essential and how many systems must stay synchronized after launch.",
    image: "/images/marketing/mountain-trek.webp",
    imageAlt:
      "A structured tour website represented against a mountain landscape",
    sources: [
      {
        label: "WordPress.com features",
        href: "https://wordpress.com/features/",
      },
      {
        label: "WordPress.com setup guide",
        href: "https://wordpress.com/support/getting-started-with-wordpress-com/",
      },
    ],
  },
  {
    slug: "triponeplus-vs-fareharbor",
    title: "TripOne+ vs FareHarbor for tour businesses",
    description:
      "Understand the boundary between a travel-native website and lead workspace and a reservation platform focused on live booking operations and distribution.",
    competitor: "FareHarbor",
    competitorFit:
      "the priority is real-time online reservations, payments, distribution connections and mature booking-business management",
    triponeFit:
      "the immediate need is structured website generation, content, SEO, packages, qualified requests and an operator-controlled publishing workflow",
    decision:
      "These tools may be complementary: identify the canonical inventory system and test a product-level handoff before selecting or connecting platforms.",
    image: "/images/marketing/ocean-hero.webp",
    imageAlt:
      "A high-intent tour experience ready for an online booking decision",
    sources: [
      {
        label: "FareHarbor for tour operators",
        href: "https://fareharbor.com/solutions/tours/",
      },
      { label: "About FareHarbor", href: "https://fareharbor.com/about/" },
    ],
  },
  {
    slug: "triponeplus-vs-rezdy",
    title: "TripOne+ vs Rezdy for activity operators",
    description:
      "Compare website-first tourism merchandising and payment-free requests with reservation inventory, booking widgets and channel distribution.",
    competitor: "Rezdy",
    competitorFit:
      "the operator needs live inventory, online checkout, reporting, integrations and reseller or OTA distribution",
    triponeFit:
      "the operator needs a guided brand website, reusable travel content, packages, SEO structure, enquiries and native requests without taking payments",
    decision:
      "Map discovery, checkout, inventory and fulfilment separately; then choose one owner for each record and avoid presenting conflicting availability.",
    image: "/images/marketing/desert-atv.webp",
    imageAlt:
      "An activity group representing a capacity-sensitive booking workflow",
    sources: [
      {
        label: "Rezdy booking software",
        href: "https://rezdy.com/booking-software/",
      },
      {
        label: "Rezdy channel manager",
        href: "https://rezdy.com/channel-manager/",
      },
    ],
  },
  {
    slug: "triponeplus-vs-bokun",
    title: "TripOne+ vs Bókun for tours and activities",
    description:
      "Compare a tourism website operating layer with booking, channel, availability and reseller tools designed for experience providers.",
    competitor: "Bókun",
    competitorFit:
      "central booking management, live availability, channel connections, point of sale and marketplace distribution are the main requirements",
    triponeFit:
      "the priority is a premium structured website, deterministic builder, owned content, packages, enquiries and payment-free direct requests",
    decision:
      "Decide whether one platform or a connected pair will own availability, then test the exact handoff from an experience page to reservation.",
    image: "/images/marketing/coastal-yacht.webp",
    imageAlt: "A bookable coastal activity represented in an image-led website",
    sources: [
      { label: "Bókun platform overview", href: "https://www.bokun.io/" },
    ],
  },
  {
    slug: "triponeplus-vs-shopify-travel",
    title: "TripOne+ vs Shopify for selling travel experiences",
    description:
      "Compare a commerce-led platform and application ecosystem with a travel-native model for experiences, rentals, itineraries and operating requests.",
    competitor: "Shopify",
    competitorFit:
      "the business is commerce-led, needs established checkout and payments, or plans to assemble travel capabilities through apps and custom development",
    triponeFit:
      "the website should start from tourism records, page recipes, service relationships and an operations workspace without a payment integration",
    decision:
      "List the exact products, inventory rules, checkout needs and weekly content changes, then prototype one complete customer journey.",
    image: "/images/marketing/travel-planning.webp",
    imageAlt: "Travel products being structured for a digital sales journey",
    sources: [
      {
        label: "Shopify website-builder comparison",
        href: "https://www.shopify.com/blog/best-website-builders",
      },
      {
        label: "Shopify tourism trends",
        href: "https://www.shopify.com/ie/enterprise/blog/trending-tourism-websites",
      },
    ],
  },
];

function makeVerticalArticle(guide: VerticalGuide): ResourceArticle {
  return {
    slug: guide.slug,
    category: "Guide",
    title: `Website planning guide for ${guide.label}`,
    description: `A practical framework for ${guide.label} to publish the details travellers need, create a truthful booking path and keep website promises aligned with operations.`,
    image: guide.image,
    imageAlt: guide.imageAlt,
    readTime: "8 min read",
    publishedAt,
    updatedAt: publishedAt,
    takeaways: [
      `Structure the website around how guests evaluate ${guide.label}.`,
      "Distinguish a booking request from a confirmed reservation.",
      "Keep public content connected to real capacity and fulfilment.",
    ],
    sections: [
      {
        heading: "Start with the traveller's decision",
        paragraphs: [
          guide.audience,
          `For ${guide.label}, a useful website makes those comparisons possible before asking for personal details. Use a focused homepage, a complete page for every meaningful service, and supporting pages only when they add distinct planning information.`,
        ],
      },
      {
        heading: "Publish the essential service details",
        paragraphs: [
          "Use consistent labels across cards, detail pages and enquiry forms. A visitor should not need to open a chat simply to understand the basic shape of the service.",
        ],
        bullets: guide.needs,
      },
      {
        heading: "Design an honest booking path",
        paragraphs: [
          guide.booking,
          "Place the relevant policy, price basis and expected response close to the action. A successful form should say what was received and what must happen before the customer can treat it as confirmed.",
        ],
      },
      {
        heading: "Connect the promise to operations",
        paragraphs: [
          guide.operating,
          "Review the public page whenever operating rules, resources, route conditions or inclusions change. That discipline prevents the website and the actual guest experience from drifting apart.",
        ],
      },
    ],
    faqs: [
      {
        question: `What is the most important page for ${guide.label}?`,
        answer:
          "The individual service page usually carries the most decision-making detail. It should explain the experience, fit, logistics, price basis and real next step without relying on generic homepage claims.",
      },
      {
        question: "Should every request be shown as instantly confirmed?",
        answer:
          "No. Use instant confirmation only when live capacity and operational requirements are genuinely checked. Otherwise describe the submission as a request and explain the confirmation process.",
      },
    ],
  };
}

function makeStrategyArticle(guide: StrategyGuide): ResourceArticle {
  return {
    slug: guide.slug,
    category: guide.category,
    title: guide.title,
    description: guide.description,
    image: guide.image,
    imageAlt: guide.imageAlt,
    readTime: "7 min read",
    publishedAt,
    updatedAt: publishedAt,
    takeaways: [
      guide.focus[0]!.toUpperCase() + guide.focus.slice(1) + ".",
      guide.actions[0] + ".",
      guide.metric,
    ],
    sections: [
      {
        heading: "Define the useful outcome",
        paragraphs: [
          `The objective is to ${guide.focus}. Begin with the traveller or operator decision, then choose the smallest structure that supports it.`,
          "Write down the source of truth for every fact before changing copy, forms or automation. This keeps the public promise consistent with what the team can actually deliver.",
        ],
      },
      {
        heading: "Build the working foundation",
        paragraphs: [
          "Apply the improvement as a repeatable system rather than an isolated visual change.",
        ],
        bullets: guide.actions,
      },
      {
        heading: "Avoid the common failure",
        paragraphs: [
          guide.risk,
          "Test the complete path with realistic information on a phone and desktop. Confirm that errors are recoverable, labels remain precise and no unsupported claim is introduced.",
        ],
      },
      {
        heading: "Measure and refine",
        paragraphs: [
          guide.metric,
          "Use that signal to identify missing information or workflow friction. Do not interpret traffic, clicks or rankings as confirmed revenue unless the underlying booking outcome is available and reliable.",
        ],
      },
    ],
    faqs: [
      {
        question: `Where should a small operator begin with ${guide.title.toLowerCase()}?`,
        answer: `Begin with one important service and the real customer journey around it. ${guide.actions[0]}; then test the result before expanding the pattern.`,
      },
      {
        question: "How often should this be reviewed?",
        answer:
          "Review it whenever the service, operating process or customer questions change, and schedule a focused quarterly check even when no obvious issue has been reported.",
      },
    ],
  };
}

function makeComparisonArticle(guide: ComparisonGuide): ResourceArticle {
  return {
    slug: guide.slug,
    category: "Comparison",
    title: guide.title,
    description: guide.description,
    image: guide.image,
    imageAlt: guide.imageAlt,
    readTime: "9 min read",
    publishedAt,
    updatedAt: publishedAt,
    takeaways: [
      `${guide.competitor} and TripOne+ begin from different product priorities.`,
      "Compare the complete weekly maintenance workflow, not a feature-count headline.",
      "Verify current pricing, integrations and provider claims directly before purchasing.",
    ],
    sections: [
      {
        heading: "The core product difference",
        paragraphs: [
          `${guide.competitor} may be the stronger fit when ${guide.competitorFit}.`,
          `TripOne+ may be the stronger fit when ${guide.triponeFit}. This difference matters because the starting data model determines how much configuration and synchronization the operator must maintain.`,
        ],
      },
      {
        heading: `When ${guide.competitor} deserves the shortlist`,
        paragraphs: [
          `Choose ${guide.competitor} for the capabilities it currently documents and the workflows your team genuinely needs. Confirm plan limits, regional availability, fees, integrations and support directly with the provider.`,
        ],
      },
      {
        heading: "When TripOne+ deserves the shortlist",
        paragraphs: [
          "TripOne+ is intentionally travel-native: services, rentals, packages, destinations, structured sections, booking requests, leads and fulfilment resources share one model. It does not claim to replace payment processing, OTA distribution or every specialist reservation feature.",
        ],
      },
      {
        heading: "Run a fair evaluation",
        paragraphs: [
          guide.decision,
          "Use current primary documentation and a real product sample. Record which platform owns content, availability, customer data and the final confirmation so gaps and duplicate work are visible before migration.",
        ],
      },
    ],
    faqs: [
      {
        question: `Does TripOne+ replace every ${guide.competitor} feature?`,
        answer: `No. ${guide.competitor} has its own scope and ecosystem. TripOne+ focuses on structured tourism websites and connected payment-free operating workflows; evaluate the specific capabilities your business requires.`,
      },
      {
        question: "Can the platforms be used together?",
        answer:
          "Potentially. A specialist reservation or commerce system can own checkout and live inventory while TripOne+ owns the discovery website, provided product links, availability language and analytics handoffs remain accurate.",
      },
    ],
    sources: guide.sources,
  };
}

export const supplementalResources: ResourceArticle[] = [
  ...verticalGuides.map(makeVerticalArticle),
  ...strategyGuides.map(makeStrategyArticle),
  ...comparisonGuides.map(makeComparisonArticle),
];
