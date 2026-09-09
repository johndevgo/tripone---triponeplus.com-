export default function ResourceLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-28 rounded bg-white/10" />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="h-5 w-24 rounded bg-white/10" />
          <div className="mt-6 h-14 max-w-xl rounded-2xl bg-white/10" />
          <div className="mt-4 h-14 max-w-lg rounded-2xl bg-white/[.06]" />
        </div>
        <div className="aspect-[16/10] rounded-[2rem] bg-white/[.07]" />
      </div>
    </div>
  );
}
