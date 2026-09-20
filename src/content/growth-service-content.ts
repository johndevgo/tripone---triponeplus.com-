import type { SeoContentSection } from "./seo-content";
import type { SeoPageSpec } from "./seo-catalog";

type GrowthServiceProfile = {
  thesis: string;
  commercialContext: string;
  diagnosis: string;
  operatingModel: string;
  travellerJourney: string;
  deliverables: string[];
  measurement: string;
  reporting: string;
  risks: string[];
  firstMonth: string;
  secondMonth: string;
  thirdMonth: string;
};

const profiles: Record<string, GrowthServiceProfile> = {
  "/services/seo": {
    thesis:
      "Travel SEO should help the right traveller discover a relevant tour, destination or package and move confidently towards a direct enquiry or booking. Rankings matter only when the landing page answers the trip-planning question, represents the offer accurately and creates a measurable commercial path.",
    commercialContext:
      "A tour operator competes across destination searches, activity searches, itinerary research, local map results and branded comparison queries. A useful travel SEO agency therefore works across technical foundations, product architecture, destination expertise, local visibility and conversion design instead of publishing disconnected articles around search volume alone.",
    diagnosis:
      "The initial audit combines Google Search Console, crawl data, indexation, page templates, internal links, local profiles and conversion tracking. It also reviews the actual catalogue: duplicated tours, thin destination pages, expired departures, inconsistent inclusions and URLs that compete for the same intent. Priorities are ranked by business value, implementation effort and the reliability of the underlying offer information.",
    operatingModel:
      "Keyword research is translated into a traveller-led information architecture. Commercial pages explain bookable experiences; destination hubs organise local expertise; planning guides answer pre-booking questions; and supporting resources earn useful links. Schema is added only where the visible page contains the corresponding facts. Search Console then shows how Google interprets the result, while lead and booking data reveal whether visibility is commercially useful.",
    travellerJourney:
      "The journey must continue after the click. A search visitor should immediately see location, duration, price context, suitability, availability expectations, trust information and the next action. On mobile, that action needs to remain clear without covering the content. For enquiry-led products, forms should retain the landing page and experience context so the sales team can respond without asking the traveller to repeat the trip they viewed.",
    deliverables: [
      "Technical crawl, indexation and canonical review",
      "Search-intent map for services, tours, packages and destinations",
      "Commercial-page briefs and on-page improvements",
      "Internal-linking plan based on real traveller decisions",
      "Local SEO review for operational locations and service areas",
      "Search Console, enquiry and direct-booking measurement plan",
    ],
    measurement:
      "SEO reporting separates impressions, clicks and average position from qualified enquiries, booking requests and confirmed direct revenue. Non-brand growth, destination visibility and commercial-page engagement are useful leading indicators, but they are not described as bookings unless the booking or CRM record supports that conclusion.",
    reporting:
      "The supplied Search Console evidence demonstrates the kind of account-level trend the team can inspect. It is presented with its visible period and metrics, without implying that another domain will reproduce the same curve. Monthly commentary explains what changed, what was shipped, where demand moved and which commercial pages deserve the next investment.",
    risks: [
      "Publishing many interchangeable destination pages that add no local value",
      "Changing URLs without a redirect and internal-link migration plan",
      "Treating impressions or AI-overview visibility as confirmed revenue",
      "Adding review, rating or availability schema unsupported by visible data",
    ],
    firstMonth:
      "In the first 30 days, establish crawl and Search Console baselines, repair critical indexing conflicts, map priority commercial queries and improve one representative offer journey from search result to enquiry.",
    secondMonth:
      "By day 60, strengthen destination and activity clusters, publish briefs grounded in real expertise, improve internal links and connect organic landing pages to qualified lead or booking events.",
    thirdMonth:
      "By day 90, compare non-brand discovery, commercial-page engagement and lead quality with the baseline. Expand the patterns that work, consolidate competing pages and create the next content cycle from observed customer questions.",
  },
  "/services/google-ads": {
    thesis:
      "Google Ads for tour operators works best when high-intent searches lead to a page that matches the destination, activity, date and booking decision. The objective is not cheaper clicks in isolation; it is controlled acquisition where spend can be related to qualified enquiries or confirmed bookings.",
    commercialContext:
      "Travel demand is seasonal, location-sensitive and easily distorted by broad informational searches. Search campaigns, Performance Max, brand protection and remarketing can each play a role, but they require different expectations. A travel PPC agency should distinguish a traveller researching a destination from someone looking for a specific experience, departure or package now.",
    diagnosis:
      "The audit reviews search terms, match types, geography, language, devices, schedules, negative keywords, conversion actions, landing pages and budget pacing. It checks whether phone calls, WhatsApp clicks, forms, external booking clicks and completed bookings are being counted separately. Duplicate or imported conversions are corrected before return on ad spend is discussed.",
    operatingModel:
      "Campaign structure follows the commercial catalogue. Closely related experiences can share themes, while different destinations, margins or booking modes need their own controls. Ads make a specific promise and the landing page continues it with real product detail. Budgets are allocated by demand, capacity and business priority rather than being spread evenly across every possible tour.",
    travellerJourney:
      "A paid-search visitor should not land on a generic homepage and hunt for the advertised experience. The page should repeat the relevant destination and offer, answer price and suitability questions, show trust signals, and offer the right booking or enquiry action. Call and WhatsApp options need hours and ownership so paid leads are not lost after the click.",
    deliverables: [
      "Account, search-term and conversion-tracking audit",
      "Campaign architecture aligned with destinations and products",
      "Negative-keyword and location-targeting controls",
      "Ad copy and landing-page message alignment",
      "Budget pacing, seasonality and capacity rules",
      "Qualified-lead, booking and revenue reporting framework",
    ],
    measurement:
      "Campaign reporting includes spend, impressions, click-through rate, cost per click and platform conversions, then adds qualified-lead rate, booking rate and revenue where the business can provide those records. ROAS is only shown when revenue attribution is sufficiently reliable; otherwise the report states the limitation.",
    reporting:
      "The anonymised account screenshots supplied on this page show hands-on campaign delivery across different markets. They are not travel-industry forecasts. Their value is demonstrating that spend, conversion definitions and account structure can be inspected together rather than reduced to one impressive number.",
    risks: [
      "Counting page views or duplicate tags as conversions",
      "Sending every keyword to the homepage",
      "Allowing broad queries to consume destination-specific budgets",
      "Scaling campaigns while availability or lead response is unreliable",
    ],
    firstMonth:
      "During the first month, validate tracking, remove waste, protect priority campaigns and build one complete high-intent journey with an aligned landing page and accountable conversion action.",
    secondMonth:
      "By day 60, test search themes and creative deliberately, improve negative keywords, connect lead quality feedback and adjust budgets around real seasonality and product capacity.",
    thirdMonth:
      "By day 90, evaluate acquisition cost against qualified opportunities and confirmed bookings where available. Scale only the combinations of query, offer and landing page that remain commercially defensible.",
  },
  "/services/meta-ads": {
    thesis:
      "Meta Ads for travel businesses create demand by making an experience easy to imagine and easy to act on. Strong campaigns combine destination-rich creative, a clear offer, audience learning, retargeting and reliable conversion tracking rather than relying on a single boosted post.",
    commercialContext:
      "Facebook and Instagram reach travellers before and during active trip planning. Reels may introduce the experience, carousels can explain an itinerary, Stories can support urgency around genuine departures, and retargeting can bring back visitors who viewed a package. Each placement needs a role in the journey and an outcome appropriate to the visitor's level of intent.",
    diagnosis:
      "The audit reviews Business Manager access, pixel and Conversions API coverage, account events, audiences, exclusions, placements, frequency, creative history and landing pages. It also checks how enquiries are handled after a form, message or WhatsApp click, because an advertising result is incomplete when the sales team cannot identify the campaign or offer behind it.",
    operatingModel:
      "Campaigns are organised around the traveller problem and the experience promise. Prospecting introduces differentiated reasons to care; consideration creative answers practical questions; retargeting restores context without following people indefinitely. Creative testing changes one meaningful variable at a time—hook, format, angle, proof or offer—so the team can understand what improved response.",
    travellerJourney:
      "The post-click page should retain the destination, visual tone and promise of the ad. It needs real itinerary or experience details, mobile-readable reassurance and one primary action. Instant forms can reduce friction, but their qualification questions and response workflow must prevent large volumes of low-context leads from overwhelming the team.",
    deliverables: [
      "Meta account, pixel, event and audience audit",
      "Prospecting, consideration and retargeting structure",
      "Reels, Stories, carousel and static creative briefs",
      "Landing-page and lead-form alignment",
      "Frequency, exclusion and creative-refresh rules",
      "Campaign-to-lead and booking feedback loop",
    ],
    measurement:
      "Reach, video completion, click-through rate and platform conversions explain delivery, while qualified conversations, enquiries, deposits and confirmed bookings explain commercial value. View-through attribution is reported separately from click-through outcomes so a campaign is not credited beyond the evidence available.",
    reporting:
      "The supplied agency credentials and anonymised portfolio material demonstrate relevant delivery experience. They do not imply guaranteed reach, cost or revenue. Reporting includes creative-level findings so the business learns which destinations, traveller concerns and formats deserve continued production.",
    risks: [
      "Judging campaigns by likes without a defined business action",
      "Using beautiful footage that never explains the offer",
      "Retargeting without exclusions, frequency controls or consent review",
      "Routing every enquiry into an unmanaged inbox",
    ],
    firstMonth:
      "In the first 30 days, repair access and event tracking, define the traveller segments, build a focused creative matrix and launch one complete journey with clear lead ownership.",
    secondMonth:
      "By day 60, refresh weak creative, compare message and format combinations, refine exclusions and use lead-quality feedback to improve both audiences and forms.",
    thirdMonth:
      "By day 90, decide where Meta contributes discovery, assisted conversion or direct response. Scale proven offer-and-creative combinations while preserving a production cadence that prevents fatigue.",
  },
  "/services/tiktok-ads": {
    thesis:
      "TikTok ads for travel businesses should feel native to the way travellers discover places: immediate, visual, specific and human. Performance comes from a repeatable short-form creative system, not from turning a polished television advert vertical and hoping the algorithm finds buyers.",
    commercialContext:
      "Tours, attractions and activities often have strong raw material for TikTok: movement, transformation, local perspective, guides, reactions and practical trip advice. Spark Ads can extend credible organic posts, creator partnerships can add perspective, and paid campaigns can test which story earns attention from a relevant market.",
    diagnosis:
      "The audit reviews account access, pixel events, landing speed, historic videos, hooks, retention curves, comments, creator rights and the path from interest to enquiry. It identifies whether the business can produce new variations consistently, because a campaign that depends on one successful clip is fragile.",
    operatingModel:
      "A creative pipeline moves from traveller insight to hook, shot list, edit, caption, rights approval, launch and learning. UGC-style work should still be accurate and properly authorised. Spark Ads preserve social context where appropriate, while direct-response variants make the location, experience and next step clear before the video ends.",
    travellerJourney:
      "TikTok traffic is heavily mobile and may have less prior intent than search traffic. The landing experience must load quickly, continue the visual story and answer the most important practical questions without demanding a long reading session. A saveable itinerary, concise enquiry or focused experience page often works better than a generic corporate homepage.",
    deliverables: [
      "TikTok account, pixel and landing-journey audit",
      "Traveller insight and short-form creative matrix",
      "Hooks, scripts, shot lists and editing direction",
      "Spark Ads, creator usage and approval workflow",
      "Creative testing and fatigue-monitoring cadence",
      "Qualified-action and post-click measurement plan",
    ],
    measurement:
      "Thumb-stop rate, watch time, completion, click-through and cost per landing-page view help diagnose creative delivery. Qualified enquiries and bookings remain the commercial outcome. The team also reviews comments and saved content for customer language that can improve future videos and landing pages.",
    reporting:
      "The portfolio imagery on this page represents TikTok advertising and cross-channel creative capability. It is not presented as a promised TikTok result. Every report distinguishes what the platform attributes from what the website, CRM or booking record can independently confirm.",
    risks: [
      "Using trends that obscure the destination or offer",
      "Publishing creator footage without usage rights",
      "Sending mobile traffic to a slow, desktop-first page",
      "Scaling spend without enough creative variations",
    ],
    firstMonth:
      "The first month establishes tracking, identifies repeatable content angles, prepares a rights-safe creative batch and tests one destination or experience with a focused mobile landing path.",
    secondMonth:
      "By day 60, use retention and enquiry evidence to refine hooks, pacing, proof and calls to action. Introduce Spark Ads or creator work only where the source content and permissions are suitable.",
    thirdMonth:
      "By day 90, document a sustainable production rhythm, the formats associated with qualified behaviour and the situations where TikTok should assist rather than own the final booking decision.",
  },
  "/services/social-media-marketing": {
    thesis:
      "Social media marketing for a travel agency should build recognisable demand and traveller confidence, not merely fill a calendar. Instagram, TikTok and Facebook work best when each channel has a defined audience role and the content reflects real destinations, products, people and customer questions.",
    commercialContext:
      "A travel brand needs inspiration, practical planning help, social proof, offer explanation and responsive community management. The balance changes by season and product. A trekking company may need preparation content and guide expertise; a day-tour operator may benefit from same-week availability and guest perspective; an agency may need destination comparisons and package education.",
    diagnosis:
      "The review examines profile clarity, content themes, publishing consistency, visual identity, response times, saves, shares, website traffic and lead handling. It identifies which posts contribute to meaningful discovery or consideration and which recurring formats consume production time without helping a traveller decide.",
    operatingModel:
      "The content calendar starts with commercial priorities and customer questions, then assigns the right format. Reels and short video can create discovery, carousels can explain, Stories can support active decisions, and community replies can remove objections. One source shoot should be planned to produce multiple useful assets without making every platform identical.",
    travellerJourney:
      "Profiles and posts need clear routes into destination pages, experiences, packages, WhatsApp or an enquiry form. Link destinations should match the post rather than sending every visitor to the homepage. Community managers also need escalation rules for availability, complaints, emergencies and private customer information.",
    deliverables: [
      "Channel, audience and content-performance audit",
      "Travel-specific content pillars and editorial calendar",
      "Reels, carousel, Story and community playbooks",
      "Repurposing plan for one shoot across channels",
      "Profile, link and landing-page improvements",
      "Publishing, response and escalation workflow",
    ],
    measurement:
      "Reach and follower movement indicate distribution, while saves, meaningful comments, profile actions, website visits and qualified conversations show stronger intent. Where tracking allows, campaigns and posts are connected to enquiries or bookings, but organic influence is not overstated when the evidence is only directional.",
    reporting:
      "The supplied creative and platform assets show the breadth of agency capability behind the service. Monthly review focuses on useful patterns—topics, formats, destinations and calls to action—rather than presenting a collage of the largest vanity numbers.",
    risks: [
      "Posting daily without a traveller or commercial purpose",
      "Repeating one generic visual style across every destination",
      "Ignoring questions and complaints after publishing",
      "Using guest or creator material without permission",
    ],
    firstMonth:
      "In month one, clarify each profile, define the content pillars, establish response ownership and produce a realistic four-week calendar from available destination and product material.",
    secondMonth:
      "By day 60, compare formats by meaningful behaviour, strengthen the routes from content to relevant pages, and build a repeatable capture and repurposing workflow.",
    thirdMonth:
      "By day 90, align the next quarter with seasonality, launches and observed traveller questions. Continue only the formats the team can produce accurately and consistently.",
  },
  "/services/content-marketing": {
    thesis:
      "Travel content marketing should become a durable library that helps travellers choose and helps the business sell. Destination guides, itinerary advice, comparison content, video and commercial pages need one strategy so useful research naturally leads towards relevant experiences and packages.",
    commercialContext:
      "Travel purchases involve uncertainty about season, safety, transport, suitability, cost, culture and logistics. Operators already answer many of these questions in calls and messages. A travel content agency turns that expertise into maintained assets while preserving the distinction between advice, inspiration and a bookable offer.",
    diagnosis:
      "The audit inventories existing pages, videos, brochures, FAQs, sales conversations and destination knowledge. It maps each item to traveller intent, commercial relevance, freshness and ownership. Thin duplicates, orphaned posts and content that no longer matches the actual product are consolidated or retired before the publishing calendar expands.",
    operatingModel:
      "Topic planning begins with the customer journey and the offer catalogue. Destination hubs provide context; service and package pages handle commercial decisions; guides answer narrower questions; and email or social distribution extends the useful life of each asset. Briefs specify the expert input, first-hand evidence, internal links, visuals and conversion path required before production.",
    travellerJourney:
      "Every guide should help the reader take the next informed step. A seasonal article can link to suitable departures, a packing guide can route to the relevant trek, and a destination comparison can expose packages without pretending the editorial answer is universal. Calls to action match the stage: explore, compare, save, enquire or book.",
    deliverables: [
      "Content inventory, consolidation and gap analysis",
      "Traveller-question and commercial topic architecture",
      "Destination, guide, comparison and service-page briefs",
      "Expert interview and first-hand evidence workflow",
      "Editorial calendar with ownership and refresh dates",
      "Internal-linking, distribution and conversion plan",
    ],
    measurement:
      "Reporting follows each asset from discovery to useful engagement and qualified action. Search impressions, entrances, video retention and newsletter clicks are leading indicators. Assisted enquiries, package views and bookings provide stronger evidence when tracking and the sales workflow preserve the source.",
    reporting:
      "The supplied Search Console and content-strategy material illustrates how planning and observed search performance can be reviewed together. No screenshot is treated as a universal content forecast; the programme learns from the business's own catalogue, audience and publishing capacity.",
    risks: [
      "Publishing generic destination summaries without first-hand value",
      "Creating articles that never connect to a relevant offer",
      "Leaving seasonal, price or policy details without review dates",
      "Measuring output volume instead of traveller and commercial usefulness",
    ],
    firstMonth:
      "The first month establishes the inventory, removes obvious duplication, maps the priority journey and produces one evidence-rich commercial brief plus its supporting guide.",
    secondMonth:
      "By day 60, publish the first connected cluster, improve distribution and internal links, and capture recurring customer questions for the next cycle.",
    thirdMonth:
      "By day 90, compare discovery and qualified-action signals, refresh weak assets and commit to a cadence the internal experts and production team can sustain.",
  },
  "/services/creative-design": {
    thesis:
      "Travel marketing design has to make an experience desirable without hiding the practical decision. Strong creative connects brand, destination, offer and action across websites, advertisements, social media and sales materials, while remaining recognisable as the same travel business.",
    commercialContext:
      "Travel is visually competitive, but novelty alone does not create trust. A safari, wellness retreat, city tour and yacht charter should not all look interchangeable. The creative system must express the distinctive atmosphere and audience while keeping core information—location, itinerary, suitability, inclusions and next step—easy to understand.",
    diagnosis:
      "The review covers positioning, brand assets, photography, video, typography, colour, ad variations, landing pages and production constraints. It identifies where inconsistent files, missing formats, weak hierarchy or unusable source material slow campaigns and where beautiful work fails to communicate the offer.",
    operatingModel:
      "Creative direction starts with the commercial brief and traveller insight. A modular system then produces hero imagery, campaign concepts, ads, social assets, landing-page elements and sales collateral without copying the same composition everywhere. File naming, approvals, rights, source files and accessible alternatives are part of delivery rather than afterthoughts.",
    travellerJourney:
      "The visual promise in an advert must continue on the landing page, and the page must still function when an image loads slowly or a user relies on text. Contrast, readable type, meaningful alternative text and restrained motion protect both accessibility and conversion. Real product photography should be prioritised over generic imagery when it materially affects expectations.",
    deliverables: [
      "Brand and campaign-asset audit",
      "Creative direction tied to audience and offer",
      "Ad, social, website and landing-page asset system",
      "Photography, video and short-form content briefs",
      "Responsive, accessible format adaptations",
      "Rights, approval and source-file organisation",
    ],
    measurement:
      "Creative performance is evaluated in context. Attention and click-through can diagnose an ad, but landing engagement and qualified action determine whether the promise attracted the right person. Brand work also needs qualitative checks for recognition, clarity and consistency rather than an invented direct-revenue claim.",
    reporting:
      "The supplied brand, agency and advertising visuals demonstrate the range of design work available. They are presented as portfolio evidence. Project outcomes are reviewed against the approved brief, the real placement and observed customer behaviour.",
    risks: [
      "Using generic stock imagery that misrepresents the experience",
      "Designing one desktop composition without responsive adaptations",
      "Changing visual style on every campaign until the brand is unrecognisable",
      "Ignoring usage rights, source files and accessible alternatives",
    ],
    firstMonth:
      "Month one aligns the brief, audits usable assets, chooses a distinctive creative direction and delivers the first responsive campaign or page system.",
    secondMonth:
      "By day 60, expand proven components across placements, capture missing source material and compare creative variations through meaningful campaign and page behaviour.",
    thirdMonth:
      "By day 90, document the reusable system, archive rejected or expired assets and plan the next seasonal production around commercial priorities rather than last-minute requests.",
  },
  "/services/conversion-rate-optimisation": {
    thesis:
      "Travel website CRO removes uncertainty and friction between a visit and a qualified enquiry or booking. It is not a collection of colour changes. The work combines traveller research, analytics, product clarity, mobile usability and the operational reality that follows a submitted form or booking request.",
    commercialContext:
      "Travel decisions can be complex: dates, group size, pickup, cancellation, suitability, availability and payment expectations all influence action. A tour booking conversion optimisation programme identifies which questions block progress, which information belongs earlier and which handoffs fail after the visitor commits.",
    diagnosis:
      "The audit reviews traffic sources, landing pages, product templates, mobile recordings or session evidence where consent allows, form analytics, errors, speed, accessibility and lead quality. It also interviews the people answering enquiries. A drop in form completion may reflect the form, but it can also signal unclear price, unavailable dates or an offer that attracted the wrong audience.",
    operatingModel:
      "The team forms a hypothesis from evidence, prioritises it by likely impact and effort, then changes one complete journey. Improvements may involve information hierarchy, comparison, social proof, CTA language, booking mode, form fields, reassurance or performance. Experiments are used when volume supports interpretation; smaller operators can combine before-and-after evidence with customer interviews.",
    travellerJourney:
      "Mobile comes first because many travellers research and enquire on a phone. Important details and actions remain visible without intrusive overlays. Forms use clear labels, useful validation and sensible input modes. Confirmation explains what happens next, and the lead record retains the page, product and campaign context needed for a relevant response.",
    deliverables: [
      "Analytics, journey and accessibility audit",
      "Traveller-objection and customer-question review",
      "Prioritised conversion research backlog",
      "Product-page, CTA and form improvements",
      "Mobile performance and booking-path review",
      "Experiment or evidence-based evaluation plan",
    ],
    measurement:
      "Conversion rate is segmented by meaningful source, device, landing page and action. A higher rate is not automatically better if lead quality falls. Reporting therefore follows form starts, completions, qualified enquiries, response time, booking progression and revenue where reliable records exist.",
    reporting:
      "The supplied CRO, user-experience and campaign screenshots illustrate the disciplines connected in the engagement. They do not establish a benchmark for every travel site. Baselines and targets are set from the operator's own traffic, product and sales process.",
    risks: [
      "Copying a competitor pattern without diagnosing the local problem",
      "Removing qualification fields and overwhelming the sales team",
      "Calling an underpowered A/B test conclusive",
      "Optimising the click while ignoring the post-enquiry experience",
    ],
    firstMonth:
      "The first 30 days establish measurement, identify the highest-friction representative journey and ship foundational accessibility, clarity and tracking repairs.",
    secondMonth:
      "By day 60, implement the highest-value hypothesis, connect lead-quality feedback and compare mobile behaviour with the baseline.",
    thirdMonth:
      "By day 90, retain improvements supported by evidence, reverse changes that created poorer-fit actions and expand the working pattern across related products or campaigns.",
  },
  "/services/website-growth": {
    thesis:
      "Travel website growth treats the website as an acquisition and operating asset rather than a brochure. Search visibility, content, performance, user experience, conversion paths and lead handling are improved together so more useful demand can become direct commercial opportunity.",
    commercialContext:
      "A redesign can look better while preserving the same weak product information, slow pages, unclear calls to action and broken tracking. Website growth begins with the existing evidence and the catalogue behind the interface. It prioritises the changes that make tours, packages and destinations easier to discover, compare and act on.",
    diagnosis:
      "The audit spans crawlability, Core Web Vitals, templates, content quality, navigation, internal search, mobile layout, accessibility, analytics, forms and external booking handoffs. It reviews how editors maintain the site and whether the CMS or builder creates duplicated work. Technical findings are connected to affected pages and customer decisions rather than delivered as an unranked issue dump.",
    operatingModel:
      "Work is organised into foundations, commercial journeys and growth experiments. Foundations protect indexing, speed, accessibility and tracking. Journey work improves representative product, destination and package pages. Experiments then test messaging, proof or calls to action where the site has enough reliable evidence. Shared components keep improvements consistent without making every offer identical.",
    travellerJourney:
      "A visitor should move from discovery to relevant inventory, understand the practical offer, assess trust and choose the right next step. Navigation and taxonomy support different starting points: destination, activity, travel style or package category. The journey remains coherent across mobile, desktop, enquiry forms, WhatsApp and external booking providers.",
    deliverables: [
      "Technical, content, UX and conversion baseline",
      "Prioritised website growth roadmap",
      "Commercial template and navigation improvements",
      "Performance and accessibility repairs",
      "SEO and content-cluster implementation",
      "Lead, booking and external-handoff measurement",
    ],
    measurement:
      "The measurement model connects organic and paid acquisition to engagement with commercial pages, qualified actions and bookings where available. Speed and accessibility are monitored as experience safeguards, not treated as vanity scores. Each release records the pages changed and the evidence expected to move.",
    reporting:
      "The supplied UX, search-performance and agency credentials show the disciplines involved in this cross-functional service. They are examples of delivery evidence, not promises that every site will produce the same traffic or conversion result.",
    risks: [
      "Launching a visual redesign without repairing information and measurement",
      "Changing high-value URLs without migration controls",
      "Adding heavy media that damages mobile performance",
      "Improving lead volume without an accountable response workflow",
    ],
    firstMonth:
      "Month one establishes the cross-discipline baseline, repairs critical tracking and indexing problems, and improves one high-value commercial journey.",
    secondMonth:
      "By day 60, extend the working design and content system, strengthen taxonomy and internal links, and address the largest mobile performance or accessibility constraints.",
    thirdMonth:
      "By day 90, evaluate qualified behaviour and maintainability, then sequence the next quarter around the strongest remaining opportunities rather than a cosmetic wish list.",
  },
  "/services/analytics-tracking": {
    thesis:
      "Travel marketing analytics should answer which journeys create qualified enquiries, bookings and customer value—not merely which channel generated the most events. Reliable measurement begins with clear business definitions, consent-aware collection and a tested path from campaign parameters to website actions and operational records.",
    commercialContext:
      "A traveller may discover a destination on social media, return through Google, message on WhatsApp and book through an external platform. GA4, Google Tag Manager, Meta Pixel, TikTok Pixel and dashboards each observe part of that journey. A tourism analytics agency must state what each source can and cannot prove instead of forcing every interaction into one perfect attribution story.",
    diagnosis:
      "The audit inventories tags, containers, properties, pixels, consent behavior, referral exclusions, cross-domain flows, event names, duplicate conversions, UTMs and dashboard sources. It tests events in the browser and compares them with forms, leads, external booking clicks and available booking records. Personally identifiable information is kept out of analytics payloads.",
    operatingModel:
      "A measurement plan defines the business question, event, trigger, parameters, owner and validation method. Naming stays consistent across the website and campaigns. Google Tag Manager provides controlled deployment where appropriate; GA4 supports behavioral analysis; advertising pixels support platform optimisation; and first-party lead or booking records provide the strongest available commercial confirmation.",
    travellerJourney:
      "Tracking should be invisible to usability and respectful of consent. Forms and booking actions must still work when optional marketing scripts are declined or fail. Cross-domain handoffs are documented so users are not counted as a new source merely because they moved to an approved reservation provider.",
    deliverables: [
      "GA4, Tag Manager, pixel and consent audit",
      "Business-question and event measurement plan",
      "Form, phone, WhatsApp and booking-action tracking",
      "Campaign UTM and naming governance",
      "Cross-domain and referral configuration",
      "Tested dashboard with definitions and known limitations",
    ],
    measurement:
      "The system distinguishes diagnostic events from conversions. Page views, scrolls and button clicks help explain behaviour; qualified enquiries, booking requests, deposits and confirmed revenue represent progressively stronger outcomes. Attribution models are presented as methods of assigning credit, not objective records of every influence.",
    reporting:
      "The supplied analytics, Search Console and Google Ads screenshots demonstrate the kinds of source data that can feed a review. Dashboards retain links to definitions and source systems so a stakeholder can understand where a number came from and whether it is complete.",
    risks: [
      "Marking every interaction as a conversion",
      "Firing duplicate tags through code and Tag Manager",
      "Sending personal form values into analytics platforms",
      "Presenting modeled attribution as confirmed booking revenue",
    ],
    firstMonth:
      "The first month documents the measurement plan, removes duplicate or unsafe collection, validates priority events and establishes one trusted acquisition-to-lead view.",
    secondMonth:
      "By day 60, connect campaign naming, cross-domain journeys and operational feedback, then build dashboards around decisions rather than every available metric.",
    thirdMonth:
      "By day 90, reconcile the dashboard with lead and booking samples, document remaining blind spots and establish a monthly quality-control routine for tags, consent and definitions.",
  },
};

export function buildGrowthServiceSections(
  page: SeoPageSpec,
): SeoContentSection[] | undefined {
  const profile = profiles[page.path];
  if (!profile) return undefined;
  return [
    {
      heading: `A commercial approach to ${page.primaryKeyword}`,
      paragraphs: [
        profile.thesis,
        profile.commercialContext,
        `TripOne+ approaches ${page.keywordCluster.toLowerCase()} as part of the complete traveller and operator journey. The work connects ${naturalList(page.entities)} to the offer, the customer decision and the team's ability to respond. That keeps ${page.primaryKeyword} focused on commercial usefulness instead of activity for its own sake.`,
      ],
    },
    {
      heading: `How the ${page.keywordCluster.toLowerCase()} engagement works`,
      paragraphs: [
        profile.diagnosis,
        profile.operatingModel,
        profile.travellerJourney,
      ],
      bullets: profile.deliverables,
    },
    {
      heading: "Measurement and evidence",
      paragraphs: [profile.measurement, profile.reporting],
    },
    {
      heading: "Common risks to control",
      paragraphs: [
        `The strongest programme protects accuracy, customer trust and operational capacity while it grows demand. These are the failure modes reviewed most closely for ${page.title.toLowerCase()}:`,
      ],
      bullets: profile.risks,
    },
    {
      heading: "A practical 30, 60 and 90-day roadmap",
      paragraphs: [profile.firstMonth, profile.secondMonth, profile.thirdMonth],
    },
  ];
}

function naturalList(values: readonly string[]) {
  if (values.length === 1) return values[0]!;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}
