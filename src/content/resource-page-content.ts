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
