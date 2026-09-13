import Link from "next/link";
import { AuthCard, AuthMessage, inputClass } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/auth/actions";
export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const p = await searchParams;
  return (
    <AuthCard
      title="Start your TripOne+ workspace"
      description="No card required. Create your account, then build from your real services and brand."
      benefits={[
        "A guided multi-service setup for tours, rentals, packages and transfers",
        "Ten premium directions with one consistent, responsive renderer",
        "Structured SEO, enquiry and booking-request foundations",
        "A private draft and preview before you decide to publish",
      ]}
    >
      <AuthMessage {...p} />
      <form action={signup} className="mt-6 grid gap-5">
        <label className="text-sm font-medium">
          Your name
          <input
            className={inputClass}
            name="name"
            autoComplete="name"
            minLength={2}
            required
          />
        </label>
        <label className="text-sm font-medium">
          Email
          <input
            className={inputClass}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="text-sm font-medium">
          Password
          <input
            className={inputClass}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <span className="mt-2 block text-xs font-normal text-white/40">
            At least 8 characters.
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm leading-6 text-white/60">
          <input
            className="mt-1 size-4 shrink-0 accent-[#f5a623]"
            name="marketingConsent"
            type="checkbox"
          />
          Email me useful TripOne+ product updates and account reminders. This
          is optional and I can unsubscribe later.
        </label>
        <Button type="submit">Create my workspace</Button>
      </form>
      <p className="mt-4 text-xs leading-5 text-white/40">
        Founding accounts include three years of free access. Accounts with no
        sign-in for 60 days may be permanently removed under the retention
        policy. If you opt into emails, that address may remain subscribed after
        account deletion until you unsubscribe.
      </p>
      <p className="mt-6 text-center text-sm text-white/55">
        Already have an account?{" "}
        <Link className="text-[#FFC857] hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
