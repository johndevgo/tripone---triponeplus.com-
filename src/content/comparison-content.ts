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
