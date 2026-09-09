import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy notice",
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return (
    <Legal title="Privacy notice placeholder">
      <p>
        This page is a launch-ready placeholder for TripOne+’s reviewed privacy
        notice. It is not legal advice and must be replaced or approved by
        qualified counsel before accepting production customers.
      </p>
      <h2>Information the product handles</h2>
      <p>
        TripOne+ stores account details, business and website content, enquiries
        submitted to customer websites, and privacy-conscious event analytics.
        Analytics does not intentionally retain full IP addresses or enquiry
        messages.
      </p>
      <h2>Service providers</h2>
      <p>
        The intended production stack uses Supabase for authentication and data
        storage, Vercel for hosting, and Cloudflare for DNS. Their final roles,
        retention periods and contractual terms must be documented by the
        operator.
      </p>
      <h2>Your choices</h2>
      <p>
        Account holders can update profile and website information and request
        account deletion from the account page. Website visitors can decline
        optional tracking when a site owner enables the basic consent banner.
      </p>
    </Legal>
  );
}
function Legal({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="glass mx-auto max-w-3xl rounded-3xl p-7 sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffc857]">
        Review before launch
      </p>
      <h1 className="mt-4 text-4xl font-semibold">{title}</h1>
      <div className="mt-8 grid gap-5 leading-7 text-white/60 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
        {children}
      </div>
    </article>
  );
}
