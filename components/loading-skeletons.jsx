"use client";

function Pulse({ className = "", rounded = "rounded-2xl" }) {
  return <div aria-hidden="true" className={`animate-pulse bg-[#f0e2d0] ${rounded} ${className}`} />;
}

function RecipeCardSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[24px] bg-white shadow-[0_14px_36px_rgba(111,80,50,0.08)]">
      <Pulse className="aspect-[4/3] w-full rounded-none bg-[#f4eadb]" />
      <div className="space-y-3 p-5">
        <Pulse className="h-5 w-3/4" />
        <div className="flex items-center gap-2.5">
          <Pulse className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Pulse className="h-3 w-1/2" />
            <Pulse className="h-3 w-2/3" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Pulse className="h-7 w-20 rounded-full" />
          <Pulse className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function FeaturedRecipeSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_70px_-24px_rgba(111,80,50,0.24)]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Pulse className="min-h-[300px] rounded-none bg-[#f4eadb]" />
        <div className="space-y-4 p-8 sm:p-10 lg:p-12">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-10 w-4/5" />
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-5/6" />
          <div className="flex items-center gap-3">
            <Pulse className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Pulse className="h-4 w-40" />
              <Pulse className="h-3 w-28" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Pulse className="h-9 w-24 rounded-full" />
            <Pulse className="h-9 w-20 rounded-full" />
            <Pulse className="h-9 w-24 rounded-full" />
          </div>
          <div className="flex gap-3 pt-1">
            <Pulse className="h-12 w-36 rounded-full" />
            <Pulse className="h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <article aria-hidden="true" className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(111,80,50,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Pulse className="h-11 w-11 rounded-full" />
          <div className="space-y-2">
            <Pulse className="h-4 w-32" />
            <Pulse className="h-3 w-40" />
            <Pulse className="h-3 w-28" />
          </div>
        </div>
        <Pulse className="h-9 w-9 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Pulse className="h-3 w-full" />
        <Pulse className="h-3 w-5/6" />
        <Pulse className="h-3 w-4/5" />
      </div>
      <Pulse className="mt-4 h-44 w-full rounded-3xl bg-[#f4eadb]" />
      <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
        <Pulse className="h-9 w-16 rounded-full" />
        <Pulse className="h-9 w-20 rounded-full" />
        <Pulse className="h-9 w-16 rounded-full" />
        <Pulse className="h-9 w-14 rounded-full" />
        <Pulse className="ml-auto h-4 w-20 rounded-full" />
      </div>
    </article>
  );
}

function CommentSkeleton() {
  return (
    <div aria-hidden="true" className="flex items-start gap-2.5">
      <Pulse className="h-7 w-7 rounded-full" />
      <div className="flex-1 space-y-2 rounded-2xl rounded-tl-sm bg-[#faf8f4] px-3.5 py-2">
        <Pulse className="h-3 w-24 bg-[#ead9c2]" />
        <Pulse className="h-3 w-full bg-[#ead9c2]" />
      </div>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <main aria-hidden="true" className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#FFF9F3]">
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] min-h-[90vh] grid-cols-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-10 xl:gap-10 xl:px-14">
        <div className="order-1 z-10 flex flex-col justify-center lg:col-span-6">
          <div className="space-y-5">
            <Pulse className="h-4 w-40" />
            <Pulse className="h-14 w-4/5" />
            <Pulse className="h-5 w-2/3" />
            <div className="flex gap-2.5">
              <Pulse className="h-9 w-28 rounded-full" />
              <Pulse className="h-9 w-28 rounded-full" />
            </div>
          </div>
        </div>
        <div className="order-2 hidden lg:block lg:col-span-12 lg:col-start-5">
          <Pulse className="mx-auto h-[340px] w-[340px] rounded-[48px] bg-[#f4eadb]" />
        </div>
        <div className="order-3 z-30 flex justify-center lg:col-span-6 lg:col-start-7 lg:justify-start xl:col-span-5 xl:col-start-8">
          <div className="w-full max-w-[460px] space-y-4 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_44px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8">
            <Pulse className="h-5 w-32" />
            <Pulse className="h-10 w-56" />
            <Pulse className="h-4 w-72" />
            <div className="space-y-4 pt-4">
              <Pulse className="h-12 w-full rounded-2xl" />
              <Pulse className="h-12 w-full rounded-2xl" />
              <Pulse className="h-12 w-full rounded-2xl" />
              <Pulse className="h-12 w-full rounded-2xl" />
            </div>
            <Pulse className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-8 w-48" />
          <Pulse className="h-3 w-72" />
        </header>
        <div className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <Pulse className="h-28 w-28 rounded-full" />
            <div className="flex w-full flex-col items-center gap-3 sm:items-start">
              <Pulse className="h-6 w-40" />
              <Pulse className="h-3 w-32" />
              <Pulse className="h-9 w-32 rounded-full" />
            </div>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(111,80,50,0.1)] backdrop-blur-xl sm:p-8">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Pulse className="h-9 w-9 rounded-xl" />
              <div className="space-y-1.5">
                <Pulse className="h-4 w-40" />
                <Pulse className="h-3 w-56" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Pulse className="h-11 w-full rounded-xl" />
              <Pulse className="h-11 w-full rounded-xl" />
            </div>
            <Pulse className="h-28 w-full rounded-xl" />
            <Pulse className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

function ListPageSkeleton({ title = "Loading..." }) {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <Pulse className="h-3 w-32" />
          <Pulse className="h-8 w-56" />
          <Pulse className="h-3 w-72" />
        </header>
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-[22px] border border-white/70 bg-white/70 p-3.5 shadow-[0_14px_34px_rgba(111,80,50,0.09)] backdrop-blur-xl">
              <div className="flex gap-4">
                <Pulse className="h-28 w-28 rounded-2xl sm:h-32 sm:w-32" />
                <div className="flex-1 space-y-3 py-1">
                  <Pulse className="h-4 w-2/3" />
                  <Pulse className="h-3 w-28" />
                  <div className="flex flex-wrap gap-2">
                    <Pulse className="h-6 w-20 rounded-full" />
                    <Pulse className="h-6 w-20 rounded-full" />
                    <Pulse className="h-6 w-16 rounded-full" />
                  </div>
                  <Pulse className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function NotificationSkeleton() {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3] px-4 py-10 md:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-8 w-52" />
          <Pulse className="h-3 w-64" />
        </header>
        <div className="space-y-3">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="rounded-[20px] border border-white/70 bg-white/70 p-4 shadow-[0_10px_30px_-12px_rgba(111,80,50,0.12)] backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <Pulse className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-40" />
                  <Pulse className="h-3 w-full" />
                  <Pulse className="h-3 w-32" />
                </div>
                <Pulse className="h-4 w-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function RecipeDetailSkeleton() {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3] pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Pulse className="mb-8 h-4 w-40" />
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <Pulse className="aspect-square w-full rounded-[32px] md:w-[400px]" />
          <div className="flex flex-1 flex-col pt-2">
            <div className="flex gap-3">
              <Pulse className="h-8 w-24 rounded-full" />
              <Pulse className="h-8 w-20 rounded-full" />
            </div>
            <Pulse className="mt-5 h-10 w-4/5" />
            <Pulse className="mt-4 h-4 w-full" />
            <Pulse className="mt-2 h-4 w-5/6" />
            <div className="mt-8 rounded-2xl bg-white/60 p-5 shadow-[0_8px_20px_rgba(111,80,50,0.05)] backdrop-blur-md">
              <div className="grid gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <Pulse className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Pulse className="h-3 w-20" />
                      <Pulse className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4 border-t border-[#f0e8dc] pt-8">
              <Pulse className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <Pulse className="h-8 w-32" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((index) => (
                <Pulse key={index} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-4 lg:col-span-2">
            <Pulse className="h-8 w-32" />
            <div className="space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <Pulse key={index} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CommunitySkeleton() {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3] px-4 py-8 text-[#1c1917] md:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Pulse className="h-64 w-full rounded-[32px]" />
        <Pulse className="h-40 w-full rounded-[28px]" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {[0, 1, 2, 3].map((index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
          <div className="hidden space-y-4 lg:block">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(111,80,50,0.12)]">
                <Pulse className="h-4 w-40" />
                <div className="mt-4 space-y-3">
                  <Pulse className="h-9 w-full rounded-full" />
                  <Pulse className="h-9 w-full rounded-full" />
                  <Pulse className="h-9 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function GenerateRecipeSkeleton() {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3] py-10 lg:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Pulse className="mx-auto h-[340px] w-full rounded-[32px]" />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
          <div className="space-y-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="rounded-3xl border border-[#F3F4F6] bg-white p-6 shadow-[0_18px_44px_-22px_rgba(111,80,50,0.18)] sm:p-7">
                <Pulse className="h-5 w-40" />
                <div className="mt-5 space-y-3">
                  <Pulse className="h-12 w-full" />
                  <Pulse className="h-12 w-full" />
                  <Pulse className="h-24 w-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            <Pulse className="h-64 w-full rounded-3xl" />
            <Pulse className="h-56 w-full rounded-3xl" />
            <Pulse className="h-36 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

function HomeSkeleton() {
  return (
    <main aria-hidden="true" className="min-h-screen bg-[#FFF9F3]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-12 lg:px-16 lg:py-16">
        <div className="space-y-6">
          <Pulse className="h-72 w-full rounded-[36px]" />
          <Pulse className="h-64 w-full rounded-[32px]" />
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <RecipeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function RecipesSkeleton() {
  return (
    <main aria-hidden="true" className="relative min-h-screen overflow-hidden bg-[#FFF9F3]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
        <div className="flex flex-col gap-6">
          <Pulse className="h-14 w-56" />
          <Pulse className="h-16 w-full max-w-3xl" />
          <div className="flex flex-wrap gap-4">
            {[0, 1, 2].map((index) => (
              <Pulse key={index} className="h-16 w-44 rounded-2xl" />
            ))}
          </div>
        </div>
        <FeaturedRecipeSkeleton />
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <Pulse className="h-10 w-48" />
            <Pulse className="h-10 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <RecipeCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export {
  AuthSkeleton,
  CommunitySkeleton,
  CommentSkeleton,
  FeaturedRecipeSkeleton,
  GenerateRecipeSkeleton,
  HomeSkeleton,
  ListPageSkeleton,
  NotificationSkeleton,
  PostSkeleton,
  ProfileSkeleton,
  RecipeCardSkeleton,
  RecipeDetailSkeleton,
  RecipesSkeleton,
};
