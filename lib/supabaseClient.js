import { createClient } from '@supabase/supabase-js';

// Server-only client. Uses the service role key, which bypasses Row Level
// Security — that's fine here because this file is only ever imported by
// API routes (app/api/**/route.js), which run on the server and are never
// bundled into client-side JS. Never import this from a 'use client'
// component or expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
let client;

export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. Add them to your environment variables.'
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
