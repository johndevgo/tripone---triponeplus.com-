"use client";
export default function TenantError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#041c16] px-5 text-white">
      <section className="glass max-w-lg rounded-3xl p-8 text-center">
        <h1 className="text-3xl font-semibold">This page could not load</h1>
        <p className="mt-3 text-white/55">
          Please try again. The website owner’s content remains safe.
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
