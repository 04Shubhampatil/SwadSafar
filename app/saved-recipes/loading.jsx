export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <p className="sr-only">Loading your saved recipes…</p>
      <div className="mx-auto max-w-4xl space-y-8" aria-hidden="true">
        <header className="flex flex-col gap-5">
          <div className="h-3 w-28 animate-pulse rounded-full bg-[#e8d7c2]" />
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-2xl bg-[#f0e0cc]" />
            <div className="space-y-2">
              <div className="h-7 w-44 animate-pulse rounded-lg bg-[#ead9c2]" />
              <div className="h-3 w-48 animate-pulse rounded-full bg-[#f0e2d0]" />
            </div>
          </div>
        </header>

        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[0_14px_34px_rgba(111,80,50,0.09)] sm:flex-row sm:gap-5"
            >
              <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-[#f0e2d0] sm:aspect-auto sm:h-64 sm:w-72" />
              <div className="flex min-w-0 flex-1 flex-col gap-3 py-1">
                <div className="h-5 w-3/4 animate-pulse rounded-lg bg-[#ead9c2]" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#f0e2d0]" />
                <div className="h-3 w-full animate-pulse rounded-full bg-[#f0e2d0]" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#f0e2d0]" />
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-[#f0e2d0]" />
                  <div className="h-8 w-32 animate-pulse rounded-full bg-[#ead9c2]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
