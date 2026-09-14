import Image from "next/image";
import { Check, Compass } from "lucide-react";
import { Logo } from "@/components/logo";
export function AuthCard({
  title,
  description,
  benefits,
  children,
}: {
  title: string;
  description: string;
  benefits?: string[];
  children: React.ReactNode;
}) {
  return (
    <main className="app-bg relative isolate grid min-h-screen place-items-center overflow-hidden px-5 py-16 text-white">
      <Image
        src="/images/marketing/coastal-yacht.webp"
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,28,22,.96),rgba(4,28,22,.72),rgba(4,28,22,.93))]" />
      <div className="ambient" />
      <div className={`w-full ${benefits ? "max-w-5xl" : "max-w-md"}`}>
        <div className="mb-8 text-center">
          <Logo light />
        </div>
        <div
          className={benefits ? "grid gap-5 lg:grid-cols-[1.05fr_.85fr]" : ""}
        >
          {benefits && (
            <aside className="glass order-2 rounded-3xl p-7 sm:p-10 lg:order-1">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#95ee8e]">
                <Compass size={15} /> Tourism-native from the start
              </p>
              <h2 className="mt-5 max-w-lg text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                Your website and operating foundation, built together.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/55">
                Begin with real business information. TripOne+ turns it into a
                structured draft you can review before anything is published.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-sm leading-6 text-white/70"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-emerald-200">
                      <Check size={14} />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <section className="glass order-1 rounded-3xl p-6 sm:p-8 lg:order-2">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {description}
            </p>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
export function AuthMessage({
  message,
  error,
}: {
  message?: string;
  error?: string;
}) {
  return (
    <>
      {message && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100"
        >
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100"
        >
          {error === "setup"
            ? "Connect Supabase in .env.local before signing in."
            : error}
        </p>
      )}
    </>
  );
}
export const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white/[.07] px-4 text-white placeholder:text-white/30 focus:border-[#95EE8E] focus:outline-none";
