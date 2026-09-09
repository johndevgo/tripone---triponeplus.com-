import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  robots: { index: false, follow: true },
};

export default function Terms() {
  return (
    <article className="glass mx-auto max-w-3xl rounded-3xl p-7 sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffc857]">
        Review before launch
      </p>
      <h1 className="mt-4 text-4xl font-semibold">Terms placeholder</h1>
      <div className="mt-8 grid gap-5 leading-7 text-white/60 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white">
        <p>
          This document is a product placeholder, not legal advice. TripOne+’s
          operator must have final terms reviewed for the launch jurisdiction
          and business model.
        </p>
        <h2>Product use</h2>
        <p>
          Customers are responsible for the accuracy, rights and legality of the
          business content, images, testimonials, booking links and tracking IDs
          they publish.
        </p>
        <h2>No ranking or conversion guarantee</h2>
        <p>
          TripOne+ provides SEO-ready structure and conversion-oriented design
          checks. It does not guarantee search rankings, enquiries, sales or
          business results.
        </p>
        <h2>Third-party services</h2>
        <p>
          Availability can depend on hosting, DNS, authentication, storage and
          optional analytics providers. Production service levels and support
          terms must be stated in the final reviewed agreement.
        </p>
      </div>
    </article>
  );
}
