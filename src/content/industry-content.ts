import type { SeoPageSpec } from "./seo-catalog";
import type { SeoContentSection } from "./seo-content";

type IndustryProfile = {
  promise: string;
  operatingReality: string;
  catalogue: string;
  salesJourney: string;
  delivery: string;
  capabilities: string[];
  website: string;
  measurement: string;
  safeguards: string[];
  firstMonth: string;
  secondMonth: string;
  thirdMonth: string;
};

const profiles: Record<string, IndustryProfile> = {
  "/for/tour-operators": {
    promise:
      "Tour operator software should connect the experiences travellers discover with the enquiries, bookings, customers and delivery work the team manages. TripOne+ is designed as a website and growth operating layer for operators that want structured products and an owned direct-booking journey, not merely a booking button placed on an otherwise disconnected site.",
    operatingReality:
      "A tour operator may sell scheduled departures, private trips, rentals, multi-day packages and custom requests at the same time. Each can use different capacity, pricing, meeting instructions and confirmation steps. The system must remain understandable to a small team during peak season while giving leaders a reliable view of what is published and what needs action.",
    catalogue:
      "Tours are stored as structured products with duration, location, media, pricing context, inclusions, itineraries, suitability and booking mode. Destinations and useful taxonomies help travellers browse the catalogue without forcing an operator to create a separate system for every activity subtype. Packages can group existing services with accommodation, transfer or custom items.",
    salesJourney:
      "A visitor can move from an SEO-ready destination or product page into the appropriate next step: external booking, direct request, phone or WhatsApp. The lead retains source and product context. Staff can progress it into a customer and booking record instead of copying details across unconnected inboxes and sheets.",
    delivery:
      "Availability, resources and operational notes should reflect the way the operator actually fulfils a tour. TripOne+ provides a controlled base for products, requests and schedules; where specialist live inventory, channel management or payment processing is required, that system should remain the authoritative integration rather than being imitated by an unreliable toggle.",
    capabilities: [
      "Tour, activity, rental and package catalogue",
      "Website builder using the same preview and public renderer",
      "Enquiry, customer and booking workspace",
      "Availability and resource planning foundation",
      "Destination and traveller-friendly taxonomy management",
      "SEO, analytics and direct-growth controls",
    ],
    website:
      "The generated website uses real business and product data to create editable pages, navigation, metadata and conversion sections. Operators can add evidence, policies and local expertise without maintaining raw HTML. Publishing creates a versioned release, while draft work remains private until the owner chooses to publish.",
    measurement:
      "The dashboard should distinguish visits and actions from qualified leads and confirmed bookings. Product, source and landing-page context make the acquisition story more useful, while first-party records help the operator identify response delays and demand patterns without inventing revenue that has not been recorded.",
    safeguards: [
      "Do not publish availability the team cannot fulfil",
      "Keep prices, inclusions and meeting instructions owned and current",
      "Retain a clear source of truth for external reservations and payments",
      "Test the complete mobile enquiry and booking handoff before launch",
    ],
    firstMonth:
      "In the first 30 days, model the main tour, configure the business and website, publish accurate core pages and test one complete discovery-to-response journey with the responsible team.",
    secondMonth:
      "By day 60, organise the wider catalogue, destinations and packages, improve lead ownership and connect website content to real customer questions and search demand.",
    thirdMonth:
      "By day 90, review qualified enquiries, bookings, operational exceptions and content performance, then expand only the workflows the team can maintain confidently.",
  },
  "/for/travel-agencies": {
    promise:
      "Travel agency software should preserve the context behind every enquiry while helping the team package, present and follow up on complex trips. TripOne+ brings the agency website, packages, destinations, leads and customer records into one workspace so a promising request does not become an anonymous message in a shared inbox.",
    operatingReality:
      "Agencies balance ready-made packages with bespoke requests, multiple travellers, suppliers, changing dates and proposal revisions. The public page needs enough specificity to earn trust without presenting tentative supplier information as guaranteed. Internally, ownership and next action matter more than collecting the largest possible number of fields.",
    catalogue:
      "Packages can combine linked services with custom inclusions such as accommodation, transfers or meals, then add a day-by-day itinerary and enquiry mode. Destinations, travel styles and package categories provide useful browsing paths. Draft terms stay private until they have enough substance and assignments to help a visitor.",
    salesJourney:
      "Forms capture the destination, party and timing context needed for a useful first response. CRM stages distinguish a new enquiry from a qualified opportunity, proposal, booking and completed trip. Follow-up can remain personal while templates and automation support consistent acknowledgement and reminders.",
    delivery:
      "A customer record should show the connected enquiry and booking context without becoming an uncontrolled store for sensitive documents. Supplier quotations, ticketing, payments and regulated travel records may require specialist systems; TripOne+ should link the workflow while keeping system boundaries explicit.",
    capabilities: [
      "Package, itinerary and destination publishing",
      "Lead pipeline with source and offer context",
      "Customer and booking relationship records",
      "SEO-ready agency website and content controls",
      "Reusable service, package and travel-style taxonomies",
      "Marketing, review and retention workflow foundation",
    ],
    website:
      "The agency website can present curated packages, destination expertise and enquiry routes without claiming live inventory that is not connected. Structured sections keep mobile content readable, metadata editable and internal links coherent as the catalogue grows.",
    measurement:
      "Useful reporting follows enquiries through qualification, proposal and booking rather than counting every form as equal. Source and package context reveal what creates commercially relevant conversations, while response time and stage ageing identify preventable sales friction.",
    safeguards: [
      "Label indicative prices and supplier-dependent terms accurately",
      "Collect only customer information needed for the current step",
      "Keep proposal and booking ownership visible",
      "Do not imply real-time availability without a reliable source",
    ],
    firstMonth:
      "Month one configures the agency profile, one representative package, lead stages and an accurate enquiry journey from a published destination or offer.",
    secondMonth:
      "By day 60, build the useful package and destination taxonomy, standardise follow-up and add content that answers recurring planning and trust questions.",
    thirdMonth:
      "By day 90, review stage conversion, response quality and package demand, then refine the catalogue and workflows from actual sales-team evidence.",
  },
  "/for/dmcs": {
    promise:
      "DMC software needs to represent a destination management company's mix of ground services, experiences, packages and custom programmes without flattening every request into one product type. TripOne+ provides a flexible public catalogue and growth workspace for destination specialists, while leaving specialist contracting and finance systems authoritative where required.",
    operatingReality:
      "Destination management companies may serve FIT travellers, groups, agencies and corporate partners with different service levels and commercial arrangements. An itinerary can involve guides, transport, accommodation, activities and local suppliers. The first useful system goal is shared context and ownership, not pretending every bespoke combination behaves like instant retail inventory.",
    catalogue:
      "The catalogue can describe reusable services and destinations, assemble packages with linked and custom items, and maintain day-by-day itinerary content. Taxonomies help internal editors and public visitors navigate by activity, destination, travel style or package category without duplicating the underlying service record.",
    salesJourney:
      "Enquiries retain the page, package or destination that prompted them and move through defined ownership. A DMC can qualify party, dates, market and programme needs before committing supplier work. Customer and booking records preserve the relationship once the request becomes deliverable business.",
    delivery:
      "Resource and availability planning can expose the operational shape of the programme, but supplier confirmation, net rates, contracts and financial reconciliation require disciplined sources of truth. The platform should make those handoffs explicit and avoid publishing provisional components as confirmed.",
    capabilities: [
      "Multi-service and destination catalogue",
      "FIT, group and custom package presentation",
      "Linked services and day-by-day itineraries",
      "Lead, customer and booking context",
      "Partner-ready website and enquiry routes",
      "SEO, content and growth-service foundation",
    ],
    website:
      "A DMC website should demonstrate destination knowledge, operating scope and relevant programme examples while guiding trade and direct audiences into the right conversation. Page recipes can support destinations, packages, services and expertise without generating empty pages for every possible term.",
    measurement:
      "Reporting should separate direct and partner enquiries, programme type, destination, stage, response time and confirmed outcome. Complex sales cycles need pipeline evidence and stage ageing; website engagement alone cannot establish the value of a custom itinerary.",
    safeguards: [
      "Separate sample programmes from confirmed availability",
      "Protect supplier terms and traveller information",
      "Define ownership across sales and operations handoffs",
      "Keep external contracting and finance sources authoritative",
    ],
    firstMonth:
      "In month one, map the principal market and programme, configure representative services and destinations, and test the complete partner or traveller enquiry handoff.",
    secondMonth:
      "By day 60, assemble reusable packages, clarify trade and direct messaging, and connect CRM stages to the actual proposal and supplier-confirmation process.",
    thirdMonth:
      "By day 90, examine pipeline quality and delivery exceptions, improve the content and data model, and document which specialist integrations deserve priority.",
  },
  "/for/activity-providers": {
    promise:
      "Activity booking software should make the product, time, capacity and next action clear to both the traveller and the operator. TripOne+ helps activity providers publish structured experiences, manage enquiry and booking context, and build owned discovery without forcing every provider into a heavyweight tour-enterprise workflow.",
    operatingReality:
      "An activity business may sell shared sessions, private departures, equipment-based rentals or weather-dependent experiences. Capacity can depend on guides, vehicles, vessels, time slots or safety ratios. The system must be quick for staff to operate while being honest when live inventory or instant confirmation is not connected.",
    catalogue:
      "Products store duration, location, price context, suitability, media, inclusions, exclusions and booking mode. One general activity and rental model can retain a subtype in structured details, avoiding a separate backend for every bike, boat, jet ski or outdoor service. Useful categories remain editable taxonomies.",
    salesJourney:
      "A visitor sees the practical information required to choose and reaches a clear booking request, external checkout, phone or WhatsApp action. The resulting record keeps product and source context. Staff can see what needs confirmation and avoid making the customer repeat the selected activity.",
    delivery:
      "Availability and resources should represent the limiting unit the provider actually manages. Safety briefings, waivers, weather decisions and payment processing may involve additional systems and human checks. A reliable workflow exposes those dependencies instead of marking every request automatically confirmed.",
    capabilities: [
      "Structured activity and rental product pages",
      "Capacity, availability and resource foundation",
      "Direct request and external booking modes",
      "Customer, booking and lead context",
      "Mobile website builder and media management",
      "Local SEO and campaign landing journeys",
    ],
    website:
      "Activity pages prioritise location, duration, price context, requirements, images and the booking action. Destination and activity collections help visitors compare real inventory. The shared renderer means the builder preview and public site use the same section components.",
    measurement:
      "The operator can review demand by activity, date and source, response time, booking progression and capacity-related loss. Marketing events remain diagnostic until they connect to qualified or confirmed records, which protects decisions from inflated platform attribution.",
    safeguards: [
      "Do not describe a request as an instant confirmation",
      "Model the actual limiting guide, equipment or time resource",
      "Keep safety and suitability information prominent",
      "Test weather, cancellation and sold-out exceptions",
    ],
    firstMonth:
      "The first month publishes one accurate flagship activity, configures its action and availability assumptions, and tests the mobile path through staff response.",
    secondMonth:
      "By day 60, organise the product range, resources and destinations, improve local discovery and connect recurring enquiries to consistent customer follow-up.",
    thirdMonth:
      "By day 90, evaluate qualified demand, capacity constraints and exceptions, then expand the catalogue and automation only where operations remain reliable.",
  },
  "/for/adventure-tour-operators": {
    promise:
      "Adventure tour operator software should connect a compelling trip page with the people, equipment, departures and readiness checks needed to deliver it safely. TripOne+ gives adventure businesses an owned website and commercial workspace while keeping safety-critical judgement with trained operators.",
    operatingReality:
      "Adventure products are high-consideration purchases shaped by difficulty, terrain, season, group composition and equipment. Capacity is rarely just a number of seats: guide ratios, permits, transport and specialist resources can all become the real limit. Accurate expectation setting is part of conversion, not an obstacle to it.",
    catalogue:
      "Each adventure can explain itinerary, duration, location, difficulty, minimum age, inclusions, exclusions, meeting point and preparation. Departures and packages can reuse the underlying product without duplicating every description. Activity, destination and travel-style taxonomies help visitors browse genuine inventory.",
    salesJourney:
      "The traveller moves from inspiration into practical suitability and a clearly labelled booking or enquiry action. The lead retains the selected adventure and page context so staff can qualify dates, experience and party needs without asking the customer to start again.",
    delivery:
      "Guides, specialist equipment and departures should be treated as constrained resources. Medical screening, waivers, permits and emergency planning remain controlled operational processes; a website field must never be presented as a substitute for trained assessment or local requirements.",
    capabilities: [
      "Adventure, departure and package publishing",
      "Difficulty, suitability and preparation content",
      "Guide, equipment and capacity planning foundation",
      "Context-rich enquiries, customers and bookings",
      "Destination-led SEO and visual website builder",
      "Pre-trip communication and resource workflows",
    ],
    website:
      "An adventure website needs cinematic proof and precise logistics in equal measure. Structured sections can pair strong media with itinerary, difficulty, inclusions, safety context and FAQs while keeping the mobile action visible and the page fast.",
    measurement:
      "Review qualified demand by product, destination and source alongside suitability questions, response time, booking progression and capacity loss. This reveals whether growth is reaching the right travellers, not merely producing more messages.",
    safeguards: [
      "Keep safety, difficulty and preparation information current",
      "Model guide ratios and specialist resources honestly",
      "Route medical and exceptional needs to trained staff",
      "Never turn a request into an automatic confirmation without authority",
    ],
    firstMonth:
      "Month one publishes a flagship adventure with verified suitability and delivery data, then tests its complete mobile enquiry and staff-response journey.",
    secondMonth:
      "By day 60, structure destinations, departures, equipment and packages, and build pre-trip communication around recurring readiness questions.",
    thirdMonth:
      "By day 90, compare qualified bookings with resource and suitability constraints, then expand the catalogue from evidence rather than volume alone.",
  },
  "/for/trekking-companies": {
    promise:
      "Trekking company software should make a complex journey understandable before it helps sell it. TripOne+ connects trek itineraries, departures, guides, porters, packages and enquiries so travellers can evaluate fit and the operator can preserve context from research through preparation.",
    operatingReality:
      "A trek can vary by altitude, acclimatisation, season, route, accommodation, permits and support team. A polished card cannot carry that decision alone. The product model and page need room for day-by-day detail, physical expectations and local logistics while the business tracks departure and staffing constraints.",
    catalogue:
      "Treks can store duration, difficulty, itinerary, location, inclusions, exclusions, FAQs and booking mode. Destinations and travel styles create useful route families. Packages can combine the trek with transfers, accommodation or other services without breaking the source record.",
    salesJourney:
      "Destination and route pages support organic research, then guide visitors into the relevant trek and action. Enquiries retain trek, dates and source. Staff can qualify experience, party needs and timing before treating the request as a booking.",
    delivery:
      "Departure capacity must reflect guides, porters, accommodation, permits and transport where they apply. Health, altitude and emergency decisions require qualified human review and current local guidance; software can organise information but cannot make those judgements safely.",
    capabilities: [
      "Day-by-day trek and package itineraries",
      "Difficulty, altitude and preparation content",
      "Departure, guide and porter planning foundation",
      "Destination and travel-style collections",
      "Enquiry, customer and booking context",
      "Search-ready trekking website and guides",
    ],
    website:
      "The website can balance photography with scannable route facts, acclimatisation context, maps or location information, inclusions and detailed planning copy. Related treks and destinations create meaningful internal paths instead of repetitive keyword pages.",
    measurement:
      "Measure discovery and qualified enquiries by route and destination, then inspect response time, departure fit and booking progression. Preparation questions are valuable content evidence and can reveal where a page creates unsafe or inaccurate expectations.",
    safeguards: [
      "Publish realistic difficulty and acclimatisation context",
      "Keep itinerary, permits and seasonal details reviewed",
      "Treat health screening as a trained human responsibility",
      "Tie departure promises to real guide and porter capacity",
    ],
    firstMonth:
      "The first month models one representative trek and departure, verifies its itinerary and requirements, and tests the research-to-enquiry journey.",
    secondMonth:
      "By day 60, organise routes and destinations, add useful preparation resources, and connect guide, porter and package data to the workflow.",
    thirdMonth:
      "By day 90, review route-level demand, qualification and delivery constraints, then prioritise the next treks and content clusters.",
  },
  "/for/safari-operators": {
    promise:
      "Safari operator software should support a considered, high-value sales journey while organising the lodges, vehicles, guides and itineraries behind it. TripOne+ helps safari businesses present accurate programmes and move enquiries into accountable customer and booking workflows.",
    operatingReality:
      "Safari availability can depend on accommodation allocations, vehicle capacity, guide schedules, park rules, transfers and seasonal wildlife patterns. Many requests require consultation rather than instant checkout. The platform should communicate what is known, what is indicative and what still requires confirmation.",
    catalogue:
      "Safaris can be structured as experiences or multi-day packages with destinations, accommodation context, itinerary, inclusions, exclusions, pickup and wildlife highlights. Product and destination collections help travellers compare trip styles without implying wildlife guarantees.",
    salesJourney:
      "A visitor can explore destination expertise and sample itineraries, then submit a request that retains programme and source context. CRM ownership and stages support qualification, proposal and follow-up while the final booking reflects confirmed supplier and operational information.",
    delivery:
      "Vehicles and guides are first-class constraints, while lodge and park confirmations may remain in specialist supplier processes. Wildlife language must remain responsible: sightings vary and should never be promised as a certainty for conversion.",
    capabilities: [
      "Safari itinerary and package presentation",
      "Destination, lodge and wildlife context",
      "Vehicle, guide and departure planning foundation",
      "Consultative enquiry and CRM workflow",
      "Customer and booking relationship records",
      "Premium website, SEO and media controls",
    ],
    website:
      "A premium safari site can use immersive imagery alongside clear itinerary, season, accommodation and practical information. Conversion sections should invite a relevant consultation without using fake urgency or unsupported claims about sightings, exclusivity or availability.",
    measurement:
      "Track qualified enquiries, programme and destination interest, proposal progression, response time and confirmed bookings where recorded. Long sales cycles need stage evidence and follow-up quality rather than a dashboard that treats every brochure view as revenue.",
    safeguards: [
      "Never guarantee wildlife sightings",
      "Distinguish sample itineraries from confirmed supplier availability",
      "Model vehicle and guide capacity before promoting departures",
      "Protect traveller details during consultative sales",
    ],
    firstMonth:
      "Month one builds a representative safari programme, destination journey and qualification process with verified claims and ownership.",
    secondMonth:
      "By day 60, structure additional destinations and itineraries, improve proposal follow-up and connect vehicle and guide constraints to planning.",
    thirdMonth:
      "By day 90, review pipeline quality and programme demand, strengthen useful destination content and prioritise integrations from real booking handoffs.",
  },
  "/for/boat-tour-operators": {
    promise:
      "Boat tour booking software should connect each departure to the vessel, passenger capacity, crew and conditions required to operate it. TripOne+ helps boat operators publish distinctive trips and manage direct demand without pretending weather-sensitive requests are always instantly confirmed.",
    operatingReality:
      "A boat tour may be shared, private, scheduled or chartered. Vessel certification, crew, passenger limits, maintenance, tide and weather can change the available operation. The system needs simple customer choices backed by resource-aware planning and visible exceptions.",
    catalogue:
      "Tours can describe vessel, route, duration, departure point, passenger guidance, inclusions and booking mode. Vessels remain reusable resources rather than text copied into every product. Destinations and activity collections organise sunset cruises, wildlife trips, transfers or private experiences.",
    salesJourney:
      "Visitors see the trip and vessel context before selecting the next action. Requests retain party, tour and source information; external reservation handoffs remain clearly labelled. Staff confirm suitability and conditions rather than reconstructing the selection from a generic message.",
    delivery:
      "Capacity should use the lower of commercial, regulatory and configured operational limits. Maintenance blocks, crew assignments and weather decisions need accountable owners. Safety and final go/no-go authority stay with the operator and relevant regulations.",
    capabilities: [
      "Boat tour and private charter pages",
      "Vessel, departure and passenger-capacity foundation",
      "Direct requests and external booking links",
      "Meeting-point and preparation information",
      "Customer, booking and source context",
      "Local SEO and responsive website publishing",
    ],
    website:
      "The website can lead with route and on-water imagery while surfacing vessel, timing, meeting point, accessibility, cancellation and weather context before the call to action. Local destination pages support discovery without duplicating every tour.",
    measurement:
      "Review demand and bookings by route, vessel, departure and source alongside cancellations, capacity loss and response time. This connects acquisition with the resource that actually earns revenue.",
    safeguards: [
      "Apply vessel and regulatory passenger limits",
      "Make weather and cancellation terms easy to find",
      "Block maintenance and unavailable crew before confirmation",
      "Keep safety decisions outside marketing automation",
    ],
    firstMonth:
      "The first month publishes one real route with its vessel and capacity assumptions, then tests booking, weather and sold-out paths.",
    secondMonth:
      "By day 60, organise the fleet and departure calendar, improve local discovery and standardise customer information and response ownership.",
    thirdMonth:
      "By day 90, compare route demand with utilisation and exceptions, then expand only the schedule and content the team can maintain accurately.",
  },
  "/for/yacht-charters": {
    promise:
      "Yacht charter software should support a premium, consultative enquiry while making vessel and date context immediately clear. TripOne+ gives charter businesses a refined catalogue, owned website and CRM pathway suited to high-value requests that often require qualification and a tailored proposal.",
    operatingReality:
      "Yacht charters vary by vessel, route, duration, guest count, crew, catering, marina, extras and terms. Availability may be provisional until operations or an owner confirms it. A credible workflow distinguishes an enquiry from a hold, option, deposit and confirmed charter.",
    catalogue:
      "Each yacht can present capacity, spaces, features, gallery, operating area and charter options, while experiences or packages explain routes and inclusions. Taxonomies support vessel style and destination browsing without copying the same yacht record into every itinerary.",
    salesJourney:
      "A high-intent page collects dates, party and requested experience without turning the first message into a false confirmation. Staff retain the yacht, campaign and page context, progress the opportunity and communicate the exact next step.",
    delivery:
      "Vessel availability, maintenance, crew and marina requirements must remain controlled by accountable operational sources. Proposal, payment and contract platforms can remain connected where specialist functions are required; the customer journey should show the boundary clearly.",
    capabilities: [
      "Premium yacht and charter catalogue",
      "Vessel galleries, capacity and feature records",
      "Date-led consultative enquiry workflow",
      "Lead, client and booking progression",
      "Route, destination and package presentation",
      "Luxury website, SEO and conversion controls",
    ],
    website:
      "Large, well-compressed imagery can create desire while specifications, capacity, operating area and terms establish trust. The page should feel premium through restraint and clarity rather than hiding basic information to manufacture exclusivity.",
    measurement:
      "Pipeline reporting follows qualified charter value, stage, vessel, dates, source and response time. Platform events can indicate interest but do not become charter revenue until a confirmed record supports them.",
    safeguards: [
      "Label provisional and confirmed availability distinctly",
      "Protect client information and high-value enquiry context",
      "Keep vessel, crew and maintenance sources authoritative",
      "Avoid unsupported luxury, exclusivity or availability claims",
    ],
    firstMonth:
      "Month one structures the flagship yacht and charter journey, defines CRM stages and tests enquiry, unavailable-date and proposal handoffs.",
    secondMonth:
      "By day 60, organise the fleet and routes, refine qualification and response templates, and strengthen destination-led discovery.",
    thirdMonth:
      "By day 90, review qualified pipeline and vessel demand, then improve the catalogue and operational integrations around evidenced friction.",
  },
  "/for-diving-snorkelling": {
    promise:
      "Dive booking software should connect trips, boats, instructors, equipment and participant suitability without reducing safety to a checkbox. TripOne+ helps diving and snorkelling operators publish clear products, collect useful booking context and coordinate capacity around the resources that actually limit a departure.",
    operatingReality:
      "Introductory dives, certified trips, courses and snorkelling tours have different supervision, equipment and eligibility needs. Boat seats alone do not define capacity. Certification, instructor ratios, tanks, sizes, conditions and local rules can all affect whether the requested experience is appropriate.",
    catalogue:
      "Products can explain site, duration, required certification, minimum age, inclusions, equipment, meeting point and booking mode. Dive sites and destinations form useful collections, while courses and trips keep their distinct requirements instead of sharing generic copy.",
    salesJourney:
      "The visitor sees prerequisites before the action and can submit relevant party and experience context. Staff verify certification, medical or equipment needs through the appropriate controlled process. The website does not issue safety clearance.",
    delivery:
      "Boats, instructors and equipment are linked planning constraints. Final participant acceptance, conditions and dive planning remain with qualified professionals operating under local standards. Sensitive medical information should be collected only through an appropriate secure workflow.",
    capabilities: [
      "Dive, course and snorkelling product pages",
      "Site, prerequisite and certification guidance",
      "Boat, instructor and equipment capacity foundation",
      "Context-rich request and booking records",
      "Destination, gallery and review publishing",
      "Local search and mobile booking journeys",
    ],
    website:
      "Underwater media can lead the experience while visible prerequisites, site facts, equipment and conservation guidance help visitors select responsibly. Fast responsive pages and concise actions matter for travellers already at the destination.",
    measurement:
      "Track demand by product, site and source together with qualification, equipment questions, capacity loss and confirmed progression. Separate interest from accepted participation and never describe a marketing event as safety approval.",
    safeguards: [
      "Keep certification and prerequisite language unambiguous",
      "Apply instructor, boat and equipment constraints together",
      "Route medical suitability to qualified controlled processes",
      "Preserve professional authority over conditions and dive planning",
    ],
    firstMonth:
      "The first month publishes one trip and one distinct eligibility path, then tests the request through instructor, boat and equipment checks.",
    secondMonth:
      "By day 60, structure sites, courses and resources, improve local discovery and standardise preparation communication.",
    thirdMonth:
      "By day 90, review qualified demand, resource constraints and customer questions, then expand products and automation within professional safeguards.",
  },
  "/for/rafting-companies": {
    promise:
      "Rafting booking software should connect each departure with rafts, guides, equipment, transport and participant expectations. TripOne+ gives rafting operators an owned sales journey and capacity foundation while keeping river and safety decisions with qualified teams.",
    operatingReality:
      "Capacity depends on raft configuration, guide ratios, water conditions, equipment sizes, transport and the suitability of the group. Difficulty can change by section and season. Clear preparation and cancellation information helps attract appropriate customers and reduces avoidable operational pressure.",
    catalogue:
      "Trips can describe river section, duration, grade context, age guidance, inclusions, equipment, pickup and booking mode. Multi-day rafting can use package itineraries, while destinations and adventure categories help visitors compare real options.",
    salesJourney:
      "Visitors receive suitability and meeting information before they act. Enquiries retain trip, date and party context. Staff can verify fit and capacity before confirmation instead of accepting every request against a simple seat count.",
    delivery:
      "Rafts, qualified guides, personal protective equipment and transport form the operational capacity model. Water, weather and final trip decisions are dynamic professional responsibilities and must never be automated from marketing data.",
    capabilities: [
      "River trip and multi-day package pages",
      "Difficulty, age and preparation content",
      "Raft, guide, equipment and departure foundation",
      "Pickup and transport information",
      "Enquiry, customer and booking context",
      "Adventure SEO and responsive website tools",
    ],
    website:
      "Strong action imagery should be paired with honest difficulty, participant expectations, equipment and logistics. FAQs can address swimming ability, seasons and cancellation without making universal safety promises.",
    measurement:
      "Review qualified bookings by trip, date and source with capacity loss, unsuitable requests, cancellation reasons and response time. These signals guide both marketing and clearer customer education.",
    safeguards: [
      "Keep river grade and seasonal context reviewed",
      "Model rafts, guides, equipment and transport together",
      "Leave final operating decisions with qualified staff",
      "Explain participant requirements before booking",
    ],
    firstMonth:
      "Month one models a core river trip, resources and suitability journey, then tests normal, sold-out and condition-related exceptions.",
    secondMonth:
      "By day 60, organise departures and packages, strengthen preparation content and align acquisition with real capacity.",
    thirdMonth:
      "By day 90, compare trip-level demand and fulfilment evidence, then refine the schedule and catalogue around reliable operations.",
  },
  "/for/atv-buggy-tours": {
    promise:
      "ATV tour booking software should manage guided experiences and vehicle-based rentals through one understandable product and resource model. TripOne+ helps operators publish routes, requirements and time slots while retaining the vehicle and customer context needed to fulfil the booking.",
    operatingReality:
      "ATVs and buggies may be sold per vehicle, driver, passenger, session or guided departure. Licence rules, age, deposits, damage processes, guide ratios and route access vary. A simple guest-capacity field cannot represent every sale accurately.",
    catalogue:
      "Products can distinguish guided tours from rentals and store duration, vehicle type, rider or passenger rules, route, inclusions and booking mode. Vehicles remain resources, while activity and destination taxonomies support browsing without creating a separate backend for each model.",
    salesJourney:
      "The page makes driver, passenger and licence expectations visible before the action. The request retains product, party, timing and source context so staff can allocate the right unit and confirm requirements without an extended message exchange.",
    delivery:
      "Vehicles need availability, maintenance and turnaround blocks. Helmets or other equipment, guide capacity and route conditions may further limit sessions. Deposits, waivers and damage management must follow the operator's lawful controlled process.",
    capabilities: [
      "Guided ATV and buggy tour products",
      "Standalone vehicle rental products",
      "Vehicle, time-slot and maintenance foundation",
      "Driver, passenger and requirement content",
      "Request, customer and booking context",
      "Local website, SEO and campaign journeys",
    ],
    website:
      "Route imagery and vehicle choices can lead the design while driver rules, passenger capacity, clothing, pickup and deposit context remain easy to find. Product comparisons should clarify meaningful differences rather than repeat model names.",
    measurement:
      "Track demand, qualification and bookings by product, vehicle class and slot, with maintenance loss, response time and acquisition source. This shows whether marketing supports profitable utilisation rather than just clicks.",
    safeguards: [
      "Clarify driver, passenger, age and licence rules",
      "Block maintenance and turnaround time",
      "Keep deposits, waivers and damage processes controlled",
      "Model vehicle and guide constraints before confirmation",
    ],
    firstMonth:
      "The first month configures one tour or rental and its vehicle resource, then tests requirements, booking and unavailable-unit paths.",
    secondMonth:
      "By day 60, add fleet and slot structure, improve destination discovery and standardise pre-arrival communication.",
    thirdMonth:
      "By day 90, review utilisation, qualified demand and exceptions, then refine pricing presentation and resource planning from evidence.",
  },
  "/for/motorcycle-tour-rentals": {
    promise:
      "Motorcycle tour software should let one operator sell guided journeys and standalone rentals without duplicating the fleet or customer record. TripOne+ combines product publishing, itineraries and direct-demand context while motorcycles remain shared operational resources.",
    operatingReality:
      "A motorcycle may be assigned to a rental, a guided tour or maintenance. Licence, riding experience, deposit, luggage, gear and route support vary by product and jurisdiction. Multi-day tours also require itinerary, accommodation and support logistics that a rental calendar alone cannot explain.",
    catalogue:
      "Rentals and tours can share motorcycle resources while retaining distinct duration, route, itinerary, inclusions and requirements. Product categories, destinations and travel styles help visitors find the relevant journey without forcing separate admin systems.",
    salesJourney:
      "The website clarifies whether the offer is a rental or guided tour, what experience or licence is required and what happens after a request. Staff receive the selected motorcycle class, dates, party and source context for qualification and allocation.",
    delivery:
      "Fleet availability includes service intervals, turnaround, one-way logistics and tour assignments. Licence verification, deposits, contracts and rider acceptance remain controlled processes appropriate to the operating location.",
    capabilities: [
      "Motorcycle rental and guided-tour catalogue",
      "Multi-day itinerary and package presentation",
      "Shared fleet, availability and maintenance foundation",
      "Rider requirement and equipment content",
      "Lead, customer and booking relationships",
      "Route-led SEO and responsive website builder",
    ],
    website:
      "The public journey can shift from machine and rate comparison for rentals to route, support and itinerary storytelling for tours. Both keep practical requirements and the next action visible without turning every offer into the same card.",
    measurement:
      "Review demand and bookings by rental, tour, route and motorcycle class alongside utilisation, unavailable requests and response time. This exposes where one service line competes with another for the same fleet.",
    safeguards: [
      "Keep licence and rider-experience requirements current",
      "Block maintenance and cross-product fleet assignments",
      "Use controlled contract, deposit and verification workflows",
      "Differentiate rental and guided-tour confirmation steps",
    ],
    firstMonth:
      "Month one configures one rental and one guided tour against representative fleet resources and tests conflicting date requests.",
    secondMonth:
      "By day 60, organise routes, itineraries and fleet availability, then improve qualification and pre-trip information.",
    thirdMonth:
      "By day 90, compare utilisation and pipeline by service line, refine product presentation and prioritise integrations around real operational gaps.",
  },
  "/for/bike-tour-rentals": {
    promise:
      "Bike tour booking software should support guided rides and bicycle rentals in one straightforward workspace. TripOne+ connects route and product pages with bikes, guides, inventory and customer context so operators can grow direct demand without losing sight of fit and availability.",
    operatingReality:
      "Bike businesses allocate frames, sizes, accessories and guides across hourly rentals, multi-day hire and scheduled tours. Capacity depends on the right bike in the right size, not simply the number of guests. Maintenance and turnaround affect what can be promised next.",
    catalogue:
      "Rentals can describe bike class, size process, duration, pickup and included equipment; tours can add route, difficulty, guide, itinerary and meeting point. Both use shared inventory and traveller-friendly activity and destination collections.",
    salesJourney:
      "The visitor understands whether they are booking a bike, guided ride or package and provides the information needed for the next step. The request preserves product, dates, party and source so staff can confirm size and allocation efficiently.",
    delivery:
      "Bikes and accessories require inventory, service and turnaround visibility. Guide schedules and transport can constrain tours separately. Final fit and road or trail suitability remain an operator responsibility supported by clear pre-arrival communication.",
    capabilities: [
      "Bike rental and guided-tour products",
      "Size, class and accessory inventory foundation",
      "Guide, route and departure planning",
      "Rental, tour and package presentation",
      "Customer, request and booking context",
      "Local discovery and mobile website tools",
    ],
    website:
      "Rental pages can prioritise bike choice, duration, sizing and pickup, while tour pages explain route, pace, terrain and guide support. Shared brand and navigation keep the experience cohesive without erasing those different decisions.",
    measurement:
      "Track qualified requests and bookings by service line, bike class, date and source alongside utilisation, sizing issues and unavailable demand. This informs both acquisition and future inventory decisions.",
    safeguards: [
      "Confirm size and bike allocation before fulfilment",
      "Block maintenance and turnaround consistently",
      "Describe route difficulty and rider expectations clearly",
      "Keep rental and guided-tour workflows distinct where needed",
    ],
    firstMonth:
      "The first month models one rental and one tour with shared bike resources, then tests size, maintenance and sold-out exceptions.",
    secondMonth:
      "By day 60, structure the wider inventory and route catalogue, improve local content and standardise customer preparation.",
    thirdMonth:
      "By day 90, review demand, utilisation and qualification by service line, then refine inventory, schedules and content around observed needs.",
  },
};

export function buildIndustrySections(
  page: SeoPageSpec,
): SeoContentSection[] | undefined {
  const profile = profiles[page.path];
  if (!profile) return undefined;

  return [
    {
      heading: `${page.title}, grounded in real operations`,
      paragraphs: [
        profile.promise,
        profile.operatingReality,
        `That is the practical standard for ${page.primaryKeyword}: connect ${naturalList(page.entities)} without making unsupported claims about inventory, integrations or commercial outcomes.`,
      ],
    },
    {
      heading: "From catalogue to customer and delivery",
      paragraphs: [profile.catalogue, profile.salesJourney, profile.delivery],
      bullets: profile.capabilities,
    },
    {
      heading: "An owned website and measurable growth journey",
      paragraphs: [profile.website, profile.measurement],
    },
    {
      heading: "Operational safeguards before scale",
      paragraphs: [
        `A dependable ${page.keywordCluster.toLowerCase()} setup makes constraints visible before the team increases demand. The following controls protect customer trust and operational clarity:`,
      ],
      bullets: profile.safeguards,
    },
    {
      heading: "A practical 30, 60 and 90-day implementation",
      paragraphs: [profile.firstMonth, profile.secondMonth, profile.thirdMonth],
    },
  ];
}

function naturalList(values: readonly string[]) {
  if (values.length === 1) return values[0]!;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}
