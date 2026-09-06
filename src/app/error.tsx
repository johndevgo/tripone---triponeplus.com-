"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="app-bg grid min-h-screen place-items-center px-5 text-white">
      <section className="glass max-w-lg rounded-3xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffc857]">
          TripOne+
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 leading-7 text-white/55">
          Your data has not been intentionally changed. Try this view again, or
          return to the dashboard.
        </p>
        <button
          onClick={reset}
          className="mt-6 min-h-11 rounded-xl bg-[#f5a623] px-5 font-semibold text-[#173028]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
