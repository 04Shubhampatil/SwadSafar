import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'

/**
 * Allows only internal application paths to be used as redirect targets.
 * Blocks absolute URLs, protocol-relative URLs (//host) and scheme strings
 * (javascript:, https:, …). Falls back to "/" for anything invalid.
 */
function getSafeNext(value) {
  if (!value) return '/'
  if (!value.startsWith('/')) return '/'
  if (value.startsWith('//')) return '/'
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) return '/'
  return value
}

/**
 * OAuth Callback Route Handler
 *
 * Supabase redirects to this URL after Google OAuth with a ?code= param.
 * We exchange that code for a session (sets secure auth cookies), then
 * redirect to the originally requested destination. No tokens ever appear
 * in the browser URL — this is the PKCE + SSR cookie flow.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `next` lets us redirect to a specific page after auth (optional)
  const next = getSafeNext(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()

    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        // Auto-create the user's profile row (idempotent upsert) on first login
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          await ensureProfile(supabase, user)
        }

        // Successful OAuth — redirect to the intended destination
        return NextResponse.redirect(`${origin}${next}`)
      }

      console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    }
  }

  // Something went wrong — bounce back to sign-in with an error hint
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`)
}
