export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <p className="sr-only">Loading your profile…</p>
      <div className="mx-auto max-w-3xl space-y-8" aria-hidden="true">
        <header className="flex flex-col gap-2">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[#e8d7c2]" />
          <div className="h-8 w-48 animate-pulse rounded-xl bg-[#ead9c2]" />
          <div className="h-3 w-72 animate-pulse rounded-full bg-[#f0e2d0]" />
        </header>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="h-28 w-28 shrink-0 animate-pulse rounded-full bg-[#f0e0cc]" />
              <div className="flex w-full flex-col items-center gap-2 sm:items-start">
                <div className="h-6 w-40 animate-pulse rounded-lg bg-[#ead9c2]" />
                <div className="h-3 w-32 animate-pulse rounded-full bg-[#f0e2d0]" />
                <div className="mt-2 h-9 w-32 animate-pulse rounded-full bg-[#ead9c2]" />
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-xl bg-[#f0e0cc]" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 animate-pulse rounded bg-[#ead9c2]" />
                  <div className="h-3 w-56 animate-pulse rounded-full bg-[#f0e2d0]" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-11 animate-pulse rounded-xl bg-[#f0e2d0]" />
                <div className="h-11 animate-pulse rounded-xl bg-[#f0e2d0]" />
              </div>
              <div className="h-28 animate-pulse rounded-xl bg-[#f0e2d0]" />
              <div className="h-11 animate-pulse rounded-xl bg-[#f0e2d0]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
