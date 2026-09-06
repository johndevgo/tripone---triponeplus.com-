export default function TenantNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#041c16] px-5 text-white">
      <section className="glass max-w-xl rounded-3xl p-9 text-center">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#ffc857]">
          TripOne+
        </p>
        <h1 className="mt-4 text-3xl font-semibold">
          This website is unavailable
        </h1>
        <p className="mt-4 leading-7 text-white/60">
          The address may be incorrect, the page may have moved, or the website
          has not been published yet.
        </p>
      </section>
    </main>
  );
}
