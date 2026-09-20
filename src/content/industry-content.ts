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
