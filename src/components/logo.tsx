import Link from "next/link";
import { Compass } from "lucide-react";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-xl font-bold tracking-tight ${light ? "text-white" : "text-[#063D2E]"}`}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-[#F5A623] text-[#063D2E]">
        <Compass size={20} />
      </span>
      TripOne<span className="text-[#F5A623]">+</span>
    </Link>
  );
}
