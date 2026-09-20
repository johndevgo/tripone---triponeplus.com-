import type { SeoPageSpec } from "./seo-catalog";
import type { SeoContentSection } from "./seo-content";

type ResourceProfile = {
  purpose: string;
  startingPoint: string;
  checklist: string[];
  workflow: string;
  evidence: string;
  handoff: string;
  risks: string[];
  review: string;
};

const profiles: Record<string, ResourceProfile> = {
  "/resources/tour-operator-business-plan": {
    purpose:
      "A useful tour operator business plan is an operating decision document, not a long description written only for a lender or investor. It should show who the business serves, which experiences it can deliver safely, how demand becomes a booking, what each departure costs and what evidence will trigger the next investment.",
    startingPoint:
      "Begin with one representative product and one realistic season. Record the traveller, destination, itinerary, capacity, suppliers, guide or equipment needs, sales channel, price, variable cost and cancellation exposure. Label every uncertain figure as an assumption and identify who can validate it.",
    checklist: [
      "Business model, audience and credible market position",
      "Experience portfolio, destinations and delivery constraints",
      "Supplier, guide, equipment and safety responsibilities",
      "Pricing, contribution margin and cash-flow assumptions",
      "Website, distribution, sales and customer follow-up journey",
      "Twelve-month milestones, owners, evidence and decision dates",
    ],
    workflow:
      "Work from offer to operations, then finance and growth. Product facts determine capacity and cost; capacity constrains the sales promise; the sales promise shapes the website and channels; and confirmed demand determines when more people, inventory or marketing spend are justified. Keep these links visible instead of maintaining separate optimistic plans.",
    evidence:
      "Support the plan with supplier quotes, real competitor observations, customer interviews, search and channel evidence, pilot enquiries and a documented cost model. A market-size statistic may provide context, but it does not prove that this operator can acquire a specific traveller profitably.",
    handoff:
      "Convert approved decisions into owned records: a product catalogue, supplier register, risk controls, pricing sheet, content plan, pipeline stages and monthly management view. TripOne+ can hold the website, package and customer-facing structure while finance and specialist reservations remain in their appropriate systems.",
    risks: [
      "Treating gross booking value as profit",
      "Ignoring deposits, refunds and supplier payment timing",
      "Planning demand beyond safe delivery capacity",
      "Using invented proof, market share or conversion assumptions",
    ],
    review:
      "Review the plan monthly during launch and before each major season. Replace assumptions with observed lead, booking, margin, cancellation and delivery evidence, and record why the plan changed so later decisions are not based on forgotten forecasts.",
  },
  "/resources/travel-agency-business-plan": {
    purpose:
      "A travel agency business plan should explain the customers and trips the agency is equipped to serve, the commercial relationship with suppliers and hosts, the service and fee model, and the process that takes a traveller from inquiry to post-trip care. It should be specific enough to expose workload and cash-flow risk.",
    startingPoint:
      "Map a representative inquiry from source through discovery, research, proposal, approval, supplier booking, payment, documentation, travel and follow-up. Record the time, systems, commissions, fees, liabilities and handoffs at every stage before forecasting volume.",
    checklist: [
      "Target traveller, trip types and geographic scope",
      "Host, supplier, accreditation and insurance relationships",
      "Planning fees, commissions, markups and payment responsibilities",
      "Inquiry qualification, proposal and service standards",
      "CRM, documentation, consent and data-protection workflow",
      "Pipeline, cash-flow and repeat-customer management cadence",
    ],
    workflow:
      "Design the service model around the work customers will pay for and the expertise the team can consistently deliver. Separate agency revenue from money collected for suppliers, define when fees are earned or refundable and make ownership of every customer promise explicit.",
    evidence:
      "Use signed commercial agreements, current commission schedules, processing terms, professional advice, time tracking and real inquiry samples. Published supplier or host material should be verified against the contract that actually applies to the agency.",
    handoff:
      "Translate the plan into package and destination content, qualification forms, pipeline stages, proposal rules, task templates and customer communications. The public website should set accurate expectations before a private adviser collects sensitive traveller information.",
    risks: [
      "Forecasting commission before travel or supplier payment rules allow recognition",
      "Underpricing complex research and amendment work",
      "Collecting passport or health data in unsuitable forms",
      "Promising supplier availability before confirmation",
    ],
    review:
      "Review inquiry quality, proposal effort, conversion, fees, commission timing, cancellations and repeat business every month. Revisit the positioning when the mix of profitable, deliverable trips differs from the original target.",
  },
  "/resources/tour-operator-marketing-plan": {
    purpose:
      "A tour operator marketing plan should connect a defined traveller and product to a small number of discoverable messages, landing journeys and measurable commercial actions. It is not a calendar of disconnected posts, ads and search tasks.",
    startingPoint:
      "Choose one priority experience, season and traveller problem. Confirm the product facts, capacity, margin, booking path, customer questions and existing demand signals before allocating channel budget. Baseline qualified inquiries and confirmed outcomes wherever the records exist.",
    checklist: [
      "Priority audience, product, season and geographic market",
      "Positioning, proof, objections and approved claims",
      "Search, paid, partner, email and social channel roles",
      "Landing pages, booking handoffs and response ownership",
      "Campaign taxonomy, consent and conversion measurement",
      "Weekly actions, monthly review and stop-or-scale rules",
    ],
    workflow:
      "Assign one job to each channel. Search may capture existing intent, social may create familiarity, email may continue an owned relationship and partners may supply qualified reach. Every campaign should arrive at accurate product information and a response process the team can operate during peak demand.",
    evidence:
      "Use search queries, campaign records, page behaviour, sales conversations, lead qualification and bookings. Separate platform-attributed actions from reconciled commercial outcomes, and document when privacy or external booking systems limit attribution.",
    handoff:
      "Turn the plan into named campaigns, briefs, landing pages, UTMs, response playbooks and a reporting dictionary. Keep the core product and destination facts in one maintained source so channel teams do not publish conflicting promises.",
    risks: [
      "Scaling traffic before the product and response path are ready",
      "Using the same message for every traveller and channel",
      "Counting clicks or messages as confirmed revenue",
      "Publishing urgency, reviews or performance claims without evidence",
    ],
    review:
      "Review delivery weekly and commercial evidence monthly. Increase, change or stop activity according to qualified outcomes, capacity and contribution—not because a platform reports a large reach number.",
  },
  "/resources/tour-operator-website-checklist": {
    purpose:
      "A tour operator website checklist should test whether a traveller can discover, understand, trust and act on a real experience from a mobile device. Passing means the complete journey works, not that a homepage looks attractive in isolation.",
    startingPoint:
      "Select the homepage, one destination, one representative experience and the primary enquiry or booking path. Test them with production-like content, a slow mobile connection, keyboard navigation and the actual external systems used after the click.",
    checklist: [
      "Clear audience, offer, location and primary action above the fold",
      "Accurate itinerary, duration, price context, inclusions and suitability",
      "Responsive images, readable typography and stable page layout",
      "Keyboard, focus, labels, contrast and meaningful alternative text",
      "Indexable URLs, metadata, canonicals, schema and internal links",
      "Working forms, phone, WhatsApp, booking, analytics and consent paths",
    ],
    workflow:
      "Audit in journey order. Start with search or referral entry, continue through navigation and product evaluation, complete the action, inspect the confirmation and verify that the team receives enough context to respond. Record device, URL, result, severity, owner and retest date.",
    evidence:
      "Use browser and assistive-technology tests, field validation, analytics debug views, search inspection tools, performance measurements and a real submission to a controlled account. Source inspection alone cannot prove that a rendered action works.",
    handoff:
      "Move failures into a prioritised backlog. Block publishing for broken security, privacy, booking, form or accessibility paths; schedule usability and content improvements by customer impact; and preserve screenshots or recordings for the retest.",
    risks: [
      "Testing only a large desktop viewport",
      "Checking buttons visually without completing their action",
      "Publishing placeholder claims, testimonials or prices",
      "Adding scripts without consent, ownership or performance review",
    ],
    review:
      "Run a focused pre-publish test on every material release and a complete quarterly audit. Retest after changes to themes, forms, booking providers, analytics, navigation or structured data.",
  },
  "/resources/travel-seo-checklist": {
    purpose:
      "A travel SEO checklist should connect crawlable technical foundations with distinctive product, destination and planning information that genuinely helps a traveller. It should prevent indexation errors and thin duplication before chasing more pages.",
    startingPoint:
      "Crawl the current site, inspect representative templates and compare indexed URLs with the intended information architecture. Confirm the business name, locations, products, destinations, booking action and source of every changing fact.",
    checklist: [
      "Indexation, robots, sitemap, canonical and redirect integrity",
      "Fast responsive templates with accessible headings and media",
      "Distinct product, package, destination and policy information",
      "Search-aligned titles, descriptions and descriptive internal links",
      "Valid organisation, breadcrumb, product or relevant structured data",
      "Search Console, analytics and qualified-conversion measurement",
    ],
    workflow:
      "Fix discovery and duplication first, then template quality, page usefulness and authority. Map one primary purpose to each indexable URL. Consolidate overlapping pages and use taxonomy links to explain real relationships rather than producing every possible keyword combination.",
    evidence:
      "Use server responses, rendered HTML, crawler results, search-engine inspection, query and landing-page data, page experience tests and qualified conversion records. Rankings from a personalised or single-location check are not a dependable report.",
    handoff:
      "Create a page inventory with intent, owner, canonical URL, content gap, internal-link role and next review. Track technical issues separately from editorial opportunities so the team can verify what changed and why.",
    risks: [
      "Publishing interchangeable destination or location pages",
      "Stuffing keywords or entity lists into reader-facing copy",
      "Using unsupported review, price or availability markup",
      "Reporting impressions as bookings without commercial evidence",
    ],
    review:
      "Monitor crawl and indexing health after every release, review search and conversion evidence monthly and reassess the architecture when the catalogue or destinations materially change.",
  },
  "/resources/google-ads-checklist-tour-operators": {
    purpose:
      "A Google Ads checklist for tour operators should protect commercial intent from irrelevant spend and connect every click to an accurate mobile offer, measurable action and sales-quality review. Account activity alone is not performance.",
    startingPoint:
      "Confirm the product, market, season, capacity, margin and booking mode. Audit conversion actions, consent, landing pages and search terms before expanding keywords or automation. Separate booking, qualified enquiry and micro-actions in reporting.",
    checklist: [
      "Campaign objective, geography, language, schedule and budget guardrails",
      "Intent-led keywords, negatives and search-term review",
      "Accurate ads, assets, prices and policy-compliant claims",
      "Fast relevant landing page and tested booking handoff",
      "Primary conversions, value rules, UTMs and consent controls",
      "Lead-quality, booking and contribution review by campaign",
    ],
    workflow:
      "Group demand according to the decision and landing experience, not every minor wording variation. Search terms inform negatives and product content. Budget moves only when the business can serve the demand and downstream records support the platform signal.",
    evidence:
      "Inspect account change history, search terms, auction and device context, landing behaviour, submitted leads, booking records and cancellations. Attribution windows and imported outcomes must be documented before claiming return on ad spend.",
    handoff:
      "Maintain a campaign register with purpose, owner, landing page, conversion, exclusions, budget, experiment and next review. Give sales or reservations a simple way to return lead-quality evidence to the advertising team.",
    risks: [
      "Optimising toward page views or weak button clicks",
      "Sending every query to a generic homepage",
      "Allowing broad matching without search-term governance",
      "Scaling beyond inventory, guide or response capacity",
    ],
    review:
      "Review spend, search terms and broken paths frequently during launch, then use a documented weekly operating review and monthly commercial reconciliation. Seasonal changes require new assumptions, not copied budgets.",
  },
  "/resources/meta-ads-checklist-travel": {
    purpose:
      "A Meta Ads checklist for travel businesses should align creative discovery with a specific offer, credible proof, a useful landing or messaging journey and privacy-aware measurement. Strong imagery cannot compensate for an unclear product or weak follow-up.",
    startingPoint:
      "Define the traveller, product, destination, season and action. Gather approved visual assets and claims, confirm rights, test mobile pages and forms, and document how the team will qualify messages or leads before launching broad audiences.",
    checklist: [
      "Campaign objective and primary qualified outcome",
      "Audience hypothesis, exclusions and geographic serviceability",
      "Creative angles, formats, usage rights and honest claims",
      "Landing, instant-form or messaging experience with context",
      "Pixel, events, UTMs, consent and server-side boundaries",
      "Lead-quality, booking and creative-learning review",
    ],
    workflow:
      "Test a small number of genuinely different creative and offer hypotheses. Preserve message continuity after the click, pass the advert and product context into the lead, and stop formats that generate cheap but unsuitable conversations.",
    evidence:
      "Use delivery and creative metrics to diagnose the advertisement, then use form completion, response, qualification and booking records to judge commercial usefulness. Platform-reported attribution remains an estimate and should be reconciled where possible.",
    handoff:
      "Keep a creative register with source, rights, audience, promise, landing destination and result. Document response scripts and ownership so a campaign does not create enquiries the operations team cannot identify or answer.",
    risks: [
      "Reusing destination imagery without a clear offer",
      "Treating message starts as qualified leads",
      "Using fabricated urgency, reviews or transformation claims",
      "Collecting or activating data without an appropriate consent basis",
    ],
    review:
      "Check delivery and lead flow during launch, review creative and sales evidence weekly, and refresh the plan when fatigue, season, inventory or offer facts change.",
  },
  "/resources/travel-social-media-calendar": {
    purpose:
      "A travel social media calendar should help a team publish useful, recognisable stories from real products, places, people and customer questions. It is a production and accountability tool, not a requirement to fill every day with generic inspiration.",
    startingPoint:
      "Start with the month's commercial priorities, live availability, destination season, customer questions and reusable media. Confirm who owns facts, permissions, production, publishing, replies and escalation before assigning dates.",
    checklist: [
      "Monthly audience, offer and customer decision theme",
      "Balanced product, destination, people, proof and planning content",
      "Format, channel, asset source, rights and accessibility fields",
      "Caption, action, destination URL and campaign parameters",
      "Production owner, approver, publish date and response owner",
      "Learning note tied to useful engagement and qualified actions",
    ],
    workflow:
      "Build recurring content pillars from the business rather than trends alone: show what happens, who it suits, how to prepare, where it takes place and how the team works. Adapt the same verified source material to each channel instead of cross-posting an identical crop and caption.",
    evidence:
      "Use saves, useful replies, profile and site actions, qualified conversations and attributable bookings where available. Reach and follower growth describe distribution; they do not prove purchase intent or revenue.",
    handoff:
      "Maintain an asset library with consent and expiry, a production board, approved response guidance and an archive of final posts and links. Feed recurring questions back into website and product content so social activity improves the owned journey.",
    risks: [
      "Publishing customer or staff media without clear permission",
      "Posting outdated prices, schedules or availability",
      "Forcing every channel into the same format",
      "Optimising vanity engagement while inquiries remain unsuitable",
    ],
    review:
      "Review production weekly and performance monthly. Keep, change or retire a content series according to audience usefulness, qualified action and the team's ability to produce it accurately.",
  },
  "/resources/travel-content-calendar": {
    purpose:
      "A travel content calendar should coordinate useful owned content around real products, destinations, seasons and customer decisions. It should help subject experts, writers, designers and channel owners publish accurate material without turning every search phrase into a thin page.",
    startingPoint:
      "Inventory existing product, destination and help content, then map known customer questions and seasonal priorities. Choose the pages that need repair before adding new topics, and identify the operational source for prices, schedules, policies and local advice.",
    checklist: [
      "Audience, journey stage and question the content resolves",
      "Primary page, supporting topic and intended internal links",
      "Product, destination, expert and evidence sources",
      "Format, channel, owner, reviewer and publication date",
      "Image rights, accessibility, metadata and conversion action",
      "Refresh trigger, performance evidence and consolidation decision",
    ],
    workflow:
      "Organise the calendar in topic clusters that mirror the business: authoritative product and destination hubs supported by planning, comparison and proof content. Brief each item with the decision it helps, facts it needs and pages it should strengthen rather than prescribing a keyword count.",
    evidence:
      "Use search demand, site queries, sales questions, support conversations, seasonal changes and content performance to prioritise work. A high-volume phrase is not automatically useful when the business lacks a relevant offer or credible expertise.",
    handoff:
      "Move approved briefs through research, drafting, fact review, design, accessibility, SEO and publishing with named owners. Store the final URL, linked assets, measurement plan and next review beside the original brief.",
    risks: [
      "Publishing more pages while important facts remain inconsistent",
      "Writing for phrases the business cannot satisfy",
      "Using imagery without rights, context or alternative text",
      "Leaving seasonal advice live after conditions change",
    ],
    review:
      "Review production weekly, results monthly and the complete inventory quarterly. Update, merge or retire content according to usefulness and business fit rather than preserving every historic URL unchanged.",
  },
  "/resources/tour-product-page-template": {
    purpose:
      "A tour product page template should let a traveller decide whether one specific experience fits their interests, time, ability, group and budget. The template must surface operational truth and a complete action path while leaving room for the character of each product.",
    startingPoint:
      "Complete the template using one real tour and verify every field with the person who operates it. Separate fixed facts from seasonal notes and live availability, and make the booking system's responsibility visible wherever data is not stored on the page.",
    checklist: [
      "Distinct name, location, promise and representative media",
      "Duration, meeting point, group, age and suitability details",
      "Itinerary or experience flow with highlights and limitations",
      "Price context, inclusions, exclusions and optional costs",
      "Safety, accessibility, cancellation and preparation information",
      "Booking action, contact alternative, FAQ and related experiences",
    ],
    workflow:
      "Write in traveller decision order: recognition, fit, experience, logistics, trust and action. Use headings that answer real questions and place the primary action after enough information to understand it, with a mobile sticky action only when it does not obscure content.",
    evidence:
      "Use operating notes, route and timing checks, supplier terms, guide knowledge, customer questions and representative original media. Do not invent scarcity, ratings, awards or superlatives to fill template fields.",
    handoff:
      "Assign ownership for price, schedule, policy, media and booking-link changes. Connect the product to real destinations and taxonomies, then test metadata, schema, form or booking handoff and confirmation on production-like mobile and desktop views.",
    risks: [
      "Using the same generic description across many products",
      "Hiding exclusions, conditions or uncertain price context",
      "Showing unavailable dates or an untested external booking link",
      "Publishing decorative images that misrepresent the experience",
    ],
    review:
      "Review before every major season and whenever the route, operator, supplier, price, policy or booking system changes. Sample customer questions monthly to find information the template still fails to answer.",
  },
  "/resources/tour-package-page-template": {
    purpose:
      "A tour package page template should explain how multiple services, days and suppliers form one coherent trip. It must make the package's audience, sequence, inclusions, pricing basis and booking mode easier to compare without presenting draft components as confirmed inventory.",
    startingPoint:
      "Model one representative package with its duration, destinations, daily plan, linked services, accommodation, transport, meals, optional items, supplier dependencies and pricing assumptions. Mark sample itineraries and on-request elements clearly.",
    checklist: [
      "Package promise, traveller fit, duration and destination route",
      "Day-by-day itinerary with pace and overnight context",
      "Included services, excluded costs and optional upgrades",
      "Accommodation, transport, guide and supplier status",
      "Price basis, dates, minimums, deposits and cancellation terms",
      "Inquiry or booking action, response expectations and FAQs",
    ],
    workflow:
      "Present the trip from overview to daily detail, then commercial and practical conditions. Link reusable service and destination records where they add depth, but keep the package page complete enough that a traveller can understand the combined offer without opening every component.",
    evidence:
      "Verify the itinerary against supplier confirmations, travel times, seasonal access, capacity and current cost assumptions. Use real or accurately labelled representative imagery and avoid claiming guaranteed sightings, upgrades or access.",
    handoff:
      "Keep supplier operations private while publishing the customer-safe version. Preserve package, date and source context in every inquiry, and define who confirms availability and final price before acceptance.",
    risks: [
      "Presenting an illustrative itinerary as a guaranteed sequence",
      "Combining supplier prices without currency and timing controls",
      "Duplicating package facts in pages that drift apart",
      "Collecting payment before availability and terms are confirmed",
    ],
    review:
      "Review packages before each selling season and after any supplier, route, exchange-rate or policy change. Retire unavailable variants and redirect their demand to a genuine alternative.",
  },
  "/resources/tour-itinerary-template": {
    purpose:
      "A tour itinerary template should turn a sequence of travel services into a readable plan for the traveller and an accountable coordination reference for the team. The customer version explains what to expect; internal operations may require more sensitive detail and controls.",
    startingPoint:
      "Define the trip timezone, day boundaries, overnight locations and confirmed versus proposed status. For each day, record movement, activity, meals, accommodation, timing context, responsible supplier and the information the traveller actually needs.",
    checklist: [
      "Trip summary, dates, route, timezones and emergency contact",
      "Daily title, narrative, travel time and overnight location",
      "Confirmed services, meeting details and responsible operator",
      "Meals, accommodation, equipment and preparation notes",
      "Optional activities, dependencies and change conditions",
      "Version, approval, distribution and offline-access controls",
    ],
    workflow:
      "Build from confirmed components, then add traveller-friendly context without copying private supplier notes. Use consistent time and location formats, show meaningful gaps or free time, and identify the source and owner of late changes.",
    evidence:
      "Validate route duration, opening or access constraints, booking references, supplier contacts and accommodation details. A map estimate or old itinerary should not override a current operational confirmation.",
    handoff:
      "Publish or send a versioned traveller itinerary only after operational review. Keep an accessible offline copy where appropriate, log material changes and make sure the traveller knows which channel carries urgent updates.",
    risks: [
      "Mixing proposed and confirmed services without labels",
      "Exposing supplier rates or sensitive traveller information",
      "Using inconsistent local times and meeting locations",
      "Changing the live plan without a version and notification path",
    ],
    review:
      "Review at proposal approval, supplier confirmation, final-document issue and every material change. The operating team should complete a final departure check rather than relying on the itinerary's appearance.",
  },
  "/resources/tour-booking-workflow": {
    purpose:
      "A tour booking workflow should define how an inquiry or checkout becomes an accepted booking, who owns each decision and how inventory, payment, communication and exceptions remain aligned. It should cover failure paths as carefully as the happy path.",
    startingPoint:
      "Choose one bookable product and trace direct online, assisted, reseller and manual booking sources where relevant. Record the system of truth for availability, customer, payment and fulfilment before designing notifications or automation.",
    checklist: [
      "Booking source, product, option, date, party and customer identity",
      "Availability hold, confirmation authority and expiry rules",
      "Price, currency, tax, discount, deposit and balance status",
      "Consent, terms acceptance and required traveller information",
      "Confirmation, supplier, resource and staff handoffs",
      "Amendment, cancellation, refund, no-show and failure handling",
    ],
    workflow:
      "Use explicit states such as requested, held, pending payment, confirmed, changed, cancelled and completed. Define which event moves a booking, which system is authoritative and which actions must be idempotent so retries do not create duplicate reservations or messages.",
    evidence:
      "Test with real product rules in a safe environment, including insufficient capacity, declined payment, duplicate submission, timezone edge, amendment and cancellation. Reconcile the customer-facing result with inventory and finance records.",
    handoff:
      "Document roles, response targets, notification templates and escalation. Give the team one operational view of the booking context while restricting payment and sensitive traveller data to systems designed to protect it.",
    risks: [
      "Confirming a request before inventory or supplier acceptance",
      "Duplicating reservations during retries or channel imports",
      "Losing product and source context between systems",
      "Treating payment success as complete operational readiness",
    ],
    review:
      "Review exceptions weekly and the complete workflow after provider, policy or product changes. Monitor unresolved requests, duplicate events, notification failures and mismatches between bookings, capacity and payments.",
  },
  "/resources/travel-crm-pipeline": {
    purpose:
      "A travel CRM pipeline should show the commercial state of an inquiry without pretending every contact is a deal. Stages need entry and exit rules, named ownership and enough trip context for a helpful next action.",
    startingPoint:
      "Sample recent inquiries and map what genuinely happened from new request to qualified opportunity, proposal, booking and loss. Separate customer lifecycle from one trip opportunity so repeat travellers and multiple inquiries remain understandable.",
    checklist: [
      "Contact identity, consent, preferences and relationship links",
      "Inquiry source, product, destination, dates, party and budget context",
      "Stage definition, owner, next action and due date",
      "Qualification, proposal, booking and loss reason rules",
      "Activity history, documents and external booking reference",
      "Pipeline quality, response and outcome reporting definitions",
    ],
    workflow:
      "Create the fewest stages that describe a real change in commitment or responsibility. Automation can assign, remind and update from dependable events, while staff retain control of nuanced qualification and customer conversations.",
    evidence:
      "Measure response time, stage age, qualified rate, proposal outcome and confirmed booking where linked evidence exists. Audit missing owners, stale next actions, duplicates and records advanced only to improve a dashboard.",
    handoff:
      "Publish a field dictionary, stage policy and ownership matrix. Connect website forms with source and offer context, and define how external booking outcomes return without replacing verified records with platform assumptions.",
    risks: [
      "Using one contact row for several unrelated opportunities",
      "Automating follow-up from incomplete or stale fields",
      "Collecting sensitive traveller data before it is necessary",
      "Reporting pipeline value as revenue without booking evidence",
    ],
    review:
      "Review pipeline hygiene weekly and definitions quarterly. Sample records with sales and operations so the system continues to describe reality rather than becoming an administrative reporting exercise.",
  },
  "/resources/tour-operator-sop-template": {
    purpose:
      "A tour operator SOP template should make a repeatable operating task safe, teachable and auditable without replacing professional judgement. It needs a clear trigger, owner, inputs, sequence, exception path and evidence of completion.",
    startingPoint:
      "Select one frequent or high-risk process, observe the people who perform it and collect the current forms, systems and policies. Record variations before writing a single idealised sequence that nobody actually follows.",
    checklist: [
      "Purpose, scope, trigger, owner and required competence",
      "Inputs, systems, equipment and current source documents",
      "Numbered steps with decisions and completion evidence",
      "Safety, privacy, financial and customer communication controls",
      "Exceptions, escalation, stop conditions and emergency contacts",
      "Version, approver, training record and review trigger",
    ],
    workflow:
      "Write observable actions in the order they occur, with decision points and links to controlled forms. Keep safety-critical instructions unambiguous and separate customer-facing messages from internal notes. Test the draft with someone other than the author.",
    evidence:
      "Use direct observation, incident and error history, regulatory or insurer guidance, equipment manuals and staff feedback. Approval should come from the person accountable for the process and any qualified specialist the risk requires.",
    handoff:
      "Train affected staff, record acknowledgement where appropriate and place the current version at the point of work. Archive superseded versions and connect recurring checklist completion to the relevant departure, booking or resource record.",
    risks: [
      "Copying a generic SOP that ignores local operations",
      "Hiding critical decisions inside long prose",
      "Publishing sensitive contacts or security procedures publicly",
      "Leaving obsolete versions available to staff",
    ],
    review:
      "Review on the defined cadence and immediately after an incident, near miss, supplier change, equipment change or regulatory update. Record what changed, who approved it and who needs retraining.",
  },
  "/resources/tour-departure-checklist": {
    purpose:
      "A tour departure checklist should confirm that the people, services, resources, information and contingency arrangements required for a specific departure are ready. It is a final verification layer, not a replacement for booking and safety systems.",
    startingPoint:
      "Generate the checklist from the confirmed departure, product requirements and current guest list. Assign each check to a person and deadline, distinguishing booking-level checks from equipment, supplier, guide and customer communication tasks.",
    checklist: [
      "Confirmed date, capacity, meeting point, route and operating status",
      "Guest count, required details, payments, waivers and special needs",
      "Guide, driver, supplier and emergency contact confirmations",
      "Vehicle, vessel, equipment, permits and safety checks",
      "Weather, access, contingency and cancellation decision points",
      "Final guest message, manifest, handoff and completion record",
    ],
    workflow:
      "Work backward from departure using booking and product rules. Resolve blocked items rather than checking them optimistically, escalate safety or legal gaps immediately and document who authorises a change or cancellation.",
    evidence:
      "Use confirmed reservations, inspection records, permit status, current forecasts and access notices, signed requirements and direct supplier or guide acknowledgement. A previous successful departure is not evidence that today's resources are ready.",
    handoff:
      "Issue the approved operational pack to authorised staff, protect personal guest data and record last-minute changes in the source system. Give customers one clear update channel and staff one escalation route.",
    risks: [
      "Using an outdated manifest or departure version",
      "Checking equipment without recording defects and resolution",
      "Sharing sensitive guest information too broadly",
      "Proceeding when a safety-critical item remains unresolved",
    ],
    review:
      "Complete checks at the intervals appropriate to the product and repeat critical checks immediately before departure. Debrief exceptions and update the base product or SOP when the same issue recurs.",
  },
  "/resources/guest-manifest-template": {
    purpose:
      "A guest manifest should give authorised operations staff the minimum accurate information needed to deliver a departure and respond to an emergency. It is not a general CRM export and should not expose unnecessary personal data.",
    startingPoint:
      "Define the operational and legal purpose before choosing fields. Link each traveller to a booking and departure, identify the authoritative source and decide who can view, edit, export and retain the manifest.",
    checklist: [
      "Departure, booking, lead guest and party relationship",
      "Guest name and only necessary contact or identity details",
      "Pickup, room, seat, equipment or service assignment",
      "Necessary dietary, accessibility or emergency information",
      "Payment or document readiness as status, not exposed detail",
      "Version, generated time, authorised recipients and retention date",
    ],
    workflow:
      "Generate the manifest from current records and freeze or version it at the operational cutoff. Route corrections through the source record, distinguish unverified notes from confirmed requirements and produce role-specific views where drivers, guides and accommodation teams need different data.",
    evidence:
      "Validate names and requirements against customer submissions and confirmed bookings. Reconcile party totals with capacity and service assignments, and record the time and person completing final review.",
    handoff:
      "Distribute through an approved secure channel, make offline access deliberate and revoke or delete copies according to retention rules. Staff should know how to report corrections and incidents without creating uncontrolled copies.",
    risks: [
      "Exporting passport, payment or health details without necessity",
      "Allowing several conflicting manifest copies",
      "Failing to represent children, companions or booking relationships",
      "Keeping downloaded files after the operational purpose ends",
    ],
    review:
      "Review field necessity and access quarterly, and validate every manifest at the departure cutoff. Audit how copies were shared and disposed of after sensitive or high-risk trips.",
  },
  "/resources/travel-supplier-management-template": {
    purpose:
      "A travel supplier management template should connect contracted products, commercial terms, operational contacts, service performance and risk controls. It should help teams select and manage suppliers without turning informal inbox history into the only source of truth.",
    startingPoint:
      "Create one record per legal supplier and related service records for accommodations, transport, activities, guides or other components. Verify company identity, contract status, operational coverage, currencies, contacts and emergency arrangements.",
    checklist: [
      "Legal entity, service type, destinations and responsible owner",
      "Contract, rate period, currency, tax, commission and payment terms",
      "Product, capacity, cutoff, blackout and cancellation rules",
      "Booking, operations, finance and emergency contacts",
      "Insurance, licence, safety and data-processing evidence where required",
      "Issue history, performance review, renewal and offboarding status",
    ],
    workflow:
      "Separate supplier identity from individual products and rate periods. Control approvals and versioned terms, link every booking to the applicable service and define how changes reach pricing, operations and customer content.",
    evidence:
      "Use executed agreements, verified bank procedures, current certificates, test bookings, service records, incident history and customer feedback. Avoid relying on copied details from an old itinerary or unverified email thread.",
    handoff:
      "Assign commercial and operational owners, protect bank and contract information and publish only customer-safe facts. Set renewal reminders and a controlled process for replacing or suspending a supplier across future departures.",
    risks: [
      "Paying against changed bank details without independent verification",
      "Using expired rates, licences or insurance",
      "Updating a supplier term without affected booking review",
      "Publishing private contract or contact information",
    ],
    review:
      "Review critical suppliers before contracting and each season, with formal renewal according to risk and contract dates. Investigate incidents and recurring service failures promptly rather than waiting for annual review.",
  },
  "/resources/tour-pricing-worksheet": {
    purpose:
      "A tour pricing worksheet should expose every cost, capacity and commercial assumption behind a selling price. It helps an operator compare departures and channels without confusing markup, margin, cash collected or gross booking value with profit.",
    startingPoint:
      "Choose one product and date period. Record costs in their original currencies, the exchange-rate source and date, fixed versus per-guest behaviour, tax treatment, payment fees, commission, complimentary places and minimum viable departure size.",
    checklist: [
      "Fixed departure costs and per-guest variable costs",
      "Supplier currency, exchange rate, tax and rate validity",
      "Capacity, expected occupancy and complimentary places",
      "Direct and distribution commission or payment costs",
      "Contingency, target contribution, markup and margin",
      "Published price, rounding, approval and next review date",
    ],
    workflow:
      "Calculate the cost base first, then contribution and channel impact. Model several occupancy cases rather than dividing by maximum capacity, and compare the proposed price with what the offer includes and the market position without allowing competitor prices to replace the cost model.",
    evidence:
      "Use current supplier contracts, payroll or guide rates, transport and equipment costs, historical occupancy, refund and cancellation records and real distribution terms. Date every input that can expire or move with currency.",
    handoff:
      "Approve a controlled price version and connect it to the relevant product, date or package. Publish only customer-safe price context while finance and operations retain the cost detail and change history.",
    risks: [
      "Dividing costs by full capacity regardless of expected occupancy",
      "Adding margin and commission percentages incorrectly",
      "Ignoring tax, payment, refund and exchange-rate exposure",
      "Leaving an expired supplier rate inside a live selling price",
    ],
    review:
      "Review before every rate period and whenever costs, currency, tax, capacity or channel terms change. Compare forecast with actual departure contribution and explain material variance before copying the model forward.",
  },
  "/resources/tour-operator-kpi-dashboard": {
    purpose:
      "A tour operator KPI dashboard should connect demand, sales, capacity, delivery and customer outcomes without turning every available metric into a target. Each measure needs a definition, source, owner and decision it informs.",
    startingPoint:
      "Begin with the decisions leaders make weekly and monthly. Identify the few measures required for demand quality, pipeline, bookings, occupancy, contribution, cancellations, response, delivery and retention, then reconcile definitions across source systems.",
    checklist: [
      "Qualified demand and source with an agreed qualification rule",
      "Response time, stage progression and confirmed booking outcome",
      "Departure capacity, occupancy and serviceability",
      "Revenue, direct cost, contribution and cash timing",
      "Cancellation, refund, incident and customer feedback context",
      "Definition, system, refresh time, owner and decision threshold",
    ],
    workflow:
      "Structure the dashboard from leading operational signals to lagging commercial outcomes. Allow filters for product, departure, destination, source and period, but keep totals reconcilable. Pair rates with volumes so a small sample does not appear decisive.",
    evidence:
      "Use source records from bookings, CRM, finance, advertising and operations, with documented attribution and currency rules. Sample underlying records during every review rather than trusting a visually complete chart.",
    handoff:
      "Maintain a metric dictionary and exception log beside the dashboard. Assign owners to investigate thresholds and record actions so the dashboard supports decisions instead of becoming a presentation refreshed without follow-through.",
    risks: [
      "Treating inquiries or clicks as bookings or revenue",
      "Combining currencies, products or periods without normalisation",
      "Optimising one KPI while margin, capacity or service quality declines",
      "Publishing personal or commercially sensitive detail too broadly",
    ],
    review:
      "Review operating signals weekly, commercial performance monthly and definitions quarterly. Retire measures that do not influence a decision and add new ones only with an owner, source and action.",
  },
};

export function buildResourceSections(
  page: SeoPageSpec,
): SeoContentSection[] | undefined {
  const profile = profiles[page.path];
  if (!profile) return undefined;

  return [
    {
      heading: `How to use this ${page.primaryKeyword}`,
      paragraphs: [profile.purpose, profile.startingPoint],
      bullets: profile.checklist,
    },
    {
      heading: "Complete the work in decision order",
      paragraphs: [profile.workflow, profile.evidence],
    },
    {
      heading: "Turn the completed resource into an operating system",
      paragraphs: [profile.handoff],
    },
    {
      heading: "Quality and trust checks before approval",
      paragraphs: [
        `Use the following controls before treating the ${page.keywordCluster.toLowerCase()} work as complete:`,
      ],
      bullets: profile.risks,
    },
    {
      heading: "Review cadence and next action",
      paragraphs: [profile.review],
    },
  ];
}
