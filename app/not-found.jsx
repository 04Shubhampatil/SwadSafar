'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fffaf5] relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Background decorations */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] h-[350px] rounded-full bg-amber-200/30 blur-3xl" />

      {/* Decorative food elements */}
      <div className="absolute top-24 left-[12%] text-4xl opacity-70 rotate-12">
        🍅
      </div>

      <div className="absolute top-[20%] right-[12%] text-4xl opacity-70 -rotate-12">
        🥕
      </div>

      <div className="absolute bottom-24 left-[18%] text-3xl opacity-60 rotate-12">
        🌿
      </div>

      <div className="absolute bottom-20 right-[18%] text-4xl opacity-60 -rotate-12">
        🍋
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-5xl">
        <div className="bg-white rounded-[36px] border border-orange-100 shadow-[0_25px_80px_rgba(234,88,12,0.10)] overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[620px]">

            {/* Left illustration */}
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 flex items-center justify-center p-10 overflow-hidden">
              
              {/* Decorative circles */}
              <div className="absolute w-72 h-72 rounded-full border border-white/20 top-[-100px] left-[-80px]" />
              <div className="absolute w-96 h-96 rounded-full border border-white/10 bottom-[-180px] right-[-160px]" />

              <div className="relative text-center text-white">

                {/* Icon */}
                <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                  <span className="text-5xl">🍽️</span>
                </div>

                {/* 404 */}
                <h1 className="text-[120px] sm:text-[150px] leading-none font-black tracking-[-0.08em]">
                  404
                </h1>

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-sm font-semibold tracking-wide">
                    RECIPE NOT FOUND
                  </span>
                </div>

                {/* Decorative plate */}
                <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10 border border-white/20" />
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-white/10 border border-white/20" />
              </div>
            </div>

            {/* Right content */}
            <div className="flex items-center p-8 sm:p-12 lg:p-16">
              <div className="max-w-lg">

                {/* Small label */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-[2px] bg-orange-500" />
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                    Lost in the kitchen?
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.08] tracking-tight">
                  Looks like this recipe
                  <span className="text-orange-500"> disappeared.</span>
                </h2>

                {/* Description */}
                <p className="mt-6 text-lg leading-8 text-gray-500">
                  We couldn't find the page you're looking for. The recipe
                  may have been removed, moved somewhere else, or the link
                  might be incorrect.
                </p>

                {/* Search suggestion */}
                <div className="mt-8 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      🔎
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        Looking for something delicious?
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Explore our recipe collection and discover something
                        new to cook.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <Link
                    href="/"
                    className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Back to Home
                    <span className="text-lg group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/recipes"
                    className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-white text-gray-800 font-bold border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
                  >
                    Browse Recipes
                  </Link>

                </div>

                {/* Bottom links */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-400">
                    Need inspiration?{' '}
                    <Link
                      href="/about-us"
                      className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Learn more about SwadSafar
                    </Link>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Brand */}
        <div className="text-center mt-6">
          <p className="text-sm font-semibold text-gray-400">
            Swad<span className="text-orange-500">Safar</span>
          </p>
        </div>
      </div>
    </div>
  );
}