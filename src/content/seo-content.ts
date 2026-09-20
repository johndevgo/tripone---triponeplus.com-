import type { SeoPageSpec } from "./seo-catalog";
import { buildComparisonSections } from "./comparison-content";
import { buildGrowthServiceSections } from "./growth-service-content";
import { buildIndustrySections } from "./industry-content";
import { buildResourceSections } from "./resource-page-content";
import { buildToolSections } from "./tool-page-content";
import { buildBlogSections } from "./blog-page-content";

export type SeoContentSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  sources?: { label: string; href: string }[];
};

export type SeoFaq = { question: string; answer: string };

const typeLanguage = {
  "Growth Service": {
    subject: "growth programme",
    audienceAction: "choose a specialist partner and define a measurable brief",
    outcome: "qualified demand, direct enquiries and attributable bookings",
    evidence: "channel data, conversion events and commercial outcomes",
  },
  Industry: {
    subject: "travel-business operating system",
    audienceAction:
      "connect sales, product, customer and operational workflows",
    outcome: "clearer operations and a stronger direct-booking journey",
    evidence: "accurate inventory, workflow ownership and customer outcomes",
  },
  Compare: {
    subject: "software evaluation",
    audienceAction:
      "compare workflows with real products and current provider evidence",
    outcome: "a defensible platform decision with fewer hidden handoffs",
    evidence:
      "current documentation, test accounts, contracts and end-to-end trials",
  },
  Resource: {
    subject: "working planning resource",
    audienceAction:
      "adapt the framework to real products, people and operating rules",
    outcome: "a repeatable process the team can actually use",
    evidence: "completed fields, named owners and observable checkpoints",
  },
  Tool: {
    subject: "interactive planning tool",
    audienceAction:
      "enter current assumptions, inspect the result and validate the inputs",
    outcome: "a faster first calculation without hiding the underlying method",
    evidence:
      "visible inputs, transparent formulas and reviewed source records",
  },
  Blog: {
    subject: "practical implementation guide",
    audienceAction: "turn the advice into a sequenced operating plan",
    outcome: "better traveller decisions and more resilient business execution",
    evidence: "baseline measures, completed actions and customer behaviour",
  },
} as const;

export function buildSeoContent(page: SeoPageSpec): SeoContentSection[] {
  const language = typeLanguage[page.pageType];
  const secondary = readableList(page.secondaryKeywords);
  const entities = readableList(page.entities);
  const firstEntity = page.entities[0]!;
  const secondEntity = page.entities[1]!;
  const thirdEntity = page.entities[2]!;
  const audience = page.vertical.toLowerCase();

  const sections: SeoContentSection[] = [
    {
      heading: `${page.title}: the commercial context`,
      paragraphs: [
        `${page.title} should be treated as a ${language.subject}, not as an isolated page, campaign or administrative task. For ${audience}, the useful objective is ${page.contentAngle.charAt(0).toLowerCase()}${page.contentAngle.slice(1)} A reader looking for ${page.primaryKeyword} expects a concrete answer, a credible operating method and a next step that matches ${page.intent.toLowerCase()} intent. The page therefore has to connect discovery, evaluation and action instead of repeating a phrase without resolving the underlying business decision.`,
        `Related questions include ${secondary}, while the practical work connects ${entities}. These topics belong together because travellers and operators rarely experience them as separate disciplines. A visitor may discover an offer through search or advertising, compare product information, check trust signals, ask a question, and move into a booking or follow-up workflow. Strong implementation keeps those stages connected and gives every important fact a clear source of truth.`,
        `TripOne+ approaches ${page.keywordCluster.toLowerCase()} through structured content and visible rules. The platform does not invent rankings, revenue, awards, availability or customer proof. Instead, it helps a business publish accurate services, packages, destinations, policies and conversion paths. That distinction matters for search quality and conversion: precise facts are easier to understand, maintain, measure and trust than inflated claims written only to attract clicks.`,
      ],
    },
    {
      heading: `What ${page.primaryKeyword} needs to accomplish`,
      paragraphs: [
        `A useful ${page.primaryKeyword} strategy begins by defining the decision it supports. The reader should be able to identify who the offer is for, what is included, where it applies, what happens next and which limitations remain. For ${audience}, this usually requires a clear relationship between products, packages, destinations, dates, capacity, customer records and the acquisition channel that created the interaction. When those relationships are fragmented, teams repeat work and visitors encounter inconsistent answers.`,
        `${firstEntity}, ${secondEntity} and ${thirdEntity} are especially important within this work. ${firstEntity} supplies context for the initial decision; ${secondEntity} shapes how that decision is executed; and ${thirdEntity} helps the business validate or communicate the result. The exact configuration will vary by operator, but the principle is stable: each important part should have an owner, an update process and a defined place in the customer journey.`,
        `The commercial outcome is ${language.outcome}. That outcome cannot be inferred from page views alone. The business must distinguish discovery metrics from qualified enquiries, booking requests, confirmed bookings and retained customers. This page therefore uses conversion-oriented language while remaining careful about what TripOne+ currently does: it structures websites and connected payment-free operating workflows, while external processors or reservation systems may still own payment and real-time inventory when required.`,
      ],
      bullets: [
        `Define the traveller or operator decision behind “${page.primaryKeyword}”.`,
        `Assign a reliable source for ${page.entities.slice(0, 3).join(", ")}.`,
        `Connect the page to a real enquiry, booking, comparison or planning action.`,
        `Measure completed outcomes separately from visits and button clicks.`,
      ],
    },
    {
      heading: `How the moving parts fit together`,
      paragraphs: [
        `Search engines and customers both benefit when the information architecture reflects the real business. A travel company is an organisation; its tours, activities, rentals and packages are offers; destinations are places; departures and availability describe time and capacity; customers and leads represent people at different stages. ${page.keywordCluster} becomes easier to navigate when these parts have stable URLs, consistent names and meaningful relationships rather than being buried in one long generic page.`,
        `For this topic, the connected areas are ${entities}. Each should be introduced in plain language, used where it answers a question and linked to a deeper page when the reader needs more detail. Useful depth comes from explaining relationships: how ${firstEntity} affects ${secondEntity}, where ${thirdEntity} enters the workflow, which team owns the information, and what changes for the customer when something is incomplete.`,
        `A strong hub-and-spoke structure gives ${page.title} a clear role. The hub explains the complete problem and routes readers to specialist services, tools, templates, comparisons or platform capabilities. Supporting pages answer narrower questions and link back with descriptive anchor text. This creates contextual internal linking without manufacturing dozens of location-and-keyword combinations that offer no distinct value.`,
      ],
    },
    {
      heading: `A practical implementation framework`,
      paragraphs: [
        `Start with evidence. Collect the current website pages, product records, campaign settings, analytics events, customer questions and operational documents related to ${page.primaryKeyword}. Mark which records are authoritative, which are duplicated and which are assumptions. This audit prevents a polished new interface from reproducing old contradictions. It also shows where ${secondary} are genuine priorities and where they are merely labels without a supporting workflow.`,
        `Next, design the minimum complete journey. A traveller should move from a relevant landing point to understandable product information, reassurance and an appropriate action. An operator should be able to receive that action, identify the product or campaign, respond with the right context and update the customer record. For a ${language.subject}, the handoff is as important as the page itself because a conversion that disappears into an unmanaged inbox is not a reliable growth system.`,
        `Then implement in small, testable slices. Use one representative service or package, one destination and one conversion path. Validate content, responsive layout, keyboard use, form errors, event tracking, confirmation states and follow-up ownership. Once the pattern works, apply it across the catalogue using shared components and structured records. This approach preserves consistency while allowing each offer to keep the detail that makes it genuinely useful.`,
      ],
      bullets: [
        `Audit the current source material and establish a baseline for ${language.evidence}.`,
        `Model the important records and relationships before designing templates.`,
        `Build one complete mobile-first journey and test it with realistic data.`,
        `Document ownership, review intervals and escalation rules.`,
        `Expand only after the first workflow is accurate, accessible and measurable.`,
      ],
    },
    buildTypeSpecificSection(page),
    {
      heading: `Useful depth without repetition`,
      paragraphs: [
        `${page.primaryKeyword} belongs in the page title, main heading, opening explanation and selected subheadings because it accurately describes the topic. Related questions such as ${secondary} should appear only where they help explain a real decision. Forcing an exact repetition percentage would make the copy less readable and less trustworthy. Strong content uses the language of the subject naturally and supplies the processes, examples and limitations needed to answer the visitor well.`,
        `Technical signals should reinforce that clarity. Use one canonical URL, a concise meta title, a description written for the search result, crawlable internal links, an XML sitemap entry and structured data that matches visible content. Images need useful alternative text, stable dimensions and efficient delivery. FAQ schema should reflect questions answered on the page, not hidden keyword blocks. Comparison pages should cite current first-party sources before making provider-specific claims.`,
        `Authority grows through coherent coverage rather than raw page count. This page connects ${page.keywordCluster.toLowerCase()} to adjacent commercial and operational topics, and its related links help readers continue based on their next question. Pages should be refreshed when products, platform capabilities, prices or regulations change. If a page cannot be kept accurate or provide a distinct answer, consolidating it is better than preserving it for an impression count.`,
      ],
    },
    {
      heading: `Conversion design and user experience`,
      paragraphs: [
        `Conversion rate optimisation begins with clarity. The headline should confirm the visitor is in the right place; the introduction should frame the result; and the page should reveal proof, process and limitations before asking for commitment. The call to action “${page.cta}” is positioned as the next logical step, not as a substitute for missing information. Secondary links support readers who need a calculator, checklist, comparison or deeper platform explanation first.`,
        `On mobile, the content must remain scannable without becoming shallow. Descriptive headings, short paragraphs, clear topic cards, expandable FAQs and adequately sized controls help readers move through a long guide. Images should establish context rather than interrupt the decision. Focus indicators, semantic landmarks, labelled inputs and readable contrast are necessary conversion features because a journey that excludes keyboard, low-vision or small-screen users is both less useful and commercially weaker.`,
        `Trust should be specific and verifiable. Show real contact routes, explain what happens after an enquiry and state whether the next step is a consultation, external booking page or TripOne+ booking request. Do not create urgency, review totals or market-leading claims without supporting data. For ${audience}, accurate expectations reduce poor-fit enquiries and give the team a better opportunity to respond well.`,
      ],
    },
    {
      heading: `Measurement, governance and continuous improvement`,
      paragraphs: [
        `Measure the journey in layers. Discovery includes impressions, qualified visits and entry pages. Consideration includes product views, comparison activity, itinerary engagement and return visits. Intent includes contact clicks, form starts, booking requests and external booking clicks. Commercial outcomes include qualified leads, confirmed bookings, revenue and retention only when those records are available. This structure prevents a high click-through rate from being presented as proven sales performance.`,
        `Create a review cadence for ${page.keywordCluster.toLowerCase()}. Weekly checks can identify broken forms, campaign anomalies and urgent availability issues. Monthly reviews can assess content paths, lead quality and conversion friction. Quarterly reviews can revisit positioning, taxonomy, internal links and the relationship between acquisition cost and customer value. Name the person responsible for each review so the system does not rely on a vague expectation that someone will notice problems.`,
        `Use experiments carefully. Change one meaningful variable, document the hypothesis and preserve enough time or volume to interpret the result. A small travel operator may learn more from customer interviews and session-level evidence than from an underpowered statistical test. The goal is not endless optimisation theatre; it is a dependable process for finding uncertainty, improving the experience and observing whether customer behaviour changes.`,
      ],
    },
    {
      heading: `A 30, 60 and 90-day action plan`,
      paragraphs: [
        `During the first 30 days, establish the baseline and repair the foundations. Confirm the primary audience, product records, conversion actions, analytics definitions and ownership. Review how ${firstEntity}, ${secondEntity} and ${thirdEntity} appear across the website and internal systems. Publish or update one representative page, test the complete mobile journey and record the questions customers still ask after reading it.`,
        `By day 60, expand the working pattern. Connect relevant services, destinations, packages and resources through descriptive internal links. Improve supporting content for ${secondary}. Add only the structured data that matches visible information. Train the people who respond to leads or update products, and create a lightweight quality checklist covering accuracy, accessibility, performance, tracking and follow-up.`,
        `By day 90, evaluate business evidence rather than cosmetic completion. Compare the baseline with ${language.evidence}; review which entry pages and campaigns produce qualified actions; and identify handoffs that still require duplicate work. Keep what performs a clear job, revise what creates confusion and remove pages or fields nobody can maintain. The lasting advantage is a system the team can operate consistently, not a one-time launch that becomes outdated.`,
      ],
    },
    {
      heading: `How TripOne+ supports the next step`,
      paragraphs: [
        `TripOne+ combines a travel-focused website builder with structured products and services, packages, destinations, enquiries, customers, bookings, availability and operational resources. The deterministic generation system uses business data and editable rules rather than an external AI writing API. That makes the relationship between an input and the published result visible, while the shared renderer keeps builder previews and published pages aligned.`,
        `For ${page.title.toLowerCase()}, the practical next step is to ${language.audienceAction}. Use the framework above to prepare accurate inputs, then choose “${page.cta}” when the business is ready to continue. TripOne+ can provide the website and workflow foundation; specialist payment, reservation, distribution or advertising platforms can remain connected where they are the appropriate source of truth.`,
      ],
    },
  ];
  const specialized =
    buildGrowthServiceSections(page) ??
    buildIndustrySections(page) ??
    buildComparisonSections(page) ??
    buildResourceSections(page) ??
    buildToolSections(page) ??
    buildBlogSections(page);
  if (!specialized) return sections;
  return [
    specialized[0]!,
    sections[1]!,
    specialized[1]!,
    sections[2]!,
    specialized[2]!,
    specialized[3]!,
    sections[6]!,
    sections[7]!,
    specialized[4]!,
    sections[9]!,
  ];
}

function buildTypeSpecificSection(page: SeoPageSpec): SeoContentSection {
  const [first, second, third] = page.entities;
  const supporting = readableList(page.secondaryKeywords);

  if (page.pageType === "Growth Service") {
    return {
      heading: `How to scope a ${page.keywordCluster.toLowerCase()} engagement`,
      paragraphs: [
        `A credible engagement for ${page.primaryKeyword} starts with diagnosis rather than a predetermined list of deliverables. The baseline should show where qualified demand currently comes from, which pages and campaigns influence enquiries, how quickly the team responds, and where attribution becomes unreliable. For ${page.vertical.toLowerCase()}, that means reviewing ${first}, ${second} and ${third} alongside the actual sales and booking journey. The resulting brief should distinguish essential repairs from experiments so budget is not spent scaling an unmeasured funnel.`,
        `Delivery should connect strategy, production and measurement. Work related to ${supporting} needs named owners, approved inputs, a publishing or campaign cadence and a definition of a qualified outcome. TripOne+ should not claim revenue created by an impression, click or form start. Reporting should identify the channel, landing experience, conversion event, lead quality and confirmed commercial result when the business can supply that evidence.`,
        `The strongest service relationship also transfers operating knowledge. Decisions, naming rules, campaign parameters, content briefs and measurement definitions should remain understandable to the client team. That makes the programme more resilient when staff, seasonality or channel conditions change, and it prevents specialist work from becoming an opaque dependency that nobody inside the business can evaluate.`,
      ],
      bullets: [
        `Baseline the current role of ${first}, ${second} and ${third}.`,
        `Agree the qualified enquiry or booking outcome before production begins.`,
        `Separate foundational repairs, ongoing delivery and controlled experiments.`,
        `Report limitations and attribution gaps beside performance results.`,
      ],
    };
  }

  if (page.pageType === "Industry") {
    return {
      heading: `An operating model for ${page.vertical.toLowerCase()}`,
      paragraphs: [
        `${page.vertical} need more than a generic website template with renamed menu items. Their operating model connects the offer travellers see with the people, capacity, dates, equipment, suppliers and follow-up needed to deliver it. In this context, ${first}, ${second} and ${third} should be represented as structured business information wherever they affect availability, suitability or customer expectations.`,
        `The website layer should merchandise real products clearly, while the operational layer should preserve ownership after a visitor acts. A request must retain its source page and relevant offer; a confirmed booking should connect to the customer and schedule; and any resource constraint should be visible before a team promises fulfilment. The exact workflow varies by business, but the customer should not have to repeat information because internal systems cannot share context.`,
        `Start with the most common sale and the most consequential exception. Model one normal ${page.primaryKeyword} journey from discovery to completion, then test what happens when dates change, capacity is unavailable, a custom request arrives or a traveller needs additional guidance. That combination reveals whether the system supports real operations rather than only the ideal demonstration path.`,
      ],
      bullets: [
        `Model the primary offer, customer, booking and fulfilment records.`,
        `Keep package, destination and product taxonomies useful to travellers.`,
        `Test capacity, exception handling and team ownership with realistic data.`,
        `Publish only capabilities that the current workflow can actually deliver.`,
      ],
    };
  }

  if (page.pageType === "Compare") {
    return {
      heading: `A fair evaluation framework for ${page.keywordCluster.toLowerCase()}`,
      paragraphs: [
        `${page.title} should be evaluated against documented requirements rather than a feature-count contest. Begin with the jobs the team performs every week, then use a representative product, customer journey and publishing change to test each option. ${first}, ${second} and ${third} matter here because a platform can advertise all three while handling the relationship between them very differently.`,
        `Provider capabilities, packaging and prices can change. Any named competitor claim should be checked against current first-party documentation, a current trial workspace and the proposed contract before purchase. TripOne+ publishes this comparison and therefore has a commercial interest; the useful safeguard is a visible method that readers can apply independently instead of an unsupported declaration that one product is universally best.`,
        `Score workflow fit, implementation effort, data portability, permissions, accessibility, support and total operating cost. Also test the exit path: export important records, identify proprietary dependencies and document what would happen to URLs, analytics and customer data after a change. A sound decision accounts for maintenance and reversibility, not only the quality of the sales demonstration.`,
      ],
      bullets: [
        `Write weighted requirements before opening vendor demonstrations.`,
        `Verify ${supporting} using current first-party evidence.`,
        `Run the same end-to-end scenario in every shortlisted platform.`,
        `Include migration, training, integrations and exit costs in the decision.`,
      ],
    };
  }

  if (page.pageType === "Resource") {
    return {
      heading: `How to use this ${page.keywordCluster.toLowerCase()} resource`,
      paragraphs: [
        `This resource should be copied into a working session, not filed as passive reading. Assign an owner, replace example language with verified business information and note the evidence behind decisions involving ${first}, ${second} and ${third}. Fields that cannot yet be completed should become explicit research tasks rather than assumptions presented as finished facts.`,
        `Review the completed resource with the people who sell, deliver and support the experience. Marketing may understand acquisition context, operations may know the practical constraints, and customer-facing staff may know the questions travellers actually ask. Combining those perspectives turns ${page.primaryKeyword} into an operating reference instead of another disconnected document.`,
        `Store the approved version beside the records or workflow it governs and add a review date. Seasonal schedules, supplier terms, prices and platform behaviour can change, so a resource without ownership will gradually become misleading. The goal is a lightweight source of truth that supports repeatable decisions while remaining simple enough for the team to maintain.`,
      ],
      bullets: [
        `Replace every example with verified business information.`,
        `Record an owner, evidence source and review date.`,
        `Test the resource against one real customer or operating scenario.`,
        `Link the finished output to the relevant TripOne+ record or workflow.`,
      ],
    };
  }

  if (page.pageType === "Tool") {
    return {
      heading: `Inputs, method and limits of this ${page.keywordCluster.toLowerCase()} tool`,
      paragraphs: [
        `The interactive workspace on this page is deliberately transparent. It uses visible inputs related to ${first}, ${second} and ${third}, calculates or formats the result in the browser and does not send the entered values to TripOne+. The output is a planning aid, not a promise, quotation, tax calculation, legal document or substitute for the business records that ultimately govern a sale.`,
        `Check every input before using the result. Costs should come from current supplier and operating records; capacity should reflect the actual product and date; campaign figures should use a consistent attribution window; and customer-facing documents should include the correct identity, currency, validity and terms. ${page.primaryKeyword} becomes useful when its assumptions can be explained to another person and reproduced later.`,
        `Run more than one scenario when uncertainty is material. A base case, conservative case and capacity-constrained case can reveal which assumption changes the decision most. Save the chosen inputs with the business context and date rather than copying only the final number or text. That creates a reviewable decision trail and reduces the risk of treating a convenient estimate as permanent truth.`,
      ],
      bullets: [
        `Validate source data for ${first}, ${second} and ${third}.`,
        `Record the date, currency, scope and assumptions with the result.`,
        `Compare realistic scenarios before publishing or committing spend.`,
        `Have the responsible person approve customer-facing output.`,
      ],
    };
  }

  return {
    heading: `Turn ${page.keywordCluster.toLowerCase()} guidance into a decision`,
    paragraphs: [
      `A useful guide changes what the reader does next. For ${page.primaryKeyword}, begin by identifying the current decision, the evidence available and the person responsible for acting. ${first}, ${second} and ${third} should be connected to that decision rather than mentioned as isolated terminology. This keeps the article grounded in the operating reality of ${page.vertical.toLowerCase()}.`,
      `Translate the guidance into a short sequence with observable completion criteria. Prioritise the step that removes the greatest customer uncertainty or operating risk, then confirm the result before expanding. Supporting topics such as ${supporting} should enter the plan where they change the journey, measurement or ownership—not simply because they are related search phrases.`,
      `Document what was changed, what remained uncertain and when the decision should be revisited. Travel products, distribution platforms, customer expectations and regulations evolve. A useful article therefore supports an ongoing review habit instead of pretending that one publication date can settle every future scenario.`,
    ],
    bullets: [
      `Name the decision, evidence and responsible owner.`,
      `Apply the guidance to one representative offer or workflow.`,
      `Observe the customer and operating result before scaling.`,
      `Set a review date for changing assumptions and external dependencies.`,
    ],
  };
}

export function buildSeoFaqs(page: SeoPageSpec): SeoFaq[] {
  const supplied = page.faqs.map((question, index) => ({
    question,
    answer: answerQuestion(page, question, index),
  }));
  const additional: SeoFaq[] = [
    {
      question: `How should ${page.primaryKeyword} be measured?`,
      answer: `Measurement should follow the commercial journey rather than stop at traffic. Establish a baseline for discovery, qualified enquiries, booking requests and confirmed outcomes where those records are available. Review ${readableList(page.entities.slice(0, 3))} together, document attribution limits and avoid presenting an impression, click or message as revenue without supporting booking evidence.`,
    },
    {
      question: `What should ${page.vertical.toLowerCase()} prepare before starting?`,
      answer: `Prepare the current offer catalogue, destination and product information, customer questions, access to relevant systems, existing performance records and a named decision owner. Confirm which details are authoritative and which are assumptions. This makes the first working session useful and prevents a new ${page.keywordCluster.toLowerCase()} process from reproducing outdated information.`,
    },
    {
      question: `How does this support more direct travel bookings?`,
      answer: `Direct bookings improve when owned discovery, accurate offer information, trust, a clear mobile action and reliable follow-up work as one journey. ${page.title} contributes by reducing uncertainty and connecting the visitor's context to an enquiry or booking workflow. It should complement appropriate distribution partners rather than rely on unsupported promises or remove channels without a transition plan.`,
    },
    {
      question: `How often should this ${page.keywordCluster.toLowerCase()} work be reviewed?`,
      answer: `Review critical customer-facing information whenever products, prices, schedules, suppliers or platform behaviour change. Review performance and workflow quality on a regular operating cadence, then complete a deeper quarterly assessment. Seasonal ${page.vertical.toLowerCase()} may need more frequent checks before peak demand so published information and team capacity remain aligned.`,
    },
  ];
  const seen = new Set<string>();
  return [...supplied, ...additional].filter((faq) => {
    const key = faq.question.toLocaleLowerCase("en");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function seoContentWordCount(page: SeoPageSpec) {
  const text = [
    page.title,
    page.metaDescription,
    ...buildSeoContent(page).flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
    ...buildSeoFaqs(page).flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function answerQuestion(page: SeoPageSpec, question: string, index: number) {
  const entities = readableList(page.entities.slice(index, index + 3));
  const lower = question.toLowerCase();
  if (lower.startsWith("how long"))
    return `${page.title} does not have one honest universal timeline. The starting condition, catalogue size, technical access, review speed and competitive environment all matter. Establish the baseline first, ship the highest-value complete workflow, and review progress through qualified actions rather than promising a ranking or booking date. ${entities} should be included in the plan where they affect delivery.`;
  if (/cost|budget|price|margin/.test(lower))
    return `The appropriate figure depends on operating costs, capacity, commercial objectives and the scope of work. Record the assumptions behind ${entities}, separate fixed and variable inputs, and compare the result with qualified bookings or revenue where that evidence exists. TripOne+ does not invent a benchmark for an individual business.`;
  if (lower.startsWith("can ") || lower.startsWith("does "))
    return `It can be supported when the required information and workflow are configured accurately. For ${page.vertical.toLowerCase()}, confirm the role of ${entities}, the system that owns each record and the action that completes the journey. Provider-specific payment, inventory or advertising capabilities should be verified against current documentation before purchase.`;
  if (lower.startsWith("which") || lower.startsWith("what"))
    return `Start with the option that resolves the real customer or operating decision. In this context that means connecting ${entities} to a clear owner, accurate source and measurable next step. Avoid selecting features by quantity alone; test one representative product and the complete mobile journey before expanding.`;
  return `${page.title} should be evaluated through accurate inputs, a complete customer journey and observable outcomes. Use ${entities} as the initial review set, document assumptions and validate the result with real operating evidence rather than unsupported claims.`;
}

function readableList(values: readonly string[]) {
  if (values.length === 0) return "the relevant supporting topics";
  if (values.length === 1) return values[0]!;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}
