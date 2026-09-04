'use client';

import { createClient } from '@supabase/supabase-js';

// Browser-side client using the "anon" key (safe to expose — it's designed
// for this). Handles customer sign-up/login and keeps the session in the
// browser automatically. This is a completely separate client from
// lib/supabaseClient.js, which uses the secret service_role key and only
// ever runs on the server for the admin panel.
let client;

export function getSupabasePublic() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set.'
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return client;
}
