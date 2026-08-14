import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes — accessible without authentication
  const { pathname } = request.nextUrl

  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/about-us') ||
    pathname.startsWith('/community') ||
    pathname.startsWith('/recipes') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/auth') ||
    pathname.match(/\.(.*)$/) // Exclude static files (images, css, etc)

  // Protected routes — require authentication
  const isProtectedRoute =
    pathname.startsWith('/generate-recipe') ||
    pathname.startsWith('/my-recipes') ||
    pathname.startsWith('/liked-recipes') ||
    pathname.startsWith('/favorite-recipses') ||
    pathname.startsWith('/favorites') ||
    pathname.startsWith('/saved-recipes') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/profile')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    // Store the original path so sign-in can redirect back after login
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
