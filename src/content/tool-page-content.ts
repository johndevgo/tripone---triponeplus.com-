import type { SeoPageSpec } from "./seo-catalog";
import type { SeoContentSection } from "./seo-content";

type ToolProfile = {
  purpose: string;
  inputs: string[];
  formula: string;
  interpretation: string;
  decisions: string;
  limitations: string;
  mistakes: string[];
  nextStep: string;
};

const profiles: Record<string, ToolProfile> = {
  "/tools/tour-pricing-calculator": {
    purpose:
      "The tour pricing calculator estimates a per-guest selling price from total operating cost, paying guests, target margin and distribution commission. It is a planning check for one scenario, not a substitute for a dated cost worksheet or commercial approval.",
    inputs: [
      "Total fixed and variable operating cost for the scenario",
      "Expected paying guests rather than theoretical maximum capacity",
      "Target profit margin expressed as a share of selling revenue",
      "Distribution commission deducted from the selling price",
    ],
    formula:
      "The calculator divides total cost by paying guests and then by one minus the margin rate and commission rate. This is different from adding both percentages to cost: margin and commission are treated as shares of final selling revenue.",
    interpretation:
      "Use the result as an initial price per guest and compare it with direct and distributed scenarios. A feasible price still needs taxes, payment costs, contingencies, complimentary places, currency exposure and the value of the actual offer.",
    decisions:
      "Test conservative, expected and full-capacity guest counts. If the marketable price is below the calculated requirement, change cost, capacity, channel mix, inclusions or product design instead of hiding the gap.",
    limitations:
      "The browser calculation uses the figures entered and assumes percentages apply to the same selling base. It does not retrieve supplier rates, tax rules, live inventory, exchange rates or competitor prices.",
    mistakes: [
      "Using maximum capacity as the normal guest count",
      "Confusing markup on cost with margin on revenue",
      "Omitting commission from distributed bookings",
      "Publishing the result without dated cost approval",
    ],
    nextStep:
      "Move the approved scenario into the tour pricing worksheet, connect it to a product and rate period, then compare forecast contribution with actual completed departures.",
  },
  "/tools/tour-package-pricing-calculator": {
    purpose:
      "The tour package pricing calculator combines accommodation, transport and activity or guide costs, applies a markup and shows total and per-traveller prices. It makes the basic package arithmetic visible before a detailed supplier and currency model.",
    inputs: [
      "Accommodation total for the package and selected occupancy",
      "Transport total including relevant transfers",
      "Activities, guides and other included service costs",
      "Paying travellers and the chosen markup on combined cost",
    ],
    formula:
      "Component costs are added, multiplied by one plus the markup rate and divided by paying travellers for the per-person result. A markup percentage is calculated on cost, so it does not equal the same percentage as gross margin.",
    interpretation:
      "Compare room and group configurations because package economics can change sharply with occupancy. Review which components are per booking, per room, per vehicle or per person before entering totals.",
    decisions:
      "Use separate scenarios for different seasons, room types, group sizes and channels. Keep optional upgrades outside the base cost until their inclusion and supplier terms are clear.",
    limitations:
      "The tool does not calculate taxes, child pricing, single supplements, free places, currency conversion, cancellation exposure or channel commission. Add those in the controlled pricing worksheet.",
    mistakes: [
      "Dividing room or vehicle costs using the wrong occupancy",
      "Applying one markup to components with different risk",
      "Mixing supplier currencies without a dated rate",
      "Calling an estimated package price confirmed inventory",
    ],
    nextStep:
      "Document each component and supplier term, approve the package version and connect the published price to dates, inclusions and a clear availability process.",
  },
  "/tools/tour-profit-margin-calculator": {
    purpose:
      "The tour profit margin calculator shows gross profit and gross margin from revenue and direct operating cost. It helps distinguish money retained after direct delivery cost from total booking value.",
    inputs: [
      "Recognised revenue for the same product and period",
      "Direct costs required to deliver that revenue",
      "Consistent currency and tax treatment",
      "A clear rule for commissions, refunds and complimentary places",
    ],
    formula:
      "Gross profit equals revenue minus direct cost. Gross margin equals gross profit divided by revenue and multiplied by 100. The denominator is revenue, which is why margin differs from markup.",
    interpretation:
      "A positive gross margin does not prove net profitability because salaries, rent, software, insurance, marketing and other overhead may remain. Compare like-for-like products and periods instead of combining incomplete records.",
    decisions:
      "Use the result to examine product mix, channel cost, capacity and pricing. Investigate why actual margin differs from the approved plan before changing the customer price.",
    limitations:
      "The calculator does not define accounting recognition or allocate overhead. Finance should determine which revenue and cost figures belong in the decision.",
    mistakes: [
      "Using gross booking value before refunds and pass-through amounts",
      "Excluding distribution or payment costs inconsistently",
      "Comparing products with different cost definitions",
      "Presenting gross margin as final net profit",
    ],
    nextStep:
      "Add the approved definition to the KPI dictionary and reconcile calculator inputs with booking and finance records each reporting period.",
  },
  "/tools/tour-markup-calculator": {
    purpose:
      "The tour markup calculator converts a cost and markup rate into a proposed selling price, gross profit and equivalent margin. It is useful for checking language that teams often use interchangeably by mistake.",
    inputs: [
      "The complete cost base for one comparable unit",
      "Markup percentage applied to that cost",
      "Consistent currency and tax convention",
      "Any channel costs that must be inside the proposed price",
    ],
    formula:
      "Selling price equals cost multiplied by one plus markup. Gross profit is price minus cost. Equivalent margin is gross profit divided by selling price, so a 30 percent markup produces a lower than 30 percent margin.",
    interpretation:
      "Use the equivalent margin to compare a markup-led supplier or product rule with margin-led management targets. Make sure both calculations include the same costs.",
    decisions:
      "Test how changes in supplier cost or required margin alter the selling price. If the result is not marketable, review product design and channel economics rather than silently changing definitions.",
    limitations:
      "The calculator does not account for fixed-versus-variable behaviour, occupancy, tiered commission, tax, currency, refunds or overhead unless those are already represented in cost.",
    mistakes: [
      "Calling markup and margin the same percentage",
      "Applying markup before all required costs are included",
      "Comparing tax-inclusive and tax-exclusive prices",
      "Using an old cost base after supplier terms change",
    ],
    nextStep:
      "Record whether every price rule is markup- or margin-based in the pricing worksheet and require approval when that convention changes.",
  },
  "/tools/tour-break-even-calculator": {
    purpose:
      "The tour break-even calculator estimates how many paying guests are needed for per-guest contribution to cover fixed departure costs. It supports a departure decision but does not replace safety, minimum-group or cash-flow rules.",
    inputs: [
      "Fixed costs incurred for running the departure",
      "Selling price collected per paying guest",
      "Variable delivery cost added per guest",
      "A consistent view of channel and payment costs",
    ],
    formula:
      "Contribution per guest equals price minus variable cost. Break-even guests equal fixed cost divided by contribution and are rounded up because a partial guest cannot cover the remaining cost.",
    interpretation:
      "Compare break-even with safe capacity, expected occupancy and the contractual minimum group. A result above capacity indicates that the current price and cost structure cannot break even.",
    decisions:
      "Set a dated go, review or cancel checkpoint and define who can approve an exception. Model direct and commission-bearing sales separately when contribution differs materially.",
    limitations:
      "The simple calculation assumes stable price and variable cost per guest. It does not model tiered vehicles, guides, rooms, taxes, deposits, cancellations or opportunity cost.",
    mistakes: [
      "Putting per-guest cost into the fixed-cost field",
      "Ignoring commission when it reduces contribution",
      "Treating break-even as a safe operating minimum",
      "Waiting until departure day to make the threshold decision",
    ],
    nextStep:
      "Connect the threshold to availability and departure review, then compare forecast and actual contribution after completion.",
  },
  "/tools/ota-commission-calculator": {
    purpose:
      "The OTA commission calculator estimates commission deducted from gross booking revenue and the revenue remaining after that percentage. It makes one distribution cost visible without implying that the remainder is profit.",
    inputs: [
      "Gross booking revenue subject to commission",
      "Contracted commission percentage for the product or campaign",
      "Treatment of taxes, fees, promotions and refunds",
      "The relevant currency and booking period",
    ],
    formula:
      "Estimated commission equals gross booking revenue multiplied by the commission rate. Revenue after commission equals gross revenue minus that amount.",
    interpretation:
      "Compare the net result with direct acquisition and service costs, the demand the channel creates and its cancellation or payment terms. Distribution value cannot be judged from commission alone.",
    decisions:
      "Model each important channel separately and test the effect on product contribution. Use the evidence to set inventory, rate and promotional rules rather than removing a productive channel only because its headline percentage is high.",
    limitations:
      "The result excludes payment fees, taxes, sponsored visibility, discounts, refunds, foreign exchange and operational work unless they are incorporated elsewhere.",
    mistakes: [
      "Applying the wrong commission base",
      "Ignoring promotion or payment charges",
      "Comparing OTA net revenue with direct gross revenue",
      "Treating post-commission revenue as profit",
    ],
    nextStep:
      "Reconcile a sample channel statement with bookings and the contract, then include total channel cost and booking quality in the KPI dashboard.",
  },
  "/tools/roas-calculator": {
    purpose:
      "The ROAS calculator divides ad-attributed revenue by advertising spend. It is a narrow media-efficiency ratio whose usefulness depends entirely on how revenue and attribution were defined.",
    inputs: [
      "Advertising spend for a matching scope and period",
      "Revenue attributed under a documented model",
      "Currency, tax, cancellation and refund treatment",
      "The attribution window and source system",
    ],
    formula:
      "Return on ad spend equals attributed revenue divided by ad spend and is displayed as a multiple. A 4× result means four units of attributed revenue per one unit of media spend, not four units of profit.",
    interpretation:
      "Compare ROAS with gross margin, agency or creative cost, cancellations and incremental demand. Platform-attributed revenue may overlap across channels and should be reconciled with confirmed records where possible.",
    decisions:
      "Use ROAS with lead quality, booking contribution and capacity. Scale only when tracking is dependable and the operation can serve additional demand without reducing customer outcomes.",
    limitations:
      "The tool does not establish causality, incrementality or attribution accuracy. It uses only the two values entered and does not retrieve advertising or booking data.",
    mistakes: [
      "Calling revenue return profit or ROI",
      "Mixing booking dates, travel dates and spend periods",
      "Ignoring cancellations and offline outcomes",
      "Adding platform-attributed revenue from overlapping channels",
    ],
    nextStep:
      "Document the attribution definition, reconcile confirmed bookings and contribution, and review ROAS beside customer acquisition cost and capacity.",
  },
  "/tools/customer-acquisition-cost-calculator": {
    purpose:
      "The customer acquisition cost calculator divides sales and marketing spend by new customers acquired. It helps test whether growth cost is supportable when both the spend scope and customer definition are consistent.",
    inputs: [
      "Sales and marketing costs included in the measurement",
      "New customers acquired in the same scope and period",
      "Rules for first-time versus returning or group customers",
      "Currency, refunds and attribution boundaries",
    ],
    formula:
      "Customer acquisition cost equals included sales and marketing spend divided by new customers. The result changes when labour, agency, creative, software or sales cost is added, so the scope must travel with the number.",
    interpretation:
      "Compare CAC with customer contribution and realistic retention, not gross booking value. A group booking may contain many travellers but represent one acquired buying relationship, depending on the business model.",
    decisions:
      "Use consistent blended and channel-specific views to guide budget and process improvement. Investigate falling quality or margin before celebrating a lower acquisition cost.",
    limitations:
      "The calculation does not identify incrementality or lifetime value and cannot decide which costs belong in scope. Those choices require a documented management definition.",
    mistakes: [
      "Counting leads, passengers or bookings as new customers inconsistently",
      "Excluding sales labour from one period but not another",
      "Comparing acquisition cost with gross revenue",
      "Ignoring repeat behaviour, refunds and contribution",
    ],
    nextStep:
      "Add the approved customer and cost definitions to the KPI dictionary, then segment acquisition cost by source only where records reconcile.",
  },
  "/tools/cost-per-booking-calculator": {
    purpose:
      "The cost per booking calculator divides campaign spend by confirmed bookings. It is a useful acquisition-efficiency check when confirmation, spend scope and booking period are defined consistently.",
    inputs: [
      "Campaign or channel spend for a matching period",
      "Confirmed bookings attributed under a documented rule",
      "Currency, refund and cancellation treatment",
      "A distinction between bookings, passengers and customers",
    ],
    formula:
      "Cost per booking equals campaign spend divided by confirmed bookings. The calculation should not use clicks, form starts, messages or unqualified enquiries in the denominator.",
    interpretation:
      "Compare the result with booking contribution and cancellation quality, not only average booking value. A lower cost can be worse when it brings unsuitable or unserviceable demand.",
    decisions:
      "Use like-for-like campaigns and products, then investigate landing, response and booking friction before changing media budget. Check capacity before scaling a low-cost source.",
    limitations:
      "The tool does not establish attribution, include agency and creative cost automatically or account for bookings confirmed outside the supplied data.",
    mistakes: [
      "Counting unconfirmed enquiries as bookings",
      "Mixing booking and spend periods",
      "Ignoring cancellations, refunds and contribution",
      "Comparing group and individual bookings without context",
    ],
    nextStep:
      "Reconcile a sample against CRM, booking and finance records, then add the approved calculation to campaign reporting with its attribution limitations.",
  },
  "/tools/tour-occupancy-calculator": {
    purpose:
      "The tour occupancy calculator shows booked guest places as a percentage of available guest places. It helps compare departures when capacity and booking status are accurately defined.",
    inputs: [
      "Booked places under the selected confirmation rule",
      "Available saleable places for the same departures",
      "Treatment of holds, staff, complimentary and blocked capacity",
      "The product, date range and capacity version",
    ],
    formula:
      "Occupancy equals booked places divided by available places and multiplied by 100. Both figures must describe the same set of departures and the same unit.",
    interpretation:
      "Review occupancy beside price, contribution, channel, cancellations and safe operating limits. High occupancy is not automatically healthy when discounts remove margin or delivery quality declines.",
    decisions:
      "Use departure-level detail to adjust schedules, inventory and promotion. Compare booking pace before the date, not only final occupancy after departure.",
    limitations:
      "The tool does not model room, vehicle or equipment constraints, waitlists, overbooking or distinct capacity pools unless the entered totals already account for them.",
    mistakes: [
      "Using maximum physical capacity instead of saleable capacity",
      "Counting temporary holds as confirmed bookings",
      "Combining unlike products or periods",
      "Optimising occupancy while contribution falls",
    ],
    nextStep:
      "Define the capacity and booking-status rules in the KPI dictionary and compare occupancy curves by product, source and departure window.",
  },
  "/tools/tour-capacity-calculator": {
    purpose:
      "The tour capacity calculator multiplies scheduled departures by capacity per departure to estimate total guest places. It is a simple planning total that should be reconciled with real resource constraints.",
    inputs: [
      "Number of departures in the planning period",
      "Saleable guest capacity for the representative departure",
      "Products or departure groups that truly share one capacity",
      "Known blocked, staff or maintenance places",
    ],
    formula:
      "Scheduled capacity equals departures multiplied by places per departure. When capacity varies, calculate groups separately and add them instead of using a misleading average.",
    interpretation:
      "Use capacity as an upper bound for sales and demand planning, then check guide, vehicle, vessel, permit, equipment and supplier constraints. Physical seats do not necessarily equal safe or sellable places.",
    decisions:
      "Compare planned capacity with booking pace, break-even and delivery resources before adding departures. Remove unavailable capacity promptly so marketing and booking systems do not oversell it.",
    limitations:
      "The simple tool assumes equal capacity and does not schedule resources, prevent overlaps or verify legal and safety limits.",
    mistakes: [
      "Treating physical maximum as approved saleable capacity",
      "Ignoring shared guides, vehicles or equipment",
      "Combining departures with different capacity",
      "Publishing capacity before resources are confirmed",
    ],
    nextStep:
      "Create departure and resource records for the plan, verify conflicts and use the approved capacity as the denominator for occupancy reporting.",
  },
  "/tools/guide-guest-ratio-calculator": {
    purpose:
      "The guide-to-guest ratio calculator divides guests by guides for a departure. It supports staffing discussion but cannot determine a safe or legal ratio without the activity, location and participant context.",
    inputs: [
      "Confirmed or planned guest count",
      "Qualified guides assigned to the same group",
      "Activity, route, age and ability context",
      "Legal, permit, insurer and risk-assessment requirements",
    ],
    formula:
      "Guests per guide equals total guests divided by assigned guides. Use whole guides and consider whether leaders, assistants or specialists have different roles.",
    interpretation:
      "A lower numerical ratio may improve attention but is not automatically sufficient. Terrain, water, weather, vehicles, language, minors, accessibility and emergency response can require a stricter operating model.",
    decisions:
      "Use the ratio to plan staffing and price scenarios only after qualified safety ownership sets the applicable limit. Stop sales or add resources when the approved threshold would be exceeded.",
    limitations:
      "The tool provides arithmetic only and does not give legal, safety or professional guidance for any activity or jurisdiction.",
    mistakes: [
      "Using a generic industry ratio without local verification",
      "Counting unqualified helpers as responsible guides",
      "Ignoring subgroup, language or accessibility needs",
      "Changing capacity without updating price and departure checks",
    ],
    nextStep:
      "Record the approved staffing rule on the product, connect guides as finite resources and include ratio verification in the departure checklist.",
  },
  "/tools/tour-cancellation-rate-calculator": {
    purpose:
      "The tour cancellation rate calculator shows cancelled bookings as a percentage of total bookings. It supports diagnosis when status, time and cancellation ownership are defined consistently.",
    inputs: [
      "Cancelled bookings under the selected definition",
      "Total bookings from the same cohort",
      "Customer, operator, weather and supplier reason categories",
      "Booking date, departure date and reporting window",
    ],
    formula:
      "Cancellation rate equals cancelled bookings divided by total bookings and multiplied by 100. Decide whether rescheduled and partially cancelled bookings belong in separate categories.",
    interpretation:
      "Segment by reason, product, source, lead time and value. A percentage alone cannot show whether the issue is customer fit, policy, payment failure, weather, supplier reliability or operational cancellation.",
    decisions:
      "Use recurring reasons to improve product information, reminders, deposits, supplier controls and contingency plans. Avoid tightening terms when preventable operator issues are the cause.",
    limitations:
      "The calculation does not measure lost contribution, refund cost, rebooking or customer impact and cannot correct inconsistent historical statuses.",
    mistakes: [
      "Mixing inquiries with accepted bookings",
      "Combining operator and customer cancellations",
      "Comparing incomplete future cohorts with completed ones",
      "Changing policy without examining the underlying reasons",
    ],
    nextStep:
      "Standardise cancellation reasons and statuses, reconcile them with payments and review both rate and commercial impact in the operating dashboard.",
  },
  "/tools/travel-utm-builder": {
    purpose:
      "The travel UTM builder adds consistently encoded source, medium and campaign parameters to a complete landing-page URL. It supports campaign attribution without changing the page's canonical identity.",
    inputs: [
      "The final secure landing-page URL",
      "Lowercase campaign source such as a partner or platform",
      "A controlled medium such as paid_search or email",
      "A stable campaign name agreed in the taxonomy",
    ],
    formula:
      "The builder uses standard URL encoding and appends utm_source, utm_medium and utm_campaign query parameters. Existing valid query parameters are retained by the browser URL parser.",
    interpretation:
      "Use the resulting link in the intended campaign and verify that analytics records the values. Parameters identify tagged traffic; they do not prove that the campaign caused a booking.",
    decisions:
      "Maintain a shared naming convention and reuse stable values across teams. Link to the most relevant canonical page and preserve campaign context into the lead or booking record where consent and systems allow.",
    limitations:
      "The tool does not shorten URLs, validate analytics installation, create ad-platform click identifiers or save campaign records.",
    mistakes: [
      "Using spaces, inconsistent case or changing names mid-campaign",
      "Tagging internal website navigation",
      "Sending campaigns to redirected or irrelevant pages",
      "Treating tagged sessions as confirmed bookings",
    ],
    nextStep:
      "Test the link in an analytics debug view, record it in the campaign register and verify that the downstream enquiry retains the expected source context.",
  },
  "/tools/travel-meta-title-generator": {
    purpose:
      "The travel meta title generator combines a verified offer, location and brand into a concise starting title. It applies a character guardrail without promising how a search engine will display or rank it.",
    inputs: [
      "The specific tour, package, service or page purpose",
      "A location that is genuinely central to the offer",
      "The public business or brand name",
      "The distinct search intent served by this URL",
    ],
    formula:
      "The generator arranges offer and location before the brand and trims the draft to the configured recommendation. Search display width varies, so character count remains a practical editing cue rather than a guarantee.",
    interpretation:
      "The title should distinguish the page, match its visible heading and avoid repeating near-identical wording across many URLs. Read it as a customer choice label, not a container for every related phrase.",
    decisions:
      "Prioritise the page's clearest subject and meaningful differentiator. Use the brand where it adds recognition and remove redundant words before cutting important meaning.",
    limitations:
      "The tool does not research demand, inspect competing results, validate page content or control how search engines rewrite titles.",
    mistakes: [
      "Generating the same title for several destinations or products",
      "Adding unsupported best, number-one or price claims",
      "Stuffing keyword variants and separators",
      "Writing a title that the visible page does not fulfil",
    ],
    nextStep:
      "Review the draft with the page heading and intent, publish through the SEO controls and monitor query and click evidence without overreacting to short-term movement.",
  },
  "/tools/travel-meta-description-generator": {
    purpose:
      "The travel meta description generator creates a concise draft from offer, location and brand. It is written to clarify relevance and the next step, not to manipulate rankings or guarantee a search snippet.",
    inputs: [
      "The page's specific offer or information purpose",
      "The relevant destination or service location",
      "The correct business name",
      "A truthful action and useful distinguishing detail",
    ],
    formula:
      "The generator creates a plain-language sentence and trims it to the configured recommendation. Search engines may select other page text, so clarity and page alignment matter more than an exact count.",
    interpretation:
      "A strong description helps a suitable searcher understand what the page contains. It should complement the title, avoid repeating it mechanically and never claim prices, availability or proof the page cannot support.",
    decisions:
      "Edit the draft for the real audience and page type. Give product pages concrete decision detail and guides a clear problem or outcome while keeping the next action proportionate.",
    limitations:
      "The tool does not inspect page content, search results, local language, live availability or search-engine rewriting.",
    mistakes: [
      "Duplicating one description across many pages",
      "Using fabricated urgency or unsupported superlatives",
      "Listing keywords instead of writing a useful sentence",
      "Promising an action the page does not provide",
    ],
    nextStep:
      "Compare the draft with visible content and intent, publish it through the SEO settings and review performance with the corresponding query and landing-page context.",
  },
  "/tools/tour-schema-generator": {
    purpose:
      "The tour schema generator creates a conservative TouristTrip JSON-LD starting point from a name, canonical URL and accurate description. It intentionally avoids invented ratings, offers, availability and reviews.",
    inputs: [
      "The public name used on the page",
      "The final canonical HTTPS URL",
      "A concise description supported by visible content",
      "Any later properties verified against Schema.org and search guidance",
    ],
    formula:
      "The tool serialises the entered values into a JSON-LD object with the Schema.org context and TouristTrip type. It produces syntax, not proof that the type or every property is eligible for a search feature.",
    interpretation:
      "Structured data should describe the primary visible entity and remain consistent with the page. Search engines can ignore valid markup, and rich-result eligibility depends on their supported types and policies.",
    decisions:
      "Add only properties the business can maintain accurately. Use organisation and breadcrumb data at the appropriate global or page scope and avoid duplicating conflicting entities from plugins or themes.",
    limitations:
      "The generator does not validate eligibility, inject code, inspect duplicates or create ratings, prices and availability. A technical owner should test the final rendered page.",
    mistakes: [
      "Marking up information that is not visible to visitors",
      "Inventing reviews, prices, availability or aggregate ratings",
      "Publishing multiple conflicting schema graphs",
      "Assuming valid syntax guarantees a rich result",
    ],
    nextStep:
      "Review the JSON-LD, test it in the rendered page, monitor search reports and update it whenever the corresponding page facts or canonical URL change.",
  },
  "/tools/tour-invoice-generator": {
    purpose:
      "The tour invoice generator creates an editable plain-language draft from customer, service and amount inputs. It is a preparation aid and not an accounting, tax, payment or legal invoice system.",
    inputs: [
      "Correct customer or billing identity",
      "The tour or package being invoiced",
      "Approved amount in the intended currency",
      "Business, tax, date, payment and reference details added before issue",
    ],
    formula:
      "The generator formats the entered fields into a copyable draft. It does not calculate tax, balances, exchange rates, instalments, invoice numbering or accounting entries.",
    interpretation:
      "Treat the result as text to complete inside the authorised finance workflow. The issued document should reconcile with the booking, payments, legal entity and applicable tax requirements.",
    decisions:
      "Use controlled invoice numbering, approval and status in an accounting or booking system. Avoid collecting payment through an unverified link added to a copied draft.",
    limitations:
      "TripOne+ cannot determine invoice compliance for a country or business. The browser tool does not save, send, sign or post the draft to a ledger.",
    mistakes: [
      "Issuing the draft without legal and tax fields",
      "Using an unapproved amount or currency",
      "Confusing a quote, payment request and tax invoice",
      "Emailing sensitive payment or traveller information unnecessarily",
    ],
    nextStep:
      "Complete and approve the document in the business's accounting workflow, reconcile payment against the booking and retain records under the applicable policy.",
  },
  "/tools/travel-quote-generator": {
    purpose:
      "The travel quote generator creates a copyable draft from a customer, service and amount. It helps structure the first document, but it does not confirm supplier inventory, calculate a complete price or create a binding agreement.",
    inputs: [
      "Correct customer or lead identity",
      "The specific tour, package or proposed service",
      "An approved amount in the intended currency",
      "Dates, inclusions, exclusions, validity and terms added before issue",
    ],
    formula:
      "The browser formats the entered fields into a simple quote heading and amount. No tax, currency, supplier, capacity, deposit or cancellation logic is inferred.",
    interpretation:
      "Treat the result as a draft shell. A useful travel quote should let the customer identify the proposal version, services, assumptions, optional items, total, payment schedule and next approval action.",
    decisions:
      "Confirm availability and price ownership before sending. Clearly separate confirmed components from proposed or subject-to-availability items, and set a realistic validity period where supplier terms can change.",
    limitations:
      "The tool does not save, send, sign, approve or version the quote and cannot determine contractual or tax requirements.",
    mistakes: [
      "Presenting an estimated amount as confirmed availability",
      "Leaving currency, validity or exclusions ambiguous",
      "Mixing optional and included services",
      "Sending sensitive traveller or payment data in the draft",
    ],
    nextStep:
      "Complete the quote in the authorised sales workflow, link it to the correct opportunity and itinerary, record approval and convert accepted services into controlled booking records.",
  },
  "/tools/tour-itinerary-generator": {
    purpose:
      "The tour itinerary generator creates a day-by-day outline from destination, main experience and number of days. It removes blank-page friction while keeping every operational claim visibly incomplete until a person verifies it.",
    inputs: [
      "The trip's primary destination or route",
      "The main experience or organising theme",
      "The intended number of itinerary days",
      "Verified services, timings and practical detail added during editing",
    ],
    formula:
      "The generator creates one labelled line for each day, capped at the tool's safe maximum, and prompts the editor to add timing, transport, inclusions and practical notes.",
    interpretation:
      "Use the output as structure, not finished travel advice. Day titles should explain movement or purpose, while verified detail should distinguish confirmed services, optional ideas and free time.",
    decisions:
      "Check travel time, overnight location, opening or access constraints, supplier availability and customer pace before turning the outline into a proposal or public package.",
    limitations:
      "The deterministic tool does not research destinations, contact suppliers, calculate routes, check safety or generate live availability. Entries remain only in the current browser unless copied.",
    mistakes: [
      "Treating placeholder day text as researched advice",
      "Ignoring realistic movement and rest time",
      "Presenting optional services as included or confirmed",
      "Publishing without destination and operational review",
    ],
    nextStep:
      "Move the outline into a versioned itinerary, link verified services and destinations, add customer-safe logistics and complete operational review before approval.",
  },
};

export function buildToolSections(
  page: SeoPageSpec,
): SeoContentSection[] | undefined {
  const profile = profiles[page.path];
  if (!profile) return undefined;
  return [
    {
      heading: `What the ${page.primaryKeyword} calculates`,
      paragraphs: [profile.purpose, profile.formula],
      bullets: profile.inputs,
    },
    {
      heading: "How to read the live result",
      paragraphs: [profile.interpretation, profile.decisions],
    },
    {
      heading: "Assumptions and limitations",
      paragraphs: [profile.limitations],
    },
    {
      heading: "Calculation checks before making a decision",
      paragraphs: [
        "Review the scope and source of every input before sharing or saving the result. These errors are especially likely to make a clean calculation commercially misleading:",
      ],
      bullets: profile.mistakes,
    },
    {
      heading: "Move from calculation to an accountable decision",
      paragraphs: [profile.nextStep],
    },
  ];
}
