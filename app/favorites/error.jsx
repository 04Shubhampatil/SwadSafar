"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#FFF9F3] px-6">
      <div className="flex max-w-md flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={20} />
        </span>
        <p className="text-base font-extrabold text-[#111827]">Couldn&apos;t load favorites</p>
        <p className="text-sm font-medium text-[#7c7267]">
          {error?.message || "Please try again in a moment."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="fd-gradient-btn mt-2 rounded-full px-5 py-2.5 text-xs font-bold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
