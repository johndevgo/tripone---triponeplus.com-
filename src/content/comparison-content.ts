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
