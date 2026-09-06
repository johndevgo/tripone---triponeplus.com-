export default function Loading() {
  return (
    <main className="app-bg min-h-screen p-8 text-white">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-6 w-24 rounded bg-white/10" />
        <div className="mt-4 h-12 w-72 rounded bg-white/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((x) => (
            <div className="h-40 rounded-3xl bg-white/[.07]" key={x} />
          ))}
        </div>
      </div>
    </main>
  );
}
