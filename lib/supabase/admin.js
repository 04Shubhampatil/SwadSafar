import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role key.
 *
 * Used ONLY for provisioning operations the authenticated client cannot
 * perform (e.g. creating a missing storage bucket). Never import this module
 * from a client component, and never expose the service-role key via a
 * NEXT_PUBLIC_* variable. Returns null when the key is not configured.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Provisioning-only helper: makes sure a storage bucket exists and has the
 * intended visibility. Runs with the server-only service-role client and is
 * NEVER used for the actual object upload — file uploads always go through the
 * authenticated user session so RLS policies keep applying.
 *
 * Returns { created: boolean } on success or null when the bucket could not be
 * verified/created (e.g. SUPABASE_SERVICE_ROLE_KEY is not configured). Callers
 * should treat null as "could not provision" and still attempt the upload.
 */
export async function ensureStorageBucket(bucketName, { public: isPublic = true } = {}) {
  const admin = createAdminClient();
  if (!admin) return null;

  try {
    const { data: bucket, error: getError } = await admin.storage.getBucket(bucketName);

    if (getError || !bucket) {
      const { error: createError } = await admin.storage.createBucket(bucketName, {
        public: isPublic,
      });
      if (createError) {
        console.error(`[storage] could not create bucket "${bucketName}":`, createError.message);
        return null;
      }

      return { created: true };
    }

    if (bucket.public !== isPublic) {
      const { error: updateError } = await admin.storage.updateBucket(bucketName, {
        public: isPublic,
      });
      if (updateError) {
        console.error(`[storage] could not update visibility of "${bucketName}":`, updateError.message);
      }
    }

    return { created: false };
  } catch (error) {
    console.error(`[storage] bucket check failed for "${bucketName}":`, error?.message);
    return null;
  }
}
