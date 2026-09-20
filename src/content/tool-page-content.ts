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
