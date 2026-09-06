"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="app-bg grid min-h-screen place-items-center p-6 text-center text-white">
      <div>
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-white/50">
          We couldn&apos;t load this workspace.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </main>
  );
}
