import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Palette } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { themeMarketingImages } from "@/content/marketing-assets";
import { themes } from "@/lib/site-generator";

export const metadata: Metadata = {
  title: "Tourism website themes",
  description:
    "Explore eight professional website themes for tours, rentals, safaris, trekking, water sports and travel businesses.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Tourism website themes | TripOne+",
    description:
      "Eight professional, tokenized design directions for tourism businesses.",
    url: "/templates",
  },
};

export default function Templates() {
  return (
    <>
      <section className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
        <div>
          <p className="marketing-kicker">
            <Palette size={15} /> Theme system
          </p>
          <h1 className="marketing-title mt-6">
            Eight distinct directions. One flexible renderer.
          </h1>
        </div>
        <div className="lg:pb-2">
          <p className="max-w-2xl text-lg leading-8 text-white/60">
            Choose the design character that fits your operation, then tune the
            colors, typography, spacing, header, cards and imagery without
            starting again.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
            {["Responsive", "Tokenized", "Builder-ready"].map((label) => (
              <span key={label} className="flex items-center gap-2">
                <Check size={16} className="text-[#ffc857]" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        {Object.values(themes).map((theme) => (
          <article
            className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[.055] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25"
            key={theme.id}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={themeMarketingImages[theme.id]}
                alt={`${theme.name} tourism theme inspiration`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, ${theme.colors.primary}ee 0%, ${theme.colors.primary}18 70%)`,
                }}
              />
              <div
                className="absolute inset-x-5 bottom-5 overflow-hidden border border-white/20 bg-white/10 p-4 backdrop-blur-xl"
                style={{ borderRadius: theme.radius }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[.18em] text-white/55">
                      Explore further
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      Your next experience
                    </p>
                  </div>
                  <span
                    className="rounded-lg px-3 py-2 text-xs font-semibold"
                    style={{
                      background: theme.colors.accent,
                      color: theme.colors.text,
                    }}
                  >
                    View tours
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-semibold">{theme.name}</h2>
                  <p className="mt-2 text-white/55">{theme.description}</p>
                </div>
                <div
                  className="flex -space-x-2"
                  aria-label="Theme color palette"
                >
                  {[
                    theme.colors.primary,
                    theme.colors.secondary,
                    theme.colors.accent,
                  ].map((color) => (
                    <span
                      key={color}
                      className="size-7 rounded-full border-2 border-[#0a2b22]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/45">
                <span className="rounded-full bg-white/[.06] px-3 py-1.5 capitalize">
                  {theme.sectionStyle}
                </span>
                <span className="rounded-full bg-white/[.06] px-3 py-1.5 capitalize">
                  {theme.spacingCharacter} spacing
                </span>
                <span className="rounded-full bg-white/[.06] px-3 py-1.5 capitalize">
                  {theme.buttonStyle} buttons
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="glass mt-20 rounded-[2rem] p-8 text-center sm:p-14">
        <h2 className="text-3xl font-semibold tracking-[-.03em] sm:text-4xl">
          Start with direction. Make it unmistakably yours.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/55">
          Your selected theme becomes editable tokens—not a locked template or a
          separate codebase.
        </p>
        <ButtonLink href="/signup" className="mt-7">
          Choose your theme <ArrowRight size={17} />
        </ButtonLink>
      </section>
    </>
  );
}
