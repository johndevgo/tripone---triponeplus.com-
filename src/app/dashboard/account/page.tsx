import Link from "next/link";
import { ArrowLeft, KeyRound, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteAccount, saveProfile, sendPasswordReset } from "./actions";
export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const notice = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: profile }, { data: entitlement }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,avatar_url,marketing_consent")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("account_entitlements")
      .select("status,free_until,annual_price,currency")
      .eq("user_id", user!.id)
      .maybeSingle(),
  ]);
  return (
    <main className="app-bg min-h-screen px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/50"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <div className="mt-7 flex items-center gap-3">
          <UserCircle className="text-[#ffc857]" />
          <div>
            <p className="text-sm text-[#ffc857]">Your account</p>
            <h1 className="text-3xl font-semibold">Profile & security</h1>
          </div>
        </div>
        {(notice.message || notice.error) && (
          <p
            className={`mt-6 rounded-xl p-3 text-sm ${notice.error ? "bg-red-400/10 text-red-100" : "bg-emerald-300/10 text-emerald-100"}`}
          >
            {notice.error ?? notice.message}
          </p>
        )}
        <section className="glass mt-7 rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <form action={saveProfile} className="mt-5 grid gap-4">
            <label className="text-sm">
              Name
              <input
                name="fullName"
                required
                defaultValue={profile?.full_name}
                className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
              />
            </label>
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm leading-6 text-white/60">
              <input
                name="marketingConsent"
                type="checkbox"
                defaultChecked={profile?.marketing_consent ?? false}
                className="mt-1 size-4 accent-[#f5a623]"
              />
              Email me useful product updates and account reminders. You can
              turn this off at any time.
            </label>
            <label className="text-sm">
              Avatar URL
              <input
                name="avatarUrl"
                type="url"
                defaultValue={profile?.avatar_url ?? ""}
                className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
              />
            </label>
            <label className="text-sm">
              Email
              <input
                disabled
                value={user?.email ?? ""}
                className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.04] px-3 text-white/45"
              />
            </label>
            <button className="min-h-11 justify-self-start rounded-xl bg-[#f5a623] px-5 font-semibold text-[#173028]">
              Save profile
            </button>
          </form>
        </section>
        {entitlement && (
          <section className="glass mt-5 rounded-3xl p-6">
            <h2 className="text-xl font-semibold">Plan access</h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Your founding access is{" "}
              <span className="capitalize">{entitlement.status}</span> through{" "}
              {new Date(entitlement.free_until).toLocaleDateString()}. The
              configured annual renewal is {entitlement.currency}{" "}
              {Number(entitlement.annual_price).toLocaleString()} after the free
              period. No charge is taken automatically in this release.
            </p>
          </section>
        )}
        <section className="glass mt-5 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <KeyRound className="text-emerald-300" />
            <h2 className="text-xl font-semibold">Password</h2>
          </div>
          <p className="mt-2 text-sm text-white/40">
            Supabase will email a secure reset link to your confirmed address.
          </p>
          <form action={sendPasswordReset}>
            <button className="mt-4 min-h-11 rounded-xl border border-white/15 px-4 text-sm">
              Send password reset
            </button>
          </form>
        </section>
        <section className="mt-5 rounded-3xl border border-red-300/15 bg-red-950/10 p-6">
          <h2 className="text-xl font-semibold text-red-100">Delete account</h2>
          <p className="mt-2 text-sm text-white/40">
            This permanently removes login access, owned businesses, websites,
            operational records and uploaded files. If you opted into product
            emails, your email address remains on that mailing list until you
            unsubscribe. Type DELETE {user?.email}
          </p>
          <form
            action={deleteAccount}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              name="confirmation"
              required
              className="min-h-11 flex-1 rounded-xl border border-red-300/15 bg-black/20 px-3"
            />
            <button className="min-h-11 rounded-xl border border-red-300/25 px-5 text-red-100">
              Delete permanently
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
