import type { SeoPageSpec } from "./seo-catalog";
import type { SeoContentSection } from "./seo-content";

type ComparisonProfile = {
  alternative: string;
  category: string;
  verifiedPosition: string;
  tripOnePosition: string;
  chooseAlternative: string;
  chooseTripOne: string;
  testScenario: string;
  migration: string;
  questions: string[];
  sources: { label: string; href: string }[];
};

const reviewedOn = "20 September 2026";

function reservationProfile(input: {
  alternative: string;
  category: string;
  verifiedPosition: string;
  alternativeFit: string;
  tripOneFit: string;
  testScenario: string;
  migration: string;
  questions: string[];
  sources: { label: string; href: string }[];
}): ComparisonProfile {
  return {
    alternative: input.alternative,
    category: input.category,
    verifiedPosition: input.verifiedPosition,
    tripOnePosition:
      "TripOne+ currently emphasises an owned tourism website, structured products and packages, destination content, request-led CRM records and an integrated growth workspace. It should not be described as matching a specialist platform's documented checkout, payment, ticketing, distribution or operational depth unless the live product and a representative test prove it.",
    chooseAlternative: input.alternativeFit,
    chooseTripOne: input.tripOneFit,
    testScenario: input.testScenario,
    migration: input.migration,
    questions: input.questions,
    sources: input.sources,
  };
}

const profiles: Record<string, ComparisonProfile> = {
  "/compare/tripone-vs-tripcart": {
    alternative: "TripCart",
    category: "hosted tour website and booking platform",
    verifiedPosition:
      "TripCart's official site presents a hosted, no-commission platform with a website builder, tour schedules, real-time availability, capacity, online payments through connected gateways, add-ons, customer management, enquiries, automated email and SEO tools. Its terms also describe a day-to-day booking management system, booking engine and customised travel website.",
    tripOnePosition:
      "TripOne+ is a hosted tourism website, content and operations workspace. Its current strength is deterministic website generation, editable shared rendering, structured services and packages, taxonomies, leads, customers, booking records, resources, analytics and optional agency growth workflows. Payment and specialist real-time reservation capabilities should be evaluated against the current live release rather than assumed.",
    chooseAlternative:
      "Shortlist TripCart when a verified instant-booking and payment journey, scheduled tour inventory, checkout upsells or one of its documented booking features is central to launch. Confirm gateway availability, package limits, data export, domain behaviour and the exact plan in a trial and contract.",
    chooseTripOne:
      "Shortlist TripOne+ when the priority is a structured tourism website plus a broader request-led CRM, package, resource and marketing workspace, or when the team wants growth services and an editable content system around its sales process. Confirm any required live availability or payment integration before deciding.",
    testScenario:
      "Create the same multi-day tour with two dates, capacity, a package option, one customer enquiry and a mobile conversion path. Then change the itinerary, close a departure, export the customer record and publish an SEO update. Record every paid add-on, manual workaround and handoff.",
    migration:
      "Export tours, media, customers, bookings, redirects and metadata before changing platforms. Map old URLs to the new structure and keep booking, payment and customer records accessible for their required retention period. Do not switch DNS until forms, analytics, email and the complete booking or enquiry journey pass production tests.",
    questions: [
      "Which booking, payment and capacity features are included in the quoted plan?",
      "Can tours, customers, bookings and media be exported in usable formats?",
      "How do custom domains, redirects and canonical URLs behave during migration?",
      "Which records remain available after cancellation, and for how long?",
    ],
    sources: [
      {
        label: "TripCart official product page",
        href: "https://tripcart.com/",
      },
      {
        label: "TripCart product terms",
        href: "https://tripcart.com/terms-and-conditions/",
      },
    ],
  },
  "/compare/tripone-vs-wp-travel-engine": {
    alternative: "WP Travel Engine",
    category: "WordPress travel booking plugin",
    verifiedPosition:
      "WP Travel Engine's official documentation describes a free WordPress plugin for creating trips, itineraries, dates and pricing, accepting bookings and payments, managing enquiries and organising trips by destination, activity and type. It documents Gutenberg blocks, Elementor widgets and more than 40 premium add-ons, with gateway availability depending on setup and add-ons.",
    tripOnePosition:
      "TripOne+ is a managed application rather than a plugin installed into a separately hosted WordPress site. Its public site, builder, structured travel catalogue, leads and operating records live in one codebase and release process. This reduces plugin-stack ownership but also means a user cannot treat it as an arbitrary WordPress extension environment.",
    chooseAlternative:
      "Choose WP Travel Engine for serious evaluation when WordPress ownership, its documented checkout features, specific gateways, add-ons or the wider WordPress ecosystem are requirements and the team can maintain hosting, themes, plugins, security and compatibility.",
    chooseTripOne:
      "Choose TripOne+ for serious evaluation when the team wants a hosted travel-specific workflow with deterministic generation, one shared preview and public renderer, and fewer WordPress maintenance decisions. Verify current booking and integration requirements against the product before replacing a mature plugin stack.",
    testScenario:
      "Build a representative trip with itinerary, dates, pricing, enquiry and payment or request flow. Add a destination taxonomy, change the page design, grant a staff user access, test mobile checkout and export the core records. Include WordPress hosting, premium extensions, backups and maintenance in the cost comparison.",
    migration:
      "Inventory WordPress posts, trip records, taxonomies, media, customer data, booking data, payment records, schema, URLs and add-ons. Preserve the WordPress installation until redirects and record retention are verified. A content export alone may not include plugin-specific booking structures.",
    questions: [
      "Which capabilities require premium add-ons or a particular theme or builder?",
      "Who owns WordPress core, plugin, theme, backup and security maintenance?",
      "Can complete trip and booking records be exported independently of WordPress?",
      "What happens to custom code and URLs during a future platform change?",
    ],
    sources: [
      {
        label: "WP Travel Engine official documentation",
        href: "https://docs.wptravelengine.com/",
      },
      {
        label: "WP Travel Engine getting started guide",
        href: "https://docs.wptravelengine.com/general-setup/getting-started",
      },
    ],
  },
  "/compare/tripone-vs-wp-travel": {
    alternative: "WP Travel",
    category: "WordPress tour operator plugin",
    verifiedPosition:
      "WP Travel's official site positions the product as a WordPress tour and travel booking plugin with free and Pro options, payment gateways, integrations, extensions, themes, documentation and frontend and backend demos. That makes the surrounding WordPress site and the chosen extensions part of the operating architecture.",
    tripOnePosition:
      "TripOne+ is hosted software with a prescribed tourism data model, visual builder and management workspace. It trades the broad flexibility of a WordPress installation for a controlled application surface where customer website and dashboard changes ship together.",
    chooseAlternative:
      "WP Travel deserves a trial when the business already has WordPress expertise, needs its documented plugin or gateway ecosystem, or wants direct control over the host, theme and surrounding plugins. Test the exact free, Pro and extension combination rather than assuming the product name includes every feature.",
    chooseTripOne:
      "TripOne+ deserves a trial when a managed system, guided onboarding, shared renderer and connected leads, customers, packages and website content matter more than access to arbitrary WordPress plugins. Check required checkout and inventory depth against the current release.",
    testScenario:
      "Create one tour, one package, one destination, an enquiry and the required payment or request route. Change the design, update a URL, test permissions and restore a backup. Price the complete WordPress environment—including hosting and extensions—against the managed workflow.",
    migration:
      "Before leaving either system, obtain usable exports for content, media, customers, enquiries and bookings. Crawl all public URLs, preserve metadata and create explicit redirects. Keep financial and customer records according to applicable obligations instead of treating a site migration as deletion authority.",
    questions: [
      "Which features are free, Pro or separate extensions today?",
      "Which themes, WordPress versions and payment gateways are supported?",
      "How are backups, staging, updates and compatibility failures handled?",
      "Can the business export the underlying travel and booking data?",
    ],
    sources: [
      {
        label: "WP Travel official product site",
        href: "https://wptravel.io/",
      },
      {
        label: "WP Travel official documentation",
        href: "https://wptravel.io/docs/",
      },
    ],
  },
  "/compare/tripone-vs-tourfic": {
    alternative: "Tourfic",
    category: "WordPress and WooCommerce travel booking plugin",
    verifiedPosition:
      "Tourfic's official documentation describes a WordPress plugin covering tours and additional travel inventory types. Its tour booking documentation supports WooCommerce checkout, external booking and booking without payment; the product documentation also lists availability, pricing, taxonomies, enquiries, gateways and Pro areas. Exact capabilities depend on current editions and configuration.",
    tripOnePosition:
      "TripOne+ is a hosted tourism operating and growth workspace, not a WooCommerce extension. It provides its own structured website, service, rental, package, taxonomy, CRM and publishing workflows. It does not inherit the WooCommerce gateway and extension marketplace, so required commerce functions need direct verification.",
    chooseAlternative:
      "Evaluate Tourfic when WooCommerce is already strategic, its documented inventory types match the catalogue, or a required payment method is available through the WordPress stack. Include hosting, WooCommerce, premium modules and compatibility maintenance in the decision.",
    chooseTripOne:
      "Evaluate TripOne+ when the business wants a managed travel-first content and operating model, guided generation and integrated growth workspace without assembling a WordPress stack. Validate instant checkout, payments and live inventory needs before committing.",
    testScenario:
      "Configure the same tour with dates, price, availability, traveller data and the preferred payment or enquiry mode. Add a rental or package, update the template, test a plugin update and export the data. Compare the customer journey and the administrator's weekly maintenance work.",
    migration:
      "Map WordPress posts, Tourfic records, WooCommerce orders, customers, media, taxonomies, templates and URLs separately. Payment and order retention can differ from marketing content retention. Test redirects and archived records before retiring the WordPress environment.",
    questions: [
      "Which inventory, booking and gateway functions require Pro modules?",
      "What data belongs to Tourfic versus WooCommerce or WordPress?",
      "How are plugin, theme and WordPress compatibility issues handled?",
      "Can tours, orders and customers be exported in complete usable formats?",
    ],
    sources: [
      {
        label: "Tourfic official documentation",
        href: "https://tourfic.com/docs/",
      },
      {
        label: "Tourfic booking documentation",
        href: "https://themefic.com/docs/tourfic/tours/tour-booking/",
      },
      {
        label: "Tourfic installation documentation",
        href: "https://themefic.com/docs/tourfic/getting-started-tourfic/tourfic-installation/",
      },
    ],
  },
  "/compare/tripone-vs-wix": {
    alternative: "Wix",
    category: "general-purpose hosted website and business platform",
    verifiedPosition:
      "Wix's official pages describe a broad hosted website builder with travel templates, drag-and-drop editing, marketing, analytics, payments and client management. Wix Bookings supports appointments, classes and courses; Wix also markets tours and activities use cases, calendars, staff, forms, reminders and online or offline payments. Plan and regional requirements still need verification.",
    tripOnePosition:
      "TripOne+ begins with structured tourism businesses, experiences, rentals, packages, destinations and website recipes rather than a general blank canvas. Its narrower model can reduce setup decisions and connect travel content with lead and operational context, while offering less general-purpose design and app-market breadth than Wix.",
    chooseAlternative:
      "Wix is a strong candidate when broad design freedom, its established app ecosystem, general service scheduling or documented commerce and payment capabilities fit the business. Build the real tour workflow in a trial because a feature designed for appointments may behave differently from dated multi-day inventory.",
    chooseTripOne:
      "TripOne+ is a strong candidate when tourism-aware generation, services and package structure, destination taxonomies and a connected marketing and CRM workspace are the priority. Required real-time booking, payment and marketplace integrations should be verified explicitly.",
    testScenario:
      "Publish the same scheduled activity and multi-day package, configure capacity, collect a qualified enquiry, change a destination URL and give staff appropriate access. Test mobile performance and the weekly editing workflow, then compare the actual plan and app costs.",
    migration:
      "Export the content and records each platform makes available, crawl URLs and download original media. Hosted builders may not export a complete reusable site implementation. Plan redirects, forms, analytics, domains and email before the DNS change.",
    questions: [
      "Does the proposed Wix service model match tours, departures and packages?",
      "Which plan and apps are required for bookings, payments and staff access?",
      "What content, customer and booking data can be exported?",
      "How much design and operational maintenance will the team own weekly?",
    ],
    sources: [
      {
        label: "Wix official travel website solution",
        href: "https://www.wix.com/business/solutions/travel-agency-website",
      },
      {
        label: "Wix Bookings official overview",
        href: "https://support.wix.com/en/article/wix-bookings-about-wix-bookings",
      },
      {
        label: "Wix Bookings page model",
        href: "https://support.wix.com/en/article/about-wix-bookings-pages",
      },
    ],
  },
  "/compare/tripone-vs-squarespace": {
    alternative: "Squarespace",
    category: "general-purpose hosted website builder with Acuity scheduling",
    verifiedPosition:
      "Squarespace is a hosted website and commerce platform. Its official help documentation explains that scheduling blocks display an Acuity Scheduling page and require an Acuity subscription. That architecture can support appointment-style scheduling, but a tour operator should test whether its dates, passenger pricing, capacity and itinerary requirements fit the current Acuity and Squarespace configuration.",
    tripOnePosition:
      "TripOne+ provides a travel-specific catalogue, packages, destinations, leads, customers, booking records and deterministic page recipes in one workspace. It offers a more prescribed tourism model and less general layout freedom than a mature general website platform.",
    chooseAlternative:
      "Evaluate Squarespace when editorial presentation, general website management, commerce content or an Acuity-led scheduling journey fits the business and the team accepts the product boundary between site and scheduler. Verify current plans, transaction terms and export formats.",
    chooseTripOne:
      "Evaluate TripOne+ when structured tours, rentals, packages, tourism taxonomies and a connected request-led operating workflow are more important than a broad general website canvas. Confirm payment and real-time booking requirements against the live product.",
    testScenario:
      "Build a representative tour and package, embed or configure the intended scheduler, collect the required traveller context and test a mobile booking. Then update an itinerary, redirect a URL, export records and compare all subscriptions and manual handoffs.",
    migration:
      "Inventory website pages, blog posts, products, Acuity appointments and clients, forms, media, domains and analytics separately. Export availability differs by record type. Preserve required customer and transaction history and test redirects before moving the domain.",
    questions: [
      "Can Acuity represent the exact tour, party pricing and capacity model?",
      "Which Squarespace and Acuity subscriptions are required together?",
      "How are customers, appointments, content and media exported?",
      "Which workflow steps remain manual between the website and scheduling system?",
    ],
    sources: [
      {
        label: "Squarespace official site",
        href: "https://www.squarespace.com/",
      },
      {
        label: "Squarespace scheduling blocks guide",
        href: "https://support.squarespace.com/hc/en-us/articles/206545577-Scheduling-blocks",
      },
      {
        label: "Acuity Scheduling official site",
        href: "https://acuityscheduling.com/",
      },
    ],
  },
  "/compare/tripone-vs-wordpress": {
    alternative: "WordPress",
    category: "open-source content management system",
    verifiedPosition:
      "WordPress.org describes software installed on a chosen host, extended through thousands of themes and plugins, modified in code and used with custom content types, taxonomies and a REST API. That flexibility is genuine, but a travel booking stack, backups, security, compatibility and specialist workflows are assembled rather than supplied by WordPress core.",
    tripOnePosition:
      "TripOne+ is managed vertical software with prescribed tourism records, page recipes, a visual builder and connected operational workspaces. It provides less architectural freedom than WordPress while reducing the number of hosting, plugin and data-model decisions required for the supported travel workflow.",
    chooseAlternative:
      "Shortlist WordPress when source-level control, a particular plugin ecosystem, portable hosting or a highly bespoke website is essential and the business has accountable technical maintenance. Evaluate the complete theme, plugin, commerce and booking stack—not WordPress core alone.",
    chooseTripOne:
      "Shortlist TripOne+ when a guided tourism setup, managed release surface and connected catalogue, CRM and growth workflow are more valuable than arbitrary plugins. Verify any specialist checkout, channel or payment requirement against the current release.",
    testScenario:
      "Build the same tour, package, destination and lead journey; grant an editor access; update all dependencies; restore a backup; and export the travel records. Price hosting, premium plugins, development, monitoring and maintenance beside the managed application.",
    migration:
      "A WordPress export may not contain plugin-specific reservations or settings. Inventory the database, uploads, theme, custom code, users, URLs and each plugin's records. Preserve redirects and regulated customer or payment history before changing hosts or platforms.",
    questions: [
      "Who owns hosting, backups, security updates and plugin conflicts?",
      "Which travel functions are core, premium plugins or custom code?",
      "Can booking and customer data be exported without the original plugin?",
      "What is the tested recovery process after a failed update?",
    ],
    sources: [
      {
        label: "WordPress.org official features",
        href: "https://wordpress.org/about/features/",
      },
      {
        label: "WordPress.org requirements",
        href: "https://wordpress.org/about/requirements/",
      },
      {
        label: "WordPress.org download model",
        href: "https://wordpress.org/download/",
      },
    ],
  },
  "/compare/tripone-vs-webflow": {
    alternative: "Webflow",
    category: "visual website experience platform and composable CMS",
    verifiedPosition:
      "Webflow's official pages describe visual development, a composable CMS, hosting, SEO controls, analytics, optimisation, APIs, apps and custom code. Its strength is flexible website and content experience design. A travel operator still needs to model or integrate reservations, operational inventory and customer workflows not inherent to a general CMS.",
    tripOnePosition:
      "TripOne+ begins with tourism entities and deterministic site recipes, then connects them to leads, customers, bookings, packages and resources. Its design system is more constrained than Webflow's visual canvas, but supported travel data does not need to be invented as CMS collections from scratch.",
    chooseAlternative:
      "Evaluate Webflow when visual autonomy, a sophisticated marketing site, composable CMS or an existing best-of-breed booking stack is central and the team can design the integrations and content model.",
    chooseTripOne:
      "Evaluate TripOne+ when rapid tourism-aware setup and a connected content and operations workspace matter more than an open-ended visual canvas. Confirm advanced design and specialist reservation requirements in a live trial.",
    testScenario:
      "Build the same experience catalogue and destination relationships, connect the chosen booking action, publish an SEO change and hand daily editing to a non-designer. Compare CMS limits, integration work, accessibility, performance and administrator time.",
    migration:
      "Export CMS collections and original media where available, preserve custom code and integration documentation, and crawl all URLs. A hosted visual design may not move as a maintainable implementation, so budget for reconstruction and redirects.",
    questions: [
      "How will tours, dates, packages and destinations be modelled and related?",
      "Which booking, CRM and operational systems must be integrated?",
      "Who owns visual-system consistency and accessibility after launch?",
      "What content and code can be exported in a reusable form?",
    ],
    sources: [
      {
        label: "Webflow official platform overview",
        href: "https://webflow.com/platform",
      },
      {
        label: "Webflow official CMS features",
        href: "https://webflow.com/feature/cms",
      },
    ],
  },
  "/compare/tripone-vs-fareharbor": {
    alternative: "FareHarbor",
    category: "tour, activity, rental and attraction booking platform",
    verifiedPosition:
      "FareHarbor's official site documents direct checkout and payments, OTA and affiliate distribution, real-time availability sync, manifests, crew and resource workflows, check-in, reporting and guest follow-up. It is a mature reservation and operations candidate, not merely a booking widget.",
    tripOnePosition:
      "TripOne+ currently emphasises owned website generation, structured content, packages, CRM records, request-led bookings and growth services. It should not be represented as matching FareHarbor's documented reservation, payment, check-in and distribution depth unless those capabilities are implemented and tested.",
    chooseAlternative:
      "Shortlist FareHarbor when live inventory, checkout, payments, OTA distribution, manifests or day-of-operation tools are decisive. Confirm commercial terms, payment flow, website options, data access and the exact operational setup in a demo and contract.",
    chooseTripOne:
      "Shortlist TripOne+ when the immediate need is a tourism-aware owned website, content and lead/customer workspace, or when an existing specialist reservation system can remain the source of truth behind the marketing experience.",
    testScenario:
      "Create a capacity-constrained activity, sell through direct and partner paths, close inventory, assign a guide, check in a guest and reconcile source reporting. Separately test destination content, editing, CRM context and migration exports.",
    migration:
      "Preserve products, future and historical reservations, customer data, waivers, payment references, channel mappings, manifests, URLs and analytics. Run parallel reconciliation before moving live inventory or payment traffic.",
    questions: [
      "What fees, payment terms and channel commissions apply to this business?",
      "How are inventory, resources and OTA mappings configured and exported?",
      "What website, CRM and marketing capabilities are native or partner-led?",
      "How will historical and future reservations remain accessible after exit?",
    ],
    sources: [
      {
        label: "FareHarbor official platform",
        href: "https://fareharbor.com/",
      },
      {
        label: "FareHarbor tour booking solution",
        href: "https://fareharbor.com/solutions/tour-booking-software/",
      },
      {
        label: "FareHarbor official help centre",
        href: "https://help.fareharbor.com/",
      },
    ],
  },
  "/compare/tripone-vs-bokun": {
    alternative: "Bókun",
    category: "booking and channel management solution for experiences",
    verifiedPosition:
      "Bókun's official site presents booking and channel management with a website booking capability, Viator product import, availability synchronisation and access to a large reseller and OTA network. Its distribution orientation is material for operators that depend on multiple sales channels.",
    tripOnePosition:
      "TripOne+ concentrates on the owned website, tourism content, direct lead context, customer records and broader growth workspace. Its current release should not be assumed to replace Bókun's documented channel manager or live OTA inventory sync.",
    chooseAlternative:
      "Evaluate Bókun when OTA connectivity, channel management and live booking inventory are core. Verify each desired reseller, commission, payment flow, contract and direct-site experience with current first-party documentation.",
    chooseTripOne:
      "Evaluate TripOne+ when owned content, packages, destination authority and request-led sales operations are the priority, or as a website layer that hands inventory to a specialist system where a supported integration exists.",
    testScenario:
      "Publish one product direct and through the required resellers, change availability, cancel a booking and reconcile the channel. Then compare website editing, lead capture, customer context, SEO control and exports.",
    migration:
      "Map products, rates, availability, bookings, customer records, payments and every channel connection. Coordinate cutover with resellers to avoid duplicate or stale inventory and preserve required financial records.",
    questions: [
      "Which OTAs and resellers are live for the target market and product?",
      "What platform, payment and channel fees apply?",
      "How does direct website content and SEO ownership work?",
      "Can products, bookings, customers and channel mappings be exported?",
    ],
    sources: [
      { label: "Bókun official product site", href: "https://www.bokun.io/" },
      { label: "Bókun official help centre", href: "https://docs.bokun.io/" },
    ],
  },
  "/compare/tripone-vs-rezdy": {
    alternative: "Rezdy",
    category: "experience booking software and channel management network",
    verifiedPosition:
      "Rezdy's official pages describe booking management, communications, reporting and billing plus a channel manager connecting operators with global and local resellers. Its channel documentation discusses rate, availability and booking synchronisation and different supplier connection models.",
    tripOnePosition:
      "TripOne+ provides a managed tourism website and operational content layer with leads, customers and booking records, but it should not be claimed as equivalent to Rezdy's documented distribution network or real-time reservation engine.",
    chooseAlternative:
      "Evaluate Rezdy when multi-channel distribution, booking automation and connected reseller inventory are central. Validate the exact channels, plan, fees, payment arrangements and reconciliation workflow.",
    chooseTripOne:
      "Evaluate TripOne+ when the business needs an owned SEO and conversion site, package and destination content, and a request-led customer workflow, potentially alongside specialist booking infrastructure.",
    testScenario:
      "Connect one real product to the required channel, update rates and availability, process direct and reseller bookings and reconcile them. Compare that with the owned website, editing and lead-to-customer workflow.",
    migration:
      "Preserve supplier products, reseller contracts, rates, availability, orders, customers and reconciliation history. Coordinate channel disconnection and reconnection so two systems do not publish conflicting inventory.",
    questions: [
      "Which reseller connections and automation model fit this setup?",
      "What booking, payment, channel and reconciliation fees apply?",
      "How are direct website content and organic acquisition managed?",
      "What complete data exports and API access are available?",
    ],
    sources: [
      { label: "Rezdy official booking platform", href: "https://rezdy.com/" },
      {
        label: "Rezdy official channel manager",
        href: "https://rezdy.com/channel-manager-for-suppliers/",
      },
    ],
  },
  "/compare/tripone-vs-checkfront": {
    alternative: "Checkfront",
    category: "booking management platform for tours, activities and rentals",
    verifiedPosition:
      "Checkfront's official pages document booking calendars, inventory and assets, forms, digital waivers, check-in, notifications, online payments, channel management and reporting. Its current pricing page also publishes a subscription and online-booking-fee model that buyers should reconfirm at quotation time.",
    tripOnePosition:
      "TripOne+ focuses on tourism website generation, structured content, CRM context and a broader marketing workspace. It does not currently justify a claim of matching Checkfront's documented waiver, payment, real-time inventory and booking-management depth.",
    chooseAlternative:
      "Evaluate Checkfront when waivers, detailed inventory, checkout, guest check-in and booking operations are decisive. Test the current product model and obtain binding commercial terms for the expected booking mix.",
    chooseTripOne:
      "Evaluate TripOne+ when an owned marketing and content system plus request-led operations is the more immediate need, or when a specialist booking platform can remain connected behind the public website.",
    testScenario:
      "Configure one rental and one scheduled activity with assets, waivers, seasonal pricing and notifications. Complete payment, change inventory, check in a guest, export the records and compare website editing and acquisition context.",
    migration:
      "Plan for products, assets, customers, bookings, waivers, payment references, notification templates and URLs. Legal retention requirements can prevent simply deleting the prior system after launch.",
    questions: [
      "What subscription, payment and per-booking fees apply today?",
      "How do assets, inventory, waivers and channels map to our products?",
      "Which website and CRM functions are native versus integrations?",
      "Can all bookings, documents and customer records be exported?",
    ],
    sources: [
      {
        label: "Checkfront business management features",
        href: "https://www.checkfront.com/run-your-business/",
      },
      {
        label: "Checkfront official pricing",
        href: "https://www.checkfront.com/pricing/",
      },
      {
        label: "Checkfront waiver documentation",
        href: "https://support.checkfront.com/hc/en-us/articles/19868093090204-How-do-I-get-started-with-Waivers-Documents",
      },
    ],
  },
  "/compare/tripone-vs-xola": {
    alternative: "Xola",
    category: "tour and activity booking and marketing platform",
    verifiedPosition:
      "Xola's official product pages describe direct booking, payments, scheduling, pricing, capacity, packages, resources, customer communication, point of sale, reporting and marketing tools. That is a substantial reservation and operations suite, not only an embedded checkout.",
    tripOnePosition:
      "TripOne+ combines an owned travel website and structured content with lead, customer, package and operational workspaces. Its present scope should not be portrayed as replacing Xola's documented payment, point-of-sale, live inventory and day-of-operation capabilities without evidence.",
    chooseAlternative:
      "Evaluate Xola when conversion-oriented checkout, payment processing, scheduling, resource allocation, POS and operational reporting are central. Confirm commercial availability and terms for the operating country.",
    chooseTripOne:
      "Evaluate TripOne+ for a content-led direct-growth site and request-led CRM workflow, or when the operator's reservation source of truth can remain a specialist platform behind the TripOne+ experience.",
    testScenario:
      "Create a variable-price tour with capacity, resources, package, cut-off, payment and post-purchase questions. Operate a walk-up and schedule change, then compare content creation, SEO controls and customer data export.",
    migration:
      "Preserve products, schedules, resource assignments, orders, customer responses, payments, reports and integrations. Reconcile future bookings and payouts before switching checkout traffic.",
    questions: [
      "Are payments and the full product available in our market?",
      "How do pricing, resources, packages and distribution fit our catalogue?",
      "What costs apply to payments, integrations and marketing tools?",
      "Can operational and customer data be exported completely?",
    ],
    sources: [
      { label: "Xola official platform", href: "https://www.xola.com/" },
      {
        label: "Xola tour management features",
        href: "https://www.xola.com/tour-management-software",
      },
      {
        label: "Xola official product tour",
        href: "https://www.xola.com/product-tour/",
      },
    ],
  },
  "/compare/tripone-vs-peek-pro": {
    alternative: "Peek Pro",
    category: "experience and attraction booking and operations platform",
    verifiedPosition:
      "Peek Pro's official site describes online booking, point of sale, resources, waivers, customer communication, reseller connectivity, reporting and automation. It also markets advanced AI and revenue features; buyers should test exact availability and treat vendor performance claims as vendor claims, not forecasts.",
    tripOnePosition:
      "TripOne+ emphasises deterministic travel website creation, structured product and destination content, request-led CRM records and integrated growth work. It is not evidence-based to claim parity with Peek Pro's documented checkout, POS, inventory and enterprise operations.",
    chooseAlternative:
      "Evaluate Peek Pro when high-volume checkout, POS, resources, waivers, automation and reseller connectivity are core. Obtain current product, market, fee and implementation details rather than relying on headline growth claims.",
    chooseTripOne:
      "Evaluate TripOne+ when the owned website, organic content system and broader marketing workflow are the priority, or as a presentation layer while specialist reservation operations remain elsewhere.",
    testScenario:
      "Run a real product through mobile checkout, payment, resource allocation, waiver, walk-up, reschedule and reporting. Test the same business's content editing, destination SEO and lead workflow, then compare total ownership.",
    migration:
      "Map inventory, future bookings, customer records, waivers, payments, reseller connections, automation and reporting history. Keep the prior operational system available until every future reservation is reconciled.",
    questions: [
      "Which advertised automation and AI functions are included and available now?",
      "What payment, booking, hardware and reseller costs apply?",
      "How does the platform support owned website and SEO workflows?",
      "What export and API options protect business continuity?",
    ],
    sources: [
      {
        label: "Peek Pro official product site",
        href: "https://www.peekpro.com/",
      },
      {
        label: "Peek Pro official knowledge base",
        href: "https://support.peek.com/",
      },
    ],
  },
  "/compare/tripone-vs-trekksoft": {
    alternative: "TrekkSoft",
    category: "tour and activity booking and distribution platform",
    verifiedPosition:
      "TrekkSoft's official site and documentation describe a booking engine, POS, back office, integrated payments, channel manager, activities, rentals, packages, inquiries and resource workflows. Its public pricing shows plan-based features and multiple fee types that can change and should be reconfirmed.",
    tripOnePosition:
      "TripOne+ offers a managed tourism website, structured service and package content, customer records and growth workspace. Its current product should not be framed as a proven replacement for TrekkSoft's documented payments, POS, channels and mature reservation operations.",
    chooseAlternative:
      "Evaluate TrekkSoft when direct checkout, distribution, integrated payment, POS or activity operations are essential and its regional availability and terms fit. Calculate subscription, booking, payment and channel costs using the expected sales mix.",
    chooseTripOne:
      "Evaluate TripOne+ when the primary problem is owned content, destination discovery, request-led sales and marketing operations, or when a booking engine can remain integrated as the reservation source of truth.",
    testScenario:
      "Configure an activity, rental and package with schedules, pricing, payment and OTA distribution. Process direct, offline and partner bookings, then compare site editing, SEO, CRM context, exports and total fees.",
    migration:
      "Preserve activities, packages, schedules, reservations, customers, payments, channel mappings, resources and financial reports. Coordinate payout and channel timing before a checkout cutover.",
    questions: [
      "Which plan contains each required booking and operational feature?",
      "What direct, OTA, payment and offline fees apply to our forecast mix?",
      "How are website, channel and customer data exported?",
      "What happens to future bookings and payouts after cancellation?",
    ],
    sources: [
      {
        label: "TrekkSoft official product site",
        href: "https://www.trekksoft.com/",
      },
      {
        label: "TrekkSoft official pricing",
        href: "https://www.trekksoft.com/en/pricing",
      },
      {
        label: "TrekkSoft activity documentation",
        href: "https://support.trekksoft.com/activities",
      },
    ],
  },
  "/compare/tripone-vs-regiondo": {
    alternative: "Regiondo",
    category: "leisure booking and channel management system",
    verifiedPosition:
      "Regiondo's official help centre documents bookings, availability, offers, coupons, ticket validation, billing and settings. It also documents a channel manager for activating sales channels and mapping offer categories. Buyers should verify current market availability, plans, payments and integrations directly.",
    tripOnePosition:
      "TripOne+ centres the operator's owned site, travel content, customer context and marketing workspace. It does not have evidence for parity with Regiondo's documented ticketing, channel manager and mature reservation functions.",
    chooseAlternative:
      "Evaluate Regiondo when bookable offers, ticket validation, channel sales and reservation management are primary. Trial the exact product and channels in the operating market and obtain current commercial terms.",
    chooseTripOne:
      "Evaluate TripOne+ when a tourism-focused website, organic growth system, packages and request-led CRM are the main need, or when an existing reservation platform can stay behind the public journey.",
    testScenario:
      "Create one offer with appointments and capacity, connect a required sales channel, issue and validate a ticket, process a change and inspect billing. Compare owned-page editing, destination content and customer context.",
    migration:
      "Map offers, appointments, bookings, customers, tickets, payouts and channel categories. Disconnect sales channels in a controlled sequence and preserve records required for future attendance, refunds and accounting.",
    questions: [
      "Which markets, languages, gateways and channels are supported?",
      "What subscription, payment and channel fees apply?",
      "How much owned website and SEO control is included?",
      "Can complete booking, customer, ticket and billing records be exported?",
    ],
    sources: [
      { label: "Regiondo official website", href: "https://pro.regiondo.com/" },
      {
        label: "Regiondo dashboard documentation",
        href: "https://support.regiondo.com/hc/en-us/articles/20179813699228-Which-functions-are-on-the-first-page-of-the-dashboard",
      },
      {
        label: "Regiondo channel manager documentation",
        href: "https://support.regiondo.com/hc/en-us/articles/20179874864668-How-do-I-work-with-the-channel-manager",
      },
    ],
  },
  "/compare/tripone-vs-zaui": reservationProfile({
    alternative: "Zaui",
    category: "tour, activity and transport reservation platform",
    verifiedPosition:
      "Zaui's official material documents online booking, tour and transport schedules, routes, fleet and resource management, vehicle context, payments, mobile check-in, agent and OTA channels, customer self-service and inventory synchronisation. Its transport depth is a substantive distinction.",
    alternativeFit:
      "Evaluate Zaui when shuttles, routes, manifests, distance pricing, vehicles, transport schedules or mature live reservations are essential. Verify the precise gateways, channels, market support and commercial terms.",
    tripOneFit:
      "Evaluate TripOne+ when the priority is an owned content and growth system with packages, taxonomies and request-led CRM, or when transport reservations can remain in a specialist source of truth.",
    testScenario:
      "Configure a scheduled tour and airport transfer with vehicle, driver, route, capacity, payment and OTA sale. Change a schedule, process a walk-up and reconcile a manifest, then compare website editing and lead context.",
    migration:
      "Preserve routes, schedules, vehicles, products, resources, future reservations, customers, payments and channel mappings. Reconcile active trips and payouts before moving booking traffic.",
    questions: [
      "How are routes, fleet, resources and tour inventory represented?",
      "Which gateways, OTAs and reseller workflows serve our market?",
      "What fees and implementation services apply?",
      "Can transport, booking and customer records be exported completely?",
    ],
    sources: [
      { label: "Zaui official platform", href: "https://www.zaui.com/" },
      {
        label: "Zaui platform features",
        href: "https://www.zaui.com/platform-features",
      },
      {
        label: "Zaui tour and transport solutions",
        href: "https://www.zaui.com/solutions",
      },
    ],
  }),
  "/compare/tripone-vs-ventrata": reservationProfile({
    alternative: "Ventrata",
    category: "enterprise ticketing platform for tours and attractions",
    verifiedPosition:
      "Ventrata's official pages document web checkout, real-time availability, handheld and desktop POS, kiosks, scanning, ticket and capacity controls, reseller connectivity, OCTO APIs, hardware and enterprise reporting for high-volume online, onsite and third-party sales.",
    alternativeFit:
      "Evaluate Ventrata when turnstiles, kiosks, hardware, high-throughput ticket validation, reseller connectivity or enterprise attraction operations are core. Confirm implementation, hardware, support and commercial requirements.",
    tripOneFit:
      "Evaluate TripOne+ when a smaller operator needs an accessible owned website, structured travel content and customer-growth workflow without enterprise ticketing infrastructure.",
    testScenario:
      "Sell the same ticket through web, terminal, kiosk and a required reseller; scan it, enforce capacity, issue a change and inspect ledger reporting. Compare content publishing and CRM context separately.",
    migration:
      "Map products, ticket units, hardware, users, resellers, future admissions, payments and ledger records. Run scanners and channel connections in a controlled cutover with rollback.",
    questions: [
      "Which hardware, APIs and implementation services are required?",
      "How do reseller, payment and support costs scale?",
      "What offline and peak-load behaviour is supported?",
      "Which ticket, customer and ledger exports are available?",
    ],
    sources: [
      {
        label: "Ventrata official features",
        href: "https://ventrata.com/features-and-solutions",
      },
      {
        label: "Ventrata OCTO API documentation",
        href: "https://docs.ventrata.com/",
      },
      {
        label: "Ventrata terminal documentation",
        href: "https://support.ventrata.com/en/articles/9545671-ventrata-terminal-app-overview",
      },
    ],
  }),
  "/compare/tripone-vs-rocketrez": reservationProfile({
    alternative: "RocketRez",
    category: "attraction ticketing, POS and guest experience platform",
    verifiedPosition:
      "RocketRez's official material documents online and onsite ticketing, POS, timed capacity, scanning, kiosks, memberships, retail, food and beverage, reseller sales and guest communication. That attraction-wide commerce model extends beyond a tour catalogue.",
    alternativeFit:
      "Evaluate RocketRez when an attraction needs gate scanning, memberships, retail, concessions, kiosks and unified POS as well as tickets. Confirm regional payment, hardware and implementation details.",
    tripOneFit:
      "Evaluate TripOne+ for tour businesses whose main need is a content-rich owned site, packages and request-led customer operations rather than venue-wide ticketing and retail.",
    testScenario:
      "Sell a timed ticket online and onsite, scan entry, enforce capacity, process membership benefits and bundle a retail item. Compare that path with TripOne+'s website and lead workflow.",
    migration:
      "Preserve tickets, memberships, future events, guest records, payments, retail data and hardware configuration. Test peak entry and reconciliation before retirement.",
    questions: [
      "Which ticketing, POS, retail and membership modules are required?",
      "What hardware and payment commitments apply?",
      "How does reseller and website ownership work?",
      "Can all guest, ticket and transaction records be exported?",
    ],
    sources: [
      {
        label: "RocketRez official platform",
        href: "https://www.rocketrez.com/",
      },
      {
        label: "RocketRez official feature index",
        href: "https://www.rocketrez.com/features-index",
      },
    ],
  }),
  "/compare/tripone-vs-ticketinghub": reservationProfile({
    alternative: "TicketingHub",
    category: "tour and attraction ticketing and distribution platform",
    verifiedPosition:
      "TicketingHub presents booking and ticketing software for tours, activities and attractions with online checkout, channel distribution and operational tools. Buyers should verify every required workflow in its current official product, documentation and proposal.",
    alternativeFit:
      "Evaluate TicketingHub when ticket issuance, reseller distribution, live availability and checkout are central. Test the exact channels, payment model, fees and data access.",
    tripOneFit:
      "Evaluate TripOne+ when the operator primarily needs tourism-aware site generation, destination content, CRM context and marketing workflows, potentially connected to specialist ticketing.",
    testScenario:
      "Sell one timed activity direct and through a required reseller, redeem it, change availability, issue a cancellation and export the record. Compare editing and acquisition separately.",
    migration:
      "Map products, time slots, tickets, customers, payments, resellers and future bookings. Coordinate channel and widget replacement so no stale availability remains live.",
    questions: [
      "Which channels, ticket types and redemption workflows are supported?",
      "What booking, payment and reseller fees apply?",
      "How are the website and customer relationship managed?",
      "What exports and APIs support migration?",
    ],
    sources: [
      {
        label: "TicketingHub official product site",
        href: "https://www.ticketinghub.com/",
      },
      {
        label: "TicketingHub official help centre",
        href: "https://help.ticketinghub.com/",
      },
    ],
  }),
  "/compare/tripone-vs-rezgo": reservationProfile({
    alternative: "Rezgo",
    category: "tour and activity reservation, POS and distribution platform",
    verifiedPosition:
      "Rezgo's official site documents online, mobile, phone and in-person bookings, payment gateways, POS, inventory, resources, waivers, ticketing, analytics, reviews and OTA distribution. Current release material also shows ongoing kiosk and analytics development.",
    alternativeFit:
      "Evaluate Rezgo when live inventory, payments, POS, waivers, check-in or distribution are decisive. Confirm its current fee model, gateways and market availability.",
    tripOneFit:
      "Evaluate TripOne+ when the priority is deterministic website creation, packages, editorial growth and request-led CRM, or when Rezgo can remain the booking source.",
    testScenario:
      "Create inventory with multiple options and resources, take online and POS payments, sign a waiver, scan a ticket and distribute availability. Then compare content and acquisition workflows.",
    migration:
      "Preserve inventory, options, resources, future bookings, waivers, customers, payments and channel mappings. Reconcile active reservations and gateway records before switching.",
    questions: [
      "How does current pricing apply to our booking mix?",
      "Which gateways and distribution partners serve our market?",
      "What website and CRM capabilities are native?",
      "Can all operational and customer records be exported?",
    ],
    sources: [
      { label: "Rezgo official product site", href: "https://www.rezgo.com/" },
      {
        label: "Rezgo getting started guide",
        href: "https://support.rezgo.com/kb/getting-started-with-rezgo/",
      },
    ],
  }),
  "/compare/tripone-vs-bookeo": reservationProfile({
    alternative: "Bookeo",
    category: "tour and activity scheduling and reservation platform",
    verifiedPosition:
      "Bookeo's official pages document real-time scheduling, payments, website widgets, standalone booking pages, reminders, rescheduling, staff and vehicle resources, waivers and OTA distribution. It separates appointments, classes and tours, so the exact account type matters.",
    alternativeFit:
      "Evaluate Bookeo when mature scheduling, payment, calendar and resource rules are core and its tour-specific product fits the catalogue. Confirm plan limits and paid add-ons.",
    tripOneFit:
      "Evaluate TripOne+ when tourism content, packages, destination SEO and broader lead/customer workflows outweigh the need for a mature instant scheduling engine.",
    testScenario:
      "Configure scheduled, special-date and private tour cases with guides, vehicles, payment and a waiver. Test rescheduling and OTA availability, then compare site editing.",
    migration:
      "Export tours, schedules, customers, future bookings, payments, resources and waiver records. Preserve synced calendars and active reservations until reconciled.",
    questions: [
      "Which Bookeo product and plan matches our tour model?",
      "What resource, booking and add-on limits apply?",
      "Which gateways and channels are available?",
      "How complete are booking and customer exports?",
    ],
    sources: [
      {
        label: "Bookeo tours and activities",
        href: "https://www.bookeo.com/tours/",
      },
      {
        label: "Bookeo tour documentation",
        href: "https://support.bookeo.com/hc/en-us/sections/360002699771-Bookeo-Tours-and-Activities",
      },
      {
        label: "Bookeo official tour pricing",
        href: "https://www.bookeo.com/tours/pricing/",
      },
    ],
  }),
  "/compare/tripone-vs-trytn": reservationProfile({
    alternative: "TRYTN",
    category: "tour and activity reservation management system",
    verifiedPosition:
      "TRYTN's official pages describe online booking and central reservations for tour and activity businesses, including scheduled and unscheduled products, merchandise, assets, schedules, fees, add-ons, questions and configurable feature visibility.",
    alternativeFit:
      "Evaluate TRYTN when live reservations, asset management and its scheduling model fit the operation. Verify checkout, payments, distribution, pricing and current scope directly.",
    tripOneFit:
      "Evaluate TripOne+ when an owned website, destination and package content, request-led CRM and agency growth layer are the stronger need.",
    testScenario:
      "Create scheduled and unscheduled products, assign a constrained asset, add fees and questions, process a reservation change and export it. Compare the public content workflow.",
    migration:
      "Map products, schedules, assets, customers, reservations, payments and integrations. Keep future reservations and financial records accessible throughout transition.",
    questions: [
      "Which scheduled, unscheduled and asset workflows fit our products?",
      "What payment, distribution and notification features are included?",
      "How is the public website managed?",
      "What export and API access is available?",
    ],
    sources: [
      {
        label: "TRYTN official company overview",
        href: "https://www.trytn.com/company/",
      },
      {
        label: "TRYTN feature configuration guide",
        href: "https://support.trytn.com/hc/en-us/articles/360060902752-Customizing-the-TRYTN-Experience-Controlling-TRYTN-Features-and-Functionality",
      },
    ],
  }),
  "/compare/tripone-vs-bookinglayer": reservationProfile({
    alternative: "Bookinglayer",
    category: "reservation and operations platform for stays plus experiences",
    verifiedPosition:
      "Bookinglayer's official site documents accommodation, activities, services, rentals and packages in one inventory, with booking engine, customer portal, payments, room and activity planning, guest communication and operational lists. Accommodation-plus-programme depth is its meaningful specialisation.",
    alternativeFit:
      "Evaluate Bookinglayer when retreats, surf camps, wellness stays or adventure programmes must sell rooms and activities in one booking and manage deposits, arrivals and guest plans together.",
    tripOneFit:
      "Evaluate TripOne+ when the business does not need property-level accommodation operations and prioritises an owned tourism website, broad service catalogue and growth workflow.",
    testScenario:
      "Sell a package combining room, activity, transfer and payment plan; change room availability, collect guest details and run the arrival list. Compare website and CRM editing.",
    migration:
      "Preserve accommodation and activity inventory, packages, guests, future stays, payments, invoices and operational plans. Reconcile room occupancy before cutover.",
    questions: [
      "How are rooms, activities, services and groups modelled together?",
      "Which payment, portal and planning modules are included?",
      "What website and marketing controls are native?",
      "Can complete guest, stay and financial records be exported?",
    ],
    sources: [
      {
        label: "Bookinglayer official platform",
        href: "https://www.bookinglayer.com/",
      },
      {
        label: "Bookinglayer backoffice features",
        href: "https://www.bookinglayer.com/backoffice",
      },
      {
        label: "Bookinglayer daily planning",
        href: "https://bookinglayer.com/features/daily-planning",
      },
    ],
  }),
  "/compare/tripone-vs-beyonk": reservationProfile({
    alternative: "Beyonk",
    category: "visitor ticketing and marketing platform",
    verifiedPosition:
      "Beyonk's official pages document online and onsite ticketing, ePOS, waivers, questionnaires, scheduling, capacity, self-service, QR check-in, memberships, gift cards, merchandise, reporting and marketing services. It is a close strategic comparison but remains ticketing-led.",
    alternativeFit:
      "Evaluate Beyonk when visitor ticketing, memberships, onsite sales and integrated marketing services match the organisation. Verify geography, payments, pricing and service terms.",
    tripOneFit:
      "Evaluate TripOne+ when the business needs travel packages, destinations, service and rental content and an owned growth workspace beyond an attraction-ticketing model.",
    testScenario:
      "Sell a timed ticket and membership, sign a waiver, check in by QR, change a booking and run a repeat-visitor campaign. Compare package and destination publishing.",
    migration:
      "Map events, tickets, memberships, waivers, customers, future admissions, payments and consent. Preserve refund and attendance obligations during transition.",
    questions: [
      "Which ticketing and marketing modules are included?",
      "How are booking fees and funded marketing services structured?",
      "Can it represent multi-day travel packages and suppliers?",
      "What customer, ticket and consent exports are provided?",
    ],
    sources: [
      { label: "Beyonk official platform", href: "https://beyonk.com/us/" },
      {
        label: "Beyonk official solutions",
        href: "https://beyonk.com/us/solutions/",
      },
    ],
  }),
  "/compare/tripone-vs-wetravel": reservationProfile({
    alternative: "WeTravel",
    category:
      "multi-day group travel booking, payments and trip management platform",
    verifiedPosition:
      "WeTravel's official pages document itinerary creation, booking pages, global payments, payment plans, room inventory, participant manifests, traveller details, partner payouts and trip management for multi-day and group travel. That financial and departure workflow is central to its positioning.",
    alternativeFit:
      "Evaluate WeTravel when collecting group-trip payments, managing instalments, travellers, rooms, manifests and supplier payouts is dominant. Verify countries, currencies, compliance and fees.",
    tripOneFit:
      "Evaluate TripOne+ when the priority is persistent business infrastructure across the public website, packages, destinations, CRM and marketing, and specialist payments can remain elsewhere.",
    testScenario:
      "Publish a group trip with itinerary, room options, deposit and instalments; collect traveller data, produce a manifest and pay a supplier. Compare the long-lived website workflow.",
    migration:
      "Preserve trips, participants, room assignments, balances, payment plans, payouts, manifests and compliance records. Do not move active payment obligations without reconciliation.",
    questions: [
      "Which countries, currencies and payment methods are supported?",
      "How do processing, transfer and payout fees apply?",
      "What persistent website, CRM and SEO functions are included?",
      "Can all traveller, payment and trip records be exported?",
    ],
    sources: [
      {
        label: "WeTravel official platform",
        href: "https://www.wetravel.com/",
      },
      {
        label: "WeTravel official booking product",
        href: "https://product.wetravel.com/bookings",
      },
      {
        label: "WeTravel official workflow guide",
        href: "https://help.wetravel.com/en/articles/253921-how-it-works",
      },
    ],
  }),
  "/compare/tripone-vs-travefy": reservationProfile({
    alternative: "Travefy",
    category: "travel advisor CRM, itinerary and proposal platform",
    verifiedPosition:
      "Travefy's official product pages document an itinerary and proposal builder, reusable content, supplier imports, client mobile apps, CRM records, forms, invoices, commission tracking, email, websites and landing pages. Its advisor-centred trip and back-office workflow is broader than a presentation tool alone.",
    alternativeFit:
      "Evaluate Travefy when advisors need mature itinerary assembly, proposal approval, supplier imports, invoices and commission tracking in one established workflow. Verify plan-level limits, payment handling, website scope and team pricing.",
    tripOneFit:
      "Evaluate TripOne+ when the priority is a tourism website and content system with broad operator products, packages, destinations and request-led CRM, plus an integrated marketing workspace.",
    testScenario:
      "Import a representative supplier booking, assemble a branded multi-day proposal, collect a form and approval, issue an invoice, record commission and deliver the final trip in the client app. Then compare website and acquisition controls.",
    migration:
      "Preserve contacts, trips, reusable content, forms, invoices, commission records, documents and client communications. Export a complete trip and contact sample before committing to the cutover.",
    questions: [
      "Which itinerary, CRM, invoice and website capabilities are included in our plan?",
      "How are payments, authorisations and commissions represented?",
      "Which supplier imports and team controls match our workflow?",
      "Can trips, contacts, forms, documents and financial records be exported?",
    ],
    sources: [
      { label: "Travefy official product", href: "https://travefy.com/pro" },
      {
        label: "Travefy official CRM release",
        href: "https://travefy.com/blog-post/travefy-launches-all-new-crm-suite",
      },
    ],
  }),
  "/compare/tripone-vs-traveljoy": reservationProfile({
    alternative: "TravelJoy",
    category: "travel advisor CRM, itinerary, invoicing and payment platform",
    verifiedPosition:
      "TravelJoy's official material documents client profiles, tasks, messaging, forms, e-signatures, proposals, itineraries, invoices, payment schedules, group trips, reports and workflow automation. Current product updates also describe marketing email and enquiry-page capabilities connected to its CRM.",
    alternativeFit:
      "Evaluate TravelJoy when a travel advisor needs client, proposal, payment and group-trip administration in a focused product. Test the exact payment geography, itinerary depth, team model and current membership limits.",
    tripOneFit:
      "Evaluate TripOne+ when the durable public website, structured product and destination content, broader operator catalogue and acquisition system are the leading requirements.",
    testScenario:
      "Create an inquiry, collect an intake form, build a proposal with options, obtain approval, schedule a deposit and balance, manage a group traveller and run the post-trip follow-up. Compare the persistent website journey separately.",
    migration:
      "Preserve contacts, preferences, trips, forms, signatures, invoices, payment records, templates and message history. Reconcile all open balances and future departures before replacing any customer-facing links.",
    questions: [
      "Which CRM, group, payment and marketing features are included today?",
      "Which currencies, countries and payment responsibilities are supported?",
      "How much control is available over the public website and SEO?",
      "What complete contact, trip, form and transaction exports are available?",
    ],
    sources: [
      {
        label: "TravelJoy official CRM overview",
        href: "https://traveljoy.com/blog/post/traveljoy-a-comprehensive-crm-for-travel-agents",
      },
      {
        label: "TravelJoy official feature guide",
        href: "https://traveljoy.com/blog/post/traveljoy-features-that-simplify-travel-planning-for-advisors",
      },
      {
        label: "TravelJoy official marketing update",
        href: "https://stripe.traveljoy.com/blog/post/meet-your-new-marketing-tab",
      },
    ],
  }),
  "/compare/tripone-vs-tourwriter": reservationProfile({
    alternative: "Tourwriter",
    category:
      "itinerary, pricing, booking and operations platform for FIT travel",
    verifiedPosition:
      "Tourwriter's official product and knowledge-base pages document itinerary design, supplier and rate records, itemised pricing, markups and commissions, traveller and agency CRM, booking requests, payments, accounting connections, tasks and reporting. It is positioned particularly for bespoke multi-day FIT businesses.",
    alternativeFit:
      "Evaluate Tourwriter when complex tailor-made itineraries, supplier rates, margins, booking requests and financial operations are central. Verify plan limits, setup costs, accounting connections and implementation effort in the current proposal.",
    tripOneFit:
      "Evaluate TripOne+ when public website ownership, content-led acquisition, packages, activities, rentals and customer-growth workflows matter more than deep supplier pricing and FIT back-office operations.",
    testScenario:
      "Load supplier products and seasonal rates, assemble a multi-currency itinerary, calculate net and gross pricing, request bookings, collect a traveller payment and reconcile supplier obligations. Compare publishing and lead acquisition separately.",
    migration:
      "Preserve supplier contracts, rates, products, itineraries, contacts, bookings, tasks, invoices and payment records. Validate pricing and active departures in parallel before switching systems.",
    questions: [
      "How are supplier rates, markups, commissions and currencies controlled?",
      "Which booking, payment and accounting integrations are included?",
      "What setup, migration, training and per-user commitments apply?",
      "Can all supplier, itinerary, customer and finance records be exported?",
    ],
    sources: [
      {
        label: "Tourwriter official product",
        href: "https://www.tourwriter.com/product/",
      },
      {
        label: "Tourwriter official pricing workflow",
        href: "https://learn.tourwriter.com/portal/en/kb/articles/itinerary-pricing-in-tourwriter",
      },
      {
        label: "Tourwriter official plans",
        href: "https://www.tourwriter.com/software-pricing-plans/",
      },
    ],
  }),
  "/compare/tripone-vs-wetu": reservationProfile({
    alternative: "Wetu",
    category: "travel itinerary, content and trade collaboration platform",
    verifiedPosition:
      "Wetu's official product and knowledge pages document a shared travel content library, itinerary builder, product manager, contact manager, co-branding and white-labelling, multiple digital and document outputs, and the offline-capable TravelKey client app. Its travel-trade content ecosystem is a material distinction.",
    alternativeFit:
      "Evaluate Wetu when rich itinerary presentation, supplier content, agent collaboration, co-branding and offline traveller delivery are core. Verify the exact package, content rights, translation and output availability.",
    tripOneFit:
      "Evaluate TripOne+ when the business needs an owned public website, structured offers and destinations, leads, packages and growth operations beyond itinerary distribution.",
    testScenario:
      "Create a multi-day itinerary from shared and private content, apply co-branding, publish the required outputs, open it offline in the traveller app and update a contact. Compare website discovery and enquiry workflows.",
    migration:
      "Preserve private content, images, products, contacts, templates, itineraries and traveller documents. Confirm content licensing and output access before replacing existing itinerary links.",
    questions: [
      "Which itinerary outputs and apps are available in the selected package?",
      "How do shared, supplier and private content rights work?",
      "Which contact, proposal and collaboration workflows are native?",
      "Can private content, contacts and itineraries be exported completely?",
    ],
    sources: [
      { label: "Wetu official platform", href: "https://wetu.com/" },
      {
        label: "Wetu official account guide",
        href: "https://knowledge.wetu.com/whats-included-in-my-wetu-account-and-where-should-i-start",
      },
      {
        label: "Wetu official output guide",
        href: "https://knowledge.wetu.com/what-output-options-does-wetu-give-me-for-my-itineraries",
      },
    ],
  }),
  "/compare/tripone-vs-lemax": reservationProfile({
    alternative: "Lemax",
    category: "tour operator and travel agency ERP platform",
    verifiedPosition:
      "Lemax's official feature pages document travel products and complex packages, supplier rates, inventory, sales, automated supplier ordering, reservations, rooming and movement lists, guides and vehicles, finance, accounting and reporting. That end-to-end operational scope is substantially deeper than a website builder.",
    alternativeFit:
      "Evaluate Lemax when a larger DMC or operator needs supplier contracting, reservations, operations, accounting and management reporting in one implementation. Confirm configuration, integration, migration and support commitments.",
    tripOneFit:
      "Evaluate TripOne+ when a smaller or growing operator prioritises an owned website, structured catalogue, request-led customer workflow and integrated acquisition without implementing a full travel ERP.",
    testScenario:
      "Create contracted products and rates, quote a package, request supplier availability, take customer payment, issue confirmations, assign a guide and vehicle, produce movement lists and reconcile financial reporting.",
    migration:
      "Map suppliers, contracts, products, inventory, reservations, passengers, operations, invoices, payments and ledgers. A finance-approved parallel run is essential before operational cutover.",
    questions: [
      "Which sales, operations and finance modules are required?",
      "How are implementation, customisation, integrations and support scoped?",
      "Can the platform represent our supplier and accounting rules?",
      "What full operational and financial exports are contractually available?",
    ],
    sources: [
      {
        label: "Lemax official travel product features",
        href: "https://lemax.net/travel-products/",
      },
      {
        label: "Lemax official operations features",
        href: "https://lemax.net/operations/",
      },
    ],
  }),
  "/compare/tripone-vs-safari-portal": reservationProfile({
    alternative: "Safari Portal",
    category: "travel itinerary, proposal and advisor workflow platform",
    verifiedPosition:
      "Safari Portal's official feature list documents reusable and preloaded travel content, customisable itineraries and lookbooks, guest portals, forms, live flight updates, CRM synchronisation, media, sales-pipeline visibility and task management. Its design-led itinerary workflow is especially relevant to safari and luxury travel advisors.",
    alternativeFit:
      "Evaluate Safari Portal when high-touch proposals, reusable destination and property content, guest documents and advisor task workflows are decisive. Verify payments, CRM synchronisation, content coverage and plan terms.",
    tripOneFit:
      "Evaluate TripOne+ when the business needs a persistent public website, broad operator product model, destination SEO, enquiries and marketing operations as the primary system.",
    testScenario:
      "Build a custom itinerary from preloaded and private content, share a lookbook, collect guest forms, update a flight, expose final documents and move the opportunity through pipeline tasks. Compare public-site ownership separately.",
    migration:
      "Preserve contacts, private content, media, proposals, itineraries, forms, documents, tasks and pipeline status. Test CRM synchronisation and export completeness with representative records.",
    questions: [
      "Which content, itinerary, guest-portal and CRM features are included?",
      "How are payments, invoicing and client documents handled?",
      "What controls exist for public websites, SEO and lead acquisition?",
      "Can contacts, private content and complete trips be exported?",
    ],
    sources: [
      {
        label: "Safari Portal official feature list",
        href: "https://www.safariportal.app/features",
      },
      {
        label: "Safari Portal official site",
        href: "https://www.safariportal.app/",
      },
    ],
  }),
  "/compare/tripone-vs-anyroad": reservationProfile({
    alternative: "AnyRoad",
    category: "enterprise experiential marketing and event platform",
    verifiedPosition:
      "AnyRoad's official platform pages document branded booking and ticketing, capacity and event operations, guest data capture, payments, surveys, feedback analysis, analytics, post-experience conversion and integrations with CRM, CDP, POS and other systems. It is aimed strongly at scaled brand experiences and events.",
    alternativeFit:
      "Evaluate AnyRoad when an enterprise brand needs event operations, consented first-party guest data, experiential analytics and cross-system activation across locations. Validate implementation, privacy, integrations and commercial scope.",
    tripOneFit:
      "Evaluate TripOne+ when a tour or travel business needs an owned tourism website, travel products and packages, destinations and practical customer-growth operations without enterprise experiential infrastructure.",
    testScenario:
      "Launch a branded recurring experience, accept online and walk-in guests, scan entry, capture consented feedback, inspect capacity and push a qualified record into the required CRM. Compare travel catalogue and SEO workflows separately.",
    migration:
      "Preserve experiences, schedules, tickets, guests, consent, payments, surveys, integrations and reporting definitions. Validate privacy obligations and active events before cutover.",
    questions: [
      "Which event, booking, feedback and analytics modules are included?",
      "How are guest consent, data ownership and regional privacy handled?",
      "Which CRM, POS, CDP and reporting integrations are proven?",
      "Can event, guest, consent and transaction data be exported completely?",
    ],
    sources: [
      {
        label: "AnyRoad official platform overview",
        href: "https://www.anyroad.com/platform/overview",
      },
      {
        label: "AnyRoad official integrations",
        href: "https://www.anyroad.com/platform/integrations",
      },
      {
        label: "AnyRoad official experience survey",
        href: "https://www.anyroad.com/platform/experience-survey",
      },
    ],
  }),
  "/compare/tripone-vs-sembark": reservationProfile({
    alternative: "Sembark",
    category: "travel sales, operations, accounting and reporting platform",
    verifiedPosition:
      "Sembark's official product and documentation pages describe travel CRM and sales, quotations, operations, accounting, taxation, reporting, employee workflows, transport management, tour-movement calendars, payment tracking and ledgers. Its back-office scope is materially broader than website publishing.",
    alternativeFit:
      "Evaluate Sembark when a travel agency, DMC or operator needs integrated quotations, service operations, payments, accounts and tax workflows suited to its operating market. Verify localisation, implementation and module scope.",
    tripOneFit:
      "Evaluate TripOne+ when the priority is a public tourism website, structured packages and services, customer context and marketing workflow, with accounting remaining in a dedicated system.",
    testScenario:
      "Capture a lead, price and approve an itinerary, assign operational services, track incoming and supplier payments, produce the movement calendar and reconcile a management report. Compare website publishing independently.",
    migration:
      "Map leads, customers, itineraries, suppliers, services, operations, employees, payments, tax records and ledgers. Finance and operations should approve reconciled opening balances before cutover.",
    questions: [
      "Which sales, operations, accounting and tax modules fit our entity?",
      "What implementation, migration and local support are included?",
      "How are payment, supplier and profitability records controlled?",
      "Can complete operational and accounting data be exported?",
    ],
    sources: [
      { label: "Sembark official platform", href: "https://sembark.com/" },
      {
        label: "Sembark official getting-started documentation",
        href: "https://sembark.com/travel-software/docs/getting-started/",
      },
    ],
  }),
  "/compare/tripone-vs-hubspot": reservationProfile({
    alternative: "HubSpot",
    category: "general CRM, sales, marketing, service and content platform",
    verifiedPosition:
      "HubSpot's official product pages document a shared CRM data foundation with contact and deal management, pipelines, sales engagement, forms, email, automation, reporting, marketing and service products. Packaging and limits vary significantly by product, edition, seat and contact volume.",
    alternativeFit:
      "Evaluate HubSpot when sophisticated general CRM, sales, service or marketing automation is central and the team can design the travel-specific data model and integrations. Price the complete required bundle, not only the entry CRM.",
    tripOneFit:
      "Evaluate TripOne+ when a smaller travel team wants tourism-native products, packages, destinations, website generation and lead context without first configuring a general CRM platform.",
    testScenario:
      "Capture a travel enquiry with product and source context, route it, progress a deal, automate an appropriate follow-up, report the qualified outcome and connect a booking handoff. Compare the work and cost of modelling travel entities.",
    migration:
      "Preserve contacts, companies, deals, activities, consent, lists, workflows, forms, marketing records and custom properties. Audit edition-dependent exports and integrations before changing the source of truth.",
    questions: [
      "Which Hubs, editions, seats and marketing-contact volumes are required?",
      "How will travel products, trips, travellers and bookings be modelled?",
      "Which workflows require paid operations or custom objects?",
      "Can all CRM, activity, consent and automation data be exported?",
    ],
    sources: [
      {
        label: "HubSpot official CRM",
        href: "https://www.hubspot.com/products/crm/ai-crm",
      },
      {
        label: "HubSpot official Sales Hub",
        href: "https://www.hubspot.com/products/sales",
      },
      {
        label: "HubSpot official product catalog",
        href: "https://legal.hubspot.com/hubspot-product-and-services-catalog",
      },
    ],
  }),
  "/compare/tripone-vs-zoho-crm": reservationProfile({
    alternative: "Zoho CRM",
    category: "general sales, marketing and customer relationship platform",
    verifiedPosition:
      "Zoho CRM's official feature pages document leads, contacts, deals, multiple pipelines, omnichannel communication, workflows, Blueprint process controls, journey orchestration, analytics, portals and extensive layout and module customisation. Travel-specific entities and fulfilment still require configuration or connected products.",
    alternativeFit:
      "Evaluate Zoho CRM when a team needs a configurable general CRM and is prepared to model travel enquiries, products and handoffs. Verify edition limits, the wider Zoho apps required and the implementation ownership.",
    tripOneFit:
      "Evaluate TripOne+ when the business wants tourism-aware website, product, package and destination structures connected to a simpler lead and customer workspace out of the box.",
    testScenario:
      "Capture a package enquiry, assign and qualify the lead, progress a deal through a custom travel pipeline, automate follow-up, create a customer view and report source-to-outcome evidence. Record every added app and customisation.",
    migration:
      "Preserve leads, contacts, accounts, deals, activities, consent, workflows, custom modules, layouts and reports. Test APIs and edition-level exports with representative relationships before migration.",
    questions: [
      "Which edition and additional Zoho applications are required?",
      "How will trips, travellers, packages and bookings be represented?",
      "Who will own Blueprint, workflow and custom-module maintenance?",
      "Can all related records, activities and automation definitions be exported?",
    ],
    sources: [
      {
        label: "Zoho CRM official feature suite",
        href: "https://www.zoho.com/crm/features.html",
      },
      {
        label: "Zoho CRM official customer-experience features",
        href: "https://www.zoho.com/crm/cx-platform/features/",
      },
      {
        label: "Zoho CRM official overview",
        href: "https://www.zoho.com/crm/what-is-zoho-crm.html",
      },
    ],
  }),
};

export function buildComparisonSections(
  page: SeoPageSpec,
): SeoContentSection[] | undefined {
  const profile = profiles[page.path];
  if (!profile) return undefined;

  return [
    {
      heading: `${page.title}: the decision in context`,
      paragraphs: [
        `${page.title} is a comparison between TripOne+ and ${profile.alternative}, a ${profile.category}. It is not a declaration that one platform wins for every business. The useful decision depends on the exact catalogue, booking mode, payment needs, team capability, migration constraints and total operating cost.`,
        profile.verifiedPosition,
        profile.tripOnePosition,
      ],
      sources: profile.sources,
    },
    {
      heading: `When ${profile.alternative} or TripOne+ may fit better`,
      paragraphs: [profile.chooseAlternative, profile.chooseTripOne],
      bullets: [
        "Write weighted requirements before demonstrations or trials.",
        "Verify each decisive feature in the current product and quoted plan.",
        "Include setup, maintenance, extensions, integrations and staff time.",
        "Do not use this commercially interested comparison as the only source.",
      ],
    },
    {
      heading: "Run the same practical trial in both products",
      paragraphs: [
        profile.testScenario,
        `Complete the trial with representative content and users, not a vendor's polished demonstration data. Record the number of systems touched, permissions required, customer-facing steps and manual corrections. This page was reviewed against the linked first-party sources on ${reviewedOn}; products, prices and packaging can change after that date.`,
      ],
    },
    {
      heading: "Buyer questions that expose the real operating cost",
      paragraphs: [
        "Ask each provider the same questions and request links to current documentation or contract language. A verbal roadmap is not the same as an available capability, and a feature is not useful if it cannot represent the business's actual product and exception paths.",
      ],
      bullets: profile.questions,
    },
    {
      heading: "Migration, reversibility and a defensible final decision",
      paragraphs: [
        profile.migration,
        `Score ${page.primaryKeyword} options across workflow fit, customer journey, data ownership, accessibility, performance, security responsibility, support and total cost. Keep the evidence and date behind every material score. The best choice is the system the team can operate accurately and leave safely—not the one with the longest undifferentiated feature list.`,
      ],
    },
  ];
}
