'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4">
      <div className="text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            404
          </h1>
          <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-orange-400 to-red-500 -z-10"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            We couldn't find the recipe you're looking for. It might have been deleted or the link might be broken.
          </p>
        </div>

        {/* Decorative Emoji */}
        <div className="text-6xl">🔍</div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          <Link
            href="/recipes"
            className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300"
          >
            Browse Recipes
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 pt-8">
          Lost? Try searching for recipes or visit our{' '}
          <Link href="/about-us" className="text-orange-600 hover:text-orange-700 font-semibold">
            about us
          </Link>{' '}
          page for more information.
        </p>
      </div>
    </div>
  );
}
