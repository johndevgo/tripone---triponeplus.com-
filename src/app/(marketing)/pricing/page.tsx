import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
export default function Pricing() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#FFC857]">
        Pricing
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">
        Free during early access.
      </h1>
      <p className="mt-5 text-lg text-white/60">
        Build, customize and publish while TripOne+ is in early access. No
        checkout or payment details are required.
      </p>
      <div className="glass mx-auto mt-10 max-w-md rounded-3xl p-8 text-left">
        <h2 className="text-2xl font-semibold">Early access</h2>
        <p className="mt-2 text-white/55">
          Everything needed to launch a professional tourism website.
        </p>
        <div className="my-7 border-t border-white/10" />
        {[
          "Onboarding and site generation",
          "Four starter themes",
          "Draft preview and dashboard",
          "Publishing, analytics and leads",
          "Hosted TripOne+ website address",
        ].map((x) => (
          <p className="mt-3 flex gap-2" key={x}>
            <Check className="text-[#FFC857]" size={20} />
            {x}
          </p>
        ))}
        <ButtonLink href="/signup" className="mt-8 w-full">
          Get started
        </ButtonLink>
      </div>
    </div>
  );
}
