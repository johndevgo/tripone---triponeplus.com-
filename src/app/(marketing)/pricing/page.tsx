import type { Metadata } from "next";
import { ArrowRight, Check, ChevronRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Build, customize and publish a tourism website free during TripOne+ early access. No payment details required.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "TripOne+ early-access pricing",
    description:
      "Build, customize and publish free during early access. No payment details required.",
    url: "/pricing",
  },
};

const included = [
  "Tourism-aware onboarding and deterministic generation",
  "Eight professional themes and visual builder",
  "Experiences, rentals, rates and destination content",
  "Draft preview and versioned publishing",
  "Technical SEO controls, sitemaps and redirects",
  "Lead workspace and first-party analytics",
  "Hosted TripOne+ customer website path",
];

export default function Pricing() {
  return (
    <>
      <section className="mx-auto max-w-4xl text-center">
        <p className="marketing-kicker mx-auto">
          <Sparkles size={15} /> Early access
        </p>
        <h1 className="marketing-title mt-6">
          One complete plan. Free while we learn with operators.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
          Build, customize and publish without entering payment information.
          Future paid plans will be communicated before billing is introduced.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-3xl">
        <div className="glass relative overflow-hidden rounded-[2rem] p-7 sm:p-10">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold text-[#ffc857]">
                TripOne+ Early Access
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-[-.05em]">
                  $0
                </span>
                <span className="pb-2 text-white/45">during early access</span>
              </div>
            </div>
            <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold text-emerald-100">
              No card required
            </span>
          </div>
          <div className="my-8 border-t border-white/10" />
          <div className="grid gap-4 sm:grid-cols-2">
            {included.map((item) => (
              <p
                key={item}
                className="flex gap-3 text-sm leading-6 text-white/65"
              >
                <Check className="mt-0.5 shrink-0 text-[#ffc857]" size={18} />{" "}
                {item}
              </p>
            ))}
          </div>
          <ButtonLink href="/signup" className="mt-9 w-full min-h-13 text-base">
            Start building <ArrowRight size={18} />
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-3xl font-semibold">
          Pricing questions
        </h2>
        <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
          {[
            [
              "Will TripOne+ always be free?",
              "Early access is free. Pricing may be introduced later, but it will be communicated before any billing begins.",
            ],
            [
              "Do I need a credit card?",
              "No. The current signup and website-building flow does not request payment details.",
            ],
            [
              "Are booking transactions included?",
              "TripOne+ can link to your booking provider. It does not currently process booking payments or claim to replace live reservation inventory.",
            ],
            [
              "Is a custom domain included?",
              "The platform supports verified custom domains when provider credentials and DNS are configured. Every site can first publish on its hosted TripOne+ path.",
            ],
          ].map(([question, answer]) => (
            <details key={question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold marker:hidden">
                {question}
                <ChevronRight
                  size={19}
                  className="text-[#ffc857] transition group-open:rotate-90"
                />
              </summary>
              <p className="mt-3 max-w-2xl leading-7 text-white/55">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
